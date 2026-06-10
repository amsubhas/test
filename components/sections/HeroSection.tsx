"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Cpu, Globe, Layers } from "lucide-react";

const stats = [
  { label: "Projects Delivered", value: "200+", icon: Layers },
  { label: "Countries Served",   value: "15+",  icon: Globe  },
  { label: "AI Models Deployed", value: "50+",  icon: Cpu    },
];

const taglines = [
  "Digital Intelligence",
  "Physical Reality",
  "Infinite Possibility",
  "Measurable Outcomes",
];

// Floating particle positions — deterministic so no hydration mismatch
const PARTICLES = [
  { x: 12, y: 18, size: 2, delay: 0,   dur: 7  },
  { x: 88, y: 22, size: 1.5, delay: 1, dur: 9  },
  { x: 25, y: 72, size: 2.5, delay: 2, dur: 6  },
  { x: 75, y: 65, size: 1.5, delay: 0.5, dur: 8 },
  { x: 50, y: 15, size: 2,   delay: 3, dur: 10 },
  { x: 5,  y: 50, size: 1,   delay: 1.5, dur: 7 },
  { x: 95, y: 45, size: 2,   delay: 2.5, dur: 9 },
  { x: 38, y: 85, size: 1.5, delay: 0.8, dur: 6},
  { x: 62, y: 8,  size: 1,   delay: 3.5, dur: 8 },
  { x: 18, y: 35, size: 2,   delay: 4,   dur: 7 },
  { x: 82, y: 78, size: 1.5, delay: 1.2, dur: 9 },
  { x: 45, y: 55, size: 1,   delay: 2.8, dur: 6 },
];

// Hex grid — decorative nodes
const HEX_NODES = [
  { cx: "8%",  cy: "20%", r: 40 },
  { cx: "92%", cy: "25%", r: 50 },
  { cx: "6%",  cy: "70%", r: 35 },
  { cx: "94%", cy: "68%", r: 45 },
];

export default function HeroSection() {
  const [taglineIdx,   setTaglineIdx]   = useState(0);
  const [displayText,  setDisplayText]  = useState("");
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  // Typewriter effect
  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(taglines[taglineIdx]);
      return;
    }
    const current = taglines[taglineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayText.length < current.length) {
      timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 75);
    } else if (!isDeleting && displayText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2600);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 38);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, taglineIdx, prefersReduced]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Layered backgrounds ── */}
      <div className="absolute inset-0 grid-overlay opacity-40" aria-hidden="true" />

      {/* Radial centre glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,30,80,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Corner hexagonal decorations (SVG, no JS cost) */}
      {HEX_NODES.map((n, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{ left: n.cx, top: n.cy, transform: "translate(-50%, -50%)" }}
        >
          <svg width={n.r * 2} height={n.r * 2} viewBox={`0 0 ${n.r * 2} ${n.r * 2}`} fill="none">
            <polygon
              points={`${n.r},2 ${n.r * 2 - 2},${n.r * 0.5} ${n.r * 2 - 2},${n.r * 1.5} ${n.r},${n.r * 2 - 2} 2,${n.r * 1.5} 2,${n.r * 0.5}`}
              stroke="rgba(0,245,255,0.08)"
              strokeWidth="1"
              fill="rgba(0,245,255,0.015)"
            />
          </svg>
        </div>
      ))}

      {/* Ambient glow orbs */}
      <div
        aria-hidden="true"
        className="absolute rounded-full blur-[100px] animate-pulse-slow"
        style={{
          top: "20%", left: "15%",
          width: 420, height: 420,
          background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)",
          animationDelay: "0s",
          willChange: "opacity",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full blur-[80px] animate-pulse-slow"
        style={{
          bottom: "20%", right: "12%",
          width: 380, height: 380,
          background: "radial-gradient(circle, rgba(0,102,255,0.14) 0%, transparent 70%)",
          animationDelay: "2.2s",
          willChange: "opacity",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full blur-[120px]"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(123,47,255,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Scan line — subtle sweep */}
      {mounted && !prefersReduced && (
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.25), transparent)",
            animation: "heroScan 8s linear infinite",
          }}
        />
      )}

      {/* Floating particles */}
      {mounted && !prefersReduced && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left:   `${p.x}%`,
                top:    `${p.y}%`,
                width:  p.size,
                height: p.size,
                background: i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#0066ff" : "#7b2fff",
                opacity: 0.5,
                animation: `heroFloat ${p.dur}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
                boxShadow: `0 0 ${p.size * 3}px currentColor`,
              }}
            />
          ))}
        </div>
      )}

      {/* Inject hero-specific keyframes once */}
      <style>{`
        @keyframes heroScan {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.6; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50%       { transform: translateY(-22px) scale(1.2); opacity: 0.7; }
        }
      `}</style>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-10"
            style={{
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.2)",
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
            <span className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase">
              AI · Robotics · Infrastructure
            </span>
          </motion.div>

          {/* H1 with staggered reveals */}
          <h1
            className="heading-xl text-white mb-8"
            style={{ fontFamily: "var(--font-display)" }}
            aria-label={`Transforming ${displayText || taglines[0]} Into Reality`}
          >
            <div className="overflow-hidden mb-3">
              <motion.span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.88]"
                initial={{ y: 110, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Transforming
              </motion.span>
            </div>

            <div className="overflow-hidden mb-3" style={{ minHeight: "1.05em" }}>
              <motion.span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.88] font-bold"
                initial={{ y: 110, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="gradient-text-cyan">
                  {displayText || "\u00A0"}
                  {mounted && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.75, repeat: Infinity }}
                      aria-hidden="true"
                      style={{ color: "#00f5ff" }}
                    >
                      |
                    </motion.span>
                  )}
                </span>
              </motion.span>
            </div>

            <div className="overflow-hidden">
              <motion.span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.88]"
                initial={{ y: 110, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
              >
                Into Reality
              </motion.span>
            </div>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            NexGiga bridges the digital and physical worlds through AI, robotics,
            BIM, and smart infrastructure — turning complex ideas into measurable outcomes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.a
              href="#digital-twin-city"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-cyan-400 font-semibold transition-all"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.3)",
                borderRadius: 8,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.13)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.5)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(0,245,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Explore the Digital Twin City
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#idea-to-reality"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-8 py-4 font-semibold transition-all"
              style={{
                background: "rgba(123,47,255,0.08)",
                border: "1px solid rgba(123,47,255,0.25)",
                borderRadius: 8,
                color: "rgba(180,130,255,0.9)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(123,47,255,0.14)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,47,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(123,47,255,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,47,255,0.25)";
              }}
            >
              ✦ Try the Simulator
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-8 py-4 transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Get in Touch
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
              >
                <Icon size={18} className="text-cyan-400/60 mx-auto mb-2" aria-hidden="true" />
                <div
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value}
                </div>
                <div className="text-xs text-white/35 leading-tight">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 1,
            height: 28,
            background: "linear-gradient(to bottom, transparent, rgba(0,245,255,0.4))",
          }}
        />
        <ChevronDown size={16} className="text-white/25" />
      </motion.div>
    </section>
  );
}
