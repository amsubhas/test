"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SimulationData } from "./SimulationEngine";
import Link from "next/link";

interface ResultRevealProps {
  data: SimulationData;
  isActive: boolean;
  onAskNexBot: () => void;
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: string, durationMs: number, start: boolean) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>();
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numericTarget);

  useEffect(() => {
    if (!start || !isNumeric) {
      if (!isNumeric) setDisplay(target);
      return;
    }
    let startTime: number | null = null;
    const hasDecimal = target.includes(".");
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;
      setDisplay(hasDecimal ? current.toFixed(1) : Math.round(current).toString());
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [start, numericTarget, durationMs, isNumeric, target]);

  return display;
}

// ─── Single metric card ───────────────────────────────────────────────────────
function MetricCard({
  metric,
  delay,
  start,
}: {
  metric: { label: string; value: string; unit: string };
  delay: number;
  start: boolean;
}) {
  const displayed = useCountUp(metric.value, 1800, start);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-5 flex flex-col gap-1"
      style={{
        background: "rgba(0,245,255,0.03)",
        border: "1px solid rgba(0,245,255,0.1)",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "rgba(0,245,255,0.4)" }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "rgba(0,245,255,0.2)" }} />

      <div className="flex items-baseline gap-1">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 700,
            background: "linear-gradient(135deg, #00f5ff, #0066ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          {displayed}
        </span>
        {metric.unit && (
          <span style={{ color: "rgba(0,245,255,0.6)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            {metric.unit}
          </span>
        )}
      </div>
      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
        {metric.label.toUpperCase()}
      </span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResultReveal({ data, isActive, onAskNexBot }: ResultRevealProps) {
  const [countStart, setCountStart] = useState<boolean>(false);
  const { result } = data.industry;

  useEffect(() => {
    if (!isActive) { setCountStart(false); return; }
    const t = setTimeout(() => setCountStart(true), 600);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {/* ── Cinematic glow backdrop ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.06) 0%, transparent 70%)",
            }}
          />

          {/* ── Success banner ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ width: 28, height: 28 }}
            >
              <svg viewBox="0 0 28 28" fill="none" aria-hidden>
                <polygon points="14,2 26,8.5 26,21.5 14,28 2,21.5 2,8.5" stroke="rgba(0,245,255,0.3)" strokeWidth="1" fill="none" />
                <polygon points="14,7 21,11 21,19 14,23 7,19 7,11" stroke="rgba(0,245,255,0.5)" strokeWidth="1" fill="rgba(0,245,255,0.04)" />
              </svg>
            </motion.div>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="overflow-hidden whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)", color: "#00f5ff", fontSize: 11, letterSpacing: "0.2em" }}
            >
              PROJECT SIMULATION COMPLETE
            </motion.span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ width: 28, height: 28 }}
            >
              <svg viewBox="0 0 28 28" fill="none" aria-hidden>
                <polygon points="14,2 26,8.5 26,21.5 14,28 2,21.5 2,8.5" stroke="rgba(0,245,255,0.3)" strokeWidth="1" fill="none" />
                <polygon points="14,7 21,11 21,19 14,23 7,19 7,11" stroke="rgba(0,245,255,0.5)" strokeWidth="1" fill="rgba(0,245,255,0.04)" />
              </svg>
            </motion.div>
          </motion.div>

          {/* ── Project title ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center mb-3"
          >
            <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.3em", marginBottom: "0.5rem" }}>
              {data.industry.result.wing.toUpperCase()}
            </div>
            <h3
              className="heading-xl"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", lineHeight: 1.05 }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #00f5ff 0%, #0066ff 50%, #7b2fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {result.title}
              </span>
            </h3>
          </motion.div>

          {/* ── Description ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-center mx-auto mb-10"
            style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600, fontSize: "0.9rem", lineHeight: 1.75 }}
          >
            {result.description}
          </motion.p>

          {/* ── Metrics grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {result.metrics.map((m, i) => (
              <MetricCard key={m.label} metric={m} delay={0.1 * i + 0.3} start={countStart as boolean} />
            ))}
          </div>

          {/* ── Benefits ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10"
            style={{
              background: "rgba(0,245,255,0.02)",
              border: "1px solid rgba(0,245,255,0.08)",
              padding: "1.5rem",
            }}
          >
            <div
              style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: "1rem" }}
            >
              KEY OUTCOMES
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 + 0.7, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden>
                    <path d="M3 8L6.5 12L13 4" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.825rem", lineHeight: 1.6 }}>
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Timeline badge ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center mb-10"
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-3"
              style={{
                border: "1px solid rgba(123,47,255,0.3)",
                background: "rgba(123,47,255,0.05)",
                clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5.5" stroke="rgba(123,47,255,0.8)" strokeWidth="1.2" />
                <path d="M7 4V7L9 9" stroke="rgba(123,47,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.08em" }}>
                ESTIMATED DELIVERY:
              </span>
              <span style={{ fontFamily: "var(--font-display)", color: "#7b2fff", fontSize: "0.95rem", fontWeight: 600 }}>
                {result.timeline}
              </span>
            </div>
          </motion.div>

          {/* ── Lead generation CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative overflow-hidden text-center"
            style={{
              background: "rgba(0,245,255,0.02)",
              border: "1px solid rgba(0,245,255,0.1)",
              padding: "2.5rem 2rem",
            }}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l" style={{ borderColor: "rgba(0,245,255,0.3)" }} />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r" style={{ borderColor: "rgba(0,245,255,0.3)" }} />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l" style={{ borderColor: "rgba(0,245,255,0.3)" }} />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r" style={{ borderColor: "rgba(0,245,255,0.3)" }} />

            {/* Subtle radial bg */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,245,255,0.04) 0%, transparent 70%)" }}
            />

            <p
              className="mb-2"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em" }}
            >
              READY TO BUILD THIS?
            </p>
            <h4
              className="mb-2"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", fontWeight: 700, color: "#fff" }}
            >
              Would you like NexGiga to bring this vision to life?
            </h4>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.825rem", marginBottom: "2rem" }}>
              Our team has delivered {result.title} projects across 15+ countries.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="btn-primary"
                aria-label="Schedule a consultation with NexGiga"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 1.5V3.5M9.5 1.5V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1.5" y1="6" x2="12.5" y2="6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Schedule Consultation
              </Link>

              <Link
                href="/nextech"
                className="btn-secondary"
                aria-label="Explore NexGiga solutions"
              >
                Explore Solutions
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={onAskNexBot}
                className="flex items-center gap-2 px-5 py-3"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(123,47,255,0.3)",
                  color: "rgba(123,47,255,0.9)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  transition: "all 0.2s",
                }}
                aria-label="Ask NexBot about this simulation result"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <circle cx="7" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7 10V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M5 13H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Ask NexBot About This
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
