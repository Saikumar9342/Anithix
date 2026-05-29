"use client";

import { useReveal } from "@/hooks/useReveal";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Products() {
  const revealRef = useReveal();

  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ["start end", "end start"]
  });

  // Parallax offsets for different elements
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section ref={revealRef} id="products" className="section" style={{ background: "var(--bg)", overflow: "hidden" }}>
      {/* Abstract Background Glows */}
      <motion.div className="glow-blob" style={{ y: y2, top: "25%", right: "-10%", width: "800px", height: "800px", background: "rgba(139,92,246,0.08)" }} />
      <motion.div className="glow-blob" style={{ y: y1, bottom: "25%", left: "-10%", width: "600px", height: "600px", background: "rgba(79,70,229,0.08)" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 10 }}>
        {/* Massive Section Header */}
        <div className="section-head reveal" style={{ marginBottom: "10rem" }}>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            <span className="idx">03</span> // Products
          </span>
          <h2 className="display-massive">
            A Connected <br />
            <span style={{ color: "var(--ink-3)" }}>Suite.</span>
          </h2>
          <p className="lede reveal reveal-d1" style={{ marginTop: "3rem", maxWidth: "800px", fontSize: "1.2rem" }}>
            Each built with obsession. Not just tools, but entire universes crafted for creators, developers, and visionaries.
          </p>
        </div>

        {/* GRAVITON */}
        <div className="reveal" style={{ marginBottom: "10rem", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div style={{ order: 1 }}>
            <h3 className="display" style={{ marginBottom: "1rem" }}>Graviton</h3>
            <p style={{ fontSize: "1.4rem", color: "var(--accent)", marginBottom: "1.5rem", fontWeight: 500 }}>
              Your personal AI workspace with a newspaper soul.
            </p>
            <p className="lede" style={{ marginBottom: "2rem" }}>
              Connect every AI provider in one intelligent interface. Run local models via Ollama or connect cloud providers (Groq, OpenRouter). Graviton wraps everything in a deeply customizable editorial interface featuring "The Daily Brief" and 8 premium theme presets.
            </p>
            <div className="trust">
              {['Multi-Provider AI', 'Ollama Models', '8 Themes', 'Persistent History'].map(tag => (
                <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.03)" }}>{tag}</span>
              ))}
            </div>
          </div>
          <motion.div className="glass-panel" style={{ order: 2, y: y1 }}>
            <div style={{ position: "absolute", top: "1rem", right: "2rem", fontSize: "6rem", opacity: 0.05, fontFamily: "var(--mono)", fontWeight: 700 }}>01</div>
            <div className="feat-list" style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {[
                { ico: "◐", title: "Local & Cloud", desc: "Ollama, OpenRouter, Groq, Together AI in one workspace." },
                { ico: "📰", title: "The Daily Brief", desc: "Live news, weather, and open threads in a beautiful dashboard." },
                { ico: "🎨", title: "Deep Theming", desc: "8 presets from Editorial Dark to Ocean Glass. 27+ controls." },
                { ico: "◇", title: "Chat Modes", desc: "Switch instantly between Chat, Dev, and Research modes." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "2rem", color: "var(--accent)", marginBottom: "1rem" }}>{item.ico}</div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ATOM */}
        <div className="reveal" style={{ marginBottom: "10rem", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", alignItems: "center" }}>
          <motion.div className="glass-panel" style={{ order: 1, y: y3 }}>
            <div style={{ position: "absolute", top: "1rem", left: "2rem", fontSize: "6rem", opacity: 0.05, fontFamily: "var(--mono)", fontWeight: 700 }}>02</div>
            <div className="steps" style={{ position: "relative", zIndex: 10 }}>
              {[
                { sn: "01", title: "Upload your resume", desc: "Drop your existing PDF. AI extracts and structures your data instantly." },
                { sn: "02", title: "AI generates portfolio", desc: "The design engine creates a stunning portfolio website in seconds." },
                { sn: "03", title: "Customize & enhance", desc: "Fine-tune every detail from your phone. AI suggests improvements." },
                { sn: "04", title: "Go live instantly", desc: "Publish your live portfolio with one tap. Custom domain support included." },
              ].map((step) => (
                <div key={step.sn} className="step" style={{ padding: "1.5rem 0" }}>
                  <span className="sn" style={{ fontSize: "1.2rem", color: "var(--live)" }}>{step.sn}</span>
                  <div>
                    <h5 style={{ fontSize: "1.1rem" }}>{step.title}</h5>
                    <p style={{ fontSize: "0.95rem" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div style={{ order: 2 }}>
            <h3 className="display" style={{ marginBottom: "1rem" }}>Atom</h3>
            <p style={{ fontSize: "1.4rem", color: "var(--live)", marginBottom: "1.5rem", fontWeight: 500 }}>
              Your portfolio, from your pocket.
            </p>
            <p className="lede" style={{ marginBottom: "2rem" }}>
              A mobile-first builder that lets you create and manage professional portfolio websites entirely from your smartphone. Upload a resume and watch AI transform it into a stunning live website.
            </p>
            <div className="trust">
              {['Resume to Portfolio', 'Mobile Management', 'One-Tap Writing', 'Live Sync'].map(tag => (
                <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.03)" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ORBIS */}
        <div className="reveal" style={{ marginBottom: "10rem", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div style={{ order: 1 }}>
            <h3 className="display" style={{ marginBottom: "1rem" }}>Orbis</h3>
            <p style={{ fontSize: "1.4rem", color: "#60a5fa", marginBottom: "1.5rem", fontWeight: 500 }}>
              Automate your content universe.
            </p>
            <p className="lede" style={{ marginBottom: "2rem" }}>
              An AI Media OS that discovers trends, writes content, generates visuals, and publishes on autopilot. Features an advanced Analytics Dashboard, AI-driven A/B Testing, and Smart Scheduling.
            </p>
            <div className="trust">
              {['AI Media OS', 'Analytics', 'A/B Testing', 'Smart Schedule'].map(tag => (
                <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.03)" }}>{tag}</span>
              ))}
            </div>
          </div>
          <motion.div className="glass-panel" style={{ order: 2, y: y2 }}>
            <div style={{ position: "absolute", top: "1rem", right: "2rem", fontSize: "6rem", opacity: 0.05, fontFamily: "var(--mono)", fontWeight: 700 }}>03</div>
            
            {/* Visual Pipeline */}
            <div className="pipeline" style={{ marginBottom: "3rem", justifyContent: "flex-start", position: "relative", zIndex: 10 }}>
              <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Trends</span>
              <span className="pipe-arr">→</span>
              <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Content</span>
              <span className="pipe-arr">→</span>
              <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>A/B Test</span>
              <span className="pipe-arr">→</span>
              <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Publish</span>
            </div>

            <div className="feat-list" style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {[
                { ico: "📈", title: "Deep Analytics", desc: "Track post performance across all platforms in real-time." },
                { ico: "🧪", title: "A/B Testing", desc: "Auto-generate variations and let the audience decide the winner." },
                { ico: "⏱️", title: "Smart Schedule", desc: "AI predicts the optimal time to post for maximum engagement." },
                { ico: "◷", title: "Visual Gen", desc: "On-brand imagery created on demand by AI models." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "2rem", color: "#60a5fa", marginBottom: "1rem" }}>{item.ico}</div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FUTURE LABS */}
        <div className="reveal">
          <motion.div className="glass-panel" style={{ textAlign: "center", padding: "clamp(3rem, 6vw, 6rem)", y: y1 }}>
            <span className="eyebrow" style={{ display: "block", marginBottom: "1.5rem" }}>Product 04 — Research</span>
            <h3 className="display" style={{ marginBottom: "2rem" }}>Future Labs</h3>
            <p className="lede" style={{ margin: "0 auto 4rem", maxWidth: "600px" }}>
              The future is being built here. Experiments, autonomous agents, and prototypes shaping the next generation of Anithix products.
            </p>
            <div className="lab-grid" style={{ maxWidth: "800px", margin: "0 auto", background: "transparent", border: "none", gap: "1rem" }}>
              {[
                { title: "AI Agents", desc: "Autonomous reasoning" },
                { title: "Research", desc: "Pushing boundaries" },
                { title: "Prototypes", desc: "Active testing" },
                { title: "Ecosystem", desc: "Next expansions" },
              ].map((item, i) => (
                <div key={i} className="cell" style={{ padding: "2rem 1.5rem", borderRadius: "1rem" }}>
                  <h4 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
