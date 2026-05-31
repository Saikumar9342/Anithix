"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  
  // Track this card's exit transition as it is scrolled up the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"]
  });

  // Scale down and blur as the card is covered/exited
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(6px)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.65]);
  const yOffset = useTransform(scrollYProgress, [0, 1], ["0px", "-20px"]);

  // 3D Card Hover Tilt mechanics
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

  // Calculate the sticky top offset so they stack beautifully
  const topOffset = 140 + index * 30; // pixels from top
  const zIndex = index;
  
  return (
    <div 
      className="sticky" 
      style={{ top: `${topOffset}px`, zIndex, paddingBottom: "8vh" }}
    >
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-panel w-full p-8 md:p-14 rounded-[2.2rem] border border-white/5 flex flex-col md:flex-row gap-8 md:gap-14 items-start backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        style={{ 
          scale, 
          filter: blur, 
          opacity, 
          y: yOffset,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: `linear-gradient(135deg, rgba(20,20,25,0.96) 0%, rgba(5,5,8,0.98) 100%)`,
          boxShadow: "0 -30px 60px rgba(0,0,0,0.65)",
          transformOrigin: "top center"
        }}
      >
        {/* Blueprint tech grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating Radial Cursor Glow Highlight */}
        <motion.div
          style={{
            position: "absolute",
            left: glowX,
            top: glowY,
            width: "240px",
            height: "240px",
            background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            opacity: glowOpacity,
            mixBlendMode: "screen",
          }}
        />
        <div className="shrink-0 pt-3" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "1.2rem",
              background: `rgba(${parseInt(item.color.slice(1,3), 16) || 124}, ${parseInt(item.color.slice(3,5), 16) || 58}, ${parseInt(item.color.slice(5,7), 16) || 237}, 0.1)`,
              border: `1px solid ${item.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <item.icon size={36} color={item.color} strokeWidth={1.5} />
          </div>
        </div>
        
        <div style={{ flex: 1, transformStyle: "preserve-3d" }}>
          <div className="flex items-center gap-3 mb-4" style={{ transform: "translateZ(25px)" }}>
            <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ color: item.color }}>{item.status}</span>
            <motion.div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.25 }}
            />
          </div>
          <h3 className="display mb-3" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, transform: "translateZ(45px)", transformStyle: "preserve-3d" }}>{item.title}</h3>
          <p className="text-[1.05rem] text-[var(--ink-3)] leading-relaxed max-w-2xl font-medium" style={{ transform: "translateZ(28px)" }}>{item.desc}</p>
        </div>

        {/* Index flag */}
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            fontFamily: "var(--font-mono, monospace)",
            color: "rgba(255,255,255,0.03)",
            alignSelf: "flex-end",
            userSelect: "none",
            transform: "translateZ(10px)"
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
}

export function AILab() {
  const revealRef = useReveal();

  return (
    <section 
      id="ai-lab" 
      className="section relative" 
      style={{ 
        background: "#130f26", 
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
        position: "relative"
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
          AILAB
        </span>
      </div>

      <div className="wrap relative z-10">
        <div ref={revealRef} className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="Where the future" />
            <JellyText text="comes to life." style={{ color: "var(--accent)" }} />
          </h2>
          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "600px", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)" }}>
            Deep research, experimental systems, and emerging technologies being developed inside the Anithix lab.
          </p>
        </div>
      </div>

      <div className="wrap relative z-10" style={{ marginTop: "4rem" }}>
        <div className="flex flex-col relative">
          {LAB_ITEMS.map((item, i) => (
            <StickyCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
