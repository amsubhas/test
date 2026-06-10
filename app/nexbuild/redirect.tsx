"use client";

import { useEffect } from "react";
import { BUILDMATE_URL } from "@/lib/constants";

export default function NexBuildRedirect() {
  useEffect(() => {
    window.open(BUILDMATE_URL, "_self");
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#010508" }}
      aria-live="polite"
    >
      <div className="text-center">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mx-auto mb-4" />
        <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          Redirecting to BuildMate…
        </p>
      </div>
    </div>
  );
}
