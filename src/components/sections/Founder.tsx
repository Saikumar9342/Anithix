"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

const ACRONYM = [
  { letter: "A", word: "Advanced" },
  { letter: "N", word: "Next-generation" },
  { letter: "I", word: "Intelligent" },
  { letter: "T", word: "Technology" },
  { letter: "H", word: "Hub for" },
  { letter: "I", word: "Innovation &" },
  { letter: "X", word: "eXcellence" },
];

const TRAITS = [
  { title: "Full-Stack Engineering", desc: "Building end-to-end from pixel to server with precision." },
  { title: "AI Innovation", desc: "Integrating cutting-edge AI into real-world products." },
  { title: "Future-Focused", desc: "Always building for what's next, not what exists today." },
  { title: "Rapid Builder", desc: "Turning ideas into working products at speed." },
];

export function Founder() {
  const revealRef = useReveal();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="section relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="Built by someone" />
            <JellyText text="obsessed with the future." style={{ color: "var(--accent)" }} />
          </h2>
          <div className="headline-mark" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "4rem",
            marginTop: "6rem",
            alignItems: "start",
          }}
        >
          {/* Left: Founder info */}
          <motion.div
            style={{ y: y1 }}
            className="glass-panel p-10 md:p-16 rounded-[2rem] border border-white/5"
          >
            {/* Avatar */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              S
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  right: "-6px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "var(--live)",
                  border: "3px solid var(--bg)",
                  boxShadow: "0 0 10px var(--live)",
                }}
              />
            </div>

            <h3 className="display" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              Saikumar
            </h3>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--accent)",
                marginBottom: "2rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
            >
              Founder & Builder, Anithix
            </div>

            {/* Bio */}
            <div style={{ marginBottom: "3rem" }}>
              {[
                "Anithix wasn't born in a boardroom. It was born from a deep fascination with technology — a conviction that software can be simultaneously powerful, beautiful, and transformative.",
                "As a full-stack developer with a passion for AI, I started building the tools I wished existed: an AI workspace that actually feels intelligent, a portfolio builder that works from your pocket, automation that doesn't require a PhD to configure.",
                "The future isn't something that happens to us. It's something we build.",
              ].map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: "var(--ink-3)",
                    marginBottom: i === 2 ? 0 : "1.5rem",
                    fontWeight: i === 2 ? 500 : 400,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Traits grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {TRAITS.map((trait, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h6 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--ink)" }}>
                    {trait.title}
                  </h6>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-4)", lineHeight: 1.5 }}>
                    {trait.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Acronym + Quote */}
          <motion.div
            style={{ y: y2 }}
            className="flex flex-col gap-8"
          >
            {/* Acronym section */}
            <div className="glass-panel p-10 md:p-12 rounded-[2rem] border border-white/5">
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "2rem",
                  fontWeight: 600
                }}
              >
                What ANITHIX stands for
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {ACRONYM.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.letter}
                    </div>
                    <span style={{ fontSize: "1.3rem", color: "var(--ink)", fontWeight: 500 }}>
                      {item.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="glass-panel p-10 md:p-12 rounded-[2rem] border border-[var(--accent)]" style={{ background: "rgba(124, 58, 237, 0.05)" }}>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "var(--ink)",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                "I build products that I would want to use every day — tools that feel intelligent,
                look beautiful, and make the complex feel simple."
              </p>
              <div style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                — Saikumar, Founder of Anithix
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
