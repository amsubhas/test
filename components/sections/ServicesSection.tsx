"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  Layers,
  Brain,
  Building2,
  Settings,
  Radio,
  FlaskConical,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    id: "bim",
    icon: Layers,
    title: "BIM & Digital Twin",
    subtitle: "Building Information Modeling",
    description:
      "We create intelligent, data-rich BIM models and living digital twins that serve as the single source of truth across your entire asset lifecycle — from design through demolition.",
    features: [
      "LOD 100–500 BIM Models",
      "4D/5D BIM Scheduling & Cost",
      "Clash Detection & Coordination",
      "Point Cloud to BIM (Scan-to-BIM)",
      "Digital Twin Implementation",
      "BIM for Facilities Management",
      "IFC / Open BIM Standards",
      "Revit, ArchiCAD, Navisworks",
    ],
    color: "#00f5ff",
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI & Machine Learning",
    subtitle: "Intelligent Systems",
    description:
      "Deploy AI that doesn't just process data — it understands it. Our ML pipelines, computer vision systems, and NLP solutions bring genuine intelligence to your operations.",
    features: [
      "Predictive Analytics",
      "Computer Vision Systems",
      "Natural Language Processing",
      "Generative AI Integration",
      "Anomaly Detection",
      "AI-Powered Quality Control",
      "Recommendation Engines",
      "LLM Fine-tuning & Deployment",
    ],
    color: "#0066ff",
  },
  {
    id: "infra",
    icon: Building2,
    title: "Smart Infrastructure",
    subtitle: "Connected Physical Systems",
    description:
      "Design, simulate, and deploy infrastructure that thinks. From smart roads to intelligent grids, we engineer physical systems with embedded digital intelligence.",
    features: [
      "Smart City Planning",
      "IoT Sensor Networks",
      "Traffic Management Systems",
      "Smart Grid Integration",
      "Structural Health Monitoring",
      "GIS & Geospatial Analysis",
      "Infrastructure Digital Twins",
      "Utility Network Management",
    ],
    color: "#7b2fff",
  },
  {
    id: "robotics",
    icon: Settings,
    title: "Robotics & Automation",
    subtitle: "Intelligent Physical Agents",
    description:
      "From industrial robotic arms to autonomous inspection drones, we design, program, and deploy robotic systems that operate with precision, adaptability, and intelligence.",
    features: [
      "Industrial Robot Programming",
      "Autonomous Mobile Robots",
      "Drone Inspection Systems",
      "Collaborative Robotics (Cobots)",
      "Process Automation",
      "Vision-Guided Robotics",
      "Robot Simulation & Testing",
      "ROS / ROS2 Development",
    ],
    color: "#00ccee",
  },
  {
    id: "simulation",
    icon: FlaskConical,
    title: "Simulation & Analysis",
    subtitle: "Test Before You Build",
    description:
      "Reduce risk and cost with high-fidelity simulations. We model structural performance, fluid dynamics, thermal behavior, and complex system interactions before a single component is manufactured.",
    features: [
      "FEA Structural Analysis",
      "CFD Fluid Dynamics",
      "Thermal & Energy Simulation",
      "Multi-physics Simulation",
      "Discrete Event Simulation",
      "Monte Carlo Risk Analysis",
      "Real-time Physics Engines",
      "ANSYS, MATLAB, OpenFOAM",
    ],
    color: "#ff6b00",
  },
  {
    id: "iot",
    icon: Radio,
    title: "IoT & Edge Computing",
    subtitle: "Connected Intelligence",
    description:
      "Bridge physical and digital with intelligent sensor networks, edge processors, and real-time data pipelines. We turn raw sensor data into actionable operational intelligence.",
    features: [
      "IoT Architecture Design",
      "Edge Computing Deployment",
      "MQTT / OPC-UA Protocols",
      "Industrial IoT (IIoT)",
      "Real-time Dashboards",
      "Predictive Maintenance",
      "Asset Tracking Systems",
      "SCADA & PLC Integration",
    ],
    color: "#00eeff",
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState(services[0]);

  return (
    <section
      id="services"
      className="section-padding relative overflow-hidden"
      aria-label="NexGiga Services"
    >
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel label="What We Do" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="heading-xl text-4xl md:text-5xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Services That{" "}
            <span className="gradient-text-cyan">Redefine</span>
            <br />
            What&apos;s Possible
          </motion.h2>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-5 gap-8 min-h-[500px]">
          {/* Left: service list */}
          <div className="lg:col-span-2 space-y-2">
            {services.map((service, i) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setActive(service)}
                className={`w-full text-left p-4 border transition-all duration-300 flex items-center gap-4 group ${
                  active.id === service.id
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : "border-white/5 hover:border-white/10 hover:bg-white/2"
                }`}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                }}
              >
                <div
                  className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300`}
                  style={{
                    background: active.id === service.id ? `${service.color}20` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active.id === service.id ? service.color + "40" : "rgba(255,255,255,0.08)"}`,
                    color: active.id === service.id ? service.color : "rgba(255,255,255,0.4)",
                  }}
                >
                  <service.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-sm transition-colors ${active.id === service.id ? "text-white" : "text-white/60"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {service.title}
                  </div>
                  <div className="text-xs text-white/30">{service.subtitle}</div>
                </div>
                <ChevronRight
                  size={14}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    active.id === service.id ? "text-cyan-400 translate-x-0" : "text-white/20 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full glass border border-white/5 p-8 relative"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
                }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: active.color }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: `${active.color}40` }} />

                {/* Service header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: `${active.color}15`, border: `1px solid ${active.color}30`, color: active.color }}
                  >
                    <active.icon size={24} />
                  </div>
                  <div>
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-display)", color: active.color }}
                    >
                      {active.title}
                    </h3>
                    <div className="text-xs text-white/40" style={{ fontFamily: "var(--font-mono)" }}>
                      {active.subtitle}
                    </div>
                  </div>
                </div>

                <p className="text-white/55 leading-relaxed mb-8">{active.description}</p>

                {/* Feature list */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {active.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: active.color }}
                      />
                      <span className="text-white/50 text-xs">{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold group"
                  style={{ color: active.color, fontFamily: "var(--font-display)" }}
                >
                  Discuss this service
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
