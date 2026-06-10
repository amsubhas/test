import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
// Client wrapper handles ssr:false for Three.js — cannot use ssr:false in a Server Component
import DigitalTwinCityClient from "@/components/DigitalTwinCityClient";

// ── All below-fold sections: next/dynamic for proper App Router lazy loading
const TransformationJourney  = dynamic(() => import("@/components/sections/TransformationJourney"));
const DigitalTwinEcosystem   = dynamic(() => import("@/components/sections/DigitalTwinEcosystem"));
const IdeaToRealitySection   = dynamic(() => import("@/components/idea-to-reality/IdeaToRealitySection"));
const ServicesSection        = dynamic(() => import("@/components/sections/ServicesSection"));
const IndustrySolutions      = dynamic(() => import("@/components/sections/IndustrySolutions"));
const BuildmateShowcase      = dynamic(() => import("@/components/sections/BuildmateShowcase"));
const FutureTechnologies     = dynamic(() => import("@/components/sections/FutureTechnologies"));
const ImpactMetrics          = dynamic(() => import("@/components/sections/ImpactMetrics"));
const SuccessStories         = dynamic(() => import("@/components/sections/SuccessStories"));
const TimelineSection        = dynamic(() => import("@/components/sections/TimelineSection"));
const ContactSection         = dynamic(() => import("@/components/sections/ContactSection"));

// Minimal placeholder shown while a section's JS loads
function SectionSkeleton() {
  return (
    <div
      style={{ minHeight: "40px", background: "transparent" }}
      aria-hidden="true"
    />
  );
}

export default function Home() {
  return (
    <>
      {/* Hero renders immediately — no Suspense wrapper */}
      <HeroSection />

      {/* Digital Twin City — client-only (Three.js/R3F, no SSR) */}
      <Suspense fallback={<SectionSkeleton />}>
        <DigitalTwinCityClient />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TransformationJourney />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <DigitalTwinEcosystem />
      </Suspense>

      {/* ── Idea-to-Reality Simulator — placed immediately below Digital Twin ── */}
      <Suspense fallback={<SectionSkeleton />}>
        <IdeaToRealitySection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <IndustrySolutions />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BuildmateShowcase />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FutureTechnologies />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ImpactMetrics />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SuccessStories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TimelineSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>
    </>
  );
}
