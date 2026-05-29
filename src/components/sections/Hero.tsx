"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";
import { HeroScene } from "@/components/animations/HeroScene";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRef = useReveal();
  
  // Parallax the background on scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center"
    >
      {/* 3D WebGL Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden">
        <HeroScene />
        
        {/* Tech Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)"
          }} 
        />
      </motion.div>
      
      {/* Content */}
      <div ref={revealRef} className="wrap relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pointer-events-none min-h-screen pt-20 pb-32">
        
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left">
          {/* Massive Headline */}
          <h1 className="reveal reveal-d1 in display-massive pointer-events-auto" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="We build" />
            <JellyText text="intelligent" style={{ color: "var(--accent)" }} />
            <JellyText text="products." style={{ color: "var(--ink-3)" }} />
          </h1>

          {/* Lede */}
          <p className="lede reveal reveal-d2 in pointer-events-auto" style={{ maxWidth: "600px", fontSize: "1.25rem", color: "var(--ink-2)", marginBottom: "3rem" }}>
            Anithix crafts AI-powered software, automation platforms, and developer tools designed for visionaries who demand precision and performance.
          </p>

          {/* Action Buttons */}
          <div className="reveal reveal-d3 in flex flex-wrap gap-6 justify-start pointer-events-auto">
            <a
              href="#products"
              className="flex items-center justify-center"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                padding: "1.2rem 2.5rem",
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
                padding: "1.2rem 2.5rem",
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

        {/* Right Side: Elegant 3D Object */}
        <div className="reveal reveal-d2 in h-[500px] lg:h-[700px] w-full flex items-center justify-center relative">
          <HeroScene />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 reveal in reveal-d4 pointer-events-none"
        style={{ color: "var(--ink-4)" }}
      >
        <div className="w-px h-16" style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
      </div>
    </section>
  );
}
