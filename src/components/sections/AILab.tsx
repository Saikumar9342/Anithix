"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Cpu, Zap, GitBranch, FlaskConical, Sparkles } from "lucide-react";

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

function NeuralNetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string }> = [];
    const colors = ["rgba(124,58,237,0.6)", "rgba(6,182,212,0.6)", "rgba(168,85,247,0.6)"];

    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ pointerEvents: "none" }}
    />
  );
}

export function AILab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="ai-lab"
      className="section relative overflow-hidden"
      ref={sectionRef}
      style={{ background: "var(--bg)" }}
    >
      {/* Neural network background */}
      <div className="absolute inset-0">
        <NeuralNetworkViz />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg), transparent, var(--bg))",
        }}
      />

      <div className="relative wrap">
        {/* Header */}
        <div className="section-head reveal in">
          <div className="eyebrow reveal in reveal-d1">
            <span className="idx">05</span>AI Lab
          </div>

          <h2 className="h-sec reveal in reveal-d2">
            Where the future{"\n"}comes to life.
          </h2>

          <p className="lede reveal in reveal-d3">
            Deep research, experimental systems, and emerging technologies being
            developed inside the Anithix lab.
          </p>
        </div>

        {/* Lab cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-[var(--line)] border border-[var(--line)]">
          {LAB_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="cell p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      border: "1px solid var(--line-2)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-xs font-500"
                    style={{ color: "var(--ink-4)" }}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-600 text-sm mb-2" style={{ color: "var(--ink)" }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--ink-3)" }}>
                  {item.desc}
                </p>

                {/* Pulse indicator */}
                <div className="flex items-center gap-2 mt-auto">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--live)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                  <span className="text-xs" style={{ color: "var(--ink-4)" }}>
                    Active
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
