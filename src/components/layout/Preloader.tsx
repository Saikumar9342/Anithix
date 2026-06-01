"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { StarField } from "./StarField";

const LETTERS = "ANITHIX".split("");

export function Preloader() {
  const { active, progress: actualProgress } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Smooth cinematic loading simulation combined with actual WebGL assets loaded
  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";

    let animFrame: number;
    let lastTime = performance.now();

    const update = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }

        // Clean, steady progression. Enforces a minimum ~2.5 second introduction.
        let increment = 36 * delta; 

        // Gentle slowdown near the end to build anticipation
        if (prev > 80) {
          increment *= 0.5;
        }

        const nextSimulated = prev + increment;

        // Cap simulated progress at actual WebGL load percentage if active
        let targetCap = 100;
        if (active && actualProgress < 100) {
          targetCap = Math.min(actualProgress, 95);
        }

        if (nextSimulated >= targetCap) {
          return Math.min(targetCap, 100);
        }

        return nextSimulated;
      });

      animFrame = requestAnimationFrame(update);
    };

    animFrame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animFrame);
      document.body.style.overflow = "";
    };
  }, [active, actualProgress]);

  // Trigger loading complete sequence
  const progressVal = Math.floor(simulatedProgress);

  useEffect(() => {
    if (progressVal >= 100) {
      const timer = setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("preloaderFinished"));
      }, 600); // Smooth elegant pause at 100%
      return () => clearTimeout(timer);
    }
  }, [progressVal]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#08080a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            overflow: "hidden",
          }}
        >
          {/* Subtle starfield backdrop */}
          <StarField position="absolute" opacity={0.35} count={100} />

          {/* Minimalist Centered Container */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.4rem" }}>
            
            {/* Elegant letter fade reveal */}
            <h1
              style={{
                fontFamily: "var(--font-space), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                margin: 0,
                display: "flex",
              }}
            >
              {LETTERS.map((ch, i) => {
                const threshold = ((i + 1) / LETTERS.length) * 100;
                const activeLetter = progressVal >= threshold - 1;

                return (
                  <motion.span
                    key={i}
                    style={{
                      display: "inline-block",
                      color: activeLetter ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
                      textShadow: activeLetter ? "0 0 20px rgba(255,255,255,0.25)" : "none"
                    }}
                    animate={{
                      opacity: activeLetter ? 1 : 0.4,
                      y: activeLetter ? 0 : 3,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </h1>

            {/* Ultra-thin loading bar + percentage */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "160px", height: "1px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
                <motion.div
                  style={{ 
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%", 
                    background: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 0 8px rgba(255, 255, 255, 0.4)"
                  }}
                  animate={{ width: `${progressVal}%` }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                />
              </div>
              <div style={{ fontFamily: "var(--font-space), monospace", fontWeight: 400, fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.15em" }}>
                {progressVal}%
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


