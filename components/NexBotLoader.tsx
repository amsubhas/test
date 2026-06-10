'use client';

/**
 * NexBotLoader — Client Component wrapper for NexBot
 *
 * WHY THIS FILE EXISTS:
 * `next/dynamic` with `ssr: false` is FORBIDDEN inside Server Components
 * (which includes app/layout.tsx in Next.js App Router).
 * The solution is to isolate the dynamic import inside a Client Component
 * (marked with "use client") and import that wrapper from layout.tsx instead.
 *
 * NexBot requires this because it uses browser-only APIs:
 *   - window.SpeechRecognition / webkitSpeechRecognition
 *   - requestAnimationFrame
 *   - document.querySelector / createElement
 *   - window.speechSynthesis
 */

import dynamic from 'next/dynamic';

const NexBot = dynamic(() => import('@/components/NexBot'), {
  ssr: false,
  loading: () => null, // Appears silently after hydration — no flash of placeholder
});

export default function NexBotLoader() {
  return <NexBot />;
}
