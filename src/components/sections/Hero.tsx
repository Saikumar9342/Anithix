"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRef = useReveal();
  
  // Parallax the background on scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Client-side only rendering for random initial positions to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Dynamic Animated Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && (
          <>
            <motion.div
              animate={{
                x: ["-20%", "20%", "-20%"],
                y: ["-10%", "10%", "-10%"],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full filter blur-[100px] opacity-70"
              style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.8), transparent 70%)" }}
            />
            <motion.div
              animate={{
                x: ["20%", "-20%", "20%"],
                y: ["10%", "-10%", "10%"],
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full filter blur-[120px] opacity-50"
              style={{ background: "radial-gradient(circle, rgba(134, 210, 164, 0.8), transparent 70%)" }}
            />
            <motion.div
              animate={{
                x: ["-10%", "10%", "-10%"],
                y: ["20%", "-20%", "20%"],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full filter blur-[90px] opacity-40"
              style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent 70%)" }}
            />
          </>
        )}

        {/* Tech Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
          }} 
        />
      </motion.div>
      
      {/* Content */}
      <div ref={revealRef} className="wrap relative z-10 text-center flex flex-col items-center">
        
        {/* Massive Headline */}
        <h1 className="reveal reveal-d1 in display-massive" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <JellyText text="We build" />
          <JellyText text="intelligent" style={{ color: "var(--accent)" }} />
          <JellyText text="products." style={{ color: "var(--ink-3)" }} />
        </h1>

        {/* Lede */}
        <p className="lede reveal reveal-d2 in" style={{ maxWidth: "700px", fontSize: "1.25rem", color: "var(--ink-2)", marginBottom: "4rem" }}>
          Anithix crafts AI-powered software, automation platforms, and developer tools designed for visionaries who demand precision and performance.
        </p>

        {/* Action Buttons */}
        <div className="reveal reveal-d3 in flex flex-wrap gap-6 justify-center">
          <a
            href="#products"
            className="flex items-center justify-center"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              padding: "1.2rem 3rem",
              borderRadius: "2rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Explore the Suite
          </a>
          <a
            href="#ecosystem"
            className="flex items-center justify-center glass-panel"
            style={{
              background: "transparent",
              color: "var(--ink)",
              padding: "1.2rem 3rem",
              borderRadius: "2rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "rgba(124, 58, 237, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            View Architecture
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 reveal in reveal-d4"
        style={{ color: "var(--ink-4)" }}
      >
        <div className="w-px h-16" style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
      </div>
    </section>
  );
}
