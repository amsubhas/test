"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { SIMULATION_STAGES, type StageId } from "./SimulationEngine";

interface TransformationTimelineProps {
  currentStage: number;
}

const STAGE_ICONS: Record<StageId, React.ReactNode> = {
  idea: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1C4.24 1 2 3.24 2 6C2 7.87 3.03 9.49 4.56 10.38V12H9.44V10.38C10.97 9.49 12 7.87 12 6C12 3.24 9.76 1 7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="5" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  analysis: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  design: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="1.5" y1="5" x2="12.5" y2="5" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="5" y1="5" x2="5" y2="12.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  "digital-twin": (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <polygon points="7,1 13,4.5 13,10.5 7,14 1,10.5 1,4.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  construction: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.5" y="9" width="11" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="4" y="5.5" width="6" height="3.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="5.5" y="2" width="3" height="3.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  result: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 7L5.5 11L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function TransformationTimeline({ currentStage }: TransformationTimelineProps) {
  const totalStages = SIMULATION_STAGES.length;
  const progressPct = useMemo(
    () => (currentStage / (totalStages - 1)) * 100,
    [currentStage, totalStages]
  );

  return (
    <div className="w-full max-w-4xl mx-auto" role="progressbar" aria-valuenow={currentStage + 1} aria-valuemax={totalStages} aria-label="Simulation progress">
      {/* ── Desktop timeline ── */}
      <div className="hidden sm:block">
        <div className="relative pt-2 pb-8">
          {/* Background track */}
          <div
            className="absolute left-0 right-0"
            style={{ top: 20, height: 1, background: "rgba(0,245,255,0.1)" }}
          />

          {/* Progress fill */}
          <motion.div
            className="absolute left-0"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              top: 20,
              height: 1,
              background: "linear-gradient(90deg, #00f5ff, #0066ff)",
              boxShadow: "0 0 8px rgba(0,245,255,0.5)",
            }}
          />

          {/* Stage nodes */}
          <div className="relative flex justify-between">
            {SIMULATION_STAGES.map((stage, i) => {
              const isCompleted = i < currentStage;
              const isActive = i === currentStage;
              const isPending = i > currentStage;

              return (
                <div key={stage.id} className="flex flex-col items-center gap-3">
                  {/* Node circle */}
                  <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
                    {/* Pulse ring on active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(0,245,255,0.4)" }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}

                    <motion.div
                      animate={{
                        borderColor: isCompleted
                          ? "#00f5ff"
                          : isActive
                          ? "#00f5ff"
                          : "rgba(0,245,255,0.2)",
                        background: isCompleted
                          ? "rgba(0,245,255,0.15)"
                          : isActive
                          ? "rgba(0,245,255,0.08)"
                          : "rgba(0,5,15,0.6)",
                        boxShadow: isActive
                          ? "0 0 16px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.1)"
                          : isCompleted
                          ? "0 0 8px rgba(0,245,255,0.2)"
                          : "none",
                      }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        border: "1px solid",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    >
                      <motion.span
                        animate={{
                          color: isCompleted || isActive ? "#00f5ff" : "rgba(0,245,255,0.3)",
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {STAGE_ICONS[stage.id]}
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Label */}
                  <motion.span
                    animate={{
                      color: isActive ? "#00f5ff" : isCompleted ? "rgba(0,245,255,0.7)" : "rgba(0,245,255,0.25)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textAlign: "center",
                      maxWidth: 70,
                      lineHeight: 1.3,
                    }}
                  >
                    {stage.shortLabel}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile timeline ── */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3 mb-4">
          {/* Stage number badge */}
          <div
            style={{
              border: "1px solid rgba(0,245,255,0.3)",
              background: "rgba(0,245,255,0.06)",
              padding: "4px 10px",
              clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", color: "#00f5ff", fontSize: 11 }}>
              {currentStage + 1}/{totalStages}
            </span>
          </div>

          {/* Stage name */}
          <motion.span
            key={currentStage}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-mono)",
              color: "#00f5ff",
              fontSize: 11,
              letterSpacing: "0.15em",
            }}
          >
            {SIMULATION_STAGES[currentStage]?.label.toUpperCase()}
          </motion.span>
        </div>

        {/* Progress track */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{ height: 3, background: "rgba(0,245,255,0.1)" }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00f5ff, #0066ff)",
              boxShadow: "0 0 6px rgba(0,245,255,0.6)",
            }}
          />
        </div>

        {/* Dot indicators */}
        <div className="flex justify-between mt-2">
          {SIMULATION_STAGES.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                background:
                  i < currentStage
                    ? "#00f5ff"
                    : i === currentStage
                    ? "#00f5ff"
                    : "rgba(0,245,255,0.2)",
                scale: i === currentStage ? 1.4 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{ width: 5, height: 5, borderRadius: "50%" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
