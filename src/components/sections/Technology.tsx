"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

export function Technology() {
  const revealRef = useReveal();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(20px)", "blur(0px)"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]); // 3D tilt

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="section relative overflow-hidden"
      style={{ background: "var(--bg)", perspective: "2000px" }}
    >
      <div className="wrap">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="Engineered with" />
            <JellyText className="dim" text="the best tools." />
          </h2>
          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "600px" }}>
            A modern, battle-tested technology stack powering the entire Anithix ecosystem.
          </p>
        </div>

        {/* 3D Scaling Grid Container */}
        <motion.div
          style={{
            scale,
            opacity,
            filter: blur,
            rotateX,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "2rem",
            overflow: "hidden"
          }}
        >
          {/* Blocks */}
          {[
            { cat: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
            { cat: "Backend", items: ["FastAPI", "Node.js", "Express", "Python"] },
            { cat: "Databases", items: ["PostgreSQL", "MongoDB"] },
            { cat: "AI & Models", items: ["Ollama", "OpenRouter", "Groq", "Together AI", "OpenAI APIs"] },
            { cat: "Infrastructure", items: ["Docker", "Linux", "Apache", "Nginx"] },
            { cat: "Approach", items: ["AI-native", "Performance-first", "DX-obsessed"] }
          ].map((block, i) => (
            <div key={i} className="cell" style={{ padding: "4rem 3rem", background: "var(--bg)" }}>
              <div style={{ color: "var(--ink-3)", fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "2rem" }}>
                {block.cat}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {block.items.map((tech) => (
                  <span key={tech} className="chip" style={{ background: "rgba(255,255,255,0.03)", fontSize: "1.1rem", padding: "0.5rem 1rem" }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Tech foot */}
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "4rem",
              background: "var(--bg)",
              textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "1rem", color: "var(--accent)" }}>
              Built for scale
            </div>
            <p style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--ink-2)" }}>
              Advanced · Next-gen · Intelligent · Technology · Hub for Innovation & eXcellence
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
