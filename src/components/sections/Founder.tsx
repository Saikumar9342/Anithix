"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const handleReveal = () => {
      if (sectionRef.current) {
        const reveals = sectionRef.current.querySelectorAll(".reveal");
        reveals.forEach((el) => {
          el.classList.add("in");
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="founder"
      className="section"
      ref={sectionRef}
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">07</span> / The Visionary
          </span>
          <h2 className="h-sec reveal reveal-d1">
            Built by someone<br />
            <span className="dim">obsessed with the future.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            marginTop: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left: Founder info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="reveal"
          >
            {/* Avatar */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                background: "var(--bg-1)",
                border: "1px solid var(--line-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              S
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  right: "-4px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "var(--live)",
                  border: "2px solid var(--bg)",
                }}
              />
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Saikumar
            </h3>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--accent)",
                marginBottom: "1.5rem",
              }}
            >
              Founder & Builder, Anithix
            </div>

            {/* Bio */}
            <div style={{ marginBottom: "2rem" }}>
              {[
                "Anithix wasn't born in a boardroom. It was born from a deep fascination with technology — a conviction that software can be simultaneously powerful, beautiful, and transformative.",
                "As a full-stack developer with a passion for AI, I started building the tools I wished existed: an AI workspace that actually feels intelligent, a portfolio builder that works from your pocket, automation that doesn't require a PhD to configure.",
                "The future isn't something that happens to us. It's something we build.",
              ].map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "var(--ink-3)",
                    marginBottom: i === 2 ? 0 : "1rem",
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
                gap: "1px",
                background: "var(--line)",
                border: "1px solid var(--line)",
              }}
            >
              {TRAITS.map((trait, i) => (
                <div
                  key={i}
                  className="cell"
                  style={{
                    padding: "1.2rem",
                    background: "var(--bg)",
                  }}
                >
                  <h6 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {trait.title}
                  </h6>
                  <p style={{ fontSize: "0.75rem", color: "var(--ink-3)", lineHeight: 1.4 }}>
                    {trait.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Acronym + Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="reveal reveal-d1"
          >
            {/* Acronym section */}
            <div className="cell" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--ink-4)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                What ANITHIX stands for
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {ACRONYM.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        background: "var(--bg-2)",
                        border: "1px solid var(--line-2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.letter}
                    </div>
                    <span style={{ fontSize: "0.95rem", color: "var(--ink)" }}>
                      {item.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="cell" style={{ padding: "1.5rem" }}>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--ink-2)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                  fontStyle: "italic",
                }}
              >
                "I build products that I would want to use every day — tools that feel intelligent,
                look beautiful, and make the complex feel simple."
              </p>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-4)" }}>
                — Saikumar, Founder of Anithix
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
