import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface SimulationRequest {
  idea: string;
}

interface GeminiSimulationResult {
  projectType: string;
  industry: string;
  analysisItems: string[];
  tags: Array<{ label: string; type: 'requirement' | 'industry' | 'tech' | 'challenge' }>;
  designElements: string[];
  twinFeatures: string[];
  constructionPhases: string[];
  result: {
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string; unit: string }>;
    benefits: string[];
    timeline: string;
    wing: string;
  };
}

const SIMULATE_SYSTEM_PROMPT = `You are an expert NexGiga project simulator. When given a project idea, generate a detailed simulation result.

CRITICAL: Respond ONLY with valid JSON. No markdown fences. No extra text.

Use this exact structure:
{
  "projectType": "Brief project type name",
  "industry": "Industry name",
  "analysisItems": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "tags": [
    {"label": "Industry type", "type": "industry"},
    {"label": "Key tech 1", "type": "tech"},
    {"label": "Key tech 2", "type": "tech"},
    {"label": "Main requirement", "type": "requirement"},
    {"label": "Main challenge", "type": "challenge"}
  ],
  "designElements": ["element 1", "element 2", "element 3", "element 4"],
  "twinFeatures": ["feature 1", "feature 2", "feature 3", "feature 4"],
  "constructionPhases": ["phase 1", "phase 2", "phase 3", "phase 4", "phase 5"],
  "result": {
    "title": "Final project name",
    "description": "2-3 sentence description of what was achieved",
    "metrics": [
      {"label": "Efficiency Gain", "value": "XX", "unit": "%"},
      {"label": "Cost Reduction", "value": "XX", "unit": "%"},
      {"label": "ROI Timeline", "value": "X", "unit": "months"},
      {"label": "Accuracy Rate", "value": "XX", "unit": "%"}
    ],
    "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
    "timeline": "X–Y months",
    "wing": "NexTech|NexBuild|NexDesign|NexForce"
  }
}

Rules:
- Make it specific to the user's idea — not generic
- Use realistic but impressive metrics
- Match the wing to the dominant capability needed
- Make analysisItems sound like AI scanning processes
- Keep all strings concise (max 60 chars each)
- Return ONLY the JSON object, nothing else`;

async function enhanceWithGemini(idea: string): Promise<GeminiSimulationResult | null> {
  const apiKey = process.env.Gemini_API_Key;
  if (!apiKey || apiKey.trim().length < 10) return null;

  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SIMULATE_SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: `Project idea: ${idea}` }] }],
            generationConfig: {
              responseMimeType: 'text/plain',
              maxOutputTokens: 1000,
              temperature: 0.8,
            },
          }),
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      if (!raw) continue;

      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed: GeminiSimulationResult = JSON.parse(cleaned);

      // Validate required fields
      if (
        parsed.projectType &&
        parsed.industry &&
        Array.isArray(parsed.analysisItems) &&
        parsed.result?.title
      ) {
        return parsed;
      }
    } catch {
      // Try next model
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SimulationRequest;
    const { idea } = body;

    if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid idea' }, { status: 400 });
    }

    const sanitizedIdea = idea.trim().slice(0, 500);

    // Try Gemini enhancement first
    const geminiResult = await enhanceWithGemini(sanitizedIdea);

    if (geminiResult) {
      return NextResponse.json({ success: true, data: geminiResult, source: 'gemini' });
    }

    // Signal that template fallback should be used client-side
    return NextResponse.json({ success: true, data: null, source: 'template' });

  } catch (error) {
    console.error('[Simulate API]', error);
    return NextResponse.json({ success: true, data: null, source: 'template' });
  }
}
