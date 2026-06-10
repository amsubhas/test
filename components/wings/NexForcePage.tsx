"use client";

import WingPageLayout from "./WingPageLayout";

const services = [
  {
    title: "Workforce Planning",
    description:
      "Strategic workforce architecture aligned with your business roadmap. Demand forecasting, capacity planning, and talent pipeline design.",
    icon: "🧠",
  },
  {
    title: "BOT Models",
    description:
      "Build-Operate-Transfer workforce solutions that scale rapidly. We deploy dedicated teams and transfer full operational ownership.",
    icon: "⚙️",
  },
  {
    title: "Managed Operations",
    description:
      "End-to-end operational management of workforce functions. SLA-driven delivery with full accountability and transparency.",
    icon: "📊",
  },
  {
    title: "Compliance Teams",
    description:
      "Regulatory-ready workforce with embedded compliance protocols. Labor law adherence, audit trails, and risk mitigation.",
    icon: "✅",
  },
  {
    title: "Industrial Staffing",
    description:
      "Specialized talent deployment for industrial and manufacturing environments. Skilled, semi-skilled, and supervisory roles.",
    icon: "🏭",
  },
  {
    title: "Project Resource Management",
    description:
      "Dedicated project teams for time-bound engagements. Resource allocation, utilization tracking, and outcome accountability.",
    icon: "🎯",
  },
];

export default function NexForcePage() {
  return (
    <WingPageLayout
      name="NexForce"
      tagline="Human Intelligence"
      hero="Workforce Intelligence at Scale"
      description="NexForce delivers the human capital architecture that powers enterprise transformation. From strategic workforce planning to full managed operations, we put the right people in the right roles at the right time."
      services={services}
      ctaLabel="Contact NexForce"
      primaryColor="#2563eb"
      glowColor="rgba(37,99,235,0.6)"
      gradient="linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa)"
      accentGradient="linear-gradient(135deg, #60a5fa, #2563eb, #93c5fd)"
      badge="Human Intelligence"
    />
  );
}
