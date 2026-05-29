"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { HeroScene3D } from "./HeroScene3D";

const HeroScene3DLazy = dynamic(
  () => import("./HeroScene3D").then((m) => ({ default: m.HeroScene3D })),
  { ssr: false }
);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Full-screen 3D canvas */}
      <div className="absolute inset-0">
        <HeroScene3DLazy />
      </div>

      {/* Hero vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 70% at 78% 50%, transparent 30%, rgba(8,8,10,0.55) 80%),
            linear-gradient(90deg, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.2) 38%, transparent 60%),
            linear-gradient(0deg, var(--bg) 2%, transparent 22%)
          `,
        }}
      />

      {/* Hero grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(ellipse 60% 100% at 50% 0%, black 0%, transparent 70%)",
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-[var(--pad)] min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        {/* Left column: text (50% on desktop, full on mobile) */}
        <div className="flex flex-col justify-center py-32 lg:py-0 z-10 reveal in">
          {/* Badge */}
          <div className="badge reveal in reveal-d1 mb-8 w-fit">
            <span className="dot" />
            <span>Refined AI Platform</span>
          </div>

          {/* Headline */}
          <h1 className="display reveal in reveal-d2 mb-6 leading-tight">
            <span className="block">We build</span>
            <span className="block">intelligent</span>
            <span className="block">products.</span>
          </h1>

          {/* Lede */}
          <p className="lede reveal in reveal-d3 mb-10">
            Anithix crafts AI-powered software and developer tools for creators and teams who demand precision and performance.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14 reveal in reveal-d4">
            <a
              href="/products"
              className="btn btn-solid"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Explore Products
              <span className="arr">→</span>
            </a>
            <a
              href="/ecosystem"
              className="btn btn-ghost"
            >
              Enter the Ecosystem
              <span className="arr">→</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="trust reveal in reveal-d4">
            <span className="lbl">Powered by</span>
            {["Ollama", "OpenRouter", "Groq", "Together AI"].map((n) => (
              <span key={n} className="chip">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: 3D scene (hidden on mobile) */}
        <div className="hidden lg:relative lg:flex items-center justify-center" style={{ height: "100vh" }}>
          {/* Black bg ensures no flash before canvas loads */}
          <div className="absolute inset-0" style={{ background: "var(--bg)" }} />
        </div>
      </div>

      {/* Bottom stats bar */}
      <div
        className="absolute bottom-12 left-[var(--pad)] flex items-center gap-8 z-10 reveal in reveal-d4"
        style={{ color: "var(--ink-3)" }}
      >
        <div>
          <div className="text-2xl font-600" style={{ color: "var(--ink)" }}>
            3+
          </div>
          <div className="mono text-xs" style={{ color: "var(--ink-4)" }}>
            Products
          </div>
        </div>
        <div className="w-px h-8" style={{ background: "var(--line-2)" }} />
        <div>
          <div className="text-2xl font-600" style={{ color: "var(--ink)" }}>
            2024
          </div>
          <div className="mono text-xs" style={{ color: "var(--ink-4)" }}>
            Founded
          </div>
        </div>
        <div className="w-px h-8" style={{ background: "var(--line-2)" }} />
        <div>
          <div className="text-2xl font-600" style={{ color: "var(--ink)" }}>
            100%
          </div>
          <div className="mono text-xs" style={{ color: "var(--ink-4)" }}>
            AI-Native
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 right-[var(--pad)] flex flex-col items-center gap-2 z-10 reveal in reveal-d4"
        style={{ color: "var(--ink-4)" }}
      >
        <div className="scroll-line" />
        <span className="eyebrow">Scroll</span>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--bg), transparent)",
        }}
      />
    </section>
  );
}
