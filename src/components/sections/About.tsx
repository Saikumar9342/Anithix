"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

const CARDS = [
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
];

function StoryCard({
  card,
  cardY,
  cardOpacity,
  cardScale,
}: {
  card: typeof CARDS[0];
  cardY: any;
  cardOpacity: any;
  cardScale: any;
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
      style={{
        y: cardY,
        opacity: cardOpacity,
        scale: cardScale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        scrollSnapAlign: "center",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel p-8 md:p-10 rounded-[2.2rem] border border-white/5 bg-black/45 backdrop-blur-3xl shadow-xl relative overflow-hidden"
    >
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(196, 188, 255, 0.8) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: glowOpacity,
          mixBlendMode: "screen",
        }}
      />
      <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--accent)",
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "1rem",
            fontWeight: 700,
            transform: "translateZ(15px)"
          }}
        >
          {card.num}
        </span>
        <h3 className="display mb-3" style={{ fontSize: "1.6rem", fontWeight: 800, transform: "translateZ(40px)" }}>
          {card.title}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, transform: "translateZ(25px)" }}>
          {card.text}
        </p>
      </div>
    </motion.div>
  );
}

export function About() {
  const revealRef = useReveal();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Sticky Left column fade & minor drift
  const leftOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const leftScale = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.95]);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      {/* Sticky viewport frame */}
      <section
        id="about"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#061d19",
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
            left: "2%",
            top: "50%",
            transform: "translateY(-50%) rotate(270deg)",
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
            PURPOSE
          </span>
        </div>

        <div className="wrap w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Left Column: Sticky Title Block (Span 5) */}
          <motion.div
            style={{ opacity: leftOpacity, scale: leftScale }}
            ref={revealRef}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            <h2
              className="display-massive"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.0,
              }}
            >
              <JellyText text="Built with" />
              <JellyText text="purpose." style={{ color: "var(--accent)" }} />
            </h2>
            <p
              className="lede reveal-d1"
              style={{
                marginTop: "2rem",
                maxWidth: "400px",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.6,
              }}
            >
              We started with a simple belief: the best technology feels invisible, works effortlessly, and quietly transforms how you think and work.
            </p>
          </motion.div>

          {/* Right Column: Scrolling story cards list (Span 7) */}
          <div
            className="lg:col-span-7 h-[60vh] overflow-y-auto pr-4 flex flex-col gap-6"
            style={{
              scrollSnapType: "y mandatory",
              scrollbarWidth: "none", // Firefox
            }}
          >
            {CARDS.map((card, i) => {
              // Stagger the vertical triggers strictly within [0.08, 0.92]
              const threshold = 0.08 + (i / CARDS.length) * 0.84;
              const start = threshold - 0.06;
              const peak = threshold;
              const end = threshold + 0.06;

              const cardY = useTransform(
                scrollYProgress,
                [start, peak, end],
                ["60px", "0px", "-40px"]
              );
              const cardOpacity = useTransform(
                scrollYProgress,
                [start, peak, end],
                [0.3, 1.0, 0.3]
              );
              const cardScale = useTransform(
                scrollYProgress,
                [start, peak, end],
                [0.95, 1.0, 0.95]
              );

              return (
                <StoryCard
                  key={i}
                  card={card}
                  cardY={cardY}
                  cardOpacity={cardOpacity}
                  cardScale={cardScale}
                />
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
