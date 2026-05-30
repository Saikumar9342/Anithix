"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

const CONCEPTS = [
  { name: "Neural Automation", category: "Core Engine" },
  { name: "Contextual Intelligence", category: "Data Layer" },
  { name: "Infinite Scaling", category: "Architecture" },
  { name: "Agentic Workflows", category: "Logic Layer" },
  { name: "Real-time Synergy", category: "Network" },
];

export function Ecosystem() {
  const revealRef = useReveal();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Top row moves left (-), Bottom row moves right (+)
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="section relative"
      style={{ background: "var(--bg)", overflow: "hidden" }}
    >
      <div className="wrap mb-24">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="One ecosystem." />
            <JellyText text="Infinite possibilities." style={{ color: "var(--accent)" }} />
          </h2>
          <div className="headline-mark" />
          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "800px" }}>
            Every Anithix product is part of a living, intelligent network designed to work together seamlessly. Data flows continuously, context is shared instantly, and intelligence scales infinitely.
          </p>
        </div>
      </div>

      {/* Massive Horizontal Parallax Marquees */}
      <div className="relative w-full flex flex-col gap-8 select-none" style={{ width: "200vw", left: "-20vw" }}>
        
        {/* Row 1: Moves Left */}
        <motion.div style={{ x: x1 }} className="flex items-center gap-8 pl-[20vw]">
          {CONCEPTS.map((p, i) => (
            <div key={i} className="glass-panel shrink-0 flex items-center gap-6 px-12 py-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <span className="text-4xl" style={{ color: "var(--accent)" }}>◈</span>
              <div>
                <h4 className="text-3xl font-bold mb-1">{p.name}</h4>
                <p className="text-lg" style={{ color: "var(--ink-3)" }}>{p.category}</p>
              </div>
            </div>
          ))}
          {/* Duplicates for infinite illusion */}
          {CONCEPTS.map((p, i) => (
            <div key={`dup-${i}`} className="glass-panel shrink-0 flex items-center gap-6 px-12 py-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <span className="text-4xl" style={{ color: "var(--accent)" }}>◈</span>
              <div>
                <h4 className="text-3xl font-bold mb-1">{p.name}</h4>
                <p className="text-lg" style={{ color: "var(--ink-3)" }}>{p.category}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Row 2: Moves Right */}
        <motion.div style={{ x: x2 }} className="flex items-center gap-8 pl-[10vw]">
          {[...CONCEPTS].reverse().map((p, i) => (
            <div key={i} className="glass-panel shrink-0 flex items-center gap-6 px-12 py-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <span className="text-4xl" style={{ color: "var(--live)" }}>◇</span>
              <div>
                <h4 className="text-3xl font-bold mb-1">{p.name}</h4>
                <p className="text-lg" style={{ color: "var(--ink-3)" }}>{p.category}</p>
              </div>
            </div>
          ))}
          {/* Duplicates for infinite illusion */}
          {[...CONCEPTS].reverse().map((p, i) => (
            <div key={`dup2-${i}`} className="glass-panel shrink-0 flex items-center gap-6 px-12 py-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <span className="text-4xl" style={{ color: "var(--live)" }}>◇</span>
              <div>
                <h4 className="text-3xl font-bold mb-1">{p.name}</h4>
                <p className="text-lg" style={{ color: "var(--ink-3)" }}>{p.category}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
