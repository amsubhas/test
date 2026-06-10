"use client";

import { useEffect, ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Progressive enhancement: smooth scroll without requiring Lenis
    // to avoid SSR issues
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  return <>{children}</>;
}
