"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const stories = [
  {
    id: 1,
    category: "Smart Infrastructure",
    title: "Urban Mobility Twin — Municipal Corporation",
    outcome: "Reduced traffic congestion by 34% across 12 key corridors",
    challenge:
      "A tier-1 Indian city needed to coordinate traffic signals, emergency routing, and public transport across 200+ intersections with zero central intelligence.",
    solution:
      "We deployed a city-scale digital twin integrating IoT sensors, AI signal optimization, and real-time public transport data into a unified operations center.",
    metrics: [
      { label: "Congestion reduction", value: "34%" },
      { label: "Emergency response", value: "-40% ETA" },
      { label: "Fuel savings", value: "₹12Cr/year" },
    ],
    quote:
      "NexGiga delivered what seemed impossible — a living, breathing intelligence layer over our entire city.",
    author: "Director of Urban Planning",
  },
  {
    id: 2,
    category: "Manufacturing",
    title: "Smart Factory Digital Twin — Industrial Manufacturer",
    outcome: "Eliminated 80% of unplanned downtime within 6 months",
    challenge:
      "A high-volume manufacturer was losing ₹3Cr monthly to unexpected equipment failures across 14 production lines.",
    solution:
      "We implemented a factory digital twin with predictive maintenance AI, real-time sensor fusion, and automated work order generation on failure prediction.",
    metrics: [
      { label: "Downtime reduction", value: "80%" },
      { label: "Monthly savings", value: "₹3Cr" },
      { label: "OEE improvement", value: "+22%" },
    ],
    quote:
      "The ROI was visible in the first quarter. The digital twin paid for itself four times over in year one.",
    author: "VP Operations",
  },
  {
    id: 3,
    category: "Architecture & BIM",
    title: "Mega Mixed-Use BIM Coordination — Real Estate Developer",
    outcome: "Zero construction-phase clashes on a 1.2 million sqft development",
    challenge:
      "A complex mixed-use high-rise with 400+ trade contractors required flawless coordination across structural, MEP, facade, and interior systems.",
    solution:
      "We developed LOD 400 federated BIM models, conducted weekly clash detection cycles, and maintained a live digital twin throughout construction for proactive conflict resolution.",
    metrics: [
      { label: "Clash-free delivery", value: "100%" },
      { label: "RFI reduction", value: "65%" },
      { label: "Timeline savings", value: "4 months" },
    ],
    quote:
      "This was the most coordinated construction project our firm has ever executed. NexGiga&apos;s BIM discipline was extraordinary.",
    author: "Project Director",
  },
];

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + stories.length) % stories.length);
  const next = () => setCurrent((i) => (i + 1) % stories.length);

  const story = stories[current];

  return (
    <section
      id="stories"
      className="section-padding relative overflow-hidden"
      aria-label="Success Stories"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <SectionLabel label="Case Studies" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-xl text-4xl md:text-5xl text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real Outcomes,{" "}
              <span className="gradient-text-cyan">Real Impact</span>
            </motion.h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 glass border border-white/10 hover:border-cyan-500/30 flex items-center justify-center text-white/50 hover:text-cyan-400 transition-all"
              aria-label="Previous story"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-white/30" style={{ fontFamily: "var(--font-mono)" }}>
              {String(current + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
            </span>
            <button
              onClick={next}
              className="w-10 h-10 glass border border-white/10 hover:border-cyan-500/30 flex items-center justify-center text-white/50 hover:text-cyan-400 transition-all"
              aria-label="Next story"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Story panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Main info */}
            <div className="lg:col-span-2">
              <div
                className="glass border border-cyan-500/10 p-8 h-full relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className="text-xs text-cyan-400 tracking-widest uppercase mb-2 block"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {story.category}
                    </span>
                    <h3
                      className="text-xl md:text-2xl font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {story.title}
                    </h3>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-cyan-400 font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    OUTCOME
                  </p>
                  <p className="text-white/80">{story.outcome}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Challenge</p>
                    <p className="text-white/55 text-sm leading-relaxed">{story.challenge}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Solution</p>
                    <p className="text-white/55 text-sm leading-relaxed">{story.solution}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="border-l-2 border-cyan-500/30 pl-4">
                  <Quote size={16} className="text-cyan-400/40 mb-2" />
                  <p className="text-white/60 text-sm italic mb-1">{story.quote}</p>
                  <p className="text-cyan-400/50 text-xs">{story.author}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {story.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass border border-cyan-500/8 p-6"
                  style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
                >
                  <div
                    className="text-3xl font-bold text-cyan-400 mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-white/50 text-sm">{m.label}</div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-6 border border-white/5 bg-white/2"
              >
                <p className="text-white/30 text-xs mb-3">Want similar results?</p>
                <a href="#contact" className="btn-primary text-xs py-2.5 px-4 block text-center">
                  Discuss Your Project
                </a>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-0.5 transition-all duration-300 ${i === current ? "w-8 bg-cyan-400" : "w-4 bg-white/20"}`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
