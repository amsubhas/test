# NexBot — AI Digital Employee for NexGiga

NexBot is a fully integrated, walking AI representative that lives at the bottom of the NexGiga website. It walks, waves, listens, speaks, navigates, captures leads, and behaves like a real digital employee.

---

## Quick Start

### 1. Add your Anthropic API key

Copy the example env file and fill in your key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
```

Get your key at: https://console.anthropic.com

### 2. Install dependencies (if not already installed)

```bash
npm install
# or
pnpm install
```

No new packages are required. NexBot uses:
- `framer-motion` (already in project)
- `lucide-react` (already in project)
- `next/navigation` (built-in)
- Web Speech API (browser-native, no install needed)
- Anthropic API via native `fetch`

### 3. Run locally

```bash
npm run dev
```

NexBot will appear and walk at the bottom of every page.

### 4. Deploy to Vercel

Add `ANTHROPIC_API_KEY` in your Vercel project settings:
- Dashboard → Project → Settings → Environment Variables

---

## File Structure

```
components/NexBot/
├── index.tsx              Main orchestrator (walking, activation, tours)
├── NexBotCharacter.tsx    Animated SVG robot (states: walk, wave, talk, etc.)
├── NexBotPanel.tsx        Chat UI panel (messages, voice, quick actions)
└── NexBotLeadForm.tsx     3-step lead capture form

lib/nexbot/
├── types.ts               TypeScript interfaces
├── knowledge.ts           Full NexGiga knowledge base + walking hints
├── systemPrompt.ts        Claude AI system prompt
└── navigationMap.ts       URL map, tour stops, quick action buttons

app/api/nexbot/
└── route.ts               Edge API route → Anthropic Claude API
```

---

## Features

### Walking Robot
- Walks continuously at the bottom of every page
- Smooth 60fps movement via `requestAnimationFrame`
- Flips direction at screen edges with idle pause
- Shows speech bubble hints every ~18 seconds
- Waves randomly every ~45 seconds
- Pulsing AI badge to attract attention

### Animation States
| State | When |
|-------|------|
| `walking-right` / `walking-left` | Default patrol |
| `idle` | Panel open, paused |
| `waving` | Periodic wave, activation |
| `listening` | Voice input active (visor shows waveform) |
| `thinking` | Waiting for AI response (scanning eyes) |
| `talking` | Speaking / displaying response |
| `celebrating` | Lead submitted, positive events |
| `sleeping` | Future: idle timeout |

### AI Chat
- Full conversation memory (20-message context window)
- Understands all languages (auto-detects, responds in same language)
- 4 question categories: NexGiga, General Knowledge, Competitors, Off-topic
- Smart lead detection with automatic form trigger
- Quick action buttons on first open

### Voice Support
- **Speech-to-Text**: Web Speech API (Chrome/Edge/Safari)
- **Text-to-Speech**: Web Speech Synthesis
- User can interrupt NexBot mid-speech
- Mic button available in text mode too
- Voice mode with large mic button

### Navigation AI
When AI says to navigate, NexBot automatically:
1. Routes to the target page (`useRouter`)
2. Scrolls to the specific section
3. Optionally highlights elements with cyan border

Supported navigation targets:
- `/nexforce`, `/nextech`, `/nexdesign`, `/nexbuild`
- All main page sections: `#services`, `#contact`, `#buildmate`, etc.
- External: `https://buildmate.in` (opens new tab)

### Guided Tour
User says "Give me a tour" → NexBot navigates through all major sections with explanations and highlights.

### Lead Generation
3-step form collects:
1. Name, Company, Email, Phone
2. Service interest, Requirement description  
3. Budget range, Timeline

Leads are logged to console. Connect to your CRM/email in `NexBotLeadForm.tsx` `handleSubmit`.

---

## Customization

### Update the knowledge base
Edit `lib/nexbot/knowledge.ts` — add new services, products, or update contact info.

### Change robot speed / hints timing
Edit constants in `components/NexBot/index.tsx`:
```ts
const WALK_SPEED = 65;       // px/second
const HINT_INTERVAL = 18000; // ms between hints
const WAVE_INTERVAL = 45000; // ms between waves
```

### Connect lead form to CRM
In `NexBotLeadForm.tsx`, replace the console.info in `handleSubmit`:
```ts
// Replace this:
console.info('[NexBot Lead]', leadData);

// With your API call:
await fetch('/api/leads', { method: 'POST', body: JSON.stringify(leadData) });
// or send to HubSpot, Salesforce, Notion, email, etc.
```

### Modify the AI personality
Edit `lib/nexbot/systemPrompt.ts` to adjust:
- Tone and personality
- Response length
- Navigation triggers
- Lead detection phrases

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Anthropic Claude API key |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical URL for metadata |

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Chat (text) | ✅ | ✅ | ✅ | ✅ |
| Voice input | ✅ | ❌ | ✅ | ✅ |
| Voice output | ✅ | ✅ | ✅ | ✅ |
| Walking robot | ✅ | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ | ✅ |

---

## Security

- Rate limited to 30 requests/minute per IP
- Input sanitized and truncated to 2000 characters
- Prompt injection patterns stripped
- API key never exposed to client
- ANTHROPIC_API_KEY only used server-side in Edge route

---

## Performance

- NexBot is **dynamically imported** with `ssr: false` — zero impact on initial page load
- Robot position updated via direct DOM manipulation (no React re-renders during walk)
- SVG-based robot — crisp at any DPI, <5KB asset
- Framer Motion animations use GPU-accelerated transforms only
- Chat panel lazy-renders only when opened

---

## Troubleshooting

**NexBot doesn't appear**
→ Check browser console for errors
→ Ensure `ANTHROPIC_API_KEY` is set in `.env.local`

**Voice not working**
→ Voice requires HTTPS or localhost. Won't work on `http://` in production.
→ Grant microphone permission when prompted

**Chat returns error**
→ Check API key is valid at console.anthropic.com
→ Check Vercel function logs

**Robot animation choppy on mobile**
→ Reduce `WALK_SPEED` or disable walking on mobile by detecting `window.innerWidth < 768`
