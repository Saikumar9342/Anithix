"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

const CONCEPTS = [
  { name: "Neural Automation", category: "Core Engine", desc: "Adaptable cognitive loops operating autonomously.", icon: "🧠", x: "12%", y: "15%", qX: -100, qY: -100 },
  { name: "Contextual Intelligence", category: "Data Layer", desc: "Zero-latency situational awareness vectors.", icon: "💾", x: "55%", y: "10%", qX: 100, qY: -100 },
  { name: "Infinite Scaling", category: "Architecture", desc: "Elastic compute pipelines designed for speed.", icon: "⚡", x: "25%", y: "45%", qX: -50, qY: 0 },
  { name: "Agentic Workflows", category: "Logic Layer", desc: "Multi-agent coordination on complex paths.", icon: "⚙️", x: "65%", y: "50%", qX: 100, qY: 50 },
  { name: "Real-time Synergy", category: "Network", desc: "Instant sync across the global suite nodes.", icon: "🌐", x: "42%", y: "75%", qX: 0, qY: 100 },
];

function ConceptCard({
  concept,
  cardY,
  cardOpacity,
  cardScale,
  onHoverStart,
  onHoverEnd
}: {
  concept: typeof CONCEPTS[0];
  cardY: any;
  cardOpacity: any;
  cardScale: any;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Perspective Tilt Motion Values
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  // Floating cursor radial glow highlight coordinates
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

    // Map coordinates to range [-7, 7] degrees
    rotateX.set(-((mouseY - height / 2) / (height / 2)) * 8);
    rotateY.set(((mouseX - width / 2) / (width / 2)) * 8);

    // Dynamic glow dot position
    glowX.set(mouseX);
    glowY.set(mouseY);
    glowOpacity.set(0.18);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onHoverStart}
      style={{
        position: "absolute",
        left: concept.x,
        top: concept.y,
        y: cardY,
        opacity: cardOpacity,
        scale: cardScale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        pointerEvents: "auto",
      }}
      className="glass-panel max-w-[280px] p-6 rounded-[1.8rem] border border-white/5 bg-black/45 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-violet-500/20 hover:bg-black/60 group relative overflow-hidden"
      data-cursor="hover"
    >
      {/* Floating Radial Cursor Glow Highlight */}
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: glowOpacity,
          mixBlendMode: "screen",
        }}
      />

      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            display: "inline-block",
            transform: "translateZ(20px)"
          }}
        >
          {concept.icon}
        </div>
        <h4
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: "0.25rem",
            letterSpacing: "0.01em",
          }}
        >
          {concept.name}
        </h4>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
          }}
        >
          {concept.category}
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {concept.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function Ecosystem() {
  const revealRef = useReveal();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background Orbit System Rotation & Scale
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const orbitScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.15, 0.9]);
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.1, 0.35, 0.35, 0.05]);

  // Magnetic Attraction: Shifting target offsets of background orbits when card is hovered
  const [hoveredCard, setHoveredCard] = useState<typeof CONCEPTS[0] | null>(null);

  const magnetX = useSpring(hoveredCard ? hoveredCard.qX : 0, { stiffness: 60, damping: 15 });
  const magnetY = useSpring(hoveredCard ? hoveredCard.qY : 0, { stiffness: 60, damping: 15 });

  // Section Header slide-out
  const headY = useTransform(scrollYProgress, [0, 0.4], ["0px", "-60px"]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "170vh", position: "relative" }}>
      {/* Sticky viewport content */}
      <section
        id="ecosystem"
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
        {/* Glowing Background Cosmic Orbits with Magnetic Attraction Shifts */}
        <motion.div
          style={{
            rotate: orbitRotation,
            scale: orbitScale,
            opacity: orbitOpacity,
            x: useTransform(magnetX, (val) => `calc(-50% + ${val}px)`),
            y: useTransform(magnetY, (val) => `calc(-50% + ${val}px)`),
            position: "absolute",
            width: "800px",
            height: "800px",
            top: "50%",
            left: "50%",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
            <circle cx="100" cy="100" r="80" stroke="var(--accent)" strokeWidth="0.25" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="55" stroke="var(--live)" strokeWidth="0.2" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="30" stroke="var(--accent)" strokeWidth="0.4" />
            {/* Pulsing Orbiting Dots */}
            <circle cx="100" cy="20" r="1.5" fill="var(--accent)" />
            <circle cx="45" cy="100" r="1.2" fill="var(--live)" />
            <circle cx="100" cy="170" r="1.8" fill="var(--accent)" />
          </svg>
        </motion.div>

        {/* Section Header */}
        <div className="wrap" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <motion.div
            style={{ y: headY, opacity: headOpacity }}
            ref={revealRef}
            className="section-head reveal"
          >
            <h2
              className="display-massive"
              style={{
                marginBottom: "0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <JellyText text="One ecosystem." />
              <JellyText text="Infinite possibilities." style={{ color: "var(--accent)" }} />
            </h2>
            <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "600px", fontSize: "1.05rem" }}>
              Every Anithix product is part of a living, intelligent network designed to work together seamlessly. Data flows continuously, context is shared instantly.
            </p>
          </motion.div>
        </div>

        {/* Floating Moon-Like Concepts Canvas */}
        <div className="wrap absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            {CONCEPTS.map((concept, i) => {
              // Custom activator math. Bound the trigger range strictly within [0, 1]
              const threshold = 0.15 + (i / CONCEPTS.length) * 0.68;
              const cardStart = threshold - 0.08;
              const cardEnd = threshold + 0.08;

              const cardYProgress = useTransform(
                scrollYProgress,
                [0, cardStart, cardEnd, 1],
                ["120px", "0px", "0px", "-100px"]
              );
              const cardOpacity = useTransform(
                scrollYProgress,
                [0, cardStart, cardEnd, 1],
                [0, 1, 1, 0]
              );
              const cardScale = useTransform(
                scrollYProgress,
                [0, cardStart, cardEnd, 1],
                [0.9, 1, 1, 0.85]
              );

              return (
                <ConceptCard
                  key={concept.name}
                  concept={concept}
                  cardY={cardYProgress}
                  cardOpacity={cardOpacity}
                  cardScale={cardScale}
                  onHoverStart={() => setHoveredCard(concept)}
                  onHoverEnd={() => setHoveredCard(null)}
                />
              );
            })}
          </div>
        </div>

      </section>
    </div>
  );
}
