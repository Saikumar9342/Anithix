"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TIMELINE } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

function TimelineCard({ item, isEven }: { item: any; isEven: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const x = useTransform(scrollYProgress, [0.2, 0.8], [isEven ? -100 : 100, 0]);
  const scale = useTransform(scrollYProgress, [0.2, 0.8], [0.8, 1]);

  return (
    <div className={`relative w-full flex ${isEven ? 'justify-start' : 'justify-end'} items-center`}>
      <motion.div 
        ref={cardRef}
        style={{ opacity, x, scale }}
        className={`w-full md:w-[45%] glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl ${isEven ? 'md:text-right' : 'md:text-left'}`}
      >
        <span className="eyebrow inline-block mb-4" style={{ color: "var(--accent)", fontSize: "1.2rem", justifyContent: isEven ? 'flex-end' : 'flex-start' }}>{item.year}</span>
        <h3 className="display mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}><JellyText text={item.title} /></h3>
        <p className="text-[1.1rem] text-[var(--ink-3)] leading-relaxed">{item.description}</p>
      </motion.div>
      
      {/* Center glowing dot indicator */}
      <motion.div 
        style={{ opacity, scale }}
        className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg)] border-[4px] border-[var(--accent)] z-10" 
      />
    </div>
  );
}

export function Timeline() {
  const revealRef = useReveal();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  return (
    <section
      id="timeline"
      className="section relative overflow-hidden"
      ref={sectionRef}
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="From vision" />
            <JellyText text="to reality." style={{ color: "var(--ink-3)" }} />
          </h2>
        </div>
      </div>

      <div className="wrap relative">
        <div className="relative max-w-5xl mx-auto py-20">
          {/* Animated vertical central line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, transparent, var(--accent), var(--live))",
                boxShadow: "0 0 20px var(--accent)",
              }}
              className="w-full absolute top-0 left-0 rounded-full"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-32">
            {TIMELINE.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <TimelineCard key={i} item={item} isEven={isEven} />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
