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
            
            {/* Text Fill Loader */}
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Outline / Faded Text */}
              <h1 className="display" style={{ 
                fontSize: "clamp(3rem, 8vw, 6rem)", 
                letterSpacing: "0.2em", 
                textTransform: "uppercase", 
                color: "rgba(255,255,255,0.1)",
                margin: 0
              }}>
                ANITHIX
              </h1>
              
              {/* Filled Text overlaying the faded text */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  overflow: "hidden",
                  width: `${progress}%`
                }}
              >
                <h1 className="display" style={{ 
                  fontSize: "clamp(3rem, 8vw, 6rem)", 
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase", 
                  color: "var(--accent)",
                  margin: 0,
                  whiteSpace: "nowrap"
                }}>
                  ANITHIX
                </h1>
              </motion.div>
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
