"use client";

import { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowCard from "@/components/ui/GlowCard";
import { Building2, Factory, Zap, Network, TreePine, Layers } from "lucide-react";

const DigitalTwinCity = lazy(() => import("@/components/3d/DigitalTwinCity"));

const ecosystemItems = [
  {
    icon: Building2,
    title: "Smart Buildings",
    description: "Real-time digital replicas of buildings enabling predictive maintenance, energy optimization, and automated facilities management.",
    metrics: "40% energy saved",
    color: "cyan",
  },
  {
    icon: Factory,
    title: "Intelligent Factories",
    description: "Mirror your production line digitally. Simulate changes before implementation, eliminate downtime, maximize throughput.",
    metrics: "60% less downtime",
    color: "blue",
  },
  {
    icon: Network,
    title: "Smart City Infrastructure",
    description: "Connect every urban system — traffic, utilities, emergency services — into one coherent, responsive digital intelligence.",
    metrics: "30% operational savings",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Energy & Utilities",
    description: "Model your grid, pipeline, or renewable asset. Predict failures, optimize distribution, and ensure zero-disruption operations.",
    metrics: "99.9% uptime",
    color: "cyan",
  },
  {
    icon: TreePine,
    title: "Environmental Systems",
    description: "Simulate and manage ecological impact. Monitor carbon footprint, model climate scenarios, and drive sustainability goals.",
    metrics: "Carbon neutral pathways",
    color: "blue",
  },
  {
    icon: Layers,
    title: "Multi-Domain Integration",
    description: "Unify disparate systems into a single federated digital twin. Break data silos and achieve true system-of-systems intelligence.",
    metrics: "Unified intelligence",
    color: "purple",
  },
];

export default function DigitalTwinEcosystem() {
  const { ref: canvasRef, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  return (
    <section
      id="digital-twin"
      className="section-padding relative overflow-hidden"
      aria-label="Digital Twin Ecosystem"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <SectionLabel label="Digital Twin Ecosystem" />
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your World,{" "}
              <span className="gradient-text-cyan">Mirrored</span>
              <br />
              in Digital Space
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 leading-relaxed text-lg mb-8"
            >
              Digital twins are living, breathing replicas of your physical assets.
              They capture real-time data, run simulations, and enable decisions that
              would otherwise be impossible — transforming how you build, operate, and evolve.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              {["Real-time synchronization", "Predictive analytics", "Scenario simulation", "Lifecycle management"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="text-white/60 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D City */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-80 lg:h-[480px] relative"
          >
            {/* Glow behind canvas */}
            <div className="absolute inset-0 bg-cyan-500/5 rounded blur-3xl" />
            <div
              ref={canvasRef}
              className="w-full h-full relative glass border border-cyan-500/10"
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
            >
              {inView ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-cyan-400/30 text-xs terminal-text">LOADING TWIN...</div>
                    </div>
                  }
                >
                  <DigitalTwinCity />
                </Suspense>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-cyan-400/20 text-xs terminal-text">INITIALISING...</div>
                </div>
              )}

              {/* Overlay HUD */}
              <div className="absolute top-4 left-4 terminal-text opacity-60">
                <div>TWIN_ID: NGC-2024-DTW</div>
                <div>STATUS: <span className="text-green-400">SYNCHRONIZED</span></div>
                <div>NODES: 1,247 ACTIVE</div>
              </div>
              <div className="absolute bottom-4 right-4 terminal-text opacity-40 text-right">
                <div>LOD: HIGH</div>
                <div>FPS: 60</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemItems.map((item, i) => (
            <GlowCard key={item.title} delay={i * 0.1} glowColor={item.color} className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center border rounded-sm flex-shrink-0 ${
                    item.color === "cyan"
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : item.color === "blue"
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  }`}
                >
                  <item.icon size={18} />
                </div>
                <div>
                  <h3
                    className="text-white font-semibold text-lg mb-0.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <span className={`text-xs font-mono ${item.color === "cyan" ? "text-cyan-400" : item.color === "blue" ? "text-blue-400" : "text-purple-400"}`}>
                    {item.metrics}
                  </span>
                </div>
              </div>
              <p className="text-white/45 text-sm leading-relaxed">{item.description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
