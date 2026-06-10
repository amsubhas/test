"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`inline-flex items-center gap-3 mb-6 ${className}`}
    >
      <span className="w-8 h-px bg-cyan-400" />
      <span
        className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <span className="w-8 h-px bg-cyan-400/30" />
    </motion.div>
  );
}
