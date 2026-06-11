import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | NexGiga",
  description: "How NexGiga collects, uses, and protects your personal information.",
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "June 2025";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#010508] text-white/80">
      {/* Header */}
      <div className="border-b border-white/5 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-cyan-400 text-sm font-mono mb-3">Legal</p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-16 space-y-10 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>
            NexGiga collects information you voluntarily provide when you fill out contact forms,
            request consultations, or interact with NexBot — our AI digital employee. This includes
            your name, email address, company name, phone number, and the content of your messages.
          </p>
          <p className="mt-3">
            We also collect standard server logs and analytics data (pages visited, browser type,
            IP address, referral URL) through privacy-respecting analytics tools. We do not use
            third-party advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-white/70">
            <li>Responding to enquiries and providing requested services</li>
            <li>Sending relevant business communications (with your consent)</li>
            <li>Improving our website, products, and NexBot AI assistant</li>
            <li>Complying with legal obligations</li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal data with third parties for their own
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. NexBot AI Conversations</h2>
          <p>
            Conversations with NexBot may be processed by the Google Gemini API to generate
            responses. Message content is sent to Google&apos;s API under their data processing
            terms. We recommend not sharing sensitive personal or financial information in chat.
            Conversation logs are not stored permanently on our servers beyond the active session.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
          <p>
            Contact form submissions are retained for up to 24 months to enable business follow-up.
            You may request deletion of your data at any time by emailing{" "}
            <a href="mailto:info@nexgiga.sharvasit.in" className="text-cyan-400 hover:underline">
              info@nexgiga.sharvasit.in
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
          <p>
            This website uses essential cookies required for basic functionality (session state,
            security). We do not use advertising or cross-site tracking cookies. You may disable
            cookies in your browser settings; essential features may be affected.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, or
            restrict processing of your personal data. To exercise these rights, contact us at{" "}
            <a href="mailto:info@nexgiga.sharvasit.in" className="text-cyan-400 hover:underline">
              info@nexgiga.sharvasit.in
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Security</h2>
          <p>
            We implement industry-standard technical and organisational measures to protect your
            data, including TLS encryption in transit, access controls, and regular security
            reviews. No method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Material changes will be communicated
            via a notice on this page with an updated date. Continued use of our services after
            changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
          <p>
            For privacy-related questions or requests, contact NexGiga at:
            <br />
            <a href="mailto:info@nexgiga.sharvasit.in" className="text-cyan-400 hover:underline">
              info@nexgiga.sharvasit.in
            </a>{" "}
            · +1-925-789-8909
          </p>
        </section>

        <div className="border-t border-white/5 pt-8 flex gap-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white/70 transition-colors">← Back to Home</Link>
          <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
        </div>
      </article>
    </main>
  );
}
