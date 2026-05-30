"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

export function About() {
  const revealRef = useReveal();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
      style={{ background: "var(--bg)", paddingBottom: "10rem" }}
    >
      <div className="wrap">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="Built with purpose." />
            <JellyText className="dim" text="Designed for the future." style={{ color: "var(--ink-3)" }} />
          </h2>
          <div className="headline-mark" />
          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "700px" }}>
            We started with a simple belief: the best technology feels invisible, works effortlessly,
            and quietly transforms how you think and work.
          </p>
        </div>

        {/* Story cards grid */}
        <motion.div
          style={{ y, opacity }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-24"
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
            <div
              key={i}
              className="glass-panel p-10 rounded-[2rem] border border-white/5"
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1.5rem",
                }}
              >
                {card.num}
              </span>
              <h3 className="display mb-4" style={{ fontSize: "2rem" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "1.1rem", color: "var(--ink-3)", lineHeight: 1.6 }}>
                {card.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Mission statement */}
        <div style={{ textAlign: "center", marginTop: "10rem" }}>
          <blockquote
            className="reveal display-massive"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            Software should be <em>beautiful</em>, <br/><em>useful</em>, and transformative.
          </blockquote>
          <div
            className="reveal reveal-d1"
            style={{
              fontSize: "1rem",
              color: "var(--accent)",
              fontFamily: "var(--mono)",
              letterSpacing: "0.2em",
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
