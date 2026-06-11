"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import IdeaInput from "./IdeaInput";
import TransformationTimeline from "./TransformationTimeline";
import DigitalTwinStage from "./DigitalTwinStage";
import ResultReveal from "./ResultReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  analyzeIdea,
  SIMULATION_STAGES,
  type SimulationData,
  type AnalysisTag,
} from "./SimulationEngine";

// ─── Stage visualizer components ─────────────────────────────────────────────

// Stage 1 — Idea card
function IdeaStage({ data, isActive }: { data: SimulationData; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-8 text-center"
      style={{ minHeight: 280 }}
    >
      {/* Concept ring */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 120 120" fill="none" aria-hidden>
            <circle cx="60" cy="60" r="56" stroke="rgba(0,245,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute"
          style={{ width: 90, height: 90 }}
        >
          <svg viewBox="0 0 90 90" fill="none" aria-hidden>
            <circle cx="45" cy="45" r="41" stroke="rgba(0,102,255,0.2)" strokeWidth="1" strokeDasharray="2 8" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: 64,
            height: 64,
            background: "radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)",
            border: "1px solid rgba(0,245,255,0.35)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M11 2C7.13 2 4 5.13 4 9C4 11.67 5.45 14 7.5 15.35V17H14.5V15.35C16.55 14 18 11.67 18 9C18 5.13 14.87 2 11 2Z" stroke="#00f5ff" strokeWidth="1.3" strokeLinejoin="round" />
            <line x1="8" y1="20" x2="14" y2="20" stroke="#00f5ff" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>

      {/* Concept card */}
      <div
        className="relative w-full max-w-lg text-left px-7 py-6"
        style={{
          background: "rgba(0,245,255,0.03)",
          border: "1px solid rgba(0,245,255,0.15)",
          boxShadow: "0 0 40px rgba(0,245,255,0.06), inset 0 0 60px rgba(0,245,255,0.02)",
        }}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(0,245,255,0.4)" }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(0,245,255,0.4)" }} />
        <div
          style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.4)", fontSize: 9, letterSpacing: "0.2em", marginBottom: "0.75rem" }}
        >
          CONCEPT RECEIVED — PROCESSING
        </div>
        <p
          style={{ fontFamily: "var(--font-body)", color: "#e8f4f8", fontSize: "1.05rem", lineHeight: 1.7 }}
        >
          "{data.idea}"
        </p>
        <div className="flex items-center gap-2 mt-4">
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#00f5ff" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.4)", fontSize: 9, letterSpacing: "0.15em" }}>
            ROUTING TO AI ANALYSIS ENGINE
          </span>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.3)", fontSize: 10, letterSpacing: "0.2em" }}>
        INDUSTRY DETECTED: {data.industry.name.toUpperCase()}
      </div>
    </motion.div>
  );
}

// Stage 2 — AI Analysis
function AnalysisStage({ data, isActive }: { data: SimulationData; isActive: boolean }) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [visibleTags, setVisibleTags] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) { setVisibleItems([]); setVisibleTags([]); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    data.industry.analysisItems.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleItems((p: number[]) => [...p, i]), i * 380 + 200));
    });
    data.industry.tags.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleTags((p: number[]) => [...p, i]), i * 200 + 700));
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive, data.industry.analysisItems, data.industry.tags]);

  const tagColors: Record<AnalysisTag["type"], { border: string; text: string; bg: string }> = {
    industry:    { border: "rgba(0,245,255,0.35)",  text: "#00f5ff",        bg: "rgba(0,245,255,0.06)"  },
    tech:        { border: "rgba(0,102,255,0.35)",   text: "#4488ff",        bg: "rgba(0,102,255,0.06)"  },
    requirement: { border: "rgba(123,47,255,0.35)",  text: "#a855f7",        bg: "rgba(123,47,255,0.06)" },
    challenge:   { border: "rgba(251,146,60,0.35)",  text: "rgba(251,146,60,0.9)", bg: "rgba(251,146,60,0.05)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-8 w-full"
      style={{ minHeight: 280 }}
    >
      {/* Analysis items */}
      <div>
        <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: "1rem" }}>
          ANALYSIS PIPELINE
        </div>
        <div className="space-y-3">
          {data.industry.analysisItems.map((item, i) => (
            <AnimatePresence key={item}>
              {visibleItems.includes(i) && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "linear-gradient(135deg, #00f5ff, #0066ff)",
                      flexShrink: 0,
                      boxShadow: "0 0 6px rgba(0,245,255,0.5)",
                    }}
                  />
                  <div className="flex-1 flex items-center justify-between gap-3">
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{item}</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ fontFamily: "var(--font-mono)", color: "#4ade80", fontSize: 9, letterSpacing: "0.1em", flexShrink: 0 }}
                    >
                      DETECTED
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: "1rem" }}>
          TECHNOLOGY OPPORTUNITIES
        </div>
        <div className="flex flex-wrap gap-2">
          {data.industry.tags.map((tag, i) => {
            const c = tagColors[tag.type];
            return (
              <AnimatePresence key={tag.label}>
                {visibleTags.includes(i) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{
                      border: `1px solid ${c.border}`,
                      background: c.bg,
                      color: c.text,
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      padding: "4px 10px",
                      clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                    }}
                  >
                    {tag.label}
                  </motion.span>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Neural processing visual */}
        <div className="mt-6 relative overflow-hidden" style={{ height: 80 }}>
          {Array.from({ length: 5 }).map((_, col) =>
            Array.from({ length: 3 }).map((__, row) => (
              <motion.div
                key={`${col}-${row}`}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [80, -10],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: col * 0.25 + row * 0.1,
                  ease: "easeOut",
                }}
                className="absolute"
                style={{
                  left: `${col * 22 + 5}%`,
                  width: 1,
                  height: row === 1 ? 28 : 16,
                  background: "linear-gradient(to top, transparent, rgba(0,245,255,0.5))",
                }}
              />
            ))
          )}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 0,
              fontFamily: "var(--font-mono)",
              color: "rgba(0,245,255,0.35)",
              fontSize: 9,
              letterSpacing: "0.15em",
            }}
          >
            NEURAL PROCESSING ACTIVE
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Stage 3 — Design
function DesignStage({ data, isActive }: { data: SimulationData; isActive: boolean }) {
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isActive) { setDrawProgress(0); return; }
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2200, 1);
      setDrawProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    const delay = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 300);
    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  // Blueprint grid SVG
  const gridLines = 7;
  const W = 320, H = 200;
  const cellW = W / gridLines, cellH = H / (gridLines - 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row gap-8 items-center w-full"
      style={{ minHeight: 280 }}
    >
      {/* Blueprint SVG */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          width: "min(100%, 380px)",
          height: 240,
          background: "rgba(0,10,30,0.8)",
          border: "1px solid rgba(0,102,255,0.2)",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="Design blueprint" role="img">
          <defs>
            <clipPath id="design-clip">
              <rect x="0" y="0" width={W * drawProgress} height={H} />
            </clipPath>
          </defs>

          {/* Background grid */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * cellW} y1={0} x2={i * cellW} y2={H}
              stroke="rgba(0,102,255,0.1)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: gridLines }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * cellH} x2={W} y2={i * cellH}
              stroke="rgba(0,102,255,0.1)" strokeWidth="0.5" />
          ))}

          {/* Blueprint drawing (revealed via clip-path) */}
          <g clipPath="url(#design-clip)">
            {/* Main boundary */}
            <rect x="20" y="20" width={W - 40} height={H - 40} fill="none" stroke="rgba(0,102,255,0.6)" strokeWidth="1.5" />
            {/* Inner structure */}
            <rect x="40" y="40" width="100" height="80" fill="rgba(0,102,255,0.05)" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
            <rect x="160" y="40" width="140" height="120" fill="rgba(0,102,255,0.05)" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
            <rect x="40" y="140" width="100" height="40" fill="rgba(123,47,255,0.05)" stroke="rgba(123,47,255,0.3)" strokeWidth="1" />
            {/* Cross-sections */}
            <line x1="40" y1="90" x2="140" y2="90" stroke="rgba(0,245,255,0.25)" strokeWidth="0.5" strokeDasharray="4 3" />
            <line x1="230" y1="40" x2="230" y2="160" stroke="rgba(0,245,255,0.25)" strokeWidth="0.5" strokeDasharray="4 3" />
            {/* Dimension lines */}
            <line x1="20" y1="10" x2="300" y2="10" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5" />
            <line x1="310" y1="20" x2="310" y2="180" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5" />
            {/* Labels */}
            <text x="150" y="8" textAnchor="middle" fill="rgba(0,245,255,0.5)" fontSize="6" fontFamily="monospace">MAIN SYSTEM LAYOUT</text>
            <text x="90" y="75" textAnchor="middle" fill="rgba(0,245,255,0.6)" fontSize="7" fontFamily="monospace">MODULE A</text>
            <text x="230" y="105" textAnchor="middle" fill="rgba(0,245,255,0.6)" fontSize="7" fontFamily="monospace">MODULE B</text>
            <text x="90" y="162" textAnchor="middle" fill="rgba(123,47,255,0.7)" fontSize="7" fontFamily="monospace">CORE</text>
            {/* Dots at intersections */}
            {[[40,40],[140,40],[40,120],[140,120],[160,40],[300,40],[160,160],[300,160]].map(([x,y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="rgba(0,245,255,0.5)" />
            ))}
          </g>
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute inset-y-0 pointer-events-none"
          animate={{ left: [`${drawProgress * 100 - 4}%`, `${drawProgress * 100}%`] }}
          style={{ width: 2, background: "linear-gradient(to bottom, transparent, rgba(0,245,255,0.6), transparent)" }}
        />

        <div
          className="absolute bottom-2 left-3"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.35)", fontSize: 8, letterSpacing: "0.1em" }}
        >
          BLUEPRINT GEN: {Math.round(drawProgress * 100)}%
        </div>
      </div>

      {/* Design elements list */}
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: "1rem" }}>
          DESIGN ARTIFACTS
        </div>
        <div className="space-y-3">
          {data.industry.designElements.map((el, i) => {
            const revealed = drawProgress > (i + 1) / (data.industry.designElements.length + 1);
            return (
              <motion.div
                key={el}
                animate={{ opacity: revealed ? 1 : 0.15, x: revealed ? 0 : -8 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div
                  style={{
                    width: 28, height: 28,
                    border: `1px solid ${revealed ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.1)"}`,
                    background: revealed ? "rgba(0,245,255,0.06)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.4s",
                    clipPath: "polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                  }}
                >
                  {revealed ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 5L4.5 8L8 2" stroke="#00f5ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ width: 6, height: 1, background: "rgba(0,245,255,0.2)" }} />
                  )}
                </div>
                <span style={{ color: revealed ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)", fontSize: "0.85rem", transition: "color 0.4s" }}>
                  {el}
                </span>
                {revealed && (
                  <span style={{ fontFamily: "var(--font-mono)", color: "#4ade80", fontSize: 9, letterSpacing: "0.1em", marginLeft: "auto" }}>
                    COMPLETE
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Stage 5 — Construction
function ConstructionStage({ data, isActive }: { data: SimulationData; isActive: boolean }) {
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) { setProgress([]); return; }
    const phases = data.industry.constructionPhases;
    setProgress(Array(phases.length).fill(0));

    const timers: ReturnType<typeof setTimeout>[] = [];
    phases.forEach((_, phaseIdx) => {
      let p = 0;
      const startDelay = phaseIdx * 480;
      timers.push(
        setTimeout(() => {
          const tick = setInterval(() => {
            p = Math.min(p + Math.random() * 18 + 8, 100);
            setProgress((prev: number[]) => {
              const next = [...prev];
              next[phaseIdx] = p;
              return next;
            });
            if (p >= 100) clearInterval(tick);
          }, 80);
          timers.push(tick as unknown as ReturnType<typeof setTimeout>);
        }, startDelay)
      );
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [isActive, data.industry.constructionPhases]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ minHeight: 280 }}
    >
      <div style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: "1.5rem" }}>
        INFRASTRUCTURE ASSEMBLY IN PROGRESS
      </div>

      <div className="space-y-5">
        {data.industry.constructionPhases.map((phase, i) => {
          const pct = Math.round(progress[i] ?? 0);
          const done = pct >= 100;
          return (
            <div key={phase}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      border: done ? "1px solid #00f5ff" : "1px solid rgba(0,245,255,0.2)",
                      background: done ? "rgba(0,245,255,0.15)" : "transparent",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 22, height: 22,
                      clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {done ? (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                        <path d="M1.5 4.5L3.5 7L7.5 2" stroke="#00f5ff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <motion.div
                        animate={{ opacity: pct > 0 ? [1, 0.3, 1] : 0.2 }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,245,255,0.5)" }}
                      />
                    )}
                  </motion.div>
                  <span style={{
                    color: done ? "rgba(255,255,255,0.8)" : pct > 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
                    fontSize: "0.85rem",
                    transition: "color 0.3s",
                  }}>
                    {phase}
                  </span>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  color: done ? "#4ade80" : pct > 0 ? "#00f5ff" : "rgba(0,245,255,0.25)",
                  fontSize: 11,
                  minWidth: 36,
                  textAlign: "right",
                  transition: "color 0.3s",
                }}>
                  {pct}%
                </span>
              </div>
              <div style={{ height: 3, background: "rgba(0,245,255,0.08)", overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.15, ease: "linear" }}
                  style={{
                    height: "100%",
                    background: done
                      ? "linear-gradient(90deg, #00f5ff, #4ade80)"
                      : "linear-gradient(90deg, #00f5ff, #0066ff)",
                    boxShadow: done ? "0 0 6px rgba(74,222,128,0.5)" : "0 0 6px rgba(0,245,255,0.4)",
                    transition: "background 0.5s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status display */}
      <motion.div
        className="mt-6 flex items-center gap-3"
        animate={{ opacity: progress.some((p: number) => p > 0) ? 1 : 0 }}
      >
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }}
        />
        <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.4)", fontSize: 9, letterSpacing: "0.15em" }}>
          SMART DEPLOYMENT SYSTEMS ACTIVE — {progress.filter((p: number) => (p ?? 0) >= 100).length}/{data.industry.constructionPhases.length} PHASES COMPLETE
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Stage content router ─────────────────────────────────────────────────────
function StageContent({
  stageIndex,
  data,
}: {
  stageIndex: number;
  data: SimulationData;
}) {
  const stageId = SIMULATION_STAGES[stageIndex]?.id;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stageId}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full"
      >
        {stageId === "idea"         && <IdeaStage data={data} isActive />}
        {stageId === "analysis"     && <AnalysisStage data={data} isActive />}
        {stageId === "design"       && <DesignStage data={data} isActive />}
        {stageId === "digital-twin" && <DigitalTwinStage industry={data.industry} isActive />}
        {stageId === "construction" && <ConstructionStage data={data} isActive />}
        {stageId === "result"       && <div />}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function IdeaToRealitySection() {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const resultRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView } = useInView({ triggerOnce: true, rootMargin: "100px" });

  // Handle simulation start
  const handleSimulate = useCallback(
    (idea: string) => {
      const data = analyzeIdea(idea);
      setSimulationData(data);
      setIsSimulating(true);
      setCurrentStage(0);

      // Store in sessionStorage for NexBot context
      try {
        sessionStorage.setItem("__nexgiga_sim", JSON.stringify({ idea, projectType: data.industry.projectType, wing: data.industry.result.wing }));
      } catch (_) { /* ignore storage errors */ }

      // Scroll section into view
      setTimeout(() => {
        document.getElementById("idea-to-reality")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    []
  );

  // Stage auto-advance
  useEffect(() => {
    if (!isSimulating || !simulationData) return;
    const stage = SIMULATION_STAGES[currentStage];
    if (!stage || stage.duration === Infinity) return;

    const duration = prefersReducedMotion ? stage.duration * 0.15 : stage.duration;
    const timer = setTimeout(() => {
      setCurrentStage((prev: number) => Math.min(prev + 1, SIMULATION_STAGES.length - 1));
    }, duration);
    return () => clearTimeout(timer);
  }, [isSimulating, currentStage, simulationData, prefersReducedMotion]);

  // Scroll to result when it appears
  useEffect(() => {
    if (currentStage === SIMULATION_STAGES.length - 1 && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [currentStage]);

  // NexBot open handler
  const handleAskNexBot = useCallback(() => {
    window.dispatchEvent(new CustomEvent("nexbot:open"));
  }, []);

  // Reset handler
  const handleReset = useCallback(() => {
    setIsSimulating(false);
    setSimulationData(null);
    setCurrentStage(0);
    document.getElementById("idea-to-reality")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isResult = currentStage === SIMULATION_STAGES.length - 1;

  return (
    <section
      id="idea-to-reality"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-label="Idea to Reality Simulator"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle radial centre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(0,102,255,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Top separator beam */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "5%",
            right: "5%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.15), transparent)",
          }}
        />
      </div>

      {/* ── Content container ── */}
      <div className="max-w-5xl mx-auto px-6 relative">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <SectionLabel label="Idea-to-Reality Simulator" />
          <h2
            className="heading-xl text-4xl md:text-5xl lg:text-6xl mb-5"
            style={{ color: "#fff" }}
          >
            Watch your vision{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00f5ff 0%, #0066ff 50%, #7b2fff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              become reality.
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Enter your idea and watch NexGiga&apos;s AI engine simulate the complete
            transformation — from raw concept to finished, operational project.
          </p>
        </motion.div>

        {/* ── Input phase ── */}
        <AnimatePresence>
          {!isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.5 }}
            >
              <IdeaInput onSimulate={handleSimulate} isSimulating={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Simulation phase ── */}
        <AnimatePresence>
          {isSimulating && simulationData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Idea recap tag */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  style={{
                    padding: "4px 14px",
                    border: "1px solid rgba(0,245,255,0.2)",
                    background: "rgba(0,245,255,0.04)",
                    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.7)", fontSize: 10, letterSpacing: "0.12em" }}>
                    SIMULATING:
                  </span>
                </div>
                <span
                  className="flex-1 truncate"
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontStyle: "italic" }}
                  title={simulationData.idea}
                >
                  "{simulationData.idea}"
                </span>
                <button
                  onClick={handleReset}
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "rgba(0,245,255,0.4)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    background: "transparent",
                    border: "1px solid rgba(0,245,255,0.12)",
                    padding: "4px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { (e.target as HTMLElement).style.color = "#00f5ff"; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { (e.target as HTMLElement).style.color = "rgba(0,245,255,0.4)"; }}
                  aria-label="Reset simulation"
                >
                  NEW IDEA
                </button>
              </div>

              {/* Timeline */}
              <TransformationTimeline currentStage={currentStage} />

              {/* Stage visualization panel */}
              {!isResult && (
                <motion.div
                  className="relative"
                  style={{
                    background: "rgba(0,5,15,0.7)",
                    border: "1px solid rgba(0,245,255,0.08)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    minHeight: 300,
                  }}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l" style={{ borderColor: "rgba(0,245,255,0.25)" }} />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t border-r" style={{ borderColor: "rgba(0,245,255,0.1)" }} />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l" style={{ borderColor: "rgba(0,245,255,0.1)" }} />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r" style={{ borderColor: "rgba(0,245,255,0.25)" }} />

                  {/* Stage label */}
                  <div className="flex items-center gap-3 mb-7">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                      style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#00f5ff",
                        boxShadow: "0 0 8px rgba(0,245,255,0.8)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "#00f5ff",
                        fontSize: 11,
                        letterSpacing: "0.2em",
                      }}
                    >
                      STAGE {currentStage + 1} — {SIMULATION_STAGES[currentStage]?.label.toUpperCase()}
                    </span>
                  </div>

                  {/* Renders the correct stage visualization */}
                  <StageContent stageIndex={currentStage} data={simulationData} />
                </motion.div>
              )}

              {/* Result reveal */}
              <div ref={resultRef}>
                <ResultReveal
                  data={simulationData}
                  isActive={isResult}
                  onAskNexBot={handleAskNexBot}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Feature pills — visible when not yet simulating ── */}
        {!isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-10"
          >
            {[
              "AI-Powered Analysis",
              "Digital Twin Integration",
              "Real-time Simulation",
              "NexBot Ready",
            ].map((pill) => (
              <div
                key={pill}
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  border: "1px solid rgba(0,245,255,0.1)",
                  background: "rgba(0,245,255,0.02)",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                }}
              >
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,245,255,0.5)" }} />
                <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 10, letterSpacing: "0.1em" }}>
                  {pill}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
