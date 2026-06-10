"use client";

import WingPageLayout from "./WingPageLayout";

// Content aligned with NexDesign's positioning in DigitalTwinCity:
// Creative Design Studio — brand identity, UI/UX, motion design,
// 3D visualisation, immersive experiences, spatial computing

const services = [
  {
    title: "Brand Identity & Strategy",
    description:
      "Comprehensive brand systems built for the digital era — visual identity, motion guidelines, design tokens, and brand strategy that differentiates in competitive markets.",
    icon: "✦",
  },
  {
    title: "UI/UX & Product Design",
    description:
      "Human-centred interface design from research through high-fidelity prototypes. Complex enterprise products, B2C apps, and design systems at any scale.",
    icon: "🖥️",
  },
  {
    title: "3D Visualisation & Rendering",
    description:
      "Photorealistic architectural visualisations, product renders, and real-time 3D experiences. WebGL, Three.js, and Unreal Engine for interactive showcases.",
    icon: "🎨",
  },
  {
    title: "Motion Design & Animation",
    description:
      "Purposeful motion — interface micro-interactions, brand films, explainer animations, and immersive digital installations that bring ideas to life.",
    icon: "🌀",
  },
  {
    title: "Immersive & Spatial Experiences",
    description:
      "Augmented reality, virtual reality, and mixed reality experiences. Digital showrooms, AR product configurators, and spatial computing interfaces for enterprise.",
    icon: "🔮",
  },
  {
    title: "Design Systems & Handoff",
    description:
      "Scalable component libraries, Figma design systems, token-based theming, and engineering-ready handoffs that bridge design intent and development reality.",
    icon: "⚙️",
  },
];

export default function NexDesignPage() {
  return (
    <WingPageLayout
      name="NexDesign"
      tagline="Creative Intelligence Studio"
      hero="Where Imagination Meets Execution"
      description="NexDesign is NexGiga's creative intelligence wing — engineering transcendent experiences at the frontier of design, technology, and human perception. From brand identity and UI/UX to 3D visualisation and immersive spatial experiences, we turn ideas into products people love."
      services={services}
      ctaLabel="Contact NexDesign"
      primaryColor="#059669"
      glowColor="rgba(5,150,105,0.6)"
      gradient="linear-gradient(135deg, #059669, #10b981, #047857)"
      accentGradient="linear-gradient(135deg, #34d399, #059669, #065f46)"
      badge="Creative · Design · Immersive"
    />
  );
}
