'use client';

/**
 * DigitalTwinCityClient — Server-safe, mobile-aware wrapper
 *
 * • ssr: false  — R3F requires browser APIs (WebGL, window)
 * • IntersectionObserver — only mounts 3D when in viewport (saves mobile GPU)
 * • Mobile fallback — devices <768px get a static poster to protect battery
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import { motion } from 'framer-motion';

const DigitalTwinCity = dynamic(() => import('@/components/DigitalTwinCity'), {
  ssr:     false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-label="Loading Digital Twin City"
    >
      <div className="text-[#00f5ff]/30 text-xs font-mono tracking-widest animate-pulse">
        INITIALISING DIGITAL TWIN...
      </div>
    </div>
  ),
});

// Static gradient poster — shown on mobile instead of heavy WebGL
function TwinPoster() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,245,255,0.06) 0%, rgba(0,102,255,0.04) 40%, transparent 70%)',
        }}
      />
      {/* Static city silhouette via CSS */}
      <div className="relative w-full max-w-sm mx-auto px-8">
        {[40, 70, 55, 90, 65, 45, 80, 50].map((h, i) => (
          <div
            key={i}
            className="inline-block mx-0.5 align-bottom rounded-sm"
            style={{
              height:     h,
              width:      24 + (i % 3) * 8,
              background: `rgba(0,${150 + i * 10},${200 + i * 5},${0.12 + i * 0.02})`,
              border:     '1px solid rgba(0,245,255,0.08)',
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-white/25 text-xs font-mono tracking-wider">
        Digital Twin City · Interactive on Desktop
      </p>
    </div>
  );
}

export default function DigitalTwinCityClient() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const [inView,    setInView]    = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || isMobile) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, rootMargin: '200px' }
    );
    io.observe(wrapperRef.current);
    return () => io.disconnect();
  }, [isMobile]);

  return (
    <section
      id="digital-twin-city"
      className="section-padding relative overflow-hidden"
      aria-label="Digital Twin City — interactive 3D visualization"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <SectionLabel label="Digital Twin City" />
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#0066ff]">
              Living Digital Twin
            </span>
            {' '}Experience
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            An interactive, real-time city simulation — powered by the same technology NexGiga
            deploys for smart infrastructure, urban planning, and industrial IoT clients.
          </p>
        </motion.div>

        {/* Canvas wrapper */}
        <motion.div
          ref={wrapperRef}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative w-full overflow-hidden rounded-2xl border border-white/8"
          style={{
            height:     isMobile ? 340 : 600,
            background: 'rgba(1,5,8,0.6)',
          }}
        >
          {isMobile ? (
            <TwinPoster />
          ) : inView ? (
            <DigitalTwinCity />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-[#00f5ff]/20 text-xs font-mono tracking-widest">
                LOADING TWIN ENVIRONMENT...
              </div>
            </div>
          )}

          {/* HUD overlay — only on desktop */}
          {!isMobile && (
            <div className="absolute top-4 left-4 font-mono text-[10px] text-[#00f5ff]/40 space-y-0.5 pointer-events-none" aria-hidden="true">
              <div>TWIN_ID: NGC-DTW-001</div>
              <div>STATUS: <span className="text-green-400/70">SYNCHRONISED</span></div>
              <div>DISTRICTS: 8 ACTIVE</div>
            </div>
          )}
          {!isMobile && (
            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#00f5ff]/30 text-right pointer-events-none" aria-hidden="true">
              <div>LOD: ADAPTIVE</div>
              <div>ENGINE: R3F v8</div>
            </div>
          )}
        </motion.div>

        {/* Caption */}
        <p className="text-center text-white/25 text-xs mt-4 font-mono tracking-wider">
          Interact with the city · Hover districts · Explore NexGiga's digital twin technology
        </p>
      </div>
    </section>
  );
}
