'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, Cpu, Palette, Building2, ArrowRight } from 'lucide-react';

const WINGS = [
  {
    href:        '/nexforce',
    icon:        Users,
    name:        'NexForce',
    tagline:     'Human Intelligence',
    description: 'Elite technology staffing, AI engineers, BIM specialists & global workforce solutions across 15+ countries.',
    accent:      '#00f5ff',
    gradient:    'from-cyan-500/10 to-cyan-500/0',
    border:      'hover:border-cyan-500/40',
  },
  {
    href:        '/nextech',
    icon:        Cpu,
    name:        'NexTech',
    tagline:     'Phygital Bridge',
    description: 'AI & ML, robotics & automation, IoT edge computing, and physics-based simulation for Industry 4.0.',
    accent:      '#0066ff',
    gradient:    'from-blue-500/10 to-blue-500/0',
    border:      'hover:border-blue-500/40',
  },
  {
    href:        '/nexdesign',
    icon:        Palette,
    name:        'NexDesign',
    tagline:     'Design Intelligence',
    description: 'Brand identity, UI/UX, architectural visualization, AR/VR experiences & motion design.',
    accent:      '#7b2fff',
    gradient:    'from-purple-500/10 to-purple-500/0',
    border:      'hover:border-purple-500/40',
  },
  {
    href:        '/nexbuild',
    icon:        Building2,
    name:        'NexBuild',
    tagline:     'Smart Construction',
    description: 'LOD 100–500 BIM, digital twin implementation, clash detection & the BuildMate platform.',
    accent:      '#00cc88',
    gradient:    'from-emerald-500/10 to-emerald-500/0',
    border:      'hover:border-emerald-500/40',
  },
] as const;

const METRICS = [
  { value: '200+', label: 'Projects' },
  { value: '15+',  label: 'Countries' },
  { value: '50+',  label: 'AI Models' },
  { value: '98%',  label: 'Retention' },
] as const;

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function WingsStrip() {
  return (
    <section
      id="wings"
      className="section-padding relative overflow-hidden"
      aria-label="NexGiga Service Wings"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,102,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#00f5ff] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Four Wings · One Ecosystem
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The Complete Digital{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#0066ff]">
              Transformation Stack
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            One ecosystem. Four specialized wings. End-to-end capability from workforce to AI to design to construction.
          </p>
        </motion.div>

        {/* Wing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {WINGS.map((wing, i) => {
            const Icon = wing.icon;
            return (
              <motion.div
                key={wing.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Link
                  href={wing.href}
                  className={`group flex flex-col h-full p-6 rounded-2xl border border-white/8 bg-gradient-to-b ${wing.gradient} ${wing.border} transition-all duration-300 hover:-translate-y-1`}
                  aria-label={`Explore ${wing.name} — ${wing.tagline}`}
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${wing.accent}18`, border: `1px solid ${wing.accent}30` }}
                  >
                    <Icon size={20} style={{ color: wing.accent }} />
                  </div>

                  {/* Text */}
                  <p className="text-[10px] font-semibold tracking-widest uppercase mb-1"
                     style={{ color: wing.accent }}>
                    {wing.tagline}
                  </p>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {wing.name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">
                    {wing.description}
                  </p>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1.5 mt-5 text-xs font-semibold transition-colors duration-200 group-hover:gap-2.5"
                    style={{ color: wing.accent }}
                  >
                    Explore
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/8"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <span
                className="text-3xl font-bold tracking-tight mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg, #00f5ff, #0066ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {m.value}
              </span>
              <span className="text-white/40 text-xs font-medium tracking-wide uppercase">{m.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
