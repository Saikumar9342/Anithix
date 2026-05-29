"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";

    // Simulate cinematic fast loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
            
            // Dispatch a custom event so other components know loading finished
            window.dispatchEvent(new Event("preloaderFinished"));
          }, 400); // Small pause at 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 50);

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
          }}
        >
          {/* Logo and Progress Container */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              ANITHIX
            </h1>
            
            {/* Progress Bar */}
            <div style={{ position: "relative", width: "240px", height: "1px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  background: "var(--ink-1)",
                }}
              />
            </div>
            
            {/* Percentage */}
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--ink-3)", letterSpacing: "0.1em" }}>
              {Math.min(progress, 100)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
