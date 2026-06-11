// ─── ConnectionSystem ─────────────────────────────────────────────────────────
// Manages inter-node connections and travelling data-pulse particles.

import type { NetworkNode } from './NodeSystem';
import type { TierConfig } from './PerformanceManager';

export interface Connection {
  a:           number; // node index A
  b:           number; // node index B
  strength:    number; // base alpha 0–1
  active:      number; // current highlighted alpha (mouse/NexBot boost)
  activeDecay: number;
}

export interface DataPulse {
  id:      number;
  connIdx: number;  // which connection it travels on
  t:       number;  // 0 = at node A, 1 = at node B
  speed:   number;  // units per second
  alpha:   number;
  size:    number;
  color:   string;  // chosen at spawn
  reverse: boolean; // traveling B→A
}

const PULSE_COLORS = [
  'rgba(0,245,255,',   // cyan
  'rgba(100,120,255,', // indigo-blue
  'rgba(80,220,200,',  // teal
];

let pulseCounter = 0;

export class ConnectionSystem {
  readonly connections: Connection[] = [];
  readonly pulses:      DataPulse[]  = [];
  private cfg: TierConfig;
  private readonly MAX_CONN_DIST_FACTOR = 0.30; // % of canvas width
  private spawnTimer = 0;
  private readonly SPAWN_INTERVAL_BASE = 0.28; // seconds between auto-spawns

  constructor(cfg: TierConfig) {
    this.cfg = cfg;
  }

  // ─── Build connections from nodes ────────────────────────────────────────
  build(nodes: NetworkNode[], canvasWidth: number): void {
    this.connections.length = 0;
    this.pulses.length      = 0;
    // Also clear any existing connections stored on nodes
    for (const n of nodes) n.connections = [];

    const maxDist = canvasWidth * this.MAX_CONN_DIST_FACTOR;
    const maxD2   = maxDist * maxDist;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      const candidates: Array<{ j: number; d2: number }> = [];
      for (let j = i + 1; j < nodes.length; j++) {
        const b  = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) candidates.push({ j, d2 });
      }
      candidates.sort((x, y) => x.d2 - y.d2);

      let added = 0;
      for (const { j, d2 } of candidates) {
        if (added >= this.cfg.maxConnections) break;
        const b = nodes[j];
        const layerDiff = Math.abs(a.layer - b.layer);
        if (layerDiff > 1 && Math.random() > 0.25) continue;

        const dist     = Math.sqrt(d2);
        const strength = Math.pow(1 - dist / maxDist, 1.5) * 0.55;

        // ✅ FIX: store indices i and j, NOT the node objects
        this.connections.push({
          a: i,
          b: j,
          strength,
          active:      0,
          activeDecay: 0.015 + Math.random() * 0.01,
        });

        if (!a.connections.includes(j))     a.connections.push(j);
        if (!nodes[j].connections.includes(i)) nodes[j].connections.push(i);
        added++;
      }
    }
  }

  // ─── Per-frame update ────────────────────────────────────────────────────
  update(dt: number, nodes: NetworkNode[]): void {
    // Decay active highlight
    for (const c of this.connections) {
      if (c.active > 0) c.active = Math.max(0, c.active - c.activeDecay * dt * 60);
    }

    // Advance pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.t += p.speed * dt;

      const tNorm = p.reverse ? 1 - p.t : p.t;
      p.alpha = Math.sin(tNorm * Math.PI) * 0.95;

      if (p.t >= 1) {
        // Activate destination node on arrival
        const c       = this.connections[p.connIdx];
        const destIdx = p.reverse ? c.a : c.b;
        if (nodes[destIdx]) {
          nodes[destIdx].activation = Math.min(1, nodes[destIdx].activation + 0.35);
        }
        this.pulses.splice(i, 1);
      }
    }

    // Auto-spawn pulses
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.pulses.length < this.cfg.pulseCount) {
      this.spawnTimer = this.SPAWN_INTERVAL_BASE + Math.random() * 0.35;
      this.spawnRandomPulse(nodes);
    }
  }

  // ─── Activate connections near mouse ─────────────────────────────────────
  activateNearMouse(mouseX: number, mouseY: number, nodes: NetworkNode[], radius: number): void {
    const r2 = radius * radius;
    for (const c of this.connections) {
      const an = nodes[c.a];
      const bn = nodes[c.b];
      if (!an || !bn) continue;
      const mx = (an.x + bn.x) * 0.5;
      const my = (an.y + bn.y) * 0.5;
      const dx = mouseX - mx;
      const dy = mouseY - my;
      if (dx * dx + dy * dy < r2) {
        c.active = Math.min(1, c.active + 0.14);
      }
    }
  }

  // ─── Spawn a pulse on a specific connection ───────────────────────────────
  spawnPulseOn(connIdx: number, reverse = false): void {
    if (connIdx < 0 || connIdx >= this.connections.length) return;
    if (this.pulses.length >= this.cfg.pulseCount * 2) return;

    const colorBase = PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)];
    this.pulses.push({
      id:      pulseCounter++,
      connIdx,
      t:       0,
      speed:   0.22 + Math.random() * 0.38,
      alpha:   0,
      size:    1.8 + Math.random() * 1.5,
      color:   colorBase,
      reverse,
    });
  }

  // ─── Burst pulses from a node ─────────────────────────────────────────────
  burstFromNode(nodeIdx: number, nodes: NetworkNode[], count = 3): void {
    const myConns: number[] = [];
    for (let i = 0; i < this.connections.length; i++) {
      const c = this.connections[i];
      if (c.a === nodeIdx || c.b === nodeIdx) myConns.push(i);
    }
    // Shuffle
    for (let i = myConns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [myConns[i], myConns[j]] = [myConns[j], myConns[i]];
    }
    for (let k = 0; k < Math.min(count, myConns.length); k++) {
      const cIdx   = myConns[k];
      const reverse = this.connections[cIdx].a !== nodeIdx;
      this.spawnPulseOn(cIdx, reverse);
      this.connections[cIdx].active = Math.min(1, this.connections[cIdx].active + 0.7);
    }
  }

  private spawnRandomPulse(nodes: NetworkNode[]): void {
    if (!this.connections.length) return;
    // Prefer connections whose nodes are more active
    const top = this.connections
      .map((c, i) => ({ i, act: (nodes[c.a]?.activation ?? 0) + (nodes[c.b]?.activation ?? 0) }))
      .sort((a, b) => b.act - a.act)
      .slice(0, 20);
    const chosen = top[Math.floor(Math.random() * Math.min(8, top.length))];
    if (chosen) this.spawnPulseOn(chosen.i, Math.random() < 0.5);
  }

  // ─── NexBot burst activation ───────────────────────────────────────────────
  nexbotActivate(nodeIndices: number[], nodes: NetworkNode[]): void {
    for (const idx of nodeIndices) this.burstFromNode(idx, nodes, 2);
    for (const c of this.connections) {
      if (nodeIndices.includes(c.a) || nodeIndices.includes(c.b)) {
        c.active = Math.min(1, c.active + 0.6);
      }
    }
  }
}
