"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  // Ref-based trailing to avoid spawning closures on every mousemove
  const targetRef = useRef({ x: -100, y: -100 });
  const trailingRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>();

  useEffect(() => {
    // Skip on touch/coarse-pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: Event) => {
      if ((e.target as HTMLElement).closest("a, button, [data-hover]")) {
        setIsHovering(true);
      }
    };
    const onMouseOut = () => setIsHovering(false);

    // rAF loop lerps trailing position — no setTimeout closures
    const tick = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const cx = trailingRef.current.x;
      const cy = trailingRef.current.y;
      const nx = cx + (tx - cx) * 0.18;
      const ny = cy + (ty - cy) * 0.18;
      trailingRef.current = { x: nx, y: ny };

      // Only setState when moved more than 0.5px to reduce renders
      if (Math.abs(nx - cx) > 0.5 || Math.abs(ny - cy) > 0.5) {
        setTrailing({ x: nx, y: ny });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full bg-cyan-400 mix-blend-difference"
        animate={{ x: pos.x - 6, y: pos.y - 6, scale: isHovering ? 0 : 1 }}
        transition={{ type: "tween", duration: 0.05 }}
        style={{ top: 0, left: 0 }}
      />

      {/* Trailing ring — driven by rAF lerp, no spring needed */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border border-cyan-400/40"
        animate={{
          x: trailing.x - (isHovering ? 20 : 16),
          y: trailing.y - (isHovering ? 20 : 16),
          width: isHovering ? 40 : 32,
          height: isHovering ? 40 : 32,
          opacity: isHovering ? 1 : 0.6,
        }}
        transition={{ type: "tween", duration: 0 }}
        style={{ top: 0, left: 0 }}
      />
    </>
  );
}
