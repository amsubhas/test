"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show after 2s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Show tooltip bubble after 4s, auto-hide after 6s
  useEffect(() => {
    if (!visible || dismissed) return;
    const show = setTimeout(() => setTooltip(true), 4000);
    const hide = setTimeout(() => setTooltip(false), 10000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [visible, dismissed]);

  const phone = "19257898909";
  const message = encodeURIComponent(
    "Hello NexGiga! I'd like to know more about your services."
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {tooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="relative flex items-center gap-2 bg-[#1a1a2e] border border-white/10 rounded-2xl rounded-br-sm px-4 py-3 shadow-2xl max-w-[220px]"
          >
            {/* Close tooltip */}
            <button
              onClick={() => { setTooltip(false); setDismissed(true); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X size={10} className="text-white/60" />
            </button>
            <span className="text-white/80 text-xs leading-snug">
              👋 Chat with us on WhatsApp!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setTooltip(true)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20c05c] transition-colors duration-200 cursor-pointer"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping [animation-delay:0.5s]" />

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-white relative z-10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16.004 2.667C8.64 2.667 2.667 8.639 2.667 16c0 2.347.636 4.544 1.742 6.435L2.667 29.333l7.13-1.714A13.28 13.28 0 0016.004 29.333C23.364 29.333 29.333 23.361 29.333 16c0-7.361-5.969-13.333-13.329-13.333zm0 24.267a11.006 11.006 0 01-5.627-1.547l-.403-.24-4.231 1.017 1.052-4.11-.263-.422A11.006 11.006 0 015 16c0-6.074 4.932-11.005 11.004-11.005C22.076 4.995 27 9.926 27 16c0 6.075-4.924 10.934-10.996 10.934zm6.03-8.213c-.33-.166-1.952-.963-2.255-1.072-.303-.11-.523-.166-.743.165-.22.33-.853 1.072-.046 1.346-.066.046-.275.165-.598.33-.275.11-1.841-.743-3.023-2.073-1.04-1.163-1.759-2.596-1.97-3.007-.193-.44.44-.661.633-.991.183-.33.082-.742-.027-1.017-.11-.275-.523-1.302-.716-1.785-.193-.44-.413-.413-.578-.413h-.578c-.22 0-.578.082-.88.413-.303.33-1.155 1.127-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.316 3.74 5.726 5.148.797.33 1.43.523 1.924.66.633.193 1.21.165 1.665.109.523-.082 1.952-.797 2.227-1.566.275-.77.275-1.429.192-1.566-.082-.138-.303-.22-.633-.385z"/>
        </svg>
      </motion.a>
    </div>
  );
}
