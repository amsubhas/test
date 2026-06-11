import { Suspense, lazy } from "react";
import HeroSection from "@/components/sections/HeroSection";
import WingsStrip from "@/components/sections/WingsStrip";
import IndustrySolutions from "@/components/sections/IndustrySolutions";
import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";

// Code-split the heavy interactive sections
const DigitalTwinCityClient = lazy(
  () => import("@/components/DigitalTwinCityClient")
);
const IdeaToRealitySection = lazy(
  () => import("@/components/idea-to-reality/IdeaToRealitySection")
);

export const metadata: Metadata = {
  title: "NexGiga | Transforming Digital Intelligence Into Physical Reality",
  description:
    "NexGiga bridges the digital and physical worlds — BIM, AI, robotics, simulation and smart infrastructure. Four wings: NexForce, NexTech, NexDesign, NexBuild.",
  alternates: { canonical: "https://nexgiga.sharvasit.in" },
};

// ─── Loading skeletons ────────────────────────────────────────────────────────
function TwinSkeleton() {
  return (
    <div
      className="w-full"
      style={{ height: "80vh", background: "rgba(1,5,8,0.8)" }}
      aria-hidden="true"
    />
  );
}

function SimulatorSkeleton() {
  return (
    <div
      className="w-full"
      style={{ height: 500, background: "transparent" }}
      aria-hidden="true"
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* 1. Hero — neural network background, tagline, CTA */}
      <HeroSection />

      {/* 2. Four wings — compact conversion-driving overview */}
      <WingsStrip />

      {/* 3. Digital Twin City — the flagship visual centerpiece */}
      <Suspense fallback={<TwinSkeleton />}>
        <DigitalTwinCityClient />
      </Suspense>

      {/* 4. Idea-to-Reality Simulator — interactive AI demo */}
      <Suspense fallback={<SimulatorSkeleton />}>
        <IdeaToRealitySection />
      </Suspense>

      {/* 5. Industry Solutions — 6 verticals, conversion intent */}
      <IndustrySolutions />

      {/* 6. Contact CTA — final conversion action */}
      <ContactSection />
    </>
  );
}
