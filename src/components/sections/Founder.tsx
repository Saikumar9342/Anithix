"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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

function TiltCard({
  children,
  style,
  className,
  glowColor = "rgba(196, 188, 255, 0.8)",
}: {
  children: React.ReactNode;
  style?: any;
  className?: string;
  glowColor?: string;
}) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    rotateX.set(-((mouseY - height / 2) / (height / 2)) * 6);
    rotateY.set(((mouseX - width / 2) / (width / 2)) * 6);

    glowX.set(mouseX);
    glowY.set(mouseY);
    glowOpacity.set(0.15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`${className} relative overflow-hidden`}
    >
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          width: "220px",
          height: "220px",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: glowOpacity,
          mixBlendMode: "screen",
        }}
      />
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

export function Founder() {
  const revealRef = useReveal();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Layered vertical drift & scale transformations
  const profileY = useTransform(scrollYProgress, [0, 0.5, 1], ["50px", "0px", "-50px"]);
  const profileScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.0, 0.96]);
  const profileOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const acronymY = useTransform(scrollYProgress, [0, 0.6, 1], ["100px", "0px", "-80px"]);
  const acronymOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} style={{ height: "160vh", position: "relative" }}>
      {/* Sticky full-screen viewport */}
      <section
        id="founder"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0b071a",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "35px 35px",
          }}
        />

        {/* Massive outline background text (Delassus styling) */}
        <div
          style={{
            position: "absolute",
            right: "2%",
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            transformOrigin: "center center",
            zIndex: 1,
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0.04,
          }}
        >
          <span
            style={{
              fontSize: "clamp(8rem, 16vw, 16rem)",
              fontWeight: 950,
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.8)",
              letterSpacing: "0.05em",
            }}
          >
            FOUNDER
          </span>
        </div>

        <div className="wrap w-full relative z-10">
          <div ref={revealRef} className="section-head reveal">
            <h2
              className="display-massive"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.0,
              }}
            >
              <JellyText text="Built by someone" />
              <JellyText text="obsessed with the future." style={{ color: "var(--accent)" }} />
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "4rem",
              marginTop: "5rem",
              alignItems: "start",
            }}
          >
            {/* Left: Founder info card */}
            <TiltCard
              style={{ y: profileY, scale: profileScale, opacity: profileOpacity }}
              className="glass-panel p-8 md:p-12 rounded-[2.2rem] border border-white/5"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: "var(--ink)",
                    position: "relative",
                  }}
                >
                  S
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "var(--live)",
                      border: "3px solid var(--bg)",
                      boxShadow: "0 0 10px var(--live)",
                    }}
                  />
                </div>
                <div>
                  <h3 className="display" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
                    Saikumar
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Founder & Builder, Anithix
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: "1.2rem",
                  }}
                >
                  Anithix wasn't born in a boardroom. It was born from a deep fascination with technology — a conviction that software can be simultaneously powerful, beautiful, and transformative.
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 500,
                  }}
                >
                  "The future isn't something that happens to us. It's something we build."
                </p>
              </div>

              {/* Traits grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.8rem",
                }}
              >
                {TRAITS.slice(0, 2).map((trait, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1.2rem",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "1.2rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h6 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.3rem", color: "var(--ink)" }}>
                      {trait.title}
                    </h6>
                    <p style={{ fontSize: "0.75rem", color: "var(--ink-4)", lineHeight: 1.4 }}>
                      {trait.desc}
                    </p>
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Right: Acronym + Quote cards */}
            <motion.div
              style={{ y: acronymY, opacity: acronymOpacity }}
              className="flex flex-col gap-6"
            >
              {/* Acronym block */}
              <TiltCard className="glass-panel p-8 md:p-10 rounded-[2.2rem] border border-white/5">
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono, monospace)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  What ANITHIX stands for
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {ACRONYM.map((item, i) => {
                    // Stagger letter glows strictly within [0.08, 0.92]
                    const threshold = 0.08 + (i / ACRONYM.length) * 0.84;
                    const start = threshold - 0.06;
                    const peak = threshold;
                    const end = threshold + 0.06;

                    const letterColor = useTransform(
                      scrollYProgress,
                      [start, peak, end],
                      ["rgba(255,255,255,0.25)", "#c4bcff", "rgba(255,255,255,0.25)"]
                    );
                    const letterGlow = useTransform(
                      scrollYProgress,
                      [start, peak, end],
                      ["none", "0 0 12px rgba(196, 188, 255, 0.6)", "none"]
                    );

                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <motion.div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: letterColor,
                            boxShadow: letterGlow,
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            flexShrink: 0,
                          }}
                        >
                          {item.letter}
                        </motion.div>
                        <span style={{ fontSize: "0.95rem", color: "var(--ink)", fontWeight: 500 }}>
                          {item.word}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </TiltCard>

              {/* Quote card */}
              <TiltCard
                className="glass-panel p-8 rounded-[2.2rem] border border-[var(--accent)]"
                style={{
                  background: "rgba(124, 58, 237, 0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "var(--ink)",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  "I build products that I would want to use every day — tools that feel intelligent, look beautiful, and make the complex feel simple."
                </p>
                <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  — Saikumar, Founder of Anithix
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
