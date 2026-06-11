import { NextRequest, NextResponse } from "next/server";

// ── Types ────────────────────────────────────────────────────────────────────

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string; // "homepage" | "nexforce" | "nextech" | "nexdesign"
}

// ── Validators ───────────────────────────────────────────────────────────────

function validatePayload(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") return { valid: false, error: "Invalid payload" };
  const b = body as Record<string, unknown>;

  if (!b.name || typeof b.name !== "string" || b.name.trim().length < 2)
    return { valid: false, error: "Name must be at least 2 characters" };
  if (!b.email || typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))
    return { valid: false, error: "Valid email is required" };
  if (!b.message || typeof b.message !== "string" || b.message.trim().length < 10)
    return { valid: false, error: "Message must be at least 10 characters" };
  if (b.name.length > 100 || b.email.length > 254 || (b.message as string).length > 5000)
    return { valid: false, error: "Input exceeds maximum length" };

  return { valid: true };
}

function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] ?? c)
  );
}

// ── Rate Limiter ──────────────────────────────────────────────────────────────

const contactRateMap = new Map<string, { count: number; resetAt: number }>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  if (contactRateMap.size > 500) {
    for (const [k, v] of contactRateMap.entries()) {
      if (now > v.resetAt) contactRateMap.delete(k);
    }
  }
  const entry = contactRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    contactRateMap.set(ip, { count: 1, resetAt: now + 3_600_000 }); // 5 per hour
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkContactRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { valid, error } = validatePayload(body);
  if (!valid) return NextResponse.json({ error }, { status: 422 });

  const { name, email, company, message, source } = body as ContactPayload;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    // ── Send via Resend ──────────────────────────────────────────────────────
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "NexGiga Contact Form <noreply@nexgiga.sharvasit.in>",
          to: ["info@nexgiga.sharvasit.in"],
          reply_to: email,
          subject: `New enquiry from ${sanitize(name)}${company ? ` (${sanitize(company)})` : ""} — ${source ?? "website"}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${sanitize(name)}</p>
            <p><strong>Email:</strong> ${sanitize(email)}</p>
            ${company ? `<p><strong>Company:</strong> ${sanitize(company)}</p>` : ""}
            <p><strong>Source:</strong> ${sanitize(source ?? "homepage")}</p>
            <hr/>
            <h3>Message</h3>
            <p style="white-space:pre-wrap">${sanitize(message)}</p>
          `,
          text: `Name: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}\nSource: ${source ?? "homepage"}\n\n${message}`,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("[Contact API] Resend error:", res.status, errBody);
        return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 502 });
      }
    } catch (err) {
      console.error("[Contact API] Network error:", err);
      return NextResponse.json({ error: "Service unavailable. Please try again." }, { status: 503 });
    }
  } else {
    // ── No API key: log for development ─────────────────────────────────────
    console.info("[Contact Form — DEV MODE]", {
      name,
      email,
      company,
      message: message.slice(0, 100),
      source,
    });
    // In production, set RESEND_API_KEY in your environment variables.
    // See: https://resend.com/docs/send-with-nextjs
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
