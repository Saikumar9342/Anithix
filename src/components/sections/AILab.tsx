"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Cpu, Zap, GitBranch, FlaskConical, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

const LAB_ITEMS = [
  {
    icon: Brain,
    title: "AI Agents",
    desc: "Autonomous agents that perceive, reason, and act across complex multi-step tasks without human intervention.",
    color: "#7C3AED",
    status: "Research",
  },
  {
    icon: Cpu,
    title: "Neural Automation",
    desc: "Neural network-driven automation systems that learn and adapt to operational patterns over time.",
    color: "#8B5CF6",
    status: "Prototype",
  },
  {
    icon: GitBranch,
    title: "Agentic Workflows",
    desc: "Multi-agent orchestration systems where specialized AI models collaborate on complex pipelines.",
    color: "#A855F7",
    status: "Research",
  },
  {
    icon: Zap,
    title: "Real-time Intelligence",
    desc: "Edge AI inference systems capable of sub-100ms decision-making for critical applications.",
    color: "#10B981",
    status: "Concept",
  },
  {
    icon: FlaskConical,
    title: "Experimental Models",
    desc: "Custom fine-tuned models trained on domain-specific datasets for specialized Anithix products.",
    color: "#F59E0B",
    status: "Active",
  },
  {
    icon: Sparkles,
    title: "Generative Systems",
    desc: "Next-generation generative AI pipelines for content, design, code, and creative assets.",
    color: "#EF4444",
    status: "Development",
  },
];

function StickyCard({ item, index }: { item: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Calculate the sticky top offset so they stack beautifully
  const topOffset = 150 + index * 40; // pixels from top
  const zIndex = index;
  
  // Parallax the icon inside the card
  const iconY = useTransform(scrollYProgress, [0, 1], [-80, 0]);

  return (
    <div 
      className="sticky" 
      style={{ top: `${topOffset}px`, zIndex, paddingBottom: "10vh" }}
    >
      <motion.div 
        ref={cardRef}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full p-8 md:p-16 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-8 md:gap-16 items-start backdrop-blur-2xl"
        style={{ 
          background: `linear-gradient(135deg, rgba(20,20,25,0.95) 0%, rgba(5,5,8,0.98) 100%)`,
          boxShadow: "0 -20px 40px rgba(0,0,0,0.6)",
          transformOrigin: "top center"
        }}
      >
        <motion.div style={{ y: iconY }} className="shrink-0 pt-4">
          <item.icon size={64} color={item.color} strokeWidth={1} />
        </motion.div>
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm tracking-widest uppercase font-bold" style={{ color: item.color }}>{item.status}</span>
            <motion.div 
              className="w-2 h-2 rounded-full" 
              style={{ background: item.color, boxShadow: `0 0 15px ${item.color}` }} 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            />
          </div>
          <h3 className="display mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{item.title}</h3>
          <p className="text-xl text-[var(--ink-3)] leading-relaxed max-w-2xl font-medium">{item.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function AILab() {
  const revealRef = useReveal();

  return (
    <section id="ai-lab" className="section relative" style={{ background: "var(--bg)" }}>
      <div className="wrap">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="Where the future" />
            <JellyText text="comes to life." style={{ color: "var(--accent)" }} />
          </h2>
          <div className="headline-mark" />
          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "600px" }}>
            Deep research, experimental systems, and emerging technologies being developed inside the Anithix lab.
          </p>
        </div>
      </div>

      <div className="wrap relative">
        <div className="flex flex-col relative">
          {LAB_ITEMS.map((item, i) => (
            <StickyCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
