'use client';

import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import GlowCard from '@/components/ui/GlowCard';
import { Building2, Factory, Zap, Network, TreePine, Layers } from 'lucide-react';

const ecosystemItems = [
  {
    icon: Building2,
    title: 'Smart Buildings',
    description: 'Real-time digital replicas enabling predictive maintenance, energy optimisation, and automated facilities management.',
    metrics: '40% energy saved',
    color: 'cyan',
  },
  {
    icon: Factory,
    title: 'Intelligent Factories',
    description: 'Mirror your production line digitally. Simulate changes before implementation, eliminate downtime, maximise throughput.',
    metrics: '60% less downtime',
    color: 'blue',
  },
  {
    icon: Network,
    title: 'Smart City Infrastructure',
    description: 'Connect traffic, utilities, emergency services — into one coherent, responsive digital intelligence layer.',
    metrics: '30% operational savings',
    color: 'purple',
  },
  {
    icon: Zap,
    title: 'Energy & Utilities',
    description: 'Model your grid, pipeline, or renewable asset. Predict failures, optimise distribution, and ensure zero-disruption operations.',
    metrics: '99.9% uptime',
    color: 'cyan',
  },
  {
    icon: TreePine,
    title: 'Environmental Systems',
    description: 'Simulate and manage ecological impact. Monitor carbon footprint, model climate scenarios, and drive sustainability goals.',
    metrics: 'Carbon neutral pathways',
    color: 'blue',
  },
  {
    icon: Layers,
    title: 'Multi-Domain Integration',
    description: 'Unify disparate systems into a single federated digital twin. Break data silos and achieve true system-of-systems intelligence.',
    metrics: 'Unified intelligence',
    color: 'purple',
  },
];

export default function DigitalTwinEcosystem() {
  return (
    <section
      id="digital-twin-ecosystem"
      className="section-padding relative overflow-hidden"
      aria-label="Digital Twin Ecosystem"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel label="Digital Twin Ecosystem" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your World,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#0066ff]">
              Mirrored
            </span>{' '}
            in Digital Space
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Living, breathing replicas of your physical assets — capturing real-time data,
            running simulations, and enabling decisions that were previously impossible.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemItems.map((item, i) => (
            <GlowCard key={item.title} delay={i * 0.08} glowColor={item.color} className="p-7">
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center border rounded-lg flex-shrink-0 ${
                    item.color === 'cyan'
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                      : item.color === 'blue'
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      : 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                  }`}
                >
                  <item.icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </h3>
                  <span className={`text-xs font-mono ${item.color === 'cyan' ? 'text-cyan-400' : item.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
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
