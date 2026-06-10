"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArrowUpRight, CheckCircle2, Layers, Clock, Users, TrendingUp } from "lucide-react";

// Buildmate brand colours (sampled from logo)
const BM_RED  = "#C82814";
const BM_BLUE = "#002878";

const features = [
  "AI-powered project estimation",
  "Real-time construction progress tracking",
  "Material procurement automation",
  "Subcontractor management portal",
  "Financial & invoice management",
  "BIM viewer integration",
  "Site safety compliance tools",
  "Punch list & snagging tracker",
];

const metrics = [
  { icon: TrendingUp, value: "40%",     label: "Faster project completion" },
  { icon: Clock,      value: "60%",     label: "Less admin overhead" },
  { icon: Users,      value: "500+",    label: "Construction teams" },
  { icon: Layers,     value: "₹2500Cr+",label: "Projects managed" },
];

export default function BuildmateShowcase() {
  return (
    <section
      id="buildmate"
      className="section-padding relative overflow-hidden"
      aria-label="Buildmate Platform"
    >
      {/* Background — subtle red + blue twin glows matching brand */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 60% 70% at 0% 60%, rgba(0,40,120,0.13) 0%, transparent 70%),
             radial-gradient(ellipse 50% 60% at 100% 40%, rgba(200,40,20,0.10) 0%, transparent 70%)`,
        }}
      />
      {/* Thin diagonal accent stripe */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -55deg,
            ${BM_BLUE} 0px, ${BM_BLUE} 1px,
            transparent 1px, transparent 60px
          )`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Content ── */}
          <div>
            <SectionLabel label="Our Flagship Product" />

            {/* Buildmate logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="mb-5 w-56">
                <Image
                  src="/buildmate-logo.jpeg"
                  alt="BuildMate"
                  width={224}
                  height={94}
                  className="object-contain"
                  priority
                />
              </div>

              <h2
                className="heading-xl text-4xl md:text-5xl text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Future of{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${BM_RED}, ${BM_BLUE})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Construction
                </span>{" "}
                Management
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/55 leading-relaxed text-lg mb-8"
            >
              Buildmate is NexGiga&apos;s AI-powered construction management platform —
              built specifically for the Indian construction industry. From tender
              to handover, Buildmate gives teams the intelligence to deliver projects
              on time, on budget, and at the highest quality.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3 mb-10"
            >
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.07 * i }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: i % 2 === 0 ? BM_RED : BM_BLUE }}
                  />
                  <span className="text-white/55 text-sm">{f}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://buildmate.sharvas.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${BM_RED} 0%, ${BM_BLUE} 100%)`,
                  fontFamily: "var(--font-display)",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  boxShadow: `0 4px 24px rgba(200,40,20,0.25)`,
                }}
              >
                Explore Buildmate
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://buildmate.sharvas.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Request Demo
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Metrics + mock dashboard ── */}
          <div>
            {/* Metrics grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: `1px solid ${i % 2 === 0 ? BM_RED : BM_BLUE}30`,
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                  }}
                >
                  <m.icon
                    size={18}
                    className="mb-3"
                    style={{ color: i % 2 === 0 ? BM_RED : BM_BLUE }}
                  />
                  <div
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs text-white/40">{m.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mock dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass p-6 relative overflow-hidden"
              style={{
                border: `1px solid ${BM_BLUE}25`,
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${BM_RED}, ${BM_BLUE})` }}
              />

              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: BM_RED }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: BM_BLUE, opacity: 0.5 }} />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-white/20" style={{ fontFamily: "var(--font-mono)" }}>
                  buildmate.sharvas.in
                </span>
              </div>

              {/* Project rows */}
              <div className="space-y-4">
                {[
                  { name: "Project Alpha Tower", pct: 78, color: BM_RED },
                  { name: "Site B — Foundation",  pct: 45, color: BM_BLUE },
                  { name: "Block C — Fitout",      pct: 22, color: BM_RED },
                ].map((proj, i) => (
                  <div key={proj.name} className="flex items-center gap-4">
                    <div
                      className="w-1.5 h-8 rounded-full flex-shrink-0"
                      style={{ background: proj.color, opacity: 1 - i * 0.2 }}
                    />
                    <div className="flex-1">
                      <div className="text-xs text-white/60 mb-1.5">{proj.name}</div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${proj.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                          style={{
                            background: `linear-gradient(90deg, ${BM_RED}, ${BM_BLUE})`,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="text-xs font-mono w-8 text-right"
                      style={{ color: proj.color }}
                    >
                      {proj.pct}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/30">3 active projects</span>
                <a
                  href="https://buildmate.sharvas.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: BM_RED }}
                >
                  Open Buildmate <ArrowUpRight size={10} />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
