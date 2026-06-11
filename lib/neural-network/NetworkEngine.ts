// ─── NetworkEngine ────────────────────────────────────────────────────────────
// Canvas2D renderer and rAF animation loop.

import { PerformanceManager }           from './PerformanceManager';
import { NodeSystem, type NetworkNode }  from './NodeSystem';
import { ConnectionSystem }              from './ConnectionSystem';

export interface EngineOptions {
  canvas:      HTMLCanvasElement;
  onFPSUpdate: (fps: number) => void;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = {
  nodeCyan:   [0,   245, 255] as const,
  nodeIndigo: [90,  130, 255] as const,
  nodeActive: [0,   255, 160] as const,
  connBase:   'rgba(0,200,230,',
  connActive: 'rgba(0,245,255,',
  bg:         'rgba(1,5,8,',
};

function lerpColor(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
): string {
  const r  = Math.round(a[0] + (b[0] - a[0]) * t);
  const g  = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export class NetworkEngine {
  private canvas:    HTMLCanvasElement;
  private ctx:       CanvasRenderingContext2D;
  private pm:        PerformanceManager;
  private ns:        NodeSystem;
  private cs:        ConnectionSystem;
  private rafId:     number | null = null;
  private lastRender = 0;
  private time       = 0;
  private isRunning  = false;
  private isPaused   = false;

  private mouseX      = -9999;
  private mouseY      = -9999;
  private mouseActive = false;

  private nexbotDecayTimer = 0;

  private onFPSUpdate: (fps: number) => void;

  constructor({ canvas, onFPSUpdate }: EngineOptions) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d', { alpha: false })!;
    this.pm          = new PerformanceManager();
    this.ns          = new NodeSystem(this.pm.config);
    this.cs          = new ConnectionSystem(this.pm.config);
    this.onFPSUpdate = onFPSUpdate;
    this.pm.onDegrade(() => this.rebuild());
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  init(): void {
    this.resize();
    const { w, h } = this.cssSize();
    if (w > 0 && h > 0) {
      this.ns.init(w, h);
      this.cs.build(this.ns.nodes, w);
    }
  }

  private rebuild(): void {
    const { w, h } = this.cssSize();
    this.ns.init(w, h);
    this.cs.build(this.ns.nodes, w);
  }

  private cssSize() {
    const dpr = this.pm.config.dpr;
    return {
      w: this.canvas.width  / dpr,
      h: this.canvas.height / dpr,
    };
  }

  // ─── Resize ───────────────────────────────────────────────────────────────
  // ✅ FIX 1: resetTransform() before scale() — prevents ctx.scale accumulation
  // ✅ FIX 2: auto-init nodes if never built (canvas was 0×0 at init time)
  resize(): void {
    const dpr = this.pm.config.dpr;
    const w   = this.canvas.offsetWidth  || 1;
    const h   = this.canvas.offsetHeight || 1;

    this.canvas.width  = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);

    // Reset transform FIRST to prevent cumulative scaling
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    const { w: cssW, h: cssH } = this.cssSize();
    if (cssW > 0 && cssH > 0) {
      if (this.ns.nodes.length === 0) {
        // First valid resize after a 0×0 init — build everything now
        this.ns.init(cssW, cssH);
        this.cs.build(this.ns.nodes, cssW);
      } else {
        this.ns.resize(cssW, cssH);
      }
    }
  }

  // ─── Start / Stop ─────────────────────────────────────────────────────────
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused  = false;
    this.rafId     = requestAnimationFrame(this.loop);
  }

  pause():  void { this.isPaused = true; }
  resume(): void {
    this.isPaused = false;
    this.lastRender = 0; // prevent large dt on resume
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.stop();
    this.ns.nodes.length      = 0;
    this.cs.connections.length = 0;
    this.cs.pulses.length     = 0;
  }

  // ─── Mouse ────────────────────────────────────────────────────────────────
  setMouse(x: number, y: number): void {
    this.mouseX      = x;
    this.mouseY      = y;
    this.mouseActive = true;
  }

  clearMouse(): void { this.mouseActive = false; }

  // ─── NexBot activation ────────────────────────────────────────────────────
  nexbotActivate(intensity: 'question' | 'response' = 'question'): void {
    this.nexbotDecayTimer = intensity === 'response' ? 4.5 : 2.5;

    const count    = intensity === 'response' ? 12 : 6;
    const depth    = this.pm.config.interactionDepth;
    const indices: number[] = [];

    for (let i = 0; i < count; i++) {
      const n = this.ns.randomNode();
      if (n) {
        indices.push(n.id);
        this.ns.activateNode(n.id, intensity === 'response' ? 0.9 : 0.65);
      }
    }

    for (const idx of indices) this.ns.spreadActivation(idx, depth);
    this.cs.nexbotActivate(indices, this.ns.nodes);
  }

  // ─── Main loop ────────────────────────────────────────────────────────────
  private loop = (now: number): void => {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(this.loop);
    if (this.isPaused) return;

    if (!this.pm.shouldRender(now, this.lastRender)) return;

    const dt = this.lastRender ? Math.min((now - this.lastRender) / 1000, 0.05) : 0.016;
    this.lastRender = now;
    this.time      += dt;

    this.pm.updateFPS(now);
    this.onFPSUpdate(this.pm.fpsSampler.average());

    if (this.nexbotDecayTimer > 0) this.nexbotDecayTimer -= dt;

    this.ns.update(dt, this.time, this.mouseX, this.mouseY, this.mouseActive);

    if (this.mouseActive) {
      this.cs.activateNearMouse(
        this.mouseX, this.mouseY,
        this.ns.nodes,
        this.pm.config.mouseRadius
      );
    }

    this.cs.update(dt, this.ns.nodes);
    this.draw();
  };

  // ─── Draw ─────────────────────────────────────────────────────────────────
  private draw(): void {
    const ctx   = this.ctx;
    const cfg   = this.pm.config;
    const dpr   = cfg.dpr;
    const W     = this.canvas.width  / dpr;
    const H     = this.canvas.height / dpr;
    const nodes = this.ns.nodes;
    const conns = this.cs.connections;
    const pulses= this.cs.pulses;

    if (!nodes.length) return;

    // ── Background trail ─────────────────────────────────────────────────────
    ctx.fillStyle = `${PALETTE.bg}0.20)`;
    ctx.fillRect(0, 0, W, H);

    // ── Connections ───────────────────────────────────────────────────────────
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    for (const c of conns) {
      const an = nodes[c.a];
      const bn = nodes[c.b];
      if (!an || !bn) continue;

      const boost    = c.active;
      const nodeBoost = (an.activation + bn.activation) * 0.5;
      const totalAct  = Math.min(1, boost + nodeBoost * 0.4);
      const alpha     = c.strength * (0.15 + totalAct * 0.60);

      if (alpha < 0.01) continue;

      ctx.strokeStyle = totalAct > 0.3
        ? `${PALETTE.connActive}${alpha.toFixed(3)})`
        : `${PALETTE.connBase}${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.45 + totalAct * 1.4;

      ctx.beginPath();
      ctx.moveTo(an.x, an.y);
      ctx.lineTo(bn.x, bn.y);
      ctx.stroke();
    }

    // ── Data pulses ───────────────────────────────────────────────────────────
    for (const p of pulses) {
      const c  = conns[p.connIdx];
      if (!c) continue;
      const an = nodes[c.a];
      const bn = nodes[c.b];
      if (!an || !bn) continue;

      const t  = p.reverse ? 1 - p.t : p.t;
      const px = an.x + (bn.x - an.x) * t;
      const py = an.y + (bn.y - an.y) * t;

      // Glow halo
      const glowR = p.size * 4;
      const grd   = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grd.addColorStop(0,   `${p.color}${(p.alpha * 0.85).toFixed(3)})`);
      grd.addColorStop(0.4, `${p.color}${(p.alpha * 0.30).toFixed(3)})`);
      grd.addColorStop(1,   `${p.color}0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Core bright dot
      ctx.fillStyle = `${p.color}${Math.min(1, p.alpha * 1.4).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Nodes ─────────────────────────────────────────────────────────────────
    for (const n of nodes) {
      const act = n.activation;

      // Outer activation glow
      if (act > 0.08) {
        const glowR = n.radius * (3 + act * 4);
        const grd   = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grd.addColorStop(0,   `rgba(0,245,255,${(act * 0.22).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(0,245,255,${(act * 0.07).toFixed(3)})`);
        grd.addColorStop(1,   'rgba(0,245,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node core
      const color     = lerpColor(
        n.layer % 2 === 0 ? PALETTE.nodeCyan : PALETTE.nodeIndigo,
        PALETTE.nodeActive,
        act
      );
      const coreAlpha = n.opacity * (0.55 + act * 0.45);
      // Convert rgb() → rgba()
      ctx.fillStyle = color
        .replace('rgb(', 'rgba(')
        .replace(')', `,${coreAlpha.toFixed(3)})`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, Math.max(0.5, n.radius), 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Mouse cursor ripple ────────────────────────────────────────────────────
    if (this.mouseActive && this.mouseX > -100) {
      const rr  = cfg.mouseRadius * 0.3;
      const grd = ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, rr
      );
      grd.addColorStop(0,   'rgba(0,245,255,0.030)');
      grd.addColorStop(0.6, 'rgba(0,200,230,0.012)');
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
