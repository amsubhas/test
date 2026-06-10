"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { Building2, Factory, Zap, Shield, Plane, Leaf, ChevronRight } from "lucide-react";

const industries = [
  {
    icon: Building2,
    title: "Architecture & Construction",
    description: "Revolutionize project delivery with intelligent BIM workflows, reality capture, clash-free coordination, and on-site robotic assistance.",
    solutions: ["Scan-to-BIM", "4D/5D Construction Simulation", "Drone Surveying", "Site Safety AI", "Prefab Optimization"],
    stat: "35% faster delivery",
    gradient: "from-cyan-500/10 to-blue-500/5",
  },
  {
    icon: Factory,
    title: "Manufacturing & Industry",
    description: "Transform your production floor with AI-driven quality control, predictive maintenance, and cyber-physical systems that learn and adapt.",
    solutions: ["Smart Factory Design", "Predictive Maintenance", "Quality Control AI", "Supply Chain Optimization", "Digital Factory Twin"],
    stat: "50% less downtime",
    gradient: "from-blue-500/10 to-purple-500/5",
  },
  {
    icon: Zap,
    title: "Energy & Utilities",
    description: "Manage complex energy infrastructure with digital twins, AI forecasting, and automated control systems built for reliability at scale.",
    solutions: ["Grid Digital Twin", "Renewable Energy Modeling", "Pipeline Monitoring", "Load Forecasting AI", "Carbon Analytics"],
    stat: "99.8% uptime",
    gradient: "from-purple-500/10 to-cyan-500/5",
  },
  {
    icon: Shield,
    title: "Defense & Aerospace",
    description: "Deploy mission-critical simulation, autonomous systems, and AI-powered intelligence platforms built to the highest standards of reliability.",
    solutions: ["Mission Planning Simulation", "Autonomous UAVs", "Structural Analysis", "Thermal Management", "Electronic Warfare Sim"],
    stat: "Zero-compromise reliability",
    gradient: "from-cyan-500/10 to-purple-500/5",
  },
  {
    icon: Plane,
    title: "Transportation & Logistics",
    description: "Optimize every node of your transport network — from autonomous vehicle integration to intelligent port operations and predictive logistics.",
    solutions: ["Traffic Flow AI", "Autonomous Integration", "Port Digital Twin", "Route Optimization", "Drone Delivery Systems"],
    stat: "28% efficiency gain",
    gradient: "from-blue-500/10 to-cyan-500/5",
  },
  {
    icon: Leaf,
    title: "Smart Cities & Environment",
    description: "Build cities that breathe intelligently. Integrate systems, monitor environmental health, and create responsive urban ecosystems.",
    solutions: ["Urban Digital Twin", "Environmental Monitoring", "Smart Mobility", "Waste Management AI", "Climate Modeling"],
    stat: "Carbon neutral pathways",
    gradient: "from-green-500/10 to-cyan-500/5",
  },
];

export default function IndustrySolutions() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="solutions"
      className="section-padding relative overflow-hidden"
      aria-label="Industry Solutions"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel label="Industries" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for Every{" "}
            <span className="gradient-text-cyan">Critical</span>{" "}
            Industry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/45 max-w-xl mx-auto"
          >
            Deep domain expertise meets cutting-edge technology to solve your
            industry&apos;s most complex challenges.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative border border-white/5 transition-all duration-400 cursor-pointer overflow-hidden bg-gradient-to-br ${industry.gradient} ${
                hovered === i ? "border-cyan-500/25 -translate-y-2" : ""
              }`}
              style={{
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
              }}
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent transition-opacity duration-300 ${hovered === i ? "opacity-100" : "opacity-0"}`}
              />

              <div className="relative p-8">
                {/* Icon + stat */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center text-cyan-400">
                    <industry.icon size={20} />
                  </div>
                  <span
                    className="text-xs text-cyan-400/60 text-right max-w-[100px] leading-tight"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {industry.stat}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {industry.title}
                </h3>

                <p className="text-white/45 text-sm leading-relaxed mb-6">
                  {industry.description}
                </p>

                {/* Solutions list */}
                <ul className="space-y-2">
                  {industry.solutions.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-white/40">
                      <ChevronRight size={10} className="text-cyan-400/40 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
