"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface WingPageLayoutProps {
  name: string;
  tagline: string;
  hero: string;
  description: string;
  services: Service[];
  ctaLabel: string;
  primaryColor: string;
  glowColor: string;
  gradient: string;
  accentGradient: string;
  badge?: string;
}

// ── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  primaryColor,
  glowColor,
  index,
}: {
  service: Service;
  primaryColor: string;
  glowColor: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="card-glass p-6 rounded-lg group"
      whileHover={{
        boxShadow: `0 0 30px ${glowColor}25, 0 0 60px ${glowColor}10`,
        y: -4,
      }}
      style={{ borderColor: `${glowColor}18` }}
    >
      <div className="text-3xl mb-4" aria-hidden="true">
        {service.icon}
      </div>
      <h3
        className="text-lg font-bold text-white mb-2 tracking-wide uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed">{service.description}</p>
      <div
        className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }}
      />
    </motion.div>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm({
  name,
  primaryColor,
  glowColor,
  gradient,
  ctaLabel,
}: {
  name: string;
  primaryColor: string;
  glowColor: string;
  gradient: string;
  ctaLabel: string;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          source: name.toLowerCase().replace(/\s+/g, "-"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Submission failed");
      }
      setStatus("sent");
    } catch (err) {
      console.error("[WingPageLayout ContactForm]", err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass border flex flex-col items-center justify-center p-16 text-center min-h-[400px]"
        style={{ borderColor: `${glowColor}30` }}
      >
        <CheckCircle2 size={48} className="mb-6" style={{ color: primaryColor }} />
        <h3
          className="text-2xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Message Received
        </h3>
        <p className="text-white/50 max-w-xs">
          Our {name} team will reach out within 4 business hours.
        </p>
      </motion.div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass border flex flex-col items-center justify-center p-16 text-center min-h-[400px]"
        style={{ borderColor: "rgba(239,68,68,0.3)" }}
      >
        <div className="text-4xl mb-6">⚠️</div>
        <h3
          className="text-2xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Submission Failed
        </h3>
        <p className="text-white/50 max-w-xs mb-8">
          Something went wrong. Please try again or contact us directly at info@nexgiga.com.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-3 border border-white/20 text-white/70 rounded hover:bg-white/5 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="glass border border-white/5 p-8 space-y-6"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
      noValidate
    >
      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { name: "name", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
        ].map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`wing-${field.name}`}
              className="block text-xs text-white/40 uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {field.label} {field.required && <span style={{ color: primaryColor }}>*</span>}
            </label>
            <input
              id={`wing-${field.name}`}
              name={field.name}
              type={field.type}
              required={field.required}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full bg-white/3 border border-white/8 hover:border-white/15 outline-none px-4 py-3 text-white text-sm transition-colors placeholder:text-white/20"
              style={{
                fontFamily: "var(--font-body)",
                // @ts-expect-error: focus style applied via data-attr approach
                "--focus-border": `${glowColor}60`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${glowColor}50`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              placeholder={field.label}
            />
          </div>
        ))}
      </div>

      {/* Company + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { name: "company", label: "Company", type: "text" },
          { name: "phone", label: "Phone Number", type: "tel" },
        ].map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`wing-${field.name}`}
              className="block text-xs text-white/40 uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {field.label}
            </label>
            <input
              id={`wing-${field.name}`}
              name={field.name}
              type={field.type}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full bg-white/3 border border-white/8 hover:border-white/15 outline-none px-4 py-3 text-white text-sm transition-colors placeholder:text-white/20"
              style={{ fontFamily: "var(--font-body)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${glowColor}50`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              placeholder={field.label}
            />
          </div>
        ))}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="wing-message"
          className="block text-xs text-white/40 uppercase tracking-wider mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Project Details <span style={{ color: primaryColor }}>*</span>
        </label>
        <textarea
          id="wing-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="w-full bg-white/3 border border-white/8 hover:border-white/15 outline-none px-4 py-3 text-white text-sm transition-colors resize-none placeholder:text-white/20"
          style={{ fontFamily: "var(--font-body)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${glowColor}50`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
          placeholder={`Tell us about your ${name} project, challenges, and goals...`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: gradient, borderColor: "transparent", color: "#010508" }}
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            {ctaLabel}
            <Send size={14} />
          </>
        )}
      </button>
    </form>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────

export default function WingPageLayout({
  name,
  tagline,
  hero,
  description,
  services,
  ctaLabel,
  primaryColor,
  glowColor,
  gradient,
  accentGradient,
  badge,
}: WingPageLayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #010508 0%, #020c18 40%, #010508 100%)" }}
    >
      {/* Persistent background layers */}
      <div className="fixed inset-0 grid-overlay opacity-10 pointer-events-none" />
      <div
        className="fixed top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden"
        aria-label={`${name} hero`}
      >
        {/* Corner accent lines */}
        <div
          className="absolute top-28 left-8 w-px h-32 opacity-20"
          style={{ background: `linear-gradient(180deg, ${primaryColor}, transparent)` }}
        />
        <div
          className="absolute top-28 right-8 w-px h-32 opacity-20"
          style={{ background: `linear-gradient(180deg, ${primaryColor}, transparent)` }}
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Back to NexGiga */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ArrowLeft size={12} />
              NexGiga Group
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            style={{ borderColor: `${glowColor}30` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: primaryColor }}
            />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)", color: primaryColor }}
            >
              {badge || tagline}
            </span>
          </motion.div>

          {/* Wing name label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <span
              className="text-sm font-bold tracking-[0.3em] uppercase"
              style={{ color: primaryColor, fontFamily: "var(--font-mono)" }}
            >
              {name}
            </span>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span
              style={{
                background: accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {hero}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTAs — both scroll to in-page sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="btn-primary group"
              style={{ background: gradient, borderColor: "transparent", color: "#010508" }}
            >
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#services" className="btn-secondary group">
              View Services
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom separator line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${primaryColor}50, transparent)`,
          }}
        />
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section
        id="services"
        className="relative py-24 px-6"
        aria-label={`${name} services`}
      >
        {/* Subtle section glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${glowColor}06 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px" style={{ background: primaryColor }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-mono)", color: primaryColor }}
              >
                What We Deliver
              </span>
              <span className="w-8 h-px" style={{ background: `${primaryColor}40` }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Core Services
            </h2>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                primaryColor={primaryColor}
                glowColor={glowColor}
                index={i}
              />
            ))}
          </div>

          {/* CTA bridge to contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <a
              href="#contact"
              className="btn-primary group"
              style={{ background: gradient, borderColor: "transparent", color: "#010508" }}
            >
              Get Started with {name}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative py-24 px-6 overflow-hidden"
        aria-label={`Contact ${name}`}
      >
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${glowColor}07 0%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px" style={{ background: primaryColor }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-mono)", color: primaryColor }}
              >
                Get In Touch
              </span>
              <span className="w-8 h-px" style={{ background: `${primaryColor}40` }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to work with{" "}
              <span style={{ color: primaryColor }}>{name}?</span>
            </h2>
            <p className="text-white/45 max-w-lg mx-auto">
              Tell us your challenge and we&apos;ll show you the path forward.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h3
                  className="text-xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Let&apos;s Build the Future Together
                </h3>
                <p className="text-white/45 leading-relaxed text-sm">
                  Whether you&apos;re exploring {name} capabilities or ready to launch a
                  project — we&apos;re here to help at every stage.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info@nexgiga.com",
                    href: "mailto:info@nexgiga.com",
                  },
                  {
                    icon: Phone,
                    label: "Call Us",
                    value: "+1 925 789 8909",
                    href: "tel:+19257898909",
                  },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: "Chat on WhatsApp",
                    href: "https://wa.me/19257898909",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "India — Global Operations",
                    href: null,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 glass flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: `${glowColor}20`, color: primaryColor }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-0.5">
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          className="text-white/70 text-sm transition-colors"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = primaryColor)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-white/70 text-sm">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status indicator */}
              <div
                className="glass border p-5"
                style={{ borderColor: `${glowColor}15` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: primaryColor }}
                  />
                  <span
                    className="text-xs font-semibold tracking-wider"
                    style={{ fontFamily: "var(--font-mono)", color: primaryColor }}
                  >
                    {name.toUpperCase()} ACTIVE
                  </span>
                </div>
                <p className="text-white/45 text-sm">
                  Average response time:{" "}
                  <span className="text-white/70">4 business hours</span>
                </p>
              </div>

              {/* Back to NexGiga Group */}
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <ArrowLeft size={11} />
                  Back to NexGiga Group
                </Link>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <ContactForm
                name={name}
                primaryColor={primaryColor}
                glowColor={glowColor}
                gradient={gradient}
                ctaLabel={ctaLabel}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
