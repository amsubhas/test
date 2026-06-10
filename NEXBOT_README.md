# NexBot — NexGiga's AI Guide

NexBot is NexGiga's flagship AI assistant — an intelligent, walking digital guide that lives at the bottom of every page. It walks, waves, listens, speaks, navigates, captures leads, and serves as the intelligent face of the NexGiga ecosystem.

---

## Architecture Overview

```
NexBot
├── components/NexBot/
│   ├── index.tsx          — Main controller (walking, tour, highlight)
│   ├── NexBotPanel.tsx    — Chat UI panel
│   ├── NexBotCharacter.tsx — Animated SVG robot
│   └── NexBotLeadForm.tsx  — Lead capture form
├── lib/nexbot/
│   ├── systemPrompt.ts    — NexBot's AI personality & knowledge
│   ├── knowledge.ts       — Full NexGiga knowledge base
│   ├── navigationMap.ts   — Tour stops & quick actions
│   ├── voiceEngine.ts     — TTS (Browser + ElevenLabs)
│   └── types.ts           — TypeScript interfaces
└── app/api/nexbot/route.ts — 5-layer response engine
```

---

## 5-Layer Response System

NexBot never fails. Every user query goes through these layers in order:

| Layer | System | Speed | Use Case |
|-------|--------|-------|----------|
| 1 | Local Knowledge Engine | ~0ms | Direct NexGiga topic matches |
| 2 | Intent + Confidence | ~0ms | High-confidence topic routing |
| 3 | FAQ Engine | ~0ms | Pricing, timeline, team questions |
| 4 | Gemini AI | ~1-3s | Complex, open-ended questions |
| 5 | Guided Assistance | ~0ms | Context-aware fallback (never fails) |

---

## Quick Start

### 1. Add Gemini API Key

In your `.env.local` (or Vercel environment variables):
```
Gemini_API_Key=YOUR_GEMINI_API_KEY
```

The key can begin with `AQ...`, `AI...`, or any other prefix — no validation restrictions.

Get a free key at: https://aistudio.google.com/app/apikey

### 2. (Optional) ElevenLabs Voice

For premium voice output, add:
```
NEXT_PUBLIC_ELEVENLABS_KEY=your_elevenlabs_api_key
```

Without it, NexBot uses the browser's built-in speech synthesis (free, always available).

### 3. Run

```bash
npm install
npm run dev
```

---

## NexBot Capabilities

### 🤖 Intelligent Responses
- Full NexGiga knowledge base built-in
- Smart intent detection across 13+ topic areas
- FAQ engine for common questions (pricing, timelines, team)
- Gemini AI for complex open-ended conversations
- Multi-language support (auto-detects user language)

### 🗺️ Guided Tour
Triggers when user says "give me a tour", "show me around", etc.
- Navigates page-by-page with smooth scrolling
- Highlights sections with glowing overlays
- Injects commentary directly into chat

### 🎯 Smart Lead Qualification
- Detects purchase intent automatically
- Shows lead capture form at the right moment
- Submits to `/api/contact` for CRM integration
- Identifies industry, budget, and goals

### 🔊 Voice Capabilities
- Speech-to-Text: browser Web Speech API
- Text-to-Speech: browser synthesis OR ElevenLabs
- Voice mode with large mic button
- Mute/unmute toggle
- Future-ready: swap to ElevenLabs with one env var

### 📍 Page Awareness
NexBot knows which page the user is on and adjusts its focus:
- On `/nextech` → prioritizes AI/robotics/IoT answers
- On `/nexforce` → prioritizes talent/staffing answers
- On `/nexdesign` → prioritizes design/visualization answers
- On `/nexbuild` → prioritizes BIM/construction answers

### 🎨 Visual States
- `walking-right` / `walking-left` — walks across screen
- `idle` — subtle breathing animation
- `waving` — arm wave
- `listening` — ears perk up (mic active)
- `thinking` — eyes move, slower blink
- `talking` — chest glow pulses
- `celebrating` — bouncing, green glow
- `error` — brief red state, self-corrects

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `Gemini_API_Key` | Optional | Gemini API key for AI responses (Layer 4) |
| `NEXT_PUBLIC_ELEVENLABS_KEY` | Optional | ElevenLabs API key for premium TTS |
| `RESEND_API_KEY` | Recommended | Email API for contact form submissions |

---

## Contact Integration

When NexBot collects leads, it submits to `/api/contact` which uses Resend for email delivery.
Set `RESEND_API_KEY` in your environment for this to work.

Contact phone: **+1-925-789-8909**
