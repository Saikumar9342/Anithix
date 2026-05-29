"use client";

import { useReveal } from "@/hooks/useReveal";

export function About() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="about"
      className="section"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">01</span> / Our Story
          </span>
          <h2 className="h-sec reveal reveal-d1">
            Built with purpose.<br />
            <span className="dim">Designed for the future.</span>
          </h2>
          <p className="lede reveal reveal-d2">
            We started with a simple belief: the best technology feels invisible, works effortlessly,
            and quietly transforms how you think and work.
          </p>
        </div>

        {/* Story cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "var(--line)",
            border: "1px solid var(--line)",
            marginTop: "3rem",
          }}
        >
          {[
            {
              num: "01 — Who we are",
              title: "A studio for intelligent software",
              text: "Anithix is a technology company focused on building intelligent software products powered by modern AI, automation, and innovative engineering.",
            },
            {
              num: "02 — What we build",
              title: "Tools that think with you",
              text: "AI workspaces, portfolio platforms, content automation tools, resume intelligence, and enterprise automation frameworks.",
            },
            {
              num: "03 — Why we build",
              title: "Software should empower",
              text: "We believe software should be beautiful, useful, and transformative. Every product we create is designed to empower people and unlock potential.",
            },
            {
              num: "04 — Our vision",
              title: "An interconnected ecosystem",
              text: "To create a network of intelligent products that redefine how people work, create, and connect in a technology-driven future.",
            },
          ].map((card, i) => (
            <article
              key={i}
              className="cell reveal"
              style={{
                padding: "2rem",
                background: "var(--bg)",
                transitionDelay: `${i * 0.06}s`,
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--ink-4)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.8rem",
                }}
              >
                {card.num}
              </span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.6rem", color: "var(--ink)" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-3)", lineHeight: 1.5 }}>
                {card.text}
              </p>
            </article>
          ))}
        </div>

        {/* Mission statement */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <blockquote
            className="reveal"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)",
              fontWeight: 400,
              color: "var(--ink-2)",
              lineHeight: 1.3,
              marginBottom: "1rem",
            }}
          >
            Software should be <em>beautiful</em>, <em>useful</em>, and transformative.
          </blockquote>
          <div
            className="reveal reveal-d1"
            style={{
              fontSize: "0.75rem",
              color: "var(--ink-4)",
              fontFamily: "var(--mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            — The Anithix Principle
          </div>
        </div>
      </div>
    </section>
  );
}
