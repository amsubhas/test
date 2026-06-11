// ─── Voice Provider Interface ────────────────────────────────────────────────
// Abstraction layer: swap providers without touching consuming code.

export interface VoiceProvider {
  readonly id: string;
  isSupported(): boolean;
  speak(text: string, opts?: SpeakOptions): Promise<void>;
  stop(): void;
  setOnSpeakStart(cb: () => void): void;
  setOnSpeakEnd(cb: () => void): void;
  setOnWord(cb: (word: string) => void): void;
}

export interface SpeakOptions {
  rate?:   number;  // 0.5 – 2.0 (default 0.88)
  pitch?:  number;  // 0.0 – 2.0 (default 1.05)
  volume?: number;  // 0.0 – 1.0 (default 1.0)
}

// ─── Preferred voice names (ordered by quality) ──────────────────────────────
const PREFERRED_VOICES = [
  "Samantha",      // macOS / iOS — best quality
  "Google US English",
  "Karen",         // Australia — clear and warm
  "Victoria",
  "Joanna",
  "Salli",
  "Jenny",         // Microsoft Edge
  "Aria",          // Microsoft Edge
];

function selectFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === "undefined") return null;
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Try preferred voices first
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((v) => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) return v;
  }

  // Fall back to any English female voice
  const female = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman") ||
        v.name.toLowerCase().includes("girl"))
  );
  if (female) return female;

  // Last resort: any English voice
  return voices.find((v) => v.lang.startsWith("en")) ?? null;
}

// ─── Browser TTS Provider ────────────────────────────────────────────────────
class BrowserVoiceProvider implements VoiceProvider {
  readonly id = "browser-tts";
  private onStart:  (() => void)      | null = null;
  private onEnd:    (() => void)      | null = null;
  private onWord:   ((w: string) => void) | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;

  isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  setOnSpeakStart(cb: () => void)          { this.onStart = cb; }
  setOnSpeakEnd(cb: () => void)            { this.onEnd   = cb; }
  setOnWord(cb: (word: string) => void)    { this.onWord  = cb; }

  async speak(text: string, opts: SpeakOptions = {}): Promise<void> {
    if (!this.isSupported()) return;

    return new Promise((resolve) => {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.utterance = utterance;

      // Select best available voice (wait for voices to load if needed)
      const setVoice = () => {
        const voice = selectFemaleVoice();
        if (voice) utterance.voice = voice;
      };
      setVoice();
      if (!utterance.voice) {
        speechSynthesis.addEventListener("voiceschanged", setVoice, { once: true });
      }

      utterance.rate   = opts.rate   ?? 0.88;
      utterance.pitch  = opts.pitch  ?? 1.05;
      utterance.volume = opts.volume ?? 1.0;
      utterance.lang   = "en-US";

      utterance.onstart    = () => this.onStart?.();
      utterance.onend      = () => { this.onEnd?.(); resolve(); };
      utterance.onerror    = () => { this.onEnd?.(); resolve(); };
      utterance.onboundary = (e) => {
        if (e.name === "word") this.onWord?.(text.slice(e.charIndex, e.charIndex + e.charLength));
      };

      speechSynthesis.speak(utterance);
    });
  }

  stop() {
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.cancel();
    }
    this.utterance = null;
  }
}

// ─── ElevenLabs Provider (stub — activate by setting NEXT_PUBLIC_ELEVENLABS_KEY) ──
class ElevenLabsVoiceProvider implements VoiceProvider {
  readonly id = "elevenlabs";
  private onStart: (() => void)          | null = null;
  private onEnd:   (() => void)          | null = null;
  private onWord:  ((w: string) => void) | null = null;
  private audio:   HTMLAudioElement      | null = null;

  // Nexa voice ID on ElevenLabs — replace with your cloned voice
  private static readonly VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel (default)
  private static readonly MODEL    = "eleven_turbo_v2_5";

  isSupported() {
    return (
      typeof window !== "undefined" &&
      typeof process.env.NEXT_PUBLIC_ELEVENLABS_KEY === "string" &&
      process.env.NEXT_PUBLIC_ELEVENLABS_KEY.length > 0
    );
  }

  setOnSpeakStart(cb: () => void)         { this.onStart = cb; }
  setOnSpeakEnd(cb: () => void)           { this.onEnd   = cb; }
  setOnWord(cb: (word: string) => void)   { this.onWord  = cb; }

  async speak(text: string, opts: SpeakOptions = {}): Promise<void> {
    const key = process.env.NEXT_PUBLIC_ELEVENLABS_KEY;
    if (!key) return;
    this.stop();

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ElevenLabsVoiceProvider.VOICE_ID}/stream`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: ElevenLabsVoiceProvider.MODEL,
          voice_settings: {
            stability:         0.60,
            similarity_boost:  0.85,
            style:             0.30,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) return;
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);

    await new Promise<void>((resolve) => {
      const audio = new Audio(url);
      this.audio  = audio;
      audio.playbackRate = opts.rate ?? 1.0;
      audio.volume       = opts.volume ?? 1.0;
      audio.onplay  = () => this.onStart?.();
      audio.onended = () => { URL.revokeObjectURL(url); this.onEnd?.(); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); this.onEnd?.(); resolve(); };
      audio.play().catch(() => resolve());
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

// ─── NexaVoiceEngine — picks best provider automatically ────────────────────
export class NexaVoiceEngine {
  private provider: VoiceProvider;
  private queue: string[] = [];
  private speaking = false;
  private enabled  = true;

  onSpeakStart?: () => void;
  onSpeakEnd?:   () => void;
  onWord?:       (word: string) => void;

  constructor() {
    // ElevenLabs takes priority if configured
    const el = new ElevenLabsVoiceProvider();
    this.provider = el.isSupported() ? el : new BrowserVoiceProvider();

    this.provider.setOnSpeakStart(() => { this.speaking = true;  this.onSpeakStart?.(); });
    this.provider.setOnSpeakEnd(  () => { this.speaking = false; this.onSpeakEnd?.(); this.flush(); });
    this.provider.setOnWord(      (w) => this.onWord?.(w));
  }

  get activeProvider() { return this.provider.id; }
  get isSpeaking()     { return this.speaking; }

  setEnabled(v: boolean) {
    this.enabled = v;
    if (!v) this.stop();
  }

  /** Queue text for speaking. Interrupts current speech. */
  say(text: string, interrupt = true) {
    if (!this.enabled || !this.provider.isSupported()) return;
    if (interrupt) {
      this.provider.stop();
      this.queue = [];
      this.speaking = false;
    }
    // Split into natural sentences for better pacing
    const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
    this.queue.push(...sentences.map((s) => s.trim()).filter(Boolean));
    if (!this.speaking) this.flush();
  }

  stop() {
    this.queue = [];
    this.provider.stop();
    this.speaking = false;
  }

  private async flush() {
    if (!this.queue.length || this.speaking) return;
    const next = this.queue.shift();
    if (next) await this.provider.speak(next);
  }

  /** Swap provider at runtime (e.g. when ElevenLabs key is added) */
  switchProvider(id: "browser" | "elevenlabs") {
    this.stop();
    const prev = this.provider;
    if (id === "elevenlabs") {
      const el = new ElevenLabsVoiceProvider();
      this.provider = el.isSupported() ? el : prev;
    } else {
      this.provider = new BrowserVoiceProvider();
    }
    this.provider.setOnSpeakStart(() => { this.speaking = true;  this.onSpeakStart?.(); });
    this.provider.setOnSpeakEnd(  () => { this.speaking = false; this.onSpeakEnd?.(); this.flush(); });
    this.provider.setOnWord(      (w) => this.onWord?.(w));
  }
}
