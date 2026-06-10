"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Globe, Award, Users, Briefcase, TrendingUp, Clock } from "lucide-react";

const metrics = [
  {
    icon: Briefcase,
    value: 200,
    suffix: "+",
    label: "Projects Delivered",
    description: "Across architecture, manufacturing, smart cities and defense",
    color: "#00f5ff",
  },
  {
    icon: Globe,
    value: 15,
    suffix: "+",
    label: "Countries Served",
    description: "Global delivery capability with local expertise",
    color: "#0066ff",
  },
  {
    icon: Users,
    value: 50,
    suffix: "+",
    label: "Enterprise Clients",
    description: "Trusted by industry leaders and government agencies",
    color: "#7b2fff",
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: "%",
    label: "Client Retention",
    description: "Our outcomes speak louder than any proposal",
    color: "#00f5ff",
  },
  {
    icon: Clock,
    value: 8,
    suffix: " yrs",
    label: "Industry Experience",
    description: "Consistently at the frontier of digital-physical transformation",
    color: "#0066ff",
  },
  {
    icon: Award,
    value: 30,
    suffix: "+",
    label: "Industry Awards",
    description: "Recognized for innovation, quality, and impact",
    color: "#7b2fff",
  },
];

export default function ImpactMetrics() {
  return (
    <section
      id="impact"
      className="section-padding relative overflow-hidden"
      aria-label="Global Impact Metrics"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/8 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/3 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel label="Global Impact" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Numbers That{" "}
            <span className="gradient-text-cyan">Define</span> Us
          </motion.h2>
        </div>

        {/* Metrics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass border border-white/5 p-8 hover:border-cyan-500/20 transition-all duration-300 group"
              style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center"
                  style={{
                    background: `${metric.color}10`,
                    border: `1px solid ${metric.color}25`,
                    color: metric.color,
                  }}
                >
                  <metric.icon size={20} />
                </div>
                <div
                  className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: metric.color }}
                />
              </div>

              <div
                className="text-5xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)", color: metric.color }}
              >
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                  duration={2200}
                />
              </div>

              <div
                className="text-white font-semibold text-lg mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {metric.label}
              </div>

              <p className="text-white/40 text-sm leading-relaxed">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Wide banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 glass border border-cyan-500/10 p-10 relative overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))" }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent" />
          <div className="relative z-10 text-center">
            <p
              className="text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;Every metric represents a problem solved, a vision realized, and a team empowered.&rdquo;
            </p>
            <p className="text-cyan-400/60 text-sm mt-4 terminal-text">— NexGiga Mission</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
