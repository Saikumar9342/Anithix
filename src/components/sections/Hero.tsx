"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { JellyText } from "@/components/animations/JellyText";

const CARDS = [
  {
    id: "graviton",
    name: "Graviton",
    category: "AI Workspace Platform",
    img: "/images/graviton.png",
    tags: ["AI", "WORKSPACE"],
    status: "Launching",
  },
  {
    id: "atom",
    name: "Atom",
    category: "Portfolio Platform",
    img: "/images/atom.png",
    tags: ["MOBILE", "PORTFOLIO"],
    status: "Launching",
  },
  {
    id: "orbis",
    name: "Orbis",
    category: "Content Automation",
    img: "/images/orbis.png",
    tags: ["AI", "AUTOMATION"],
    status: "In Dev",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tall scroll driver so the viewport stays sticky
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Giant text outline scaling down & fading out
  const logoScale = useTransform(scrollYProgress, [0, 0.8], [1.8, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.08, 0.02]);
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  // 2. Left column (content block) glides up & fades out slowly on scroll
  const leftY = useTransform(scrollYProgress, [0, 0.5], ["0px", "-80px"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3. Grid line split translations
  const lineLeftX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const lineRightX = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // 4. Showcase cards flying animations (Parallax offsets per card)
  const card1Y = useTransform(scrollYProgress, [0, 1], ["0px", "-160px"]);
  const card2Y = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"]);
  const card3Y = useTransform(scrollYProgress, [0, 1], ["0px", "-240px"]);

  const card1Rotate = useTransform(scrollYProgress, [0, 1], [-4, -8]);
  const card2Rotate = useTransform(scrollYProgress, [0, 1], [3, 8]);
  const card3Rotate = useTransform(scrollYProgress, [0, 1], [-1, -3]);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      {/* Sticky viewport content */}
      <section
        id="hero"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Subtle grid texture with line splitting */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center justify-between">
          <motion.div
            style={{
              x: lineLeftX,
              width: "50%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
          <motion.div
            style={{
              x: lineRightX,
              width: "50%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Massive background outline logo */}
        <motion.div
          style={{
            scale: logoScale,
            opacity: logoOpacity,
            y: logoY,
            position: "absolute",
            width: "100%",
            textAlign: "center",
            left: 0,
            zIndex: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: "clamp(8rem, 20vw, 24rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.7)",
              lineHeight: 1,
            }}
          >
            ANITHIX
          </span>
        </motion.div>

        {/* Global wrapper */}
        <div className="wrap relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ── LEFT COLUMN: Text Content & CTA (Span 5) ── */}
          <motion.div
            style={{ y: leftY, opacity: leftOpacity }}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            {/* Headline */}
            <div
              className="pointer-events-auto flex flex-col items-start gap-1"
              style={{
                fontSize: "clamp(3.5rem, 5.5vw, 5.2rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                marginBottom: "2rem",
                fontWeight: 800,
              }}
            >
              <JellyText text="We build" />
              <JellyText text="intelligent" style={{ color: "var(--accent)" }} />
              <JellyText text="products." style={{ color: "var(--ink-3)" }} />
            </div>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              style={{
                maxWidth: "420px",
                color: "rgba(255,255,255,0.6)",
                margin: "0 0 3rem 0",
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              AI-powered software, automation platforms, and developer tools for creators and teams who demand precision and performance.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
              className="pointer-events-auto"
            >
              <Link
                href="#products"
                className="inline-flex items-center gap-3 transition-all duration-300"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg)",
                  padding: "1rem 2.2rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(124, 58, 237, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Explore the Suite
                <span>→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: Flying Staggered 3D Cards (Span 7) ── */}
          <div className="lg:col-span-7 relative flex justify-end items-center h-[650px] w-full">
            {/* Subtle glow behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Card 1: Graviton (Top Left / Behind) */}
            <motion.div
              initial={{ opacity: 0, x: -100, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease }}
              className="absolute left-[5%] top-[15%] w-[260px] h-[340px] z-10 rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl"
              style={{
                y: card1Y,
                rotate: card1Rotate,
                background: "rgba(10,10,12,0.85)",
                backdropFilter: "blur(20px)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="w-full h-[55%] rounded-[1rem] overflow-hidden border border-white/5 relative">
                <img src={CARDS[0].img} alt={CARDS[0].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", fontSize: "0.6rem", background: "rgba(124, 58, 237, 0.4)", backdropFilter: "blur(8px)", padding: "0.3rem 0.6rem", borderRadius: "100px", color: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>{CARDS[0].status}</span>
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--ink)", marginBottom: "0.25rem" }}>{CARDS[0].name}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--ink-4)", marginBottom: "0.75rem" }}>{CARDS[0].category}</p>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {CARDS[0].tags.map(t => (
                    <span key={t} style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--accent)", background: "rgba(124, 58, 237, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "100px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Atom (Center Main / Floating) */}
            <motion.div
              initial={{ opacity: 0, y: 150, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease }}
              className="absolute left-[35%] top-[25%] w-[290px] h-[380px] z-30 rounded-[1.8rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              style={{
                y: card2Y,
                rotate: card2Rotate,
                background: "rgba(15,15,18,0.9)",
                backdropFilter: "blur(30px)",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="w-full h-[58%] rounded-[1.2rem] overflow-hidden border border-white/10 relative">
                <img src={CARDS[1].img} alt={CARDS[1].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.85rem", left: "0.85rem", fontSize: "0.6rem", background: "rgba(124, 58, 237, 0.5)", backdropFilter: "blur(8px)", padding: "0.3rem 0.7rem", borderRadius: "100px", color: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>{CARDS[1].status}</span>
              </div>
              <div>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--ink)", marginBottom: "0.25rem" }}>{CARDS[1].name}</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--ink-4)", marginBottom: "0.75rem" }}>{CARDS[1].category}</p>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {CARDS[1].tags.map(t => (
                    <span key={t} style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--accent)", background: "rgba(124, 58, 237, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 3: Orbis (Bottom Right / Forward) */}
            <motion.div
              initial={{ opacity: 0, x: 120, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.6, ease }}
              className="absolute right-[5%] bottom-[10%] w-[250px] h-[320px] z-20 rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl"
              style={{
                y: card3Y,
                rotate: card3Rotate,
                background: "rgba(10,10,12,0.85)",
                backdropFilter: "blur(20px)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="w-full h-[52%] rounded-[1rem] overflow-hidden border border-white/5 relative">
                <img src={CARDS[2].img} alt={CARDS[2].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", fontSize: "0.6rem", background: "rgba(124, 58, 237, 0.4)", backdropFilter: "blur(8px)", padding: "0.3rem 0.6rem", borderRadius: "100px", color: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>{CARDS[2].status}</span>
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--ink)", marginBottom: "0.25rem" }}>{CARDS[2].name}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--ink-4)", marginBottom: "0.75rem" }}>{CARDS[2].category}</p>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {CARDS[2].tags.map(t => (
                    <span key={t} style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--accent)", background: "rgba(124, 58, 237, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "100px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none"
          style={{ color: "var(--ink-4)" }}
        >
          <div className="w-px h-16" style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
        </motion.div>
      </section>
    </div>
  );
}
