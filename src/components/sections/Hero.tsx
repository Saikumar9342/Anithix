"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { JellyText } from "@/components/animations/JellyText";

/* ── Gallery cards (Awwwards-style showcase) ─── */
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
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const leftY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="section relative min-h-[90vh] overflow-hidden flex flex-col justify-center"
      style={{ background: "var(--bg)", paddingTop: "6rem" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent 80%)",
        }}
      />

      <div className="wrap relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        
        {/* ── LEFT COLUMN: Typography & CTA ── */}
        <motion.div style={{ y: leftY }} className="flex flex-col items-start text-left">
          

          {/* Headline */}
          <div className="pointer-events-auto flex flex-col items-start gap-0" style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "2rem", fontWeight: 600 }}>
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
              maxWidth: "480px",
              color: "var(--ink-2)",
              margin: "0 0 3rem 0",
              fontSize: "1.1rem",
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
              className="inline-flex items-center gap-3 font-500 transition-all duration-300"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                padding: "1rem 2.5rem",
                borderRadius: "999px",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
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

        {/* ── RIGHT COLUMN: Gallery Grid ── */}
        <motion.div style={{ y: rightY }} className="grid grid-cols-2 gap-4 lg:gap-6 relative">
          {/* Subtle glow behind cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease }}
              className={`relative ${i % 2 !== 0 ? 'mt-8 lg:mt-16' : ''}`} // Staggered layout
            >
              <Link href="/products" className="group block">
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden rounded-2xl mb-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.15)]"
                  style={{
                    aspectRatio: "16 / 11",
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "var(--bg-1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  {/* hover veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  {/* Status chip */}
                  <span
                    className="absolute top-4 left-4 inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      background: "rgba(124, 58, 237, 0.2)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(124, 58, 237, 0.4)",
                      borderRadius: "999px",
                      padding: "0.3em 0.8em",
                    }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    {card.status}
                  </span>
                </div>

                {/* Name */}
                <h3
                  className="transition-colors duration-300 group-hover:text-[var(--accent)]"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {card.name}
                </h3>

                {/* Tag labels */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {card.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: "var(--ink-4)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
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
  );
}
