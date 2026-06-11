"use client";

import WingPageLayout from "./WingPageLayout";

// Content aligned with NexTech's positioning in DigitalTwinCity:
// AI, Robotics, IoT, Simulation, Machine Learning, Digital Twins

const services = [
  {
    title: "AI & Machine Learning Systems",
    description:
      "Custom AI models and machine-learning pipelines designed for industrial and enterprise environments — predictive maintenance, anomaly detection, computer vision, and NLP.",
    icon: "🧠",
  },
  {
    title: "IoT & Edge Computing",
    description:
      "End-to-end IoT ecosystems from sensor hardware to cloud ingestion. Real-time monitoring, edge inference, and digital thread connectivity across physical assets.",
    icon: "📡",
  },
  {
    title: "Robotics & Automation",
    description:
      "Industrial robotics integration, collaborative robot (cobot) deployment, and autonomous mobile robot (AMR) fleet orchestration for manufacturing and warehousing environments.",
    icon: "🤖",
  },
  {
    title: "Digital Twins & Simulation",
    description:
      "High-fidelity digital twin models that mirror physical assets in real time. Scenario simulation for risk analysis, process optimisation, and predictive operations.",
    icon: "🌐",
  },
  {
    title: "Smart Infrastructure",
    description:
      "Connected building systems, intelligent traffic management, smart energy grids, and urban sensor networks underpinned by Industry 4.0 protocols.",
    icon: "🏙️",
  },
  {
    title: "AI Model Deployment & MLOps",
    description:
      "Production-grade model deployment, monitoring, retraining pipelines, and governance frameworks to keep AI performing reliably at scale.",
    icon: "⚙️",
  },
];

export default function NexTechPage() {
  return (
    <WingPageLayout
      name="NexTech"
      tagline="Intelligence Wing"
      hero="Engineering the Intelligent World"
      description="NexTech is NexGiga's AI, Robotics & IoT wing — deploying machine intelligence into the physical world. From predictive AI models and smart sensor networks to industrial robotics and digital twins, we build systems that turn data into autonomous, real-world action."
      services={services}
      ctaLabel="Contact NexTech"
      primaryColor="#0066ff"
      glowColor="rgba(0,102,255,0.6)"
      gradient="linear-gradient(135deg, #0066ff, #00f5ff, #38bdf8)"
      accentGradient="linear-gradient(135deg, #00f5ff, #0066ff, #7dd3fc)"
      badge="AI · Robotics · IoT"
    />
  );
}
