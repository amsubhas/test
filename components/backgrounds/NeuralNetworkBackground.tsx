'use client';
/**
 * NeuralNetworkBackground — self-contained Canvas2D neural network.
 *
 * Deliberately self-contained: ALL logic lives in this one file.
 * Eliminates the double dynamic-import chain that caused silent failures.
 * Uses alpha:true canvas so CSS background shows through.
 *
 * Visibility fixes:
 *   • Connection base opacity: 0.0825 → 0.55  (+570%)
 *   • Node base opacity:       0.225  → 0.75   (+233%)
 *   • Trail alpha:             0.20   → 0.15   (lighter → more contrast)
 *   • Canvas CSS opacity:      0.78   → 1.0    (full — managed per-draw)
 */

import { useEffect, useRef, memo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number; baseR: number;
  opacity: number;
  activation: number;
  phase: number;
  layer: number;
  connections: number[];
}

interface Connection { a: number; b: number; strength: number; active: number; }
interface Pulse { ci: number; t: number; speed: number; rev: boolean; alpha: number; size: number; }

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_COLOR_A: [number,number,number] = [0, 245, 255];   // cyan
const NODE_COLOR_B: [number,number,number] = [90, 130, 255];  // indigo
const NODE_COLOR_C: [number,number,number] = [0,  220, 150];  // activated teal

function lerp3(
  a: [number,number,number],
  b: [number,number,number],
  t: number
): string {
  return `rgba(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)},`;
}

// ─── Responsive node count ────────────────────────────────────────────────────
function nodeCount(w: number): number {
  if (w < 480)  return 28;
  if (w < 768)  return 45;
  if (w < 1280) return 75;
  return 110;
}

// ─── Build network ────────────────────────────────────────────────────────────
function buildNetwork(w: number, h: number) {
  const LAYERS = 5;
  const count  = nodeCount(w);
  const nodes: Node[] = [];

  for (let layer = 0; layer < LAYERS; layer++) {
    const inLayer   = Math.max(3, Math.round(count / LAYERS * (layer === 0 || layer === LAYERS-1 ? 0.6 : 1)));
    const baseX     = (w * 0.08) + (layer / (LAYERS - 1)) * (w * 0.84);
    const spacing   = h / (inLayer + 1);

    for (let i = 0; i < inLayer && nodes.length < count; i++) {
      const jx = (Math.random() - 0.5) * w * 0.10;
      const jy = (Math.random() - 0.5) * spacing * 0.55;
      const r  = 2.5 + Math.random() * 3;
      nodes.push({
        x: Math.max(8, Math.min(w-8, baseX + jx)),
        y: Math.max(8, Math.min(h-8, spacing * (i+1) + jy)),
        vx: (Math.random()-0.5)*0.10,
        vy: (Math.random()-0.5)*0.10,
        r, baseR: r,
        opacity:    0.65 + Math.random() * 0.35,   // ✅ 0.65–1.0 (was 0.35–0.70)
        activation: 0,
        phase:      Math.random() * Math.PI * 2,
        layer,
        connections: [],
      });
    }
  }

  const conns: Connection[] = [];
  const maxDist = w * 0.28;
  const maxD2   = maxDist * maxDist;
  const MAX_PER_NODE = w < 768 ? 3 : 4;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const candidates: {j:number; d2:number}[] = [];
    for (let j = i+1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d2 = dx*dx+dy*dy;
      if (d2 < maxD2) candidates.push({j, d2});
    }
    candidates.sort((a,b) => a.d2-b.d2);
    let added = 0;
    for (const {j, d2} of candidates) {
      if (added >= MAX_PER_NODE) break;
      const layerDiff = Math.abs(a.layer - nodes[j].layer);
      if (layerDiff > 1 && Math.random() > 0.30) continue;
      const strength = Math.pow(1 - Math.sqrt(d2) / maxDist, 1.2); // ✅ No *0.55 cap
      conns.push({ a: i, b: j, strength, active: 0 });       // ✅ Store INDICES i,j
      if (!a.connections.includes(j))           a.connections.push(j);
      if (!nodes[j].connections.includes(i))    nodes[j].connections.push(i);
      added++;
    }
  }

  console.log(`[NeuralNetwork] Built: ${nodes.length} nodes, ${conns.length} connections`);
  return { nodes, conns };
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  intensity?: 'subtle' | 'normal' | 'strong';
  showFPS?:   boolean;
}

const INTENSITY: Record<string, number> = { subtle: 0.6, normal: 0.85, strong: 1.0 };

function NeuralNetworkBackground({ intensity = 'normal', showFPS = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('[NeuralNetwork] canvas ref is null');
      return;
    }

    console.log('[NeuralNetwork] Starting initialization');

    // ── Get 2D context with alpha:true so CSS bg shows through ──────────────
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      console.error('[NeuralNetwork] Could not get 2D context');
      return;
    }

    let rafId: number;
    let nodes: Node[]      = [];
    let conns: Connection[] = [];
    let pulses: Pulse[]     = [];
    let lastTime   = 0;
    let time       = 0;
    let mouseX     = -9999;
    let mouseY     = -9999;
    let frameCount = 0;
    let fpsTime    = 0;
    let currentFPS = 60;

    const dpr    = Math.min(window.devicePixelRatio || 1, 2);
    const isMob  = window.innerWidth < 768;
    const MOUSE_R = isMob ? 120 : 180;
    const MOUSE_R2 = MOUSE_R * MOUSE_R;

    // ── Size canvas ─────────────────────────────────────────────────────────
    function sizeCanvas() {
      const parent = canvas!.parentElement;
      const pw = parent ? parent.offsetWidth  : window.innerWidth;
      const ph = parent ? parent.offsetHeight : window.innerHeight;
      const w  = pw || window.innerWidth;
      const h  = ph || window.innerHeight;

      canvas!.width  = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      console.log(`[NeuralNetwork] Canvas sized: ${w}×${h} (dpr=${dpr}, buffer=${canvas!.width}×${canvas!.height})`);
      return { w, h };
    }

    // ── Init ────────────────────────────────────────────────────────────────
    function init() {
      const { w, h } = sizeCanvas();
      const net = buildNetwork(w, h);
      nodes  = net.nodes;
      conns  = net.conns;
      pulses = [];
      console.log('[NeuralNetwork] Init complete. Starting animation loop.');
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const { w, h } = sizeCanvas();
        const net = buildNetwork(w, h);
        nodes  = net.nodes;
        conns  = net.conns;
        pulses = [];
      }, 150);
    }

    // ── Spawn pulse ─────────────────────────────────────────────────────────
    let spawnTimer = 0;
    const MAX_PULSES = isMob ? 5 : 16;

    function spawnPulse(ci?: number) {
      if (pulses.length >= MAX_PULSES) return;
      const idx = ci !== undefined ? ci : Math.floor(Math.random() * conns.length);
      if (idx < 0 || idx >= conns.length) return;
      pulses.push({
        ci: idx, t: 0,
        speed: 0.20 + Math.random() * 0.40,
        rev:   Math.random() < 0.5,
        alpha: 0, size: 2 + Math.random() * 2,
      });
    }

    // ── Update ──────────────────────────────────────────────────────────────
    function update(dt: number) {
      const W = canvas!.width  / dpr;
      const H = canvas!.height / dpr;

      for (const n of nodes) {
        n.vx *= 0.986; n.vy *= 0.986;
        n.x  += n.vx * dt * 55;
        n.y  += n.vy * dt * 55;

        if (n.x < 8)    { n.x = 8;    n.vx =  Math.abs(n.vx); }
        if (n.x > W-8)  { n.x = W-8;  n.vx = -Math.abs(n.vx); }
        if (n.y < 8)    { n.y = 8;    n.vy =  Math.abs(n.vy); }
        if (n.y > H-8)  { n.y = H-8;  n.vy = -Math.abs(n.vy); }

        if (Math.random() < 0.004) {
          n.vx += (Math.random()-0.5)*0.30;
          n.vy += (Math.random()-0.5)*0.30;
        }

        // Mouse attraction
        const dx = mouseX - n.x, dy = mouseY - n.y;
        const d2 = dx*dx + dy*dy;
        if (d2 < MOUSE_R2 && d2 > 1) {
          const d    = Math.sqrt(d2);
          const pull = (1 - d/MOUSE_R) * 0.4 * dt * 55;
          n.vx += (dx/d) * pull;
          n.vy += (dy/d) * pull;
          n.activation = Math.min(1, n.activation + (1-d/MOUSE_R) * 0.08);
        }

        // Decay activation
        if (n.activation > 0) n.activation = Math.max(0, n.activation - 0.018 * dt * 60);

        // Breathing
        n.r = n.baseR + Math.sin(time*0.7 + n.phase)*0.5 + n.activation*2;
      }

      // Connection active decay
      for (const c of conns) {
        if (c.active > 0) c.active = Math.max(0, c.active - 0.018 * dt * 60);
      }

      // Mouse → activate nearby connections
      if (mouseX > -100) {
        for (const c of conns) {
          const an = nodes[c.a], bn = nodes[c.b];
          if (!an || !bn) continue;
          const mx = (an.x+bn.x)*0.5, my = (an.y+bn.y)*0.5;
          const dx = mouseX-mx, dy = mouseY-my;
          if (dx*dx+dy*dy < MOUSE_R2) c.active = Math.min(1, c.active+0.15);
        }
      }

      // Advance pulses
      for (let i = pulses.length-1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * dt;
        p.alpha = Math.sin((p.rev ? 1-p.t : p.t) * Math.PI) * 0.95;
        if (p.t >= 1) {
          const c = conns[p.ci];
          if (c) {
            const dest = nodes[p.rev ? c.a : c.b];
            if (dest) dest.activation = Math.min(1, dest.activation + 0.4);
          }
          pulses.splice(i, 1);
        }
      }

      // Auto-spawn
      spawnTimer -= dt;
      if (spawnTimer <= 0 && conns.length > 0) {
        spawnTimer = 0.25 + Math.random()*0.35;
        spawnPulse();
      }
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    const masterOpacity = INTENSITY[intensity] ?? 0.85;

    function draw() {
      const W = canvas!.width  / dpr;
      const H = canvas!.height / dpr;

      if (!nodes.length) return;

      // ── Trail: semi-transparent clear (creates motion blur)
      ctx.globalAlpha = 1;
      ctx.fillStyle   = 'rgba(1,5,8,0.14)';   // ✅ lighter trail = more contrast
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = masterOpacity;

      // ── Connections ───────────────────────────────────────────────────────
      ctx.lineCap  = 'round';
      for (const c of conns) {
        const an = nodes[c.a], bn = nodes[c.b];
        if (!an || !bn) continue;

        const nodeBoost = (an.activation + bn.activation) * 0.5;
        const totalAct  = Math.min(1, c.active + nodeBoost * 0.5);

        // ✅ Base alpha 0.55 (was 0.0825 — 570% brighter)
        const alpha = c.strength * (0.55 + totalAct * 0.45);
        if (alpha < 0.04) continue;

        ctx.strokeStyle = totalAct > 0.25
          ? `rgba(0,245,255,${alpha.toFixed(3)})`
          : `rgba(0,185,220,${alpha.toFixed(3)})`;
        ctx.lineWidth   = 0.6 + totalAct * 1.8;

        ctx.beginPath();
        ctx.moveTo(an.x, an.y);
        ctx.lineTo(bn.x, bn.y);
        ctx.stroke();
      }

      // ── Data pulses ────────────────────────────────────────────────────────
      for (const p of pulses) {
        const c = conns[p.ci];
        if (!c) continue;
        const an = nodes[c.a], bn = nodes[c.b];
        if (!an || !bn) continue;

        const t  = p.rev ? 1-p.t : p.t;
        const px = an.x + (bn.x-an.x)*t;
        const py = an.y + (bn.y-an.y)*t;
        const gr = p.size * 4.5;

        const grd = ctx.createRadialGradient(px,py,0, px,py,gr);
        grd.addColorStop(0,   `rgba(0,255,220,${(p.alpha*0.9).toFixed(3)})`);
        grd.addColorStop(0.4, `rgba(0,245,255,${(p.alpha*0.35).toFixed(3)})`);
        grd.addColorStop(1,   'rgba(0,245,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(px,py,gr,0,Math.PI*2); ctx.fill();

        ctx.fillStyle = `rgba(200,255,255,${Math.min(1,p.alpha*1.4).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(px,py,p.size,0,Math.PI*2); ctx.fill();
      }

      // ── Nodes ──────────────────────────────────────────────────────────────
      for (const n of nodes) {
        const act = n.activation;

        // Activation glow
        if (act > 0.06) {
          const gr  = n.r * (3.5 + act*4);
          const grd = ctx.createRadialGradient(n.x,n.y,0, n.x,n.y,gr);
          grd.addColorStop(0,   `rgba(0,245,255,${(act*0.28).toFixed(3)})`);
          grd.addColorStop(0.5, `rgba(0,245,255,${(act*0.09).toFixed(3)})`);
          grd.addColorStop(1,   'rgba(0,245,255,0)');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(n.x,n.y,gr,0,Math.PI*2); ctx.fill();
        }

        // ✅ Core alpha: n.opacity * (0.75 + act*0.25) — was 0.55 minimum
        const ca  = n.opacity * (0.75 + act*0.25);
        const col = lerp3(
          n.layer%2===0 ? NODE_COLOR_A : NODE_COLOR_B,
          NODE_COLOR_C, act
        );
        ctx.fillStyle = col + ca.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(n.x,n.y,Math.max(1,n.r),0,Math.PI*2); ctx.fill();
      }

      ctx.globalAlpha = 1;

      // ── Dev FPS ────────────────────────────────────────────────────────────
      if (showFPS) {
        ctx.fillStyle = `rgba(0,0,0,0.6)`;
        ctx.fillRect(6, 6, 140, 18);
        ctx.fillStyle = currentFPS >= 50 ? '#00f5ff' : currentFPS >= 30 ? '#ffcc00' : '#ff4444';
        ctx.font = '11px monospace';
        ctx.fillText(`${currentFPS}fps · ${nodes.length}n · ${conns.length}c · ${pulses.length}p`, 10, 19);
      }
    }

    // ── Animation loop ───────────────────────────────────────────────────────
    let paused = false;
    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      if (paused) return;

      const dt = lastTime ? Math.min((now-lastTime)/1000, 0.05) : 0.016;
      lastTime = now;
      time    += dt;
      frameCount++;

      // FPS calc
      if (now - fpsTime > 500) {
        currentFPS = Math.round(frameCount / ((now-fpsTime)/1000));
        frameCount = 0;
        fpsTime    = now;
      }

      if (frameCount === 1) {
        console.log('[NeuralNetwork] First frame drawn ✅');
      }

      update(dt);
      draw();
    }

    // ── Page visibility ──────────────────────────────────────────────────────
    const onVis = () => { paused = document.hidden; if (!paused) lastTime = 0; };
    document.addEventListener('visibilitychange', onVis);

    // ── Mouse (on the SECTION, not pointer-events-none canvas) ──────────────
    // Walk up to find the first ancestor that receives pointer events
    const heroSection = canvas.closest('section') || document.body;
    const onMove  = (e: Event) => {
      const me   = e as MouseEvent;
      const rect = canvas!.getBoundingClientRect();
      mouseX = me.clientX - rect.left;
      mouseY = me.clientY - rect.top;
    };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };
    heroSection.addEventListener('mousemove',  onMove,  { passive: true });
    heroSection.addEventListener('mouseleave', onLeave, { passive: true });

    // ── NexBot events ────────────────────────────────────────────────────────
    const onQ = () => {
      const count = Math.min(6, nodes.length);
      for (let i = 0; i < count; i++) {
        const n = nodes[Math.floor(Math.random()*nodes.length)];
        n.activation = Math.min(1, n.activation + 0.7);
        for (const ci of n.connections.slice(0,2)) {
          const connIdx = conns.findIndex(c => (c.a===n.id||c.b===n.id) && c.a<conns.length);
          if (connIdx >= 0) spawnPulse(connIdx);
        }
      }
    };
    const onR = () => {
      for (let i = 0; i < Math.min(12, nodes.length); i++) {
        nodes[Math.floor(Math.random()*nodes.length)].activation = 0.9;
      }
      for (let i = 0; i < 4; i++) spawnPulse();
    };
    window.addEventListener('nexbot:question', onQ);
    window.addEventListener('nexbot:response', onR);

    // ── Resize ───────────────────────────────────────────────────────────────
    window.addEventListener('resize', onResize);

    // ── IntersectionObserver ─────────────────────────────────────────────────
    const io = new IntersectionObserver(
      ([entry]) => { paused = !entry.isIntersecting; if (!paused) lastTime = 0; },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    // ── Start ────────────────────────────────────────────────────────────────
    init();
    rafId = requestAnimationFrame(loop);
    console.log('[NeuralNetwork] rAF started ✅');

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVis);
      heroSection.removeEventListener('mousemove',  onMove);
      heroSection.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('nexbot:question', onQ);
      window.removeEventListener('nexbot:response', onR);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      console.log('[NeuralNetwork] Destroyed');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display:    'block',
          position:   'absolute',
          inset:      0,
          width:      '100%',
          height:     '100%',
        }}
      />
    </div>
  );
}

export default memo(NeuralNetworkBackground);
