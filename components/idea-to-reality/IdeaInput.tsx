"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IDEA_EXAMPLES } from "./SimulationEngine";

interface IdeaInputProps {
  onSimulate: (idea: string) => void;
  isSimulating: boolean;
}

export default function IdeaInput({ onSimulate, isSimulating }: IdeaInputProps) {
  const [value, setValue] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scanRef = useRef<ReturnType<typeof setTimeout>>();

  // Cycle placeholder examples when input is empty and unfocused
  useEffect(() => {
    if (value || isFocused) return;
    const interval = setInterval(() => {
      setExampleIndex((i: number) => (i + 1) % IDEA_EXAMPLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [value, isFocused]);

  // Scan-line oscillation
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.008;
      setScanPos(50 + 48 * Math.sin(t));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = useCallback(() => {
    const idea = value.trim() || IDEA_EXAMPLES[exampleIndex];
    if (idea && !isSimulating) onSimulate(idea);
  }, [value, exampleIndex, isSimulating, onSimulate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showOverlay = !value && !isFocused;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Terminal header ── */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-t border-l border-r"
        style={{
          borderColor: "rgba(0,245,255,0.15)",
          background: "rgba(0,245,255,0.03)",
        }}
      >
        <div className="flex gap-1.5">
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6 }} />
          ))}
        </div>
        <span
          className="text-xs tracking-widest"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)" }}
        >
          NEXGIGA // IDEA INPUT INTERFACE v2.4
        </span>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.4)", fontSize: 10 }}>
            LIVE
          </span>
        </div>
      </div>

      {/* ── Main input area ── */}
      <div
        className="relative overflow-hidden"
        style={{
          border: "1px solid",
          borderColor: isFocused ? "rgba(0,245,255,0.4)" : "rgba(0,245,255,0.12)",
          background: "rgba(0,5,15,0.8)",
          backdropFilter: "blur(20px)",
          transition: "border-color 0.3s ease",
          boxShadow: isFocused
            ? "0 0 0 1px rgba(0,245,255,0.1), 0 0 40px rgba(0,245,255,0.08), inset 0 0 60px rgba(0,245,255,0.02)"
            : "none",
        }}
      >
        {/* Scan line */}
        <div
          className="pointer-events-none absolute left-0 right-0"
          style={{
            top: `${scanPos}%`,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(0,245,255,${isFocused ? "0.15" : "0.06"}), transparent)`,
            transition: "opacity 0.3s",
          }}
        />

        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating example overlay */}
        <AnimatePresence mode="wait">
          {showOverlay && (
            <motion.div
              key={exampleIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute left-5 top-5 right-5 pointer-events-none select-none"
              style={{ fontFamily: "var(--font-body)", zIndex: 1 }}
              onClick={() => textareaRef.current?.focus()}
            >
              <span style={{ color: "rgba(0,245,255,0.25)", fontSize: "1.05rem", lineHeight: 1.6 }}>
                {IDEA_EXAMPLES[exampleIndex]}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                style={{ color: "rgba(0,245,255,0.5)", marginLeft: 2 }}
              >
                |
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isSimulating}
          rows={3}
          aria-label="Describe your project idea"
          className="relative w-full bg-transparent resize-none outline-none px-5 pt-5 pb-4"
          style={{
            fontFamily: "var(--font-body)",
            color: "#e8f4f8",
            fontSize: "1.05rem",
            lineHeight: 1.65,
            zIndex: 2,
            caretColor: "#00f5ff",
          }}
        />

        {/* Bottom meta row */}
        <div
          className="flex items-center justify-between px-5 pb-4 gap-4"
          style={{ borderTop: "1px solid rgba(0,245,255,0.06)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.3)", fontSize: 10 }}>
            {value.length > 0 ? `${value.length} chars` : "CMD+ENTER to simulate"}
          </span>
          <div className="flex gap-2">
            {IDEA_EXAMPLES.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: i === exampleIndex && showOverlay ? "#00f5ff" : "rgba(0,245,255,0.2)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Submit button ── */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <motion.button
          whileHover={!isSimulating ? { scale: 1.015, y: -2 } : {}}
          whileTap={!isSimulating ? { scale: 0.985 } : {}}
          onClick={handleSubmit}
          disabled={isSimulating}
          className="relative flex-1 flex items-center justify-center gap-3 overflow-hidden"
          style={{
            padding: "16px 36px",
            background: isSimulating
              ? "rgba(0,245,255,0.03)"
              : "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(0,102,255,0.12))",
            border: "1px solid",
            borderColor: isSimulating ? "rgba(0,245,255,0.15)" : "rgba(0,245,255,0.45)",
            color: isSimulating ? "rgba(0,245,255,0.4)" : "#00f5ff",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.9rem",
            letterSpacing: "0.15em",
            cursor: isSimulating ? "not-allowed" : "pointer",
            clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
            transition: "all 0.3s ease",
            boxShadow: isSimulating ? "none" : "0 0 30px rgba(0,245,255,0.12)",
          }}
          aria-disabled={isSimulating}
        >
          {/* Shimmer overlay on hover */}
          {!isSimulating && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(0,245,255,0.08) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
            />
          )}

          {isSimulating ? (
            <>
              <SimulatingIcon />
              <span>SIMULATION IN PROGRESS…</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>SIMULATE TRANSFORMATION</span>
            </>
          )}
        </motion.button>

        {/* Reset hint — only when has value */}
        {value && !isSimulating && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setValue("")}
            className="px-5 py-4 text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              cursor: "pointer",
              clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)";
            }}
            aria-label="Clear input"
          >
            CLEAR
          </motion.button>
        )}
      </div>

      {/* Keyboard hint */}
      <p
        className="text-center mt-3 hidden sm:block"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.2)", fontSize: 10, letterSpacing: "0.08em" }}
      >
        Press ⌘+Enter to simulate · Leave blank to use example
      </p>
    </div>
  );
}

function SimulatingIcon() {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(0,245,255,0.3)" strokeWidth="1.5" />
      <path d="M8 2A6 6 0 0 1 14 8" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}
