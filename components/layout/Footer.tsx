"use client";

import { Mail, Phone, MapPin, Linkedin, Twitter, ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const WING_PATHS = ["/nexforce", "/nextech", "/nexdesign", "/nexbuild"];

function useIsWingPage() {
  const pathname = usePathname();
  return WING_PATHS.some((p) => pathname?.startsWith(p));
}

function resolveHref(href: string, isWing: boolean) {
  if (isWing && href.startsWith("#")) return `/${href}`;
  return href;
}

export default function Footer() {
  const isWing = useIsWingPage();

  const footerLinks = {
    Services: [
      { label: "BIM & Digital Twin", href: resolveHref("#services", isWing) },
      { label: "AI & Robotics", href: resolveHref("#services", isWing) },
      { label: "Smart Infrastructure", href: resolveHref("#services", isWing) },
      { label: "Industrial Automation", href: resolveHref("#services", isWing) },
      { label: "Simulation", href: resolveHref("#services", isWing) },
    ],
    Solutions: [
      { label: "Construction", href: resolveHref("#solutions", isWing) },
      { label: "Manufacturing", href: resolveHref("#solutions", isWing) },
      { label: "Smart Cities", href: resolveHref("#solutions", isWing) },
      { label: "Energy & Utilities", href: resolveHref("#solutions", isWing) },
      { label: "Defense & Aerospace", href: resolveHref("#solutions", isWing) },
    ],
    Wings: [
      { label: "NexForce", href: "/nexforce" },
      { label: "NexTech", href: "/nextech" },
      { label: "NexDesign", href: "/nexdesign" },
      { label: "NexBuild", href: "https://buildmate.sharvas.in", external: true },
      { label: "Buildmate", href: "https://buildmate.sharvas.in", external: true },
    ],
  };

  return (
    <footer className="relative border-t border-cyan-500/10 bg-black/40">
      {/* Top grid line glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6 group w-fit">
              <div className="relative h-10 w-40 transition-opacity duration-300 group-hover:opacity-80">
                <Image
                  src="/nexgiga-logo.png"
                  alt="NexGiga"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              Transforming Digital Intelligence Into Physical Reality. Bridging
              the gap between concepts and creation across industries worldwide.
            </p>

            <div className="space-y-3">
              <a
                href="mailto:info@nexgiga.sharvasit.in"
                className="flex items-center gap-3 text-white/40 hover:text-cyan-400 transition-colors text-sm group"
              >
                <Mail size={14} className="text-cyan-400/60 group-hover:text-cyan-400" />
                info@nexgiga.sharvasit.in
              </a>
              <a
                href="tel:+19257898909"
                className="flex items-center gap-3 text-white/40 hover:text-cyan-400 transition-colors text-sm group"
              >
                <Phone size={14} className="text-cyan-400/60 group-hover:text-cyan-400" />
                +1 925 789 8909
              </a>
              <a
                href="https://wa.me/19257898909"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/40 hover:text-green-400 transition-colors text-sm group"
              >
                <MessageCircle size={14} className="text-green-500/60 group-hover:text-green-400" />
                WhatsApp Us
              </a>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin size={14} className="text-cyan-400/60" />
                India — Operating Globally
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://linkedin.com/company/nexgiga"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass border border-white/10 rounded flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
                aria-label="NexGiga LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://twitter.com/nexgiga"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass border border-white/10 rounded flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
                aria-label="NexGiga Twitter"
              >
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/60 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <ArrowUpRight
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} NexGiga. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-white/25">
            <a href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/20">·</span>
            <a href="/terms" className="hover:text-white/70 transition-colors">              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white/50 transition-colors">
              Terms of Service
            </a>
          </div>

          <a
            href="https://sharvasit.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/20 hover:text-white/40 transition-colors flex items-center gap-1 group"
          >
            <span>Crafted with care by</span>
            <span className="text-cyan-400/40 group-hover:text-cyan-400/70 transition-colors font-medium">
              Sharva&apos;s IT
            </span>
            <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </footer>
  );
}
