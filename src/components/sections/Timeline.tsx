"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TIMELINE } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

export function Timeline() {
  const revealRef = useReveal();
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll to drive horizontal scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the horizontal translation offset. 
  // We want the track of cards to slide cleanly from right to left.
  const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);

  return (
    <div ref={containerRef} style={{ height: "230vh", position: "relative" }}>
      {/* Sticky full-screen viewport */}
      <section
        id="timeline"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Subtle grid lines background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Section Header */}
        <div className="wrap" style={{ position: "absolute", top: "8rem", left: 0, right: 0, zIndex: 20 }}>
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
              <JellyText text="From vision" />
              <JellyText text="to reality." style={{ color: "var(--accent)" }} />
            </h2>
          </div>
        </div>

        {/* Sticky Laser Axis in the left-center of viewport */}
        <div
          style={{
            position: "absolute",
            left: "20vw",
            top: "25vh",
            bottom: "15vh",
            width: "1px",
            background: "linear-gradient(to bottom, transparent, var(--accent), var(--live), transparent)",
            boxShadow: "0 0 20px var(--accent), 0 0 40px var(--live)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "var(--live)",
              boxShadow: "0 0 15px var(--live), 0 0 30px var(--accent)",
            }}
          />
        </div>

        {/* Horizontal Scroll Track */}
        <div className="w-full relative overflow-visible" style={{ marginTop: "12vh" }}>
          <motion.div
            className="flex items-center gap-12 pl-[25vw] pr-[20vw]"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4rem",
              paddingLeft: "25vw",
              paddingRight: "25vw",
              x: xTranslation,
            }}
          >
            {/* The Horizontal Line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: "2px",
                background: "linear-gradient(90deg, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0.6) 50%, rgba(16,185,129,0.1) 100%)",
                zIndex: 1,
              }}
            />

            {TIMELINE.map((item, i) => {
              // Stagger the horizontal triggers strictly within [0.08, 0.92]
              const threshold = 0.08 + (i / TIMELINE.length) * 0.84;
              const cardStart = threshold - 0.06;
              const cardPeak = threshold;
              const cardEnd = threshold + 0.06;

              const cardScale = useTransform(
                scrollYProgress,
                [cardStart, cardPeak, cardEnd],
                [0.85, 1.08, 0.85]
              );
              const cardOpacity = useTransform(
                scrollYProgress,
                [cardStart, cardPeak, cardEnd],
                [0.45, 1.0, 0.45]
              );
              const cardBorderColor = useTransform(
                scrollYProgress,
                [cardStart, cardPeak, cardEnd],
                ["rgba(255,255,255,0.05)", "rgba(196, 188, 255, 1)", "rgba(255,255,255,0.05)"]
              );
              const cardShadow = useTransform(
                scrollYProgress,
                [cardStart, cardPeak, cardEnd],
                ["0 10px 30px rgba(0,0,0,0.3)", "0 20px 50px rgba(124,58,237,0.25)", "0 10px 30px rgba(0,0,0,0.3)"]
              );

              return (
                <motion.div
                  key={i}
                  style={{
                    scale: cardScale,
                    opacity: cardOpacity,
                    borderColor: cardBorderColor,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    boxShadow: cardShadow,
                    position: "relative",
                    zIndex: 5,
                    flexShrink: 0,
                    width: "360px",
                    transformStyle: "preserve-3d",
                  }}
                  className="glass-panel p-8 md:p-10 rounded-[2.2rem] bg-black/45 backdrop-blur-3xl overflow-hidden"
                >
                  {/* Blueprint tech grid overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Glowing Node Dot connecting to center line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "-34px",
                      transform: "translateY(-50%)",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "var(--accent)" : "var(--live)",
                      boxShadow: `0 0 10px ${i % 2 === 0 ? "var(--accent)" : "var(--live)"}`,
                      zIndex: 10,
                    }}
                  />

                  <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
                    {/* Year Flag */}
                    <span
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono, monospace)",
                        display: "block",
                        marginBottom: "1rem",
                        transform: "translateZ(15px)"
                      }}
                    >
                      {item.year}
                    </span>

                    <h3
                      className="display mb-3"
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        transform: "translateZ(40px)"
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.6)",
                        transform: "translateZ(25px)"
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
