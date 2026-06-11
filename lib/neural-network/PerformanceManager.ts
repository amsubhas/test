// ─── PerformanceManager ───────────────────────────────────────────────────────
// Detects device capability tier and exposes per-tier config constants.
// Used by NetworkEngine to scale node/connection counts and target FPS.

export type DeviceTier = 'low' | 'mid' | 'high';

export interface TierConfig {
  nodeCount:        number;   // total nodes in the network
  maxConnections:   number;   // max connections per node
  pulseCount:       number;   // simultaneous data-pulse particles
  targetFPS:        number;   // desired animation rate
  idleFPS:          number;   // FPS when tab is backgrounded
  mouseRadius:      number;   // px — mouse influence radius
  interactionDepth: number;   // how many hops NexBot activation spreads
  dpr:              number;   // device pixel ratio cap for canvas
  blurPasses:       number;   // trail blur intensity (0 = disabled)
}

const CONFIGS: Record<DeviceTier, TierConfig> = {
  high: {
    nodeCount:        120,
    maxConnections:   5,
    pulseCount:       18,
    targetFPS:        60,
    idleFPS:          20,
    mouseRadius:      180,
    interactionDepth: 4,
    dpr:              Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2),
    blurPasses:       1,
  },
  mid: {
    nodeCount:        70,
    maxConnections:   4,
    pulseCount:       10,
    targetFPS:        45,
    idleFPS:          15,
    mouseRadius:      140,
    interactionDepth: 3,
    dpr:              Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5),
    blurPasses:       1,
  },
  low: {
    nodeCount:        35,
    maxConnections:   3,
    pulseCount:       5,
    targetFPS:        30,
    idleFPS:          10,
    mouseRadius:      100,
    interactionDepth: 2,
    dpr:              1,
    blurPasses:       0,
  },
};

// ─── Tier Detection ───────────────────────────────────────────────────────────
function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'mid';

  // Reduced-motion preference → always low tier
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';

  // Screen size heuristic
  const w = window.innerWidth;
  const h = window.innerHeight;
  const px = w * h;

  // Mobile small screen
  if (w < 480) return 'low';
  if (w < 768) return 'low';

  // Tablet
  if (w < 1024) return 'mid';

  // Hardware concurrency (logical cores)
  const cores = navigator.hardwareConcurrency ?? 2;
  if (cores <= 2) return 'low';
  if (cores <= 4) return 'mid';

  // GPU hint via WebGL renderer
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const glCtx = gl as WebGLRenderingContext;
      const dbgInfo = glCtx.getExtension('WEBGL_debug_renderer_info');
      if (dbgInfo) {
        const renderer = glCtx.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string;
        const lower = renderer.toLowerCase();
        if (
          lower.includes('intel hd') ||
          lower.includes('intel(r) hd') ||
          lower.includes('mesa') ||
          lower.includes('swiftshader')
        ) {
          return cores <= 4 ? 'low' : 'mid';
        }
      }
    }
  } catch {
    // Can't read GPU info — use other signals
  }

  // High pixel count = likely capable display
  return px > 2_000_000 && cores >= 6 ? 'high' : 'mid';
}

// ─── FPS Sampler — real-time adaptive throttle ────────────────────────────────
export class FPSSampler {
  private samples: number[] = [];
  private last = 0;
  private readonly window = 30; // sample count

  sample(now: number): number {
    if (this.last) {
      const fps = 1000 / (now - this.last);
      this.samples.push(fps);
      if (this.samples.length > this.window) this.samples.shift();
    }
    this.last = now;
    return this.average();
  }

  average(): number {
    if (!this.samples.length) return 60;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  reset(): void {
    this.samples = [];
    this.last = 0;
  }
}

// ─── PerformanceManager ───────────────────────────────────────────────────────
export class PerformanceManager {
  readonly tier: DeviceTier;
  readonly config: TierConfig;
  readonly fpsSampler = new FPSSampler();

  private _degraded = false; // true when FPS dropped below threshold
  private degradeCallbacks: Array<() => void> = [];

  constructor() {
    this.tier = detectTier();
    this.config = { ...CONFIGS[this.tier] };
  }

  get isDegraded(): boolean { return this._degraded; }

  get frameIntervalMs(): number {
    return 1000 / this.config.targetFPS;
  }

  /** Call each rAF with the raw timestamp. Returns true when a frame should be rendered. */
  shouldRender(now: number, lastRenderTime: number): boolean {
    return now - lastRenderTime >= this.frameIntervalMs;
  }

  /** Feed real FPS readings; auto-degrades config if sustained drop detected. */
  updateFPS(now: number): void {
    const avg = this.fpsSampler.sample(now);

    if (!this._degraded && avg < this.config.targetFPS * 0.6 && this.fpsSampler['samples'].length >= 20) {
      this._degraded = true;

      // Step down config values
      this.config.nodeCount       = Math.floor(this.config.nodeCount * 0.6);
      this.config.pulseCount      = Math.floor(this.config.pulseCount * 0.5);
      this.config.blurPasses      = 0;
      this.config.maxConnections  = Math.max(2, this.config.maxConnections - 1);
      this.config.targetFPS       = Math.max(24, this.config.targetFPS - 10);

      this.degradeCallbacks.forEach((cb) => cb());
    }
  }

  onDegrade(cb: () => void): void {
    this.degradeCallbacks.push(cb);
  }

  get isReducedMotion(): boolean {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
