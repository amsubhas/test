"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IndustryData } from "./SimulationEngine";

interface DigitalTwinStageProps {
  industry: IndustryData;
  isActive: boolean;
}

interface DataNode {
  id: number;
  x: number;
  y: number;
  label: string;
  delay: number;
}

const HEX_POINTS = (cx: number, cy: number, r: number): string => {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
};

export default function DigitalTwinStage({ industry, isActive }: DigitalTwinStageProps) {
  const [visibleNodes, setVisibleNodes] = useState<number[]>([]);
  const [pulseRing, setPulseRing] = useState(0);
  const pulseRef = useRef<ReturnType<typeof setInterval>>();

  const cx = 200;
  const cy = 200;

  const nodes: DataNode[] = [
    { id: 0, x: cx,       y: cy - 105, label: industry.twinFeatures[0]?.split(" ").slice(0,2).join(" ") || "SYNC", delay: 0 },
    { id: 1, x: cx + 91,  y: cy - 52,  label: industry.twinFeatures[1]?.split(" ").slice(0,2).join(" ") || "MONITOR", delay: 0.3 },
    { id: 2, x: cx + 91,  y: cy + 52,  label: industry.twinFeatures[2]?.split(" ").slice(0,2).join(" ") || "PREDICT", delay: 0.6 },
    { id: 3, x: cx,       y: cy + 105, label: industry.twinFeatures[3]?.split(" ").slice(0,2).join(" ") || "OPTIMIZE", delay: 0.9 },
    { id: 4, x: cx - 91,  y: cy + 52,  label: "ANALYTICS",  delay: 1.2 },
    { id: 5, x: cx - 91,  y: cy - 52,  label: "INTEGRATE",  delay: 1.5 },
  ];

  // Reveal nodes sequentially
  useEffect(() => {
    if (!isActive) { setVisibleNodes([]); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    nodes.forEach((n) => {
      const t = setTimeout(
        () => setVisibleNodes((prev: number[]) => [...prev, n.id]),
        n.delay * 1000 + 400
      );
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  // Pulse ring counter
  useEffect(() => {
    if (!isActive) return;
    pulseRef.current = setInterval(() => setPulseRing((p: number) => p + 1), 1200);
    return () => clearInterval(pulseRef.current);
  }, [isActive]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
      {/* ── SVG Holographic visualization ── */}
      <div className="relative flex-shrink-0" style={{ width: 400, height: 400, maxWidth: "100%" }}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          aria-label="Digital Twin holographic model"
          role="img"
        >
          <defs>
            <radialGradient id="dt-center-glow" cx="50%" cy="50%">
              <stop offset="0%"   stopColor="#00f5ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="dt-node-glow" cx="50%" cy="50%">
              <stop offset="0%"   stopColor="#0066ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0066ff" stopOpacity="0"   />
            </radialGradient>
            <filter id="dt-glow-filter">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background grid rings */}
          {[40, 70, 100, 135].map((r, i) => (
            <polygon
              key={r}
              points={HEX_POINTS(cx, cy, r)}
              fill="none"
              stroke="rgba(0,245,255,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* Central glow */}
          <circle cx={cx} cy={cy} r="90" fill="url(#dt-center-glow)" />

          {/* Pulse rings */}
          <AnimatePresence>
            {isActive && (
              <motion.circle
                key={pulseRing}
                cx={cx}
                cy={cy}
                r={30}
                fill="none"
                stroke="rgba(0,245,255,0.6)"
                strokeWidth="1"
                initial={{ r: 30, opacity: 0.8 }}
                animate={{ r: 120, opacity: 0 }}
                exit={{}}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* Connection lines from center to nodes */}
          {nodes.map((node) => (
            <AnimatePresence key={`line-${node.id}`}>
              {visibleNodes.includes(node.id) && (
                <motion.line
                  x1={cx}
                  y1={cy}
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(0,102,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, strokeDashoffset: [8, 0] }}
                  transition={{
                    opacity: { duration: 0.3 },
                    strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  }}
                />
              )}
            </AnimatePresence>
          ))}

          {/* Outer hexagon frame */}
          <motion.polygon
            points={HEX_POINTS(cx, cy, 140)}
            fill="none"
            stroke="rgba(0,245,255,0.15)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1, rotate: [0, 360] } : { opacity: 0 }}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Inner hexagon */}
          <motion.polygon
            points={HEX_POINTS(cx, cy, 38)}
            fill="rgba(0,245,255,0.06)"
            stroke="#00f5ff"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#dt-glow-filter)"
          />

          {/* Center label */}
          <motion.text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fill="#00f5ff"
            fontSize="9"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            TWIN
          </motion.text>

          {/* Data nodes */}
          {nodes.map((node) => (
            <AnimatePresence key={`node-${node.id}`}>
              {visibleNodes.includes(node.id) && (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  {/* Glow backdrop */}
                  <circle cx={node.x} cy={node.y} r="14" fill="url(#dt-node-glow)" />
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="6"
                    fill="rgba(0,102,255,0.2)"
                    stroke="#0066ff"
                    strokeWidth="1"
                  />
                  {/* Ping dot */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="2.5"
                    fill="#00f5ff"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: node.delay }}
                  />
                </motion.g>
              )}
            </AnimatePresence>
          ))}
        </svg>

        {/* HUD corner overlays */}
        <div className="absolute top-3 left-3 pointer-events-none" style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)", fontSize: 9, lineHeight: 1.8, letterSpacing: "0.08em" }}>
          <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.5 }}>
            <div>TWIN_ID: NGC-{Math.floor(Date.now() / 10000).toString(16).toUpperCase()}</div>
            <div>STATUS: <span style={{ color: "#4ade80" }}>SYNCHRONIZED</span></div>
            <div>NODES: {visibleNodes.length} / {nodes.length} ACTIVE</div>
          </motion.div>
        </div>

        <div className="absolute bottom-3 right-3 pointer-events-none text-right" style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.35)", fontSize: 9, lineHeight: 1.8, letterSpacing: "0.08em" }}>
          <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1 }}>
            <div>LOD: HIGH</div>
            <div>SYNC: REAL-TIME</div>
          </motion.div>
        </div>
      </div>

      {/* ── Feature list ── */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ border: "1px solid rgba(0,245,255,0.2)", padding: "4px 12px", background: "rgba(0,245,255,0.04)" }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }}
            />
            <span style={{ fontFamily: "var(--font-mono)", color: "#00f5ff", fontSize: 10, letterSpacing: "0.12em" }}>
              CONNECTED TO DIGITAL TWIN ECOSYSTEM
            </span>
          </div>

          <h3
            className="text-white mb-2"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700 }}
          >
            {industry.projectType}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            A living digital replica is being constructed — synchronizing physical assets with real-time intelligence.
          </p>

          <div className="space-y-3">
            {industry.twinFeatures.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -12 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ delay: i * 0.25 + 0.4, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: "1px solid rgba(0,245,255,0.3)",
                    background: "rgba(0,245,255,0.06)",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00f5ff" }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.875rem", lineHeight: 1.5 }}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
