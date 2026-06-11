// ─── NodeSystem ───────────────────────────────────────────────────────────────
// Manages node positions, velocities, activation states, and mouse interaction.

import type { TierConfig } from './PerformanceManager';

export interface NetworkNode {
  id:         number;
  x:          number;
  y:          number;
  vx:         number;   // velocity x
  vy:         number;   // velocity y
  radius:     number;   // visual radius
  baseRadius: number;   // at rest
  opacity:    number;   // current alpha
  activation: number;   // 0–1 — NexBot/mouse activation glow
  activationDecay: number; // per-frame decay rate
  layer:      number;   // 0=input, 1=hidden, 2=output (visual layering)
  pulsePhase: number;   // offset for idle breathing
  connections: number[]; // indices of connected nodes
}

// ─── Layered placement — mimics a shallow neural network topology ──────────────
function layerX(layer: number, totalLayers: number, width: number): number {
  const pad = width * 0.08;
  const usable = width - pad * 2;
  return pad + (layer / (totalLayers - 1)) * usable;
}

export class NodeSystem {
  readonly nodes: NetworkNode[] = [];
  private width  = 0;
  private height = 0;
  private readonly cfg: TierConfig;
  private readonly LAYERS = 5;
  private readonly DRIFT_SPEED = 0.012;
  private readonly REPEL_DIST  = 60;
  private readonly REPEL_FORCE = 0.04;

  constructor(cfg: TierConfig) {
    this.cfg = cfg;
  }

  // ─── Init — place nodes in layered topology with organic jitter ─────────────
  init(width: number, height: number): void {
    this.width  = width;
    this.height = height;
    this.nodes.length = 0;

    const totalNodes  = this.cfg.nodeCount;
    const nodesPerLayer = Math.ceil(totalNodes / this.LAYERS);

    let id = 0;
    for (let layer = 0; layer < this.LAYERS; layer++) {
      const count = layer === 0 || layer === this.LAYERS - 1
        ? Math.max(3, Math.floor(nodesPerLayer * 0.6)) // smaller input/output layers
        : nodesPerLayer;

      for (let i = 0; i < count && id < totalNodes; i++, id++) {
        const baseX = layerX(layer, this.LAYERS, width);
        // vertical distribution with jitter
        const spacing = height / (count + 1);
        const baseY   = spacing * (i + 1);
        const jitterX = (Math.random() - 0.5) * width * 0.12;
        const jitterY = (Math.random() - 0.5) * spacing * 0.6;

        const r = 2 + Math.random() * 2.5;
        this.nodes.push({
          id,
          x:  Math.max(10, Math.min(width  - 10, baseX + jitterX)),
          y:  Math.max(10, Math.min(height - 10, baseY + jitterY)),
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          radius:     r,
          baseRadius: r,
          opacity:    0.35 + Math.random() * 0.35,
          activation: 0,
          activationDecay: 0.012 + Math.random() * 0.008,
          layer,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
        });
      }
    }
  }

  resize(width: number, height: number): void {
    const scaleX = width  / (this.width  || width);
    const scaleY = height / (this.height || height);
    this.width  = width;
    this.height = height;
    for (const n of this.nodes) {
      n.x = Math.max(10, Math.min(width  - 10, n.x * scaleX));
      n.y = Math.max(10, Math.min(height - 10, n.y * scaleY));
    }
  }

  // ─── Per-frame update ────────────────────────────────────────────────────────
  update(dt: number, time: number, mouseX: number, mouseY: number, mouseActive: boolean): void {
    const damp   = 0.985;
    const speed  = this.DRIFT_SPEED * dt * 60;
    const radius = this.cfg.mouseRadius;
    const r2     = radius * radius;

    for (const n of this.nodes) {
      // Gentle autonomous drift
      n.vx *= damp;
      n.vy *= damp;
      n.x  += n.vx * speed;
      n.y  += n.vy * speed;

      // Soft wall bounce
      if (n.x < 10)              { n.x = 10;              n.vx =  Math.abs(n.vx); }
      if (n.x > this.width  - 10){ n.x = this.width  - 10; n.vx = -Math.abs(n.vx); }
      if (n.y < 10)              { n.y = 10;              n.vy =  Math.abs(n.vy); }
      if (n.y > this.height - 10){ n.y = this.height - 10; n.vy = -Math.abs(n.vy); }

      // Mild random drift nudge (prevents freezing)
      if (Math.random() < 0.003) {
        n.vx += (Math.random() - 0.5) * 0.25;
        n.vy += (Math.random() - 0.5) * 0.25;
      }

      // Mouse attraction / activation
      if (mouseActive) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0) {
          const d    = Math.sqrt(d2);
          const norm = (1 - d / radius);          // 0 at edge, 1 at center
          const pull = norm * norm * 0.35 * speed;
          n.vx += (dx / d) * pull;
          n.vy += (dy / d) * pull;
          n.activation = Math.min(1, n.activation + norm * 0.08);
        }
      }

      // Activation decay
      if (n.activation > 0) {
        n.activation = Math.max(0, n.activation - n.activationDecay * dt * 60);
      }

      // Idle breathing — subtle radius pulse
      const breathe = Math.sin(time * 0.5 + n.pulsePhase) * 0.4 + n.activation * 1.8;
      n.radius = n.baseRadius + breathe;

      // Node-to-node repulsion (prevent clustering)
      if (Math.random() < 0.02) {
        for (const other of this.nodes) {
          if (other.id === n.id) continue;
          const dx = n.x - other.x;
          const dy = n.y - other.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < this.REPEL_DIST * this.REPEL_DIST && d2 > 0) {
            const d = Math.sqrt(d2);
            const f = this.REPEL_FORCE * (1 - d / this.REPEL_DIST);
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
      }
    }
  }

  // ─── Activate a node (NexBot trigger) ────────────────────────────────────────
  activateNode(index: number, strength = 1.0): void {
    if (index < 0 || index >= this.nodes.length) return;
    const n = this.nodes[index];
    n.activation = Math.min(1, n.activation + strength);
    // Give it a velocity kick
    n.vx += (Math.random() - 0.5) * 0.5;
    n.vy += (Math.random() - 0.5) * 0.5;
  }

  // ─── Spread activation from a source node through connections ────────────────
  spreadActivation(sourceIndex: number, depth: number, decay = 0.55): void {
    if (depth <= 0) return;
    const source = this.nodes[sourceIndex];
    if (!source) return;
    for (const cIdx of source.connections) {
      const connected = this.nodes[cIdx];
      if (connected && connected.activation < 0.6) {
        connected.activation = Math.min(1, connected.activation + source.activation * decay);
        this.spreadActivation(cIdx, depth - 1, decay * 0.7);
      }
    }
  }

  // ─── Pick random node (for spontaneous bursts) ───────────────────────────────
  randomNode(): NetworkNode {
    return this.nodes[Math.floor(Math.random() * this.nodes.length)];
  }

  /** Returns node closest to given point */
  nearestNode(x: number, y: number): NetworkNode | null {
    let best: NetworkNode | null = null;
    let bestD2 = Infinity;
    for (const n of this.nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) { bestD2 = d2; best = n; }
    }
    return best;
  }
}
