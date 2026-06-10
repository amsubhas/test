'use client';

import { motion } from 'framer-motion';
import type { NexBotAnimState, EmotionState } from '@/lib/nexbot/types';

interface Props {
  state: NexBotAnimState;
  emotion?: EmotionState;
  size?: number;
}

export default function NexBotCharacter({ state, emotion = 'neutral', size = 90 }: Props) {
  const isWalking = state === 'walking-right' || state === 'walking-left';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isTalking = state === 'talking';
  const isWaving = state === 'waving';
  const isCelebrating = state === 'celebrating';
  const isSleeping = state === 'sleeping';

  const scale = size / 90;

  // Eye animation variants based on state
  const eyeAnimation = isThinking
    ? { cx: [35, 42, 35], opacity: [0.9, 0.5, 0.9] }
    : isSleeping
    ? { ry: [0.3, 0.3, 0.3] }
    : { ry: [4.5, 0.3, 4.5, 4.5, 4.5, 4.5, 4.5] };

  const eyeTransition = isThinking
    ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
    : isSleeping
    ? { duration: 0 }
    : { duration: 5, repeat: Infinity, times: [0, 0.08, 0.12, 0.2, 0.5, 0.8, 1], ease: 'linear' };

  // Chest core color based on emotion
  const coreColor =
    emotion === 'happy' || isCelebrating
      ? '#00ff88'
      : emotion === 'excited'
      ? '#ff6600'
      : emotion === 'thinking' || isThinking
      ? '#7b2fff'
      : isListening
      ? '#ff3366'
      : '#00f5ff';

  return (
    <div style={{ width: size, height: size * 1.55, position: 'relative', flexShrink: 0 }}>
      {/* Body bob during walking */}
      <motion.div
        style={{ width: '100%', height: '100%' }}
        animate={
          isWalking
            ? { y: [0, -2.5, 0, -2.5, 0] }
            : isCelebrating
            ? { y: [0, -8, 0, -8, 0], scale: [1, 1.05, 1, 1.05, 1] }
            : { y: 0, scale: 1 }
        }
        transition={{
          duration: isWalking ? 0.5 : 0.4,
          repeat: isWalking || isCelebrating ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <svg
          width={size}
          height={size * 1.55}
          viewBox="0 0 90 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible', transform: `scale(${scale})`, transformOrigin: 'top left', width: 90, height: 140 }}
        >
          <defs>
            {/* Body gradient — white metallic */}
            <linearGradient id="nb-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eaf5ff" />
              <stop offset="60%" stopColor="#d0e8f8" />
              <stop offset="100%" stopColor="#b8d4ee" />
            </linearGradient>
            {/* Head gradient — slightly lighter */}
            <linearGradient id="nb-head" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4faff" />
              <stop offset="100%" stopColor="#d8ecfc" />
            </linearGradient>
            {/* Accent gradient */}
            <linearGradient id="nb-accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0066ff" stopOpacity="0.3" />
            </linearGradient>
            {/* Core radial glow */}
            <radialGradient id="nb-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={coreColor} stopOpacity="1" />
              <stop offset="60%" stopColor={coreColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
            </radialGradient>
            {/* Glow filter */}
            <filter id="nb-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft shadow filter */}
            <filter id="nb-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0066ff" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* ── SHADOW ── */}
          <ellipse cx="45" cy="139" rx="22" ry="3" fill="#0066ff" opacity="0.15" />

          {/* ── LEFT ARM (rendered behind body) ── */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 8%' }}
            animate={
              isWaving
                ? { rotate: [0, -75, -55, -80, -55, -80, 0] }
                : isCelebrating
                ? { rotate: [0, -60, 0, -60, 0] }
                : isWalking
                ? { rotate: [18, -18, 18] }
                : { rotate: 0 }
            }
            transition={{
              duration: isWaving ? 1.4 : isCelebrating ? 0.5 : isWalking ? 0.55 : 0.3,
              repeat: isWalking || isCelebrating ? Infinity : isWaving ? 1 : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Upper arm */}
            <rect x="3" y="59" width="13" height="22" rx="6" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.8" />
            {/* Elbow joint */}
            <circle cx="9.5" cy="81" r="5" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            {/* Lower arm */}
            <rect x="4" y="80" width="11" height="16" rx="5" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.7" />
            {/* Hand */}
            <ellipse cx="9.5" cy="97" rx="5" ry="4" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            {/* Wrist glow line */}
            <line x1="5" y1="91" x2="14" y2="91" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.4" />
          </motion.g>

          {/* ── RIGHT ARM (rendered behind body) ── */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 8%' }}
            animate={
              isCelebrating
                ? { rotate: [0, 60, 0, 60, 0] }
                : isWalking
                ? { rotate: [-18, 18, -18] }
                : { rotate: 0 }
            }
            transition={{
              duration: isCelebrating ? 0.5 : isWalking ? 0.55 : 0.3,
              repeat: isWalking || isCelebrating ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <rect x="74" y="59" width="13" height="22" rx="6" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.8" />
            <circle cx="80.5" cy="81" r="5" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            <rect x="75" y="80" width="11" height="16" rx="5" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.7" />
            <ellipse cx="80.5" cy="97" rx="5" ry="4" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            <line x1="76" y1="91" x2="85" y2="91" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.4" />
          </motion.g>

          {/* ── LEFT LEG ── */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 5%' }}
            animate={isWalking ? { rotate: [-14, 14, -14] } : { rotate: 0 }}
            transition={{ duration: 0.55, repeat: isWalking ? Infinity : 0, ease: 'easeInOut' }}
          >
            {/* Hip */}
            <rect x="21" y="108" width="20" height="5" rx="2.5" fill="#c0daf0" stroke="#a8d0ec" strokeWidth="0.6" />
            {/* Upper leg */}
            <rect x="22" y="112" width="18" height="16" rx="5" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.8" />
            {/* Knee */}
            <rect x="23" y="126" width="16" height="5" rx="2.5" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            {/* Lower leg */}
            <rect x="23" y="130" width="14" height="6" rx="3" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.7" />
            {/* Foot */}
            <rect x="18" y="134" width="22" height="7" rx="4" fill="#c0daf0" stroke="#a8d0ec" strokeWidth="0.8" />
            {/* Foot accent */}
            <line x1="20" y1="138" x2="38" y2="138" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.3" />
          </motion.g>

          {/* ── RIGHT LEG ── */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 5%' }}
            animate={isWalking ? { rotate: [14, -14, 14] } : { rotate: 0 }}
            transition={{ duration: 0.55, repeat: isWalking ? Infinity : 0, ease: 'easeInOut' }}
          >
            <rect x="49" y="108" width="20" height="5" rx="2.5" fill="#c0daf0" stroke="#a8d0ec" strokeWidth="0.6" />
            <rect x="50" y="112" width="18" height="16" rx="5" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.8" />
            <rect x="51" y="126" width="16" height="5" rx="2.5" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.6" />
            <rect x="53" y="130" width="14" height="6" rx="3" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.7" />
            <rect x="50" y="134" width="22" height="7" rx="4" fill="#c0daf0" stroke="#a8d0ec" strokeWidth="0.8" />
            <line x1="52" y1="138" x2="70" y2="138" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.3" />
          </motion.g>

          {/* ── BODY / TORSO ── */}
          <rect x="16" y="58" width="58" height="52" rx="9" fill="url(#nb-body)" stroke="#a8d0ec" strokeWidth="0.8" filter="url(#nb-shadow)" />

          {/* Body top accent band */}
          <path d="M 16 67 Q 45 58 74 67 L 74 62 Q 45 57 16 62 Z" fill="#c8e2f2" opacity="0.6" />

          {/* Shoulder joints */}
          <circle cx="16" cy="67" r="7" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.8" />
          <circle cx="74" cy="67" r="7" fill="#c8e4f4" stroke="#a8d0ec" strokeWidth="0.8" />

          {/* Shoulder joint inner */}
          <circle cx="16" cy="67" r="3.5" fill="#b0d4ec" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.4" />
          <circle cx="74" cy="67" r="3.5" fill="#b0d4ec" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Body side panel lines */}
          <line x1="16" y1="76" x2="28" y2="76" stroke="#00f5ff" strokeWidth="0.7" strokeOpacity="0.35" />
          <line x1="62" y1="76" x2="74" y2="76" stroke="#00f5ff" strokeWidth="0.7" strokeOpacity="0.35" />
          <line x1="16" y1="82" x2="24" y2="82" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="66" y1="82" x2="74" y2="82" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.2" />

          {/* Bottom accent lines */}
          <line x1="25" y1="100" x2="65" y2="100" stroke="#a8d0ec" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="28" y1="104" x2="62" y2="104" stroke="#a8d0ec" strokeWidth="0.4" strokeOpacity="0.3" />

          {/* ── CHEST CORE ── */}
          {/* Outer ring dark bg */}
          <circle cx="45" cy="80" r="13" fill="#001428" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.7" />
          {/* Middle ring */}
          <circle cx="45" cy="80" r="9" fill="#001f3d" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.4" />
          {/* Animated glow core */}
          <motion.circle
            cx="45" cy="80" r="5.5"
            fill="url(#nb-core)"
            filter="url(#nb-glow)"
            animate={{
              r: isListening ? [5.5, 8, 5.5] : isTalking ? [5.5, 7, 5.5] : isCelebrating ? [5.5, 9, 5.5] : [5.5, 6.5, 5.5],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{ duration: isListening ? 0.5 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Core center dot */}
          <motion.circle
            cx="45" cy="80" r="2.5"
            fill="white"
            opacity="0.95"
            animate={{ opacity: [0.95, 0.6, 0.95], r: [2.5, 3, 2.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* NexBot label on chest */}
          <text x="45" y="98" textAnchor="middle" fontSize="4.5" fill="#00f5ff" fillOpacity="0.5" fontFamily="monospace" letterSpacing="1">
            NEXBOT
          </text>

          {/* ── NECK ── */}
          <rect x="36" y="52" width="18" height="8" rx="3.5" fill="#c0daf0" stroke="#a8d0ec" strokeWidth="0.7" />
          <line x1="36" y1="55.5" x2="54" y2="55.5" stroke="#00f5ff" strokeWidth="0.6" strokeOpacity="0.3" />

          {/* ── HEAD ── */}
          <motion.g
            animate={
              isTalking
                ? { y: [0, -1.5, 0] }
                : isListening
                ? { rotate: [-3, 3, -3] }
                : isThinking
                ? { rotate: [0, 6, 0] }
                : { y: 0, rotate: 0 }
            }
            transition={{
              duration: isTalking ? 0.4 : isListening ? 1.2 : isThinking ? 2 : 0.3,
              repeat: isTalking || isListening || isThinking ? Infinity : 0,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '45px 55px' }}
          >
            {/* Head shell */}
            <rect x="18" y="11" width="54" height="42" rx="10" fill="url(#nb-head)" stroke="#a8d0ec" strokeWidth="0.8" filter="url(#nb-shadow)" />
            {/* Head top curvature highlight */}
            <path d="M 20 21 Q 45 10 70 21 L 70 15 Q 45 9 20 15 Z" fill="white" opacity="0.3" />

            {/* ── VISOR / EYE DISPLAY ── */}
            <rect x="22" y="21" width="46" height="20" rx="5" fill="#000d1a" />
            {/* Visor border glow */}
            <rect x="22" y="21" width="46" height="20" rx="5" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.7" />
            {/* Visor inner reflection */}
            <rect x="23" y="21" width="44" height="6" rx="4" fill="white" opacity="0.04" />

            {/* ── EYES ── */}
            {isSleeping ? (
              // Sleeping: closed eyes (flat lines)
              <>
                <line x1="30" y1="31" x2="42" y2="31" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
                <line x1="48" y1="31" x2="60" y2="31" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
                {/* Zzzs */}
                <motion.text x="68" y="18" fontSize="6" fill="#00f5ff" fillOpacity="0.6"
                  animate={{ opacity: [0, 1, 0], y: [18, 12, 6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                >z</motion.text>
              </>
            ) : isListening ? (
              // Listening: animated waveform bars instead of eyes
              <>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.rect
                    key={i}
                    x={26 + i * 6}
                    y={26}
                    width={4}
                    height={8}
                    rx={2}
                    fill="#00f5ff"
                    opacity={0.8}
                    filter="url(#nb-glow)"
                    animate={{ height: [8, 14 + (i % 3) * 4, 8], y: [26, 23 - (i % 3) * 2, 26] }}
                    transition={{ duration: 0.5 + i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
                  />
                ))}
              </>
            ) : isThinking ? (
              // Thinking: scanning eyes (dots move side to side)
              <>
                <motion.ellipse
                  cx={36} cy={31} rx={6} ry={4.5}
                  fill="#7b2fff" opacity={0.9} filter="url(#nb-glow)"
                  animate={{ cx: [36, 48, 36] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.ellipse
                  cx={54} cy={31} rx={6} ry={4.5}
                  fill="#7b2fff" opacity={0.9} filter="url(#nb-glow)"
                  animate={{ cx: [54, 42, 54] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            ) : isCelebrating ? (
              // Celebrating: star/arc eyes
              <>
                <text x="36" y="34" textAnchor="middle" fontSize="10" fill="#ffcc00" filter="url(#nb-glow)">★</text>
                <text x="54" y="34" textAnchor="middle" fontSize="10" fill="#ffcc00" filter="url(#nb-glow)">★</text>
              </>
            ) : (
              // Default / Talking / Idle: normal eyes with blink
              <>
                <motion.ellipse
                  cx={36} cy={31} rx={6} ry={4.5}
                  fill="#00f5ff" opacity={0.92} filter="url(#nb-glow)"
                  animate={eyeAnimation}
                  // @ts-expect-error framer motion types
                  transition={eyeTransition}
                />
                <motion.ellipse
                  cx={54} cy={31} rx={6} ry={4.5}
                  fill="#00f5ff" opacity={0.92} filter="url(#nb-glow)"
                  animate={eyeAnimation}
                  // @ts-expect-error framer motion types
                  transition={{ ...eyeTransition, delay: 0.15 }}
                />
              </>
            )}

            {/* ── MOUTH / STATUS AREA ── */}
            <rect x="28" y="44" width="34" height="5" rx="2.5" fill="#001428" />
            <rect x="28" y="44" width="34" height="5" rx="2.5" fill="none" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Mouth expression */}
            {isTalking ? (
              <motion.rect x="32" y="45.5" width="26" height="2" rx="1"
                fill="#00f5ff" fillOpacity="0.6"
                animate={{ width: [26, 20, 30, 22, 26], x: [32, 35, 30, 34, 32] }}
                transition={{ duration: 0.35, repeat: Infinity }}
              />
            ) : emotion === 'happy' || isCelebrating ? (
              // Happy smile arc
              <path d="M 33 46 Q 45 50 57 46" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
            ) : (
              // Neutral line
              <line x1="34" y1="47" x2="56" y2="47" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
            )}

            {/* ── ANTENNA ── */}
            <rect x="43.5" y="2" width="3" height="10" rx="1.5" fill="#98bcd8" />
            <motion.circle
              cx={45} cy={2} r={4}
              fill="#00f5ff"
              filter="url(#nb-glow)"
              animate={{
                opacity: isListening ? [1, 0.3, 1] : [1, 0.15, 1],
                r: isListening ? [4, 6, 4] : [4, 5, 4],
              }}
              transition={{
                duration: isListening ? 0.5 : 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Head side accents */}
            <rect x="18" y="27" width="4" height="2" rx="1" fill="#00f5ff" opacity="0.3" />
            <rect x="68" y="27" width="4" height="2" rx="1" fill="#00f5ff" opacity="0.3" />
            <rect x="18" y="32" width="3" height="1.5" rx="0.75" fill="#00f5ff" opacity="0.2" />
            <rect x="69" y="32" width="3" height="1.5" rx="0.75" fill="#00f5ff" opacity="0.2" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
