// ─── NexBot Types ─────────────────────────────────────────────────────────────

export type NexBotAnimState =
  | 'walking-right'
  | 'walking-left'
  | 'idle'
  | 'waving'
  | 'listening'
  | 'thinking'
  | 'talking'
  | 'celebrating'
  | 'sleeping'
  | 'error';

export type ConvMode = 'voice' | 'text';

export type EmotionState = 'neutral' | 'happy' | 'thinking' | 'excited' | 'attentive';

// ─── Message ──────────────────────────────────────────────────────────────────

export interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
  isLoading?: boolean;
}

// ─── Bot Response from API ─────────────────────────────────────────────────────

export interface BotAction {
  type: 'navigate' | 'scroll' | 'highlight' | 'tour' | 'lead-form' | 'external' | 'none';
  path?: string;          // e.g. '/nextech'
  section?: string;       // e.g. '#services'
  highlights?: string[];  // CSS selectors to highlight
  external?: string;      // external URL e.g. 'https://buildmate.sharvas.in'
}

export interface BotResponse {
  message: string;
  action: BotAction;
  leadCapture: {
    detected: boolean;
    interest?: string;
    showForm?: boolean;
  };
  emotion?: EmotionState;
}

// ─── Lead Generation ──────────────────────────────────────────────────────────

export interface LeadData {
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
  budget?: string;
  timeline?: string;
  interest?: string;
  source?: string;
}

// ─── Walking Hints ────────────────────────────────────────────────────────────

export interface WalkingHint {
  id: string;
  text: string;
  wing?: string;
}

// ─── Navigation Entry ─────────────────────────────────────────────────────────

export interface NavEntry {
  path: string;
  section?: string;
  label: string;
  external?: boolean;
}
