"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { WarpEffect } from "@/components/animations/WarpEffect";

/* Light-years: map current scroll depth → a fictional cosmic distance */
function distanceForScroll(): number {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  return Math.round(ratio * 11800 + 200);
}

export function WarpToTop() {
  const [visible, setVisible] = useState(false);
  const [warping, setWarping] = useState(false);
  const [ly, setLy] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const launch = () => {
    if (warping) return;

    const from = distanceForScroll();
    fromRef.current = from;
    const to = from + Math.round(Math.random() * 4_000_000 + 2_000_000);
    setWarping(true);

    // Animate the light-year count-up over the warp duration
    const start = performance.now();
    const DUR = 2400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DUR);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setLy(Math.round(from + (to - from) * e));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Jump to top at peak warp (screen is full of streaks)
    setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 1600);
  };

  const handleComplete = () => {
    setWarping(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  return (
    <>
      {/* The real 3D hyperspace warp (same as product "travel at warp speed") */}
      <WarpEffect active={warping} onComplete={handleComplete} />

      {/* Light-year readout overlaid on the warp */}
      <AnimatePresence>
        {warping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
            style={{ zIndex: 100001 }}
          >
            <div className="text-center" style={{ fontFamily: "var(--font-space), monospace" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(196,188,255,0.85)",
                  marginBottom: "0.8rem",
                }}
              >
                Warping to origin
              </div>
              <div
                style={{
                  fontSize: "clamp(2rem, 6vw, 4rem)",
                  fontWeight: 700,
                  color: "#fff",
                  textShadow: "0 0 30px rgba(196,188,255,0.7)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {ly.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginTop: "0.5rem",
                }}
              >
                light-years
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "0.8rem",
                }}
              >
                from {fromRef.current.toLocaleString()} ly
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The button */}
      <AnimatePresence>
        {visible && !warping && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={launch}
            title="Warp to top"
            className="fixed bottom-8 left-8 z-[100] w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(196,188,255,0.4)",
              boxShadow: "0 0 24px rgba(124,58,237,0.35), inset 0 0 12px rgba(124,58,237,0.2)",
            }}
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(196,188,255,0.25)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <ArrowUp size={20} color="#c4b5fd" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
