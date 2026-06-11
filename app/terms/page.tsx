import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | NexGiga",
  description: "Terms and conditions governing use of NexGiga's website and services.",
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "June 2025";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-16 space-y-10 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the NexGiga website (nexgiga.sharvasit.in) and any associated services,
            you agree to be bound by these Terms of Service. If you do not agree, please do not use
            our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Use of the Website</h2>
          <p>You agree to use this website only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside space-y-2 text-white/70 mt-3">
            <li>Attempt to gain unauthorised access to any part of the website or its infrastructure</li>
            <li>Use automated tools to scrape, crawl, or extract data at scale without written permission</li>
            <li>Transmit malicious code, viruses, or other harmful material</li>
            <li>Impersonate NexGiga, its employees, or other users</li>
            <li>Submit false, misleading, or fraudulent information through any form</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h2>
          <p>
            All content on this website — including text, graphics, logos, 3D assets, animations,
            code, and NexBot AI responses — is the intellectual property of NexGiga or its licensors
            and is protected by applicable copyright, trademark, and intellectual property laws.
          </p>
          <p className="mt-3">
            You may not reproduce, distribute, modify, or create derivative works from any content
            without prior written consent from NexGiga.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. NexBot AI Assistant</h2>
          <p>
            NexBot is an AI assistant powered by large language models. Its responses are generated
            automatically and may contain inaccuracies. NexBot&apos;s responses do not constitute
            professional, legal, financial, or technical advice. Always verify important information
            with a qualified NexGiga representative.
          </p>
          <p className="mt-3">
            By using NexBot, you agree not to attempt to manipulate, jailbreak, or elicit harmful
            outputs from the system.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Enquiries & Consultations</h2>
          <p>
            Submitting a contact form or lead capture request does not constitute a binding
            agreement or guarantee of services. All service engagements are subject to separate
            written contracts negotiated between NexGiga and the client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. External Links</h2>
          <p>
            This website contains links to external websites, including the BuildMate platform
            (buildmate.sharvas.in). NexGiga is not responsible for the content, privacy practices,
            or availability of external websites. Links do not imply endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, NexGiga shall not be liable for any
            indirect, incidental, consequential, or punitive damages arising from your use of or
            inability to use this website or its services. Our total liability for direct damages
            shall not exceed USD $100.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
          <p>
            This website and its content are provided &quot;as is&quot; without warranties of any kind,
            express or implied. NexGiga does not warrant that the website will be uninterrupted,
            error-free, or free of harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            State of California, United States, without regard to conflict of law provisions.
            Disputes shall be subject to the exclusive jurisdiction of courts in California.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
          <p>
            NexGiga reserves the right to modify these Terms at any time. Continued use of the
            website following the posting of changes constitutes your acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:info@nexgiga.sharvasit.in" className="text-cyan-400 hover:underline">
              info@nexgiga.sharvasit.in
            </a>
          </p>
        </section>

        <div className="border-t border-white/5 pt-8 flex gap-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white/70 transition-colors">← Back to Home</Link>
          <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
        </div>
      </article>
    </main>
  );
}
