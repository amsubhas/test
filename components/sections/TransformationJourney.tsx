"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const stages = [
  {
    step: "01",
    label: "IDEA",
    description: "Raw vision and creative intent — the spark that starts everything.",
    icon: "✦",
    color: "#7b2fff",
    detail: "Concept mapping, feasibility analysis, requirement gathering",
  },
  {
    step: "02",
    label: "DIGITAL MODEL",
    description: "Translating abstract concepts into precise digital blueprints.",
    icon: "◈",
    color: "#0066ff",
    detail: "BIM modeling, 3D design, parametric architecture",
  },
  {
    step: "03",
    label: "SIMULATION",
    description: "Testing reality before reality exists — eliminating risk.",
    icon: "⬡",
    color: "#00aaff",
    detail: "Physics simulation, stress testing, predictive modeling",
  },
  {
    step: "04",
    label: "OPTIMIZATION",
    description: "AI-driven refinement for peak performance and efficiency.",
    icon: "◎",
    color: "#00ccdd",
    detail: "Machine learning, genetic algorithms, performance tuning",
  },
  {
    step: "05",
    label: "AUTOMATION",
    description: "Intelligent systems that execute with precision and scale.",
    icon: "⊕",
    color: "#00eeff",
    detail: "Robotic process automation, IoT integration, edge computing",
  },
  {
    step: "06",
    label: "MANUFACTURING",
    description: "From digital instructions to physical production pipelines.",
    icon: "⬟",
    color: "#00f5ff",
    detail: "CNC machining, additive manufacturing, smart factories",
  },
  {
    step: "07",
    label: "REALITY",
    description: "The idea made tangible — buildings, machines, infrastructure.",
    icon: "★",
    color: "#ffffff",
    detail: "Commissioning, handover, continuous monitoring",
  },
];

function StageCard({
  stage,
  index,
}: {
  stage: (typeof stages)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-8 ${isEven ? "flex-row" : "flex-row-reverse"} max-w-3xl ${isEven ? "mr-auto" : "ml-auto"}`}
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? "text-right" : "text-left"}`}>
        <div
          className="text-xs font-mono mb-2 opacity-50"
          style={{ color: stage.color, fontFamily: "var(--font-mono)" }}
        >
          STAGE {stage.step}
        </div>
        <h3
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)", color: stage.color }}
        >
          {stage.label}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-2">{stage.description}</p>
        <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-mono)", color: stage.color }}>
          {stage.detail}
        </p>
      </div>

      {/* Node */}
      <div className="relative flex-shrink-0">
        <div
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl relative z-10"
          style={{
            borderColor: stage.color,
            background: `radial-gradient(circle, ${stage.color}15, transparent)`,
            boxShadow: `0 0 20px ${stage.color}30, 0 0 60px ${stage.color}10`,
          }}
        >
          <span style={{ color: stage.color }}>{stage.icon}</span>
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ borderColor: stage.color, border: `1px solid ${stage.color}` }}
        />
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1" />
    </motion.div>
  );
}

export default function TransformationJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="transformation"
      className="section-padding relative overflow-hidden"
      ref={containerRef}
      aria-label="Transformation journey"
    >
      {/* Background */}
      <div className="absolute inset-0 dot-matrix opacity-20" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <SectionLabel label="The Journey" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-5xl md:text-6xl lg:text-7xl text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Idea <span className="gradient-text-cyan">→</span> Reality
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            Every world-class outcome follows a proven transformation path.
            We guide you through each critical stage.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Stages */}
          <div className="space-y-20 relative">
            {stages.map((stage, i) => (
              <StageCard key={stage.step} stage={stage} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-24"
        >
          <div className="glass border border-cyan-500/10 rounded-none p-8 max-w-xl mx-auto"
            style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
          >
            <p className="text-white/60 mb-4">
              Ready to begin your transformation?
            </p>
            <a href="#contact" className="btn-primary inline-flex">
              Start Your Journey
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
