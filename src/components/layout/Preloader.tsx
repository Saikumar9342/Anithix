"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarField } from "./StarField";

const LETTERS = "ANITHIX".split("");

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";

    // Simulate cinematic slow loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";

            // Dispatch a custom event so other components know loading finished
            window.dispatchEvent(new Event("preloaderFinished"));
          }, 600); // Pause at 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 4) + 2;
      });
    }, 130);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--ink-1)",
            overflow: "hidden",
          }}
        >
          {/* Starfield backdrop */}
          <StarField position="absolute" opacity={0.85} count={150} />

          {/* Logo and Progress Container */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2.4rem" }}>

            {/* Per-letter resolving loader */}
            <h1
              style={{
                fontFamily: "var(--font-space), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(3rem, 8vw, 6rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: 0,
                display: "flex",
              }}
            >
              {LETTERS.map((ch, i) => {
                const threshold = ((i + 1) / LETTERS.length) * 100;
                const active = progress >= threshold - 1;
                return (
                  <motion.span
                    key={i}
                    style={{
                      display: "inline-block",
                      color: active ? "#ffffff" : "rgba(255,255,255,0.12)",
                    }}
                    animate={{
                      opacity: active ? 1 : 0.4,
                      filter: active
                        ? "blur(0px) drop-shadow(0 0 22px rgba(255,255,255,0.45))"
                        : "blur(7px)",
                      y: active ? 0 : 10,
                      scale: active ? 1 : 0.88,
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </h1>

            {/* Progress bar + percentage */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: "180px", height: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", borderRadius: "999px" }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
              <div style={{ fontFamily: "var(--font-space), monospace", fontWeight: 500, fontSize: "0.85rem", color: "var(--ink-3)", letterSpacing: "0.2em" }}>
                {Math.min(progress, 100)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
