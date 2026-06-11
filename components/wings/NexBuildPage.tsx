'use client';

import WingPageLayout from './WingPageLayout';
import BuildmateShowcase from '@/components/sections/BuildmateShowcase';
import DigitalTwinEcosystem from '@/components/sections/DigitalTwinEcosystem';

const services = [
  {
    title: 'BIM Modelling — LOD 100–500',
    description:
      'Precision Building Information Models from concept massing through as-built documentation. Federated models, LOD-compliant deliverables, and full IFC export for any platform.',
    icon: '🏗️',
  },
  {
    title: '4D & 5D BIM',
    description:
      'Time-linked 4D sequencing and cost-linked 5D models that connect your schedule and budget to every element — enabling proactive project control.',
    icon: '📅',
  },
  {
    title: 'Clash Detection & Coordination',
    description:
      'Automated multi-discipline clash detection using Navisworks and Solibri. Structured coordination workflows that eliminate costly site conflicts before they happen.',
    icon: '🔍',
  },
  {
    title: 'Digital Twin Implementation',
    description:
      'Transform your completed BIM model into a living digital twin. Real-time sensor integration, FM handover packages, and IoT-connected asset management post-completion.',
    icon: '🌐',
  },
  {
    title: 'Scan-to-BIM',
    description:
      'Laser scan and point cloud processing to create accurate BIM models of existing structures. Heritage buildings, retrofit projects, and as-built verification.',
    icon: '📡',
  },
  {
    title: 'Smart Infrastructure & Cities',
    description:
      'Urban digital twin platforms, smart building automation systems, energy management modelling, and master-plan simulation for city-scale infrastructure projects.',
    icon: '🏙️',
  },
];

export default function NexBuildPage() {
  return (
    <>
      <WingPageLayout
        name="NexBuild"
        tagline="Smart Construction"
        hero="Build Smarter. Deliver Faster."
        description="NexGiga's smart construction wing — delivering precision BIM, digital twin implementation, clash detection, and the BuildMate platform for end-to-end construction management across every project phase."
        services={services}
        ctaLabel="Contact NexBuild"
        primaryColor="#00cc88"
        glowColor="rgba(0,204,136,0.6)"
        gradient="linear-gradient(135deg, #00cc88, #00f5aa, #00e5cc)"
        accentGradient="linear-gradient(135deg, #00e5cc, #00cc88, #00f5aa)"
        badge="Smart Construction"
      />
      <BuildmateShowcase />
      <DigitalTwinEcosystem />
    </>
  );
}
