import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | NexGiga",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center grid-overlay">
      <div className="text-center px-6">
        <div
          className="text-[180px] font-bold leading-none opacity-5 select-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </div>
        <div className="-mt-16 relative z-10">
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Signal Lost
          </h1>
          <p className="text-white/40 mb-8">
            The page you&apos;re looking for doesn&apos;t exist in this dimension.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
