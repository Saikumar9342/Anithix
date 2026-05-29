"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const HeroScene3DLazy = dynamic(
  () => import("./HeroScene3D").then((m) => ({ default: m.HeroScene3D })),
  { ssr: false }
);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Full-screen 3D canvas */}
      <div className="absolute inset-0 z-0">
        <HeroScene3DLazy />
      </div>

      {/* Atmospheric vignette overlay (Smooth, no grid) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 60% 50%, transparent 10%, rgba(8,8,10,0.85) 100%),
            linear-gradient(90deg, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.6) 40%, transparent 100%),
            linear-gradient(180deg, rgba(8,8,10,0.4) 0%, transparent 30%, rgba(8,8,10,0.95) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="wrap relative min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-0 items-center z-10">
        
        {/* Left column: text */}
        <div className="flex flex-col justify-center py-32 lg:py-0 lg:pb-16 reveal in lg:col-span-7 xl:col-span-6">
          
          {/* Badge */}
      

          {/* Headline */}
          <h1 className="reveal in reveal-d2 mb-6" style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
            <span className="block" style={{ color: "#fff" }}>We build</span>
            <span className="block" style={{ background: "linear-gradient(90deg, #fff, var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>intelligent</span>
            <span className="block" style={{ color: "var(--ink-3)" }}>products.</span>
          </h1>

          {/* Lede */}
          <p className="lede reveal in reveal-d3 mb-10" style={{ fontSize: "1.15rem", color: "var(--ink-2)" }}>
            Anithix crafts AI-powered software and developer tools for creators and teams who demand precision and performance.
          </p>

          {/* Premium Glass CTAs */}
          <div className="flex flex-wrap gap-4 mb-12 reveal in reveal-d4">
            <a
              href="#products"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "1rem 2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
              }}
            >
              Explore Products
              <span className="arr">→</span>
            </a>
            <a
              href="#ecosystem"
              className="btn btn-ghost"
              style={{
                borderColor: "transparent",
                color: "var(--ink-3)",
                padding: "1rem 1.5rem"
              }}
            >
              The Ecosystem
            </a>
          </div>

          {/* Trust indicators */}
          <div className="trust reveal in reveal-d4" style={{ marginTop: 0 }}>
            <span className="lbl">Powered by</span>
            {["Ollama", "OpenRouter", "Groq"].map((n) => (
              <span key={n} className="chip" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)" }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Premium minimal bottom stats */}
        <div
          className="absolute bottom-12 flex items-center z-10 reveal in reveal-d4"
          style={{ left: "var(--pad)", color: "var(--ink-3)" }}
        >
          <div className="pr-8 sm:pr-10">
            <div className="text-xl font-600" style={{ color: "var(--ink)" }}>3+</div>
            <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>Products</div>
          </div>
          <div className="w-px h-8" style={{ background: "var(--line-2)" }} />
          <div className="px-8 sm:px-10">
            <div className="text-xl font-600" style={{ color: "var(--ink)" }}>2024</div>
            <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>Founded</div>
          </div>
          <div className="w-px h-8" style={{ background: "var(--line-2)" }} />
          <div className="pl-8 sm:pl-10">
            <div className="text-xl font-600" style={{ color: "var(--ink)" }}>100%</div>
            <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>AI-Native</div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 flex flex-col items-center gap-2 z-10 reveal in reveal-d4"
          style={{ right: "var(--pad)", color: "var(--ink-4)" }}
        >
          <div className="scroll-line" />
          <span className="eyebrow" style={{ fontSize: "0.65rem" }}>Scroll</span>
        </div>

      </div>
    </section>
  );
}
