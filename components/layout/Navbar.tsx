"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const WING_PATHS = ["/nexforce", "/nextech", "/nexdesign", "/nexbuild"];

function useIsWingPage() {
  const pathname = usePathname();
  return WING_PATHS.some((p) => pathname?.startsWith(p));
}

function resolveHref(href: string, isWing: boolean) {
  if (isWing && href.startsWith("#")) return `/${href}`;
  return href;
}

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Buildmate", href: "#buildmate" },
  { label: "About", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isWing = useIsWingPage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-cyan-500/10 py-3"
            : "bg-transparent py-5"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group" aria-label="NexGiga Home">
            <div className="relative h-10 w-36 transition-opacity duration-300 group-hover:opacity-80">
              <Image
                src="/nexgiga-logo.png"
                alt="NexGiga"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={resolveHref(link.href, isWing)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className="relative text-sm font-medium text-white/60 hover:text-cyan-400 transition-colors duration-300 tracking-wider uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.a
              href={resolveHref("#contact", isWing)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="btn-primary text-xs py-2.5 px-5"
            >
              Start Project
            </motion.a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-cyan-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 glass-strong flex flex-col pt-24 px-8 gap-6 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={resolveHref(link.href, isWing)}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-bold text-white hover:text-cyan-400 transition-colors border-b border-white/5 pb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href={resolveHref("#contact", isWing)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-4 text-center justify-center"
            >
              Start Project
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <ScrollProgressBar />
    </>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
        style={{ scaleX: progress, transformOrigin: "left" }}
      />
    </div>
  );
}
