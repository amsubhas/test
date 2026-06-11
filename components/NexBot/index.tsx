'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import NexBotCharacter from './NexBotCharacter';
import NexBotPanel from './NexBotPanel';
import type { NexBotAnimState, BotResponse } from '@/lib/nexbot/types';
import { WALKING_HINTS } from '@/lib/nexbot/knowledge';
import { GUIDED_TOUR_STOPS } from '@/lib/nexbot/navigationMap';

// ─── Constants ─────────────────────────────────────────────────────────────────
const ROBOT_W           = 90;
const WALK_SPEED        = 65;
const HINT_INTERVAL     = 18000;
const HINT_DURATION     = 4500;
const WAVE_INTERVAL     = 45000;
const IDLE_PAUSE        = 2200;
const HIGHLIGHT_DURATION= 4500;
const SCROLL_SETTLE_MS  = 680; // time to wait after scrollToSection before highlighting

// ─── Scroll to element ─────────────────────────────────────────────────────────
function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ─── Highlight overlay — FIXED positioning fix ────────────────────────────────
// Uses position:fixed, so top/left must be viewport-relative (NOT +scrollY)
function highlightElements(selectors: string[]) {
  const overlays: HTMLElement[] = [];

  selectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    // Guard: element must be at least partially in viewport
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const overlay = document.createElement('div');
    // position:fixed → top/left are viewport coords (rect.top, rect.left) — no scrollY added
    overlay.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #00f5ff;
      border-radius: 12px;
      box-shadow: 0 0 0 4px rgba(0,245,255,0.15), inset 0 0 30px rgba(0,245,255,0.05);
      pointer-events: none;
      z-index: 9000;
      animation: nexbotPulse 1s ease-in-out infinite alternate;
    `;
    document.body.appendChild(overlay);
    overlays.push(overlay);
  });

  // Inject pulse keyframes once
  if (!document.getElementById('nexbot-highlight-style')) {
    const style = document.createElement('style');
    style.id = 'nexbot-highlight-style';
    style.textContent = `
      @keyframes nexbotPulse {
        from { box-shadow: 0 0 0 4px rgba(0,245,255,0.15), inset 0 0 30px rgba(0,245,255,0.05); }
        to   { box-shadow: 0 0 0 8px rgba(0,245,255,0.28), inset 0 0 40px rgba(0,245,255,0.10); }
      }
    `;
    document.body.appendChild(style);
  }

  setTimeout(() => overlays.forEach((o) => o.remove()), HIGHLIGHT_DURATION);
}

export default function NexBot() {
  const router   = useRouter();
  const pathname = usePathname();

  // ── State ───────────────────────────────────────────────────────────────────
  const [isOpen,       setIsOpen]       = useState(false);
  const [animState,    setAnimState]    = useState<NexBotAnimState>('walking-right');
  const [hint,         setHint]         = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
  const [panelSide,    setPanelSide]    = useState<'left' | 'right'>('right');
  const [isTourActive, setIsTourActive] = useState(false);
  const [hasGreeted,   setHasGreeted]   = useState(false);
  // Tour narration — injected into NexBotPanel as an assistant message
  const [tourMessage,  setTourMessage]  = useState<string>('');

  // ── Refs ────────────────────────────────────────────────────────────────────
  const robotRef      = useRef<HTMLDivElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const posRef        = useRef(-ROBOT_W);
  const dirRef        = useRef<1 | -1>(1);
  const walkRafRef    = useRef<number>();
  const lastTimeRef   = useRef<number>();
  const hintTimerRef  = useRef<ReturnType<typeof setTimeout>>();
  const waveTimerRef  = useRef<ReturnType<typeof setTimeout>>();
  const isPausedRef   = useRef(false);
  const tourActiveRef = useRef(false);

  // ─── Walking loop ─────────────────────────────────────────────────────────
  const walkLoop = useCallback((timestamp: number) => {
    if (!robotRef.current || isPausedRef.current || document.hidden) {
      walkRafRef.current = requestAnimationFrame(walkLoop);
      return;
    }

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    posRef.current += WALK_SPEED * dirRef.current * dt;
    const vw = window.innerWidth;

    if (posRef.current > vw + ROBOT_W * 0.5) {
      posRef.current = vw + ROBOT_W * 0.5;
      dirRef.current = -1;
      setPanelSide('left');
      isPausedRef.current = true;
      setAnimState('idle');
      setTimeout(() => {
        if (!isOpen) { isPausedRef.current = false; setAnimState('walking-left'); }
      }, IDLE_PAUSE);
    } else if (posRef.current < -ROBOT_W * 0.5) {
      posRef.current = -ROBOT_W * 0.5;
      dirRef.current = 1;
      setPanelSide('right');
      isPausedRef.current = true;
      setAnimState('idle');
      setTimeout(() => {
        if (!isOpen) { isPausedRef.current = false; setAnimState('walking-right'); }
      }, IDLE_PAUSE);
    }

    setPanelSide(posRef.current > window.innerWidth / 2 ? 'left' : 'right');

    const flip = dirRef.current === -1 ? -1 : 1;
    if (robotRef.current) {
      robotRef.current.style.transform = `translateX(${posRef.current}px) scaleX(${flip})`;
    }
    walkRafRef.current = requestAnimationFrame(walkLoop);
  }, [isOpen]);

  // Start / stop walking
  useEffect(() => {
    if (isOpen) {
      if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
      lastTimeRef.current = undefined;
      return;
    }
    if (robotRef.current) {
      const flip = dirRef.current === -1 ? -1 : 1;
      robotRef.current.style.transform = `translateX(${posRef.current}px) scaleX(${flip})`;
    }
    isPausedRef.current = false;
    setAnimState(dirRef.current === 1 ? 'walking-right' : 'walking-left');
    lastTimeRef.current = undefined;
    walkRafRef.current = requestAnimationFrame(walkLoop);
    return () => { if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current); };
  }, [isOpen, walkLoop]);

  // ─── Hint bubbles ──────────────────────────────────────────────────────────
  const showHint = useCallback(() => {
    if (isOpen) return;
    const text = WALKING_HINTS[Math.floor(Math.random() * WALKING_HINTS.length)];
    setHint({ text, visible: true });
    setTimeout(() => setHint((h) => ({ ...h, visible: false })), HINT_DURATION);
  }, [isOpen]);

  useEffect(() => {
    const initial = setTimeout(showHint, 8000);
    hintTimerRef.current = setInterval(showHint, HINT_INTERVAL);
    return () => { clearTimeout(initial); clearInterval(hintTimerRef.current); };
  }, [showHint]);

  // ─── Wave behaviour ────────────────────────────────────────────────────────
  useEffect(() => {
    waveTimerRef.current = setInterval(() => {
      if (!isOpen && !isPausedRef.current) {
        isPausedRef.current = true;
        setAnimState('waving');
        setTimeout(() => {
          if (!isOpen) {
            isPausedRef.current = false;
            setAnimState(dirRef.current === 1 ? 'walking-right' : 'walking-left');
          }
        }, 1800);
      }
    }, WAVE_INTERVAL);
    return () => clearInterval(waveTimerRef.current);
  }, [isOpen]);

  // ─── Open / Close ──────────────────────────────────────────────────────────
  const handleRobotClick = useCallback(() => {
    if (isOpen) return;
    isPausedRef.current = true;
    if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    if (robotRef.current) {
      robotRef.current.style.transform = `translateX(${posRef.current}px) scaleX(1)`;
    }
    setAnimState('waving');
    setHint({ text: '', visible: false });
    setTimeout(() => {
      setAnimState('idle');
      setIsOpen(true);
      if (!hasGreeted) setHasGreeted(true);
    }, 700);
  }, [isOpen, hasGreeted]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setAnimState('idle');
    tourActiveRef.current = false;
    setIsTourActive(false);
    setTourMessage('');
    setTimeout(() => {
      lastTimeRef.current = undefined;
      walkRafRef.current = requestAnimationFrame(walkLoop);
    }, 500);
  }, [walkLoop]);

  // ─── Handle AI bot response actions ───────────────────────────────────────
  const handleBotResponse = useCallback(
    (response: BotResponse) => {
      const { action } = response;
      if (!action) return;

      switch (action.type) {
        case 'navigate': {
          if (action.path) {
            setTimeout(() => {
              router.push(action.path!);
              if (action.section) {
                setTimeout(() => scrollToSection(action.section!), 900);
              }
            }, 1200);
          }
          break;
        }
        case 'scroll': {
          if (action.section) {
            setTimeout(() => scrollToSection(action.section!), 600);
          }
          break;
        }
        case 'highlight': {
          if (action.highlights?.length) {
            setTimeout(() => {
              if (action.section) scrollToSection(action.section);
              setTimeout(() => highlightElements(action.highlights!), SCROLL_SETTLE_MS);
            }, 600);
          }
          break;
        }
        case 'external': {
          if (action.external) {
            setTimeout(() => window.open(action.external, '_blank', 'noopener,noreferrer'), 1200);
          }
          break;
        }
        case 'tour': {
          setIsTourActive(true);
          runGuidedTour();
          break;
        }
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  // ─── Guided Tour — FIXED ──────────────────────────────────────────────────
  // Fixes:
  // 1. Tour messages now injected into NexBotPanel via tourMessage state
  // 2. Scroll settles before highlight (SCROLL_SETTLE_MS delay)
  // 3. Panel stays open throughout tour
  const runGuidedTour = useCallback(async () => {
    tourActiveRef.current = true;
    setIsTourActive(true);

    // Keep panel open during tour
    if (!isOpen) {
      setIsOpen(true);
      await delay(400);
    }

    for (let i = 0; i < GUIDED_TOUR_STOPS.length; i++) {
      if (!tourActiveRef.current) break;

      const stop = GUIDED_TOUR_STOPS[i];

      // Navigate to correct page if needed
      if (stop.path !== pathname) {
        router.push(stop.path);
        await delay(900);
        if (!tourActiveRef.current) break;
      }

      // Scroll to section
      if (stop.section) {
        scrollToSection(stop.section);
        // Wait for scroll animation to complete before highlighting
        await delay(SCROLL_SETTLE_MS);
        if (!tourActiveRef.current) break;
        highlightElements([stop.section]);
      }

      // Inject the tour narrative into NexBotPanel as an assistant message
      if (stop.message) {
        setTourMessage(`🗺️ **Tour Stop ${i + 1}/${GUIDED_TOUR_STOPS.length}:** ${stop.message}`);
      }

      setAnimState('attentive' as NexBotAnimState);
      await delay(stop.duration);
      if (!tourActiveRef.current) break;
    }

    if (tourActiveRef.current) {
      setTourMessage('🎉 **Tour complete!** You\'ve seen all the key sections. Ready to explore further or start a project? Just ask!');
      setAnimState('idle');
    }
    tourActiveRef.current = false;
    setIsTourActive(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, isOpen]);

  // ─── Keyboard: Escape closes panel ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  // ─── External open trigger (Idea-to-Reality Simulator → "Ask NexBot") ────
  // Listens for nexbot:open CustomEvent dispatched by ResultReveal CTA
  useEffect(() => {
    const handleExternalOpen = () => { if (!isOpen) handleRobotClick(); };
    window.addEventListener('nexbot:open', handleExternalOpen);
    return () => window.removeEventListener('nexbot:open', handleExternalOpen);
  }, [isOpen, handleRobotClick]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Tour progress indicator */}
      <AnimatePresence>
        {isTourActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0,14,30,0.92)',
              border: '1px solid rgba(0,245,255,0.3)',
              boxShadow: '0 0 20px rgba(0,245,255,0.15)',
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#00f5ff]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[#00f5ff] text-xs font-mono tracking-wider">
              NEXBOT GUIDED TOUR
            </span>
            <button
              onClick={() => { tourActiveRef.current = false; setIsTourActive(false); setTourMessage(''); }}
              className="text-white/40 hover:text-white/80 text-xs ml-2 transition-colors"
              aria-label="Stop guided tour"
            >
              ✕ Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel backdrop (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] sm:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <NexBotPanel
            key="nexbot-panel"
            onClose={handleClose}
            onBotResponse={handleBotResponse}
            onAnimStateChange={setAnimState}
            animState={animState}
            panelSide={panelSide}
            tourMessage={tourMessage}
          />
        )}
      </AnimatePresence>

      {/* ── Walking Robot + Hint Bubble ── */}
      <div
        ref={wrapperRef}
        className="fixed bottom-0 left-0 z-[9991] pointer-events-none"
        style={{ width: '100vw', height: 0 }}
      >
        <div
          ref={robotRef}
          className="absolute bottom-0 pointer-events-auto"
          style={{
            transform: `translateX(${posRef.current}px) scaleX(1)`,
            width: ROBOT_W,
            cursor: isOpen ? 'default' : 'pointer',
          }}
          onClick={handleRobotClick}
          role="button"
          aria-label="Click to chat with NexBot"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRobotClick()}
        >
          {/* Hint bubble */}
          <AnimatePresence>
            {hint.visible && !isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-[calc(100%+8px)] left-1/2"
                style={{ transform: 'translateX(-50%)', zIndex: 9992, pointerEvents: 'none' }}
              >
                <div
                  className="relative rounded-xl px-3 py-2 text-xs text-[#00f5ff]"
                  style={{
                    background: 'rgba(0,14,30,0.94)',
                    border: '1px solid rgba(0,245,255,0.25)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(0,245,255,0.1)',
                    maxWidth: 220,
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {hint.text}
                  <span className="absolute left-1/2 -bottom-[7px]" style={{ transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid rgba(0,245,255,0.25)' }} />
                  <span className="absolute left-1/2 -bottom-[5px]" style={{ transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid rgba(0,14,30,0.94)' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ground glow */}
          <div className="absolute bottom-0 left-1/2 pointer-events-none" style={{ transform: 'translateX(-50%)', width: 60, height: 12, background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />

          {/* Robot */}
          <div style={{ transform: 'scaleX(1)' }}>
            <NexBotCharacter state={animState} size={ROBOT_W} />
          </div>

          {/* First-time pulse ring */}
          {!hasGreeted && !isOpen && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#00f5ff]/40 pointer-events-none"
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: 50, height: 50 }}
            />
          )}

          {/* AI badge */}
          {!isOpen && (
            <motion.div
              initial={false}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00f5ff] border-2 border-[#000e1e] flex items-center justify-center"
              style={{ boxShadow: '0 0 8px rgba(0,245,255,0.6)' }}
            >
              <span className="text-[7px] font-bold text-black leading-none">AI</span>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
