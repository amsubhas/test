import { NextRequest, NextResponse } from 'next/server';
import { NEXBOT_SYSTEM_PROMPT } from '@/lib/nexbot/systemPrompt';

export const dynamic = 'force-dynamic';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ApiMessage[];
  sessionId?: string;
  pathname?: string;
}

interface BotResponse {
  message: string;
  action: {
    type: 'navigate' | 'scroll' | 'highlight' | 'tour' | 'lead-form' | 'external' | 'none';
    path?: string;
    section?: string;
    highlights?: string[];
    external?: string;
  };
  leadCapture: {
    detected: boolean;
    interest?: string;
    showForm?: boolean;
  };
  emotion: 'neutral' | 'happy' | 'thinking' | 'excited' | 'attentive';
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function pruneRateLimitMap(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 1000) pruneRateLimitMap();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Input Sanitizer ──────────────────────────────────────────────────────────
function sanitizeMessage(content: string): string {
  return content
    .slice(0, 2000)
    .replace(/<\|.*?\|>/g, '')
    .replace(/\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>/g, '')
    .trim();
}

// ═════════════════════════════════════════════════════════════════════════════
// LOCAL KNOWLEDGE ENGINE — answers NexGiga questions instantly, zero API calls
// ═════════════════════════════════════════════════════════════════════════════

const LOCAL_RESPONSES: Record<string, BotResponse> = {
  overview: {
    message:
      "I'm **NexBot**, NexGiga's AI Digital Employee! 👋\n\n**NexGiga** is a pioneering technology company that bridges the digital and physical worlds — transforming ideas into measurable real-world outcomes through four specialized wings:\n\n• **NexForce** — Human Capital & Workforce Solutions\n• **NexTech** — AI, Robotics, IoT & Simulation\n• **NexDesign** — Creative Design & Visualization\n• **NexBuild** — Smart Construction via BuildMate\n\n📊 **Track Record:**\n• 200+ Projects Delivered across 15+ countries\n• 50+ AI Models Deployed\n• Industry 4.0 pioneer in construction, manufacturing, healthcare & smart cities\n\nWhich wing would you like to explore?",
    action: { type: 'scroll', section: '#wings' },
    leadCapture: { detected: false },
    emotion: 'happy',
  },
  nexforce: {
    message:
      "**NexForce** is NexGiga's Human Intelligence wing — connecting organizations with elite technology talent worldwide. 💼\n\n**Services:**\n• Technology Staffing & Recruitment (BIM, AI, Cloud, IoT specialists)\n• Project-Based Workforce Solutions — dedicated teams for specific projects\n• Technical Training & Upskilling programs\n• Global Talent Acquisition across 15+ countries\n• Managed Teams for digital transformation\n• AI & ML Engineering teams\n• Executive Search for tech leadership roles\n• Workforce analytics and performance management\n\n**Industries Served:** Construction, Manufacturing, Technology, Healthcare, Energy\n\nNeed specialized talent for your project?",
    action: { type: 'navigate', path: '/nexforce' },
    leadCapture: { detected: true, interest: 'Workforce Solutions — NexForce' },
    emotion: 'attentive',
  },
  nextech: {
    message:
      "**NexTech** is NexGiga's Phygital Bridge wing — building the connection between digital and physical systems. 🤖\n\n🧠 **AI & Machine Learning:**\n• Predictive Analytics, Computer Vision, NLP\n• Generative AI integration (GPT, Claude, custom LLMs)\n• Anomaly detection & predictive maintenance\n• MLOps pipeline development\n\n🦾 **Robotics & Automation:**\n• Industrial Robot Integration (ABB, KUKA, Fanuc)\n• Collaborative Robotics (Cobots)\n• Robot Process Automation (RPA)\n\n📡 **IoT & Edge Computing:**\n• Industrial IIoT sensor networks\n• SCADA integration, LoRaWAN, MQTT, OPC-UA\n• Smart building systems\n\n🔬 **Simulation & Digital Analysis:**\n• Physics-Based Simulation, FEA, CFD\n• Digital Twin Implementation — live asset mirrors",
    action: { type: 'navigate', path: '/nextech' },
    leadCapture: { detected: true, interest: 'Technology Solutions — NexTech' },
    emotion: 'excited',
  },
  nexdesign: {
    message:
      "**NexDesign** is NexGiga's Design Intelligence wing — merging aesthetic precision with technical excellence. 🎨\n\n**Services:**\n• Brand Identity & Visual Design Systems\n• UI/UX Design for digital products and platforms\n• Architectural Visualization & high-fidelity 3D Rendering\n• 3D Animation & walkthrough experiences\n• Motion Graphics & Video Production\n• Digital Twin Visualization & interactive models\n• Virtual Reality (VR) & Augmented Reality (AR) experiences\n• Product & Industrial Design\n\n**Tools:** Blender, Unreal Engine, Adobe Creative Suite, Figma, Cinema 4D, Lumion",
    action: { type: 'navigate', path: '/nexdesign' },
    leadCapture: { detected: true, interest: 'Design Solutions — NexDesign' },
    emotion: 'happy',
  },
  nexbuild: {
    message:
      "**NexBuild** is NexGiga's Smart Construction wing, powered by the **BuildMate** platform. 🏗️\n\n**BIM & Digital Twin Solutions:**\n• LOD 100–500 BIM Models (concept through as-built)\n• 4D BIM (time-linked sequencing) & 5D BIM (cost-linked)\n• Clash Detection & Coordination (Navisworks, Solibri)\n• Scan-to-BIM for existing structures\n• Digital Twin Implementation — live asset mirrors\n• BIM for Facilities Management (FM-BIM)\n\n**Smart Infrastructure:**\n• Smart City Solutions & Urban Digital Twins\n• Building Automation Systems (BAS/BMS)\n• Energy Management & Net-Zero Planning\n\n**Tools:** Revit, ArchiCAD, Navisworks, AutoCAD, Civil 3D",
    action: { type: 'scroll', section: '#buildmate' },
    leadCapture: { detected: true, interest: 'BIM & Construction — NexBuild' },
    emotion: 'attentive',
  },
  buildmate: {
    message:
      "**BuildMate** is NexGiga's integrated construction management platform — the engine of the NexBuild wing. 🏗️\n\n**Platform Features:**\n• Integrated BIM model management & viewer\n• Real-time project progress dashboards\n• Cost management & budget tracking\n• Document & drawing management\n• Team collaboration & task assignment\n• Mobile-first field operations app\n• Automated reporting & insights\n• Compliance & regulatory management\n\n🌐 **Live Platform:** https://buildmate.sharvas.in\n\nBuildMate transforms how construction teams coordinate — from BIM to field operations in one unified workspace.",
    action: { type: 'external', external: 'https://buildmate.sharvas.in' },
    leadCapture: { detected: true, interest: 'BuildMate Platform' },
    emotion: 'excited',
  },
  contact: {
    message:
      "Here's how to reach the NexGiga team directly: 📞\n\n**Contact Details:**\n• 📱 Phone / WhatsApp: **+1-925-789-8909**\n• 🌐 Website: nexgiga.com\n• 💼 LinkedIn: linkedin.com/company/nexgiga\n\n**Response Time:** Typically 2–4 business hours.\n\nOr I can collect your details right now and have our team reach out with a tailored proposal.",
    action: { type: 'scroll', section: '#contact' },
    leadCapture: { detected: false },
    emotion: 'attentive',
  },
  services: {
    message:
      "NexGiga offers end-to-end technology services across four wings: 🚀\n\n1️⃣ **BIM & Digital Twin** (NexBuild)\n2️⃣ **AI & Machine Learning** (NexTech)\n3️⃣ **Robotics & Automation** (NexTech)\n4️⃣ **IoT & Edge Computing** (NexTech)\n5️⃣ **Design & Visualization** (NexDesign)\n6️⃣ **Workforce Solutions** (NexForce)\n7️⃣ **Simulation & Analysis** (NexTech)\n\nWhich service area matches your needs?",
    action: { type: 'scroll', section: '#services' },
    leadCapture: { detected: false },
    emotion: 'attentive',
  },
  tour: {
    message:
      "I'd love to walk you through everything! 🎯\n\nStarting your **guided tour** now — I'll scroll through each key section of NexGiga and explain what you're seeing. ✨\n\nThe tour covers: NexGiga Wings → Services → Industry Solutions → BuildMate → Impact Metrics → Contact",
    action: { type: 'tour' },
    leadCapture: { detected: false },
    emotion: 'excited',
  },
  industries: {
    message:
      "NexGiga serves diverse industries with specialized solutions: 🌐\n\n🏗️ **Construction & Real Estate** — BIM, clash detection, digital twins, smart building automation\n🏭 **Manufacturing** — Industrial IoT, predictive maintenance AI, quality control CV, robotic automation\n🏥 **Healthcare** — Facility BIM, campus digital twins, predictive analytics for patient flow\n⚡ **Energy & Utilities** — Smart grid IoT, energy performance simulation, solar/wind digital twins\n🌆 **Smart Cities** — Urban digital twin platforms, smart traffic management, public safety AI\n📦 **Logistics** — Route optimization AI, warehouse robotics, supply chain visibility\n\nWhich industry are you in?",
    action: { type: 'scroll', section: '#solutions' },
    leadCapture: { detected: false },
    emotion: 'attentive',
  },
  simulator: {
    message:
      "The **Idea-to-Reality Simulator** is one of our most interactive features! 🚀\n\nSimply type any project idea — like *\"I want to build a smart apartment\"* or *\"AI-powered manufacturing facility\"* — and watch our AI simulate the complete transformation journey:\n\n1. **Concept Intake** — Your idea is captured and analysed\n2. **AI Analysis** — Requirements, tech stack, and challenges identified\n3. **System Design** — Blueprints and architecture generated\n4. **Digital Twin** — A live digital replica is constructed\n5. **Construction** — Infrastructure assembled phase by phase\n6. **Project Live** — Final result revealed with success metrics\n\nTry it now by scrolling to the simulator section! 👇",
    action: { type: 'scroll', section: '#idea-to-reality' },
    leadCapture: { detected: false },
    emotion: 'excited',
  },
  lead: {
    message:
      "I'd love to help you get started! 🎯\n\nLet me connect you with the right NexGiga expert. Fill in the quick form below and our team will reach out within **24 hours** with a customized proposal.",
    action: { type: 'lead-form' },
    leadCapture: { detected: true, showForm: true },
    emotion: 'happy',
  },
  impact: {
    message:
      "NexGiga's impact speaks for itself: 📊\n\n🏆 **200+ Projects Delivered** — construction, manufacturing, healthcare, energy & smart cities\n🌍 **15+ Countries Served** — North America to Asia-Pacific and the Middle East\n🤖 **50+ AI Models Deployed** — in production across diverse industries\n💡 **Industry 4.0 Pioneer** — leading digital transformation with BIM, digital twins, robotics & IoT\n\nWant to see case studies or discuss how NexGiga can create similar outcomes for your organization?",
    action: { type: 'scroll', section: '#impact' },
    leadCapture: { detected: false },
    emotion: 'excited',
  },
  competitor: {
    message:
      "Every company brings unique strengths — I respect that. 🤝\n\nWhat makes **NexGiga** distinctive:\n\n✅ **End-to-end capability** across 4 specialized wings in one ecosystem\n✅ **200+ projects** delivered across 15+ countries\n✅ **Proprietary BuildMate platform** for construction management\n✅ **Deep expertise** in BIM, AI, Robotics, Design AND workforce\n✅ **Global talent network** via NexForce\n✅ **Industry 4.0 pioneer** across multiple verticals\n\nThe best way to find the right fit is to discuss your specific goals.",
    action: { type: 'none' },
    leadCapture: { detected: false },
    emotion: 'neutral',
  },
};

// ─── Intent Detection ─────────────────────────────────────────────────────────
interface IntentResult {
  topic: string | null;
  confidence: number;
  isNexGiga: boolean;
  isLead: boolean;
  isGeneral: boolean;
}

type PatternEntry = [string[], string, number];

const TOPIC_PATTERNS: PatternEntry[] = [
  [
    ['who are you', 'what is nexgiga', 'about nexgiga', 'what do you do', 'tell me about yourself',
     'introduce yourself', 'company overview', 'what nexgiga does', 'describe nexgiga', 'nexgiga company'],
    'overview', 1.0,
  ],
  [
    ['nexforce', 'workforce', 'staffing', 'recruitment', 'talent acquisition', 'human capital',
     'team placement', 'hire talent', 'hire staff', 'find engineers', 'technology staffing'],
    'nexforce', 0.9,
  ],
  [
    ['nextech', 'ai solutions', 'robotics', 'industrial robot', 'cobot', 'automation', 'iot solution',
     'machine learning', 'deep learning', 'computer vision', 'simulation service', 'edge computing',
     'predictive maintenance', 'scada', 'digital thread', 'iiot', 'nextech wing'],
    'nextech', 0.9,
  ],
  [
    ['nexdesign', 'design service', 'branding service', 'ui ux', 'ux design', 'visualization service',
     '3d rendering', 'architectural rendering', 'motion graphic', 'vr experience', 'ar overlay',
     'brand identity', 'design wing'],
    'nexdesign', 0.9,
  ],
  [
    ['nexbuild', 'bim ', 'building information', 'digital twin', 'clash detection', 'scan to bim',
     'point cloud', 'smart construction', 'facilities management', 'smart infrastructure',
     'structural health', 'smart city solution', 'urban digital twin', 'nexbuild wing'],
    'nexbuild', 0.9,
  ],
  [
    ['buildmate', 'build mate', 'buildmate.sharvas.in', 'buildmate platform', 'construction platform'],
    'buildmate', 1.0,
  ],
  [
    ['contact', 'phone number', 'email', 'reach you', 'get in touch', 'whatsapp', 'call you',
     'your number', 'contact details', 'how do i contact', 'reach nexgiga', 'contact nexgiga'],
    'contact', 1.0,
  ],
  [
    ['all services', 'what services', 'services you offer', 'full list', 'your offerings',
     'complete services', 'what can you do', 'capabilities', 'everything you offer'],
    'services', 0.85,
  ],
  [
    ['give me a tour', 'start the tour', 'tour the website', 'website tour', 'show me around',
     'guide me through', 'take me through', 'show me everything', 'walk me through'],
    'tour', 1.0,
  ],
  [
    ['industries', 'which industry', 'what sectors', 'industry verticals', 'construction industry',
     'manufacturing industry', 'healthcare industry', 'energy sector', 'smart city', 'logistics'],
    'industries', 0.8,
  ],
  [
    ['simulator', 'idea to reality', 'idea-to-reality', 'simulate my idea', 'simulate transformation',
     'simulation result', 'project simulation', 'try the simulator'],
    'simulator', 0.95,
  ],
  [
    ['compare', ' vs ', 'versus', 'better than', 'competitor', 'other agency',
     'other company', 'alternative to', 'compared to'],
    'competitor', 0.9,
  ],
  [
    ['200 projects', '15 countries', '50 ai models', 'track record', 'proven', 'achievements',
     'impact', 'results', 'success rate', 'portfolio'],
    'impact', 0.85,
  ],
  [
    ['get a quote', 'free quote', 'free consultation', 'how much does it cost', 'your pricing',
     'what does it cost', 'cost of', 'hire you', 'work with nexgiga', 'project inquiry',
     'want to start a project', 'ready to start', 'i need a', 'we need', 'build for me',
     'need help with', 'looking for help', 'interested in working'],
    'lead', 0.95,
  ],
];

const GENERAL_SIGNALS = [
  'what is ai', 'explain ai', 'artificial intelligence definition', 'history of ',
  'who invented', 'what is blockchain', 'quantum computing', 'explain machine learning',
  'what is cloud computing', 'capital of ', 'how are you', 'tell me a joke',
  "what's up", 'whats up', 'good morning', 'good evening', 'hello', 'hi there',
];

function detectIntent(text: string): IntentResult {
  const lower = text.toLowerCase();
  const isGeneral = GENERAL_SIGNALS.some((s) => lower.includes(s));
  let bestTopic: string | null = null;
  let bestScore = 0;

  for (const [keywords, topicKey, baseScore] of TOPIC_PATTERNS) {
    const hits = keywords.filter((kw) => lower.includes(kw)).length;
    if (hits > 0) {
      const score = Math.min(1.0, baseScore * (0.65 + hits * 0.35));
      if (score > bestScore) { bestScore = score; bestTopic = topicKey; }
    }
  }

  return {
    topic: bestTopic,
    confidence: bestScore,
    isNexGiga: bestScore > 0,
    isLead: bestTopic === 'lead',
    isGeneral: isGeneral && bestScore === 0,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// GEMINI FREE-TIER FALLBACK
// Env var: Gemini_API_Key (exact name set in Vercel — API key starts with AQ...)
// ═════════════════════════════════════════════════════════════════════════════

const GENERAL_SYSTEM_PROMPT = `You are NexBot, a friendly and knowledgeable AI assistant for NexGiga.
Answer the user's question helpfully in 2-4 sentences.
If relevant, add a natural bridge: "If you ever need AI, BIM, robotics, design, or workforce help, NexGiga can assist!"

CRITICAL: Respond ONLY with valid JSON. No markdown fences. No extra text. Exact structure:
{
  "message": "your response here",
  "action": { "type": "none" },
  "leadCapture": { "detected": false },
  "emotion": "neutral"
}`;

// Try Gemini models in order of preference (free tier compatible)
const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
];

async function callGeminiWithModel(
  model: string,
  contents: object[],
  systemInstruction: string,
  apiKey: string
): Promise<Response> {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          responseMimeType: 'text/plain',
          maxOutputTokens: 1200,
          temperature: 0.72,
        },
      }),
    }
  );
}

async function callGemini(
  messages: ApiMessage[],
  useFullSystemPrompt: boolean,
  pageContext?: string
): Promise<BotResponse> {
  // Vercel env var is named exactly: Gemini_API_Key
  const apiKey = process.env.Gemini_API_Key;

  if (!apiKey) {
    console.warn('[NexBot] Gemini_API_Key not configured — using fallback response');
    return {
      message:
        "I'm best equipped to answer questions about NexGiga's services, wings, and solutions. For anything else, reach our team directly at **+1-925-789-8909** or via WhatsApp. 😊",
      action: { type: 'scroll', section: '#contact' },
      leadCapture: { detected: false },
      emotion: 'neutral',
    };
  }

  const baseInstruction = useFullSystemPrompt ? NEXBOT_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;
  const systemInstruction = pageContext
    ? `${baseInstruction}\n\nCURRENT PAGE CONTEXT: ${pageContext}`
    : baseInstruction;

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Try each model in sequence until one succeeds
  let lastError: Error | null = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await callGeminiWithModel(model, contents, systemInstruction, apiKey);

      if (response.status === 404) {
        // Model not found — try next
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[NexBot] Gemini ${model} error ${response.status}:`, errText);
        lastError = new Error(`Gemini ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rawContent: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      if (!rawContent) {
        console.warn(`[NexBot] ${model} returned empty content`);
        continue;
      }

      // Strip markdown fences if present
      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      try {
        const parsed: BotResponse = JSON.parse(cleaned);
        if (!parsed.message || typeof parsed.message !== 'string') {
          throw new Error('Invalid structure');
        }
        // Ensure all fields exist with defaults
        parsed.action    ??= { type: 'none' };
        parsed.leadCapture ??= { detected: false };
        parsed.emotion   ??= 'neutral';
        return parsed;
      } catch (parseErr) {
        // Gemini responded but not in JSON format — wrap it
        console.warn(`[NexBot] ${model} JSON parse failed, wrapping raw text`);
        return {
          message: cleaned.slice(0, 1500),
          action: { type: 'none' },
          leadCapture: { detected: false },
          emotion: 'neutral',
        };
      }
    } catch (err) {
      lastError = err as Error;
      console.error(`[NexBot] ${model} fetch error:`, err);
    }
  }

  console.error('[NexBot] All Gemini models failed. Last error:', lastError);
  return {
    message:
      "I'm having a brief technical moment. For NexGiga-related questions I have full knowledge — or reach us directly at **+1-925-789-8909**.",
    action: { type: 'none' },
    leadCapture: { detected: false },
    emotion: 'neutral',
  };
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          message:
            "I'm receiving too many requests right now. Please wait a moment, or contact us at **+1-925-789-8909**.",
          action: { type: 'none' },
          leadCapture: { detected: false },
          emotion: 'neutral',
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as RequestBody;
    const { messages, pathname = '/' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sanitized: ApiMessage[] = messages
      .slice(-20)
      .map((m) => ({ role: m.role, content: sanitizeMessage(m.content) }))
      .filter((m) => m.content.length > 0);

    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'Empty message after sanitization' }, { status: 400 });
    }

    const lastMessage = sanitized[sanitized.length - 1].content;

    // ── Layer 1 & 2: Local Knowledge Engine ────────────────────────────────
    const intent = detectIntent(lastMessage);
    if (intent.topic && intent.confidence >= 0.75 && LOCAL_RESPONSES[intent.topic]) {
      return NextResponse.json(LOCAL_RESPONSES[intent.topic]);
    }

    // ── Layer 3: Gemini Fallback ────────────────────────────────────────────
    const pageContext =
      pathname.startsWith('/nexforce')  ? 'User is on NexForce page — focus on workforce and talent solutions.'
      : pathname.startsWith('/nextech')   ? 'User is on NexTech page — focus on AI, robotics, IoT, and simulation.'
      : pathname.startsWith('/nexdesign') ? 'User is on NexDesign page — focus on creative, branding, 3D, and UI/UX.'
      : pathname.startsWith('/nexbuild')  ? 'User is on NexBuild page — focus on BIM, construction, and BuildMate.'
      : undefined;

    const useFullPrompt = intent.isNexGiga || !intent.isGeneral;
    const geminiResponse = await callGemini(sanitized, useFullPrompt, pageContext);
    return NextResponse.json(geminiResponse);

  } catch (error) {
    console.error('[NexBot] Unhandled error:', error);
    return NextResponse.json(
      {
        message:
          'I encountered an unexpected issue. Please reach us directly at **+1-925-789-8909** or via the contact form.',
        action: { type: 'scroll', section: '#contact' },
        leadCapture: { detected: false },
        emotion: 'neutral',
      },
      { status: 200 }
    );
  }
}
