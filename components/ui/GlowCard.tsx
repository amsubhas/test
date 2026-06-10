"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export default function GlowCard({
  children,
  className = "",
  glowColor = "cyan",
  delay = 0,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowColors: Record<string, string> = {
    cyan: "rgba(0,245,255,0.08)",
    blue: "rgba(0,102,255,0.08)",
    purple: "rgba(123,47,255,0.08)",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden card-glass rounded-none ${className}`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
      }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, ${glowColors[glowColor]}, transparent 70%)`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400/10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/30" />

      {children}
    </motion.div>
  );
}
