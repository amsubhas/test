"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const milestones = [
  {
    year: "2016",
    title: "NexGiga Founded",
    description: "Established with a singular vision: bridge the digital and physical worlds through intelligent engineering.",
    highlight: "Foundation",
  },
  {
    year: "2017",
    title: "First BIM Project",
    description: "Delivered our first LOD 400 BIM model for a landmark commercial tower, setting the quality benchmark.",
    highlight: "BIM Excellence",
  },
  {
    year: "2018",
    title: "Digital Twin Launch",
    description: "Pioneered real-time digital twin implementation for a major Indian infrastructure project.",
    highlight: "Innovation",
  },
  {
    year: "2019",
    title: "AI Division Established",
    description: "Launched dedicated AI & Machine Learning practice, integrating intelligence into all service lines.",
    highlight: "AI Integration",
  },
  {
    year: "2020",
    title: "Global Expansion",
    description: "Extended operations to 10 countries, delivering projects across Europe, Middle East, and Southeast Asia.",
    highlight: "Global Reach",
  },
  {
    year: "2021",
    title: "Buildmate Beta",
    description: "Launched Buildmate — our proprietary AI construction management platform — to beta partners.",
    highlight: "Product Launch",
  },
  {
    year: "2022",
    title: "Robotics Practice",
    description: "Expanded into industrial robotics, deploying autonomous inspection systems for energy and manufacturing clients.",
    highlight: "Robotics",
  },
  {
    year: "2023",
    title: "Smart City Projects",
    description: "Awarded multiple smart city digital twin contracts across tier-1 Indian cities.",
    highlight: "Scale",
  },
  {
    year: "2024",
    title: "Industry 5.0",
    description: "Launched Human-Robot Collaboration frameworks, positioning NexGiga at the frontier of Industry 5.0.",
    highlight: "Future",
  },
  {
    year: "2025+",
    title: "Quantum-Ready Platform",
    description: "Developing quantum-enhanced simulation and optimization capabilities for next-generation challenges.",
    highlight: "Beyond",
  },
];

export default function TimelineSection() {
  return (
    <section
      id="timeline"
      className="section-padding relative overflow-hidden"
      aria-label="NexGiga Timeline"
    >
      <div className="absolute inset-0 grid-overlay opacity-15" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <SectionLabel label="Our Journey" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A Decade of{" "}
            <span className="gradient-text-cyan">Transformation</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-white/5" />

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`w-[calc(50%-32px)] ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
                    <div
                      className="text-xs mb-1"
                      style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.5)" }}
                    >
                      {m.highlight}
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {m.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">{m.description}</p>
                  </div>

                  {/* Node */}
                  <div className="relative z-10 flex items-center justify-center w-16 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.6)]" />
                    {/* Year label */}
                    <div
                      className="absolute -bottom-6 text-xs text-cyan-400/50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {m.year}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-[calc(50%-32px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
