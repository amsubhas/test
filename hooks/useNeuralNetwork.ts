'use client';
// ─── useNeuralNetwork ─────────────────────────────────────────────────────────

import { useRef, useEffect, useCallback, useState } from 'react';
import type { NetworkEngine } from '@/lib/neural-network/NetworkEngine';

export interface UseNeuralNetworkOptions {
  containerRef:    React.RefObject<HTMLElement | null>;
  pauseWhenHidden?: boolean;
}

export interface UseNeuralNetworkReturn {
  canvasRef:       React.RefObject<HTMLCanvasElement | null>;
  fps:             number;
  triggerQuestion: () => void;
  triggerResponse: () => void;
}

export function useNeuralNetwork({
  containerRef,
  pauseWhenHidden = true,
}: UseNeuralNetworkOptions): UseNeuralNetworkReturn {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const engineRef  = useRef<NetworkEngine | null>(null);
  const [fps, setFps] = useState(60);

  // ─── Init engine after layout ─────────────────────────────────────────────
  // We wait for the canvas to have real dimensions before init().
  // Dynamic import keeps the heavy engine out of the initial bundle.
  useEffect(() => {
    let destroyed  = false;
    let engine: NetworkEngine | null = null;
    let initRafId: number | null = null;

    function tryInit(NetworkEngine: typeof import('@/lib/neural-network/NetworkEngine').NetworkEngine) {
      if (destroyed || !canvasRef.current) return;

      // ✅ BUG FIX: Wait until canvas has real layout dimensions
      const w = canvasRef.current.offsetWidth;
      const h = canvasRef.current.offsetHeight;

      if (w === 0 || h === 0) {
        // Not yet painted — retry next animation frame
        initRafId = requestAnimationFrame(() => tryInit(NetworkEngine));
        return;
      }

      engine = new NetworkEngine({
        canvas:      canvasRef.current,
        onFPSUpdate: (v) => setFps(Math.round(v)),
      });

      engine.init();
      engine.start();
      engineRef.current = engine;
    }

    import('@/lib/neural-network/NetworkEngine')
      .then(({ NetworkEngine }) => tryInit(NetworkEngine))
      .catch((err) => console.warn('[NeuralNetwork] Engine load failed:', err));

    return () => {
      destroyed = true;
      if (initRafId !== null) cancelAnimationFrame(initRafId);
      engine?.destroy();
      engineRef.current = null;
    };
  }, []);

  // ─── ResizeObserver — keeps canvas buffer in sync with CSS size ───────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      const eng = engineRef.current;
      if (!eng) return;
      eng.resize();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef]);

  // ─── Page visibility + IntersectionObserver ───────────────────────────────
  useEffect(() => {
    if (!pauseWhenHidden) return;

    const onVis = () => {
      if (document.hidden) engineRef.current?.pause();
      else                  engineRef.current?.resume();
    };
    document.addEventListener('visibilitychange', onVis);

    let io: IntersectionObserver | null = null;
    const container = containerRef.current;
    if (container) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) engineRef.current?.resume();
          else                       engineRef.current?.pause();
        },
        { threshold: 0.05 }
      );
      io.observe(container);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, [containerRef, pauseWhenHidden]);

  // ─── Mouse tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove  = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      engineRef.current?.setMouse(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onLeave = () => engineRef.current?.clearMouse();

    el.addEventListener('mousemove', onMove,  { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  // ─── NexBot event bridge ──────────────────────────────────────────────────
  useEffect(() => {
    const onQ = () => engineRef.current?.nexbotActivate('question');
    const onR = () => engineRef.current?.nexbotActivate('response');
    window.addEventListener('nexbot:question', onQ);
    window.addEventListener('nexbot:response', onR);
    return () => {
      window.removeEventListener('nexbot:question', onQ);
      window.removeEventListener('nexbot:response', onR);
    };
  }, []);

  const triggerQuestion = useCallback(() => engineRef.current?.nexbotActivate('question'), []);
  const triggerResponse = useCallback(() => engineRef.current?.nexbotActivate('response'), []);

  return { canvasRef, fps, triggerQuestion, triggerResponse };
}
