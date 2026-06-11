"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { Send, Mail, Phone, MapPin, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

const services = [
  "BIM & Digital Twin",
  "AI & Machine Learning",
  "Smart Infrastructure",
  "Robotics & Automation",
  "Simulation & Analysis",
  "IoT & Edge Computing",
  "Buildmate Platform",
  "Other",
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          message: form.service
            ? `Service interest: ${form.service}\n\n${form.message}`
            : form.message,
          source: "homepage",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Submission failed");
      }
      setStatus("sent");
    } catch (err) {
      console.error("[ContactSection]", err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      aria-label="Contact NexGiga"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/8 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel label="Get In Touch" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Begin Your{" "}
            <span className="gradient-text-cyan">Transformation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/45 max-w-lg mx-auto"
          >
            Every world-changing project starts with a conversation.
            Tell us your challenge and we&apos;ll show you the path forward.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Let&apos;s Build the Future Together
              </h3>
              <p className="text-white/45 leading-relaxed text-sm">
                Whether you&apos;re looking to implement BIM on your next mega-project, 
                deploy a digital twin for your facility, or integrate AI into your operations 
                — we have the expertise and technology to make it happen.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "info@nexgiga.sharvasit.in", href: "mailto:info@nexgiga.sharvasit.in" },
                { icon: Phone, label: "Call Us", value: "+1 925 789 8909", href: "tel:+19257898909" },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat on WhatsApp", href: "https://wa.me/19257898909" },
                { icon: MapPin, label: "Location", value: "India — Global Operations", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 glass border border-cyan-500/15 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-white/70 hover:text-cyan-400 transition-colors text-sm">
                        {value}
                      </a>
                    ) : (
                      <span className="text-white/70 text-sm">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="glass border border-cyan-500/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  ACTIVE
                </span>
              </div>
              <p className="text-white/45 text-sm">
                Average response time: <span className="text-white/70">4 business hours</span>
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="h-full glass border border-green-500/20 flex flex-col items-center justify-center p-16 text-center"
                style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
              >
                <CheckCircle2 size={48} className="text-green-400 mb-6" />
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Message Received
                </h3>
                <p className="text-white/50">
                  Our team will reach out within 4 business hours.
                  We&apos;re excited to learn about your project.
                </p>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="h-full glass border border-red-500/20 flex flex-col items-center justify-center p-16 text-center"
                style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
              >
                <div className="text-4xl mb-6">⚠️</div>
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Submission Failed
                </h3>
                <p className="text-white/50 mb-8">
                  Something went wrong on our end. Please try again or reach us directly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 border border-cyan-500/40 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass border border-white/5 p-8 space-y-6"
                style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
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
                        htmlFor={field.name}
                        className="block text-xs text-white/40 uppercase tracking-wider mb-2"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {field.label} {field.required && <span className="text-cyan-400">*</span>}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full bg-white/3 border border-white/8 hover:border-white/15 focus:border-cyan-500/40 outline-none px-4 py-3 text-white text-sm transition-colors placeholder:text-white/20"
                        placeholder={field.label}
                        style={{ fontFamily: "var(--font-body)" }}
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
                        htmlFor={field.name}
                        className="block text-xs text-white/40 uppercase tracking-wider mb-2"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full bg-white/3 border border-white/8 hover:border-white/15 focus:border-cyan-500/40 outline-none px-4 py-3 text-white text-sm transition-colors placeholder:text-white/20"
                        placeholder={field.label}
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Service select */}
                <div>
                  <label
                    htmlFor="service"
                    className="block text-xs text-white/40 uppercase tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full bg-white/3 border border-white/8 hover:border-white/15 focus:border-cyan-500/40 outline-none px-4 py-3 text-sm transition-colors"
                    style={{ color: form.service ? "white" : "rgba(255,255,255,0.2)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <option value="" disabled style={{ background: "#010508" }}>
                      Select a service
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s} style={{ background: "#010508", color: "white" }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs text-white/40 uppercase tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Project Details <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-white/3 border border-white/8 hover:border-white/15 focus:border-cyan-500/40 outline-none px-4 py-3 text-white text-sm transition-colors resize-none placeholder:text-white/20"
                    placeholder="Tell us about your project, challenges, and goals..."
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
