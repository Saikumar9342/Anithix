"use client";

import { useRef, useEffect, useState } from "react";
import { ScrollWarp } from "@/components/animations/ScrollWarp";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

const PRODUCTS = [
  { name: "Graviton", role: "AI Workspace", color: "#a78bfa", desc: "Multi-provider AI in one editorial interface." },
  { name: "Atom", role: "Portfolio Platform", color: "#06b6d4", desc: "Your portfolio, built from your pocket." },
  { name: "Orbis", role: "Content Automation", color: "#10b981", desc: "Publish your content universe on autopilot." },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progress.set(v);
      setScrollProgress(v);
    });
  }, [scrollYProgress, progress]);

  const afterPanelRef = useRef<HTMLDivElement>(null);
  const heroPanelRef  = useRef<HTMLDivElement>(null);

  // Drive both panels entirely via DOM refs based on scroll progress
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // Hero panel: fade out quickly as soon as user starts scrolling
      const hero = heroPanelRef.current;
      if (hero) {
        const heroFade = Math.max(0, 1 - v / 0.12);
        hero.style.opacity = String(heroFade);
        hero.style.transform = `translateY(${(1 - heroFade) * -50}px)`;
      }

      // After-impact panel: fades in smoothly right after the asteroid blast at p = 0.15
      const after = afterPanelRef.current;
      if (after) {
        const visible = v >= 0.18;
        const fadeIn = Math.max(0, Math.min(1, (v - 0.18) / 0.10));
        after.style.opacity = String(visible ? fadeIn : 0);
        after.style.transform = `translateY(${Math.max(0, (1 - fadeIn) * 40)}px)`;
        after.style.visibility = visible ? "visible" : "hidden";
      }
    });
  }, [scrollYProgress]);

  // Flash triggers at p = 0.15 (matching the spaceship laser blast)
  const flashOpacity = useTransform(scrollYProgress, [0.12, 0.15, 0.22], [0, 0.85, 0]);
  const hintOp = useTransform(scrollYProgress, [0, 0.04, 0.10], [1, 1, 0]);

  return (
    <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
      <section
        id="hero"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "transparent" }}
      >
        {/* Space Warp effect on scroll transition */}
        <ScrollWarp progress={scrollProgress} />

        {/* Impact flash */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "radial-gradient(circle at 30% 70%, #fff 0%, #ffd9a0 40%, transparent 75%)",
            opacity: flashOpacity,
          }}
        />

        {/* Hero headline */}
        <div
          ref={heroPanelRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45 }}
            style={{
              fontSize: "clamp(3.8rem, 8vw, 8rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textShadow: "0 0 80px rgba(0,0,0,0.8)",
            }}
          >
            We build
            <br />
            <span style={{ color: "var(--accent)" }}>intelligent</span>
            <br />
            products.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
            style={{
              marginTop: "1.8rem",
              maxWidth: "480px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            AI-powered software, automation platforms, and developer tools
            for creators who demand precision.
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOp }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-3"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Scroll to witness impact
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "48px",
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
        </motion.div>

        {/* After-impact panel — DOM ref controlled, starts hidden */}
        <div
          ref={afterPanelRef}
          style={{
            opacity: 0, visibility: "hidden", transform: "translateY(40px)",
            position: "absolute", right: 0, top: 0, height: "100%", zIndex: 20,
            display: "flex", flexDirection: "column", justifyContent: "center",
            pointerEvents: "none", padding: "0 clamp(2.5rem, 5vw, 7rem) 0 1.5rem",
            width: "min(50vw, 580px)",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.4rem" }}>
            <div style={{ width: "2rem", height: "1px", background: "#ff7b3a" }} />
            <span style={{
              fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#ff7b3a",
            }}>
              Impact — Genesis
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: "clamp(2.8rem, 4vw, 4.2rem)", fontWeight: 900,
            lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: "1.4rem",
          }}>
            From collision,<br />
            <span style={{ color: "#ff7b3a" }}>creation.</span>
          </h2>

          <p style={{
            fontSize: "0.9rem", lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)", marginBottom: "2.2rem", maxWidth: "34ch",
          }}>
            Pressure forged into brilliance. Anithix builds products that transform how people work, create, and connect.
          </p>

          {/* Product list — horizontal divider style */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: "1.1rem",
                padding: "1rem 0",
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                {/* Color dot */}
                <div style={{
                  width: "0.45rem", height: "0.45rem", borderRadius: "50%",
                  background: p.color, boxShadow: `0 0 10px ${p.color}`,
                  flexShrink: 0,
                }} />
                {/* Name */}
                <span style={{
                  fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)",
                  letterSpacing: "-0.01em", minWidth: "5rem",
                }}>{p.name}</span>
                {/* Role */}
                <span style={{
                  fontSize: "0.72rem", color: "rgba(255,255,255,0.35)",
                  fontFamily: "monospace", letterSpacing: "0.05em",
                }}>{p.role}</span>
                {/* Arrow */}
                <span style={{
                  marginLeft: "auto", fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.2)",
                }}>→</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href="#products" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginTop: "2rem", fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--bg)", background: "var(--accent)",
            padding: "0.85rem 1.8rem", borderRadius: "100px",
            pointerEvents: "auto", textDecoration: "none",
            width: "fit-content",
          }}>
            Explore the suite →
          </a>
        </div>
      </section>
    </div>
  );
}
