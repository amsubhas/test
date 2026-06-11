"use client";

import { motion, type Variants } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowCard from "@/components/ui/GlowCard";
import { Brain, Atom, Cpu, Globe, Wifi, Eye } from "lucide-react";


const technologies = [
  {
    icon: Brain,
    title: "Generative AI",
    description: "LLM-powered design tools that generate, optimize, and iterate on architectural and engineering concepts autonomously.",
    tag: "GPT-4 / Claude / Gemini",
    color: "#7b2fff",
  },
  {
    icon: Atom,
    title: "Quantum-Ready Computing",
    description: "Preparing optimization algorithms and simulation models for quantum advantage as the technology matures.",
    tag: "Qiskit / Cirq",
    color: "#0066ff",
  },
  {
    icon: Cpu,
    title: "Edge AI",
    description: "On-device intelligence for real-time decision-making in construction sites, factories, and infrastructure without cloud dependency.",
    tag: "NVIDIA Jetson / Hailo",
    color: "#00f5ff",
  },
  {
    icon: Globe,
    title: "Spatial Computing",
    description: "AR/VR overlays that place digital twins into the physical world for immersive review, training, and remote collaboration.",
    tag: "Apple Vision / HoloLens",
    color: "#00ccee",
  },
  {
    icon: Wifi,
    title: "5G & Private Networks",
    description: "Ultra-low latency connectivity for real-time robotic coordination, live digital twin sync, and industrial IoT at massive scale.",
    tag: "URLLC / Network Slicing",
    color: "#0066ff",
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description: "AI eyes that monitor construction progress, detect safety violations, inspect quality, and track assets autonomously.",
    tag: "YOLOv9 / SAM 2",
    color: "#7b2fff",
  },
];

export default function FutureTechnologies() {
  const { ref: canvasRef, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  return (
    <section
      id="future-tech"
      className="section-padding relative overflow-hidden"
      aria-label="Future Technologies"
    >
      <div className="absolute inset-0 dot-matrix opacity-15" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel label="Future Technologies" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Powered by{" "}
            <span className="gradient-text-cyan">Tomorrow&apos;s</span>
            <br />
            Technology Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/45 max-w-xl mx-auto"
          >
            We don&apos;t wait for the future — we build with it. Our technology stack
            is always at the frontier.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left: 3D Neural net */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-2 h-80 lg:h-[500px] relative"
          >
            <div className="absolute inset-0 bg-purple-900/5 rounded blur-3xl" />
            <div
              ref={canvasRef}
              className="w-full h-full glass border border-purple-500/10"
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
            >
              {inView ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center terminal-text text-purple-400/40">
                      LOADING AI...
                    </div>
                  }
                >
                  
                </Suspense>
              ) : (
                <div className="w-full h-full flex items-center justify-center terminal-text text-purple-400/20">
                  INITIALISING...
                </div>
              )}
            </div>

            {/* Overlaid labels */}
            <div className="absolute top-4 left-4 terminal-text opacity-50">
              <div className="text-purple-400">AI_NET: ACTIVE</div>
              <div>NODES: 60</div>
              <div>SYNAPSES: 120</div>
            </div>
          </motion.div>

          {/* Right: Tech cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {technologies.map((tech, i) => (
              <GlowCard
                key={tech.title}
                delay={i * 0.08}
                glowColor={tech.color === "#7b2fff" ? "purple" : tech.color === "#0066ff" ? "blue" : "cyan"}
                className="p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}30`, color: tech.color }}
                  >
                    <tech.icon size={16} />
                  </div>
                  <div>
                    <h3
                      className="text-base font-semibold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {tech.title}
                    </h3>
                    <span
                      className="text-[10px]"
                      style={{ fontFamily: "var(--font-mono)", color: `${tech.color}80` }}
                    >
                      {tech.tag}
                    </span>
                  </div>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">{tech.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
