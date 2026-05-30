"use client";

import { useReveal } from "@/hooks/useReveal";
import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { JellyText } from "@/components/animations/JellyText";
import { WarpEffect } from "@/components/animations/WarpEffect";
import { Sparkles, ArrowRight } from "lucide-react";

function ProductCard({ 
  title, 
  subtitle, 
  desc, 
  image, 
  alignRight,
  onWarp,
  children 
}: {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  alignRight?: boolean;
  onWarp: () => void;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]); 
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]); 
  const panelY = useTransform(scrollYProgress, [0, 1], [100, -100]); 
  
  return (
    <div ref={containerRef} className="relative h-[90vh] min-h-[700px] w-full rounded-[2rem] overflow-hidden mb-32 reveal">
      <motion.img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale: imgScale, y: imgY }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      
      <div className={`absolute inset-0 p-8 md:p-16 flex flex-col justify-end ${alignRight ? 'items-end' : 'items-start'}`}>
        <motion.div style={{ y: panelY }} className="glass-panel max-w-2xl w-full backdrop-blur-3xl bg-black/40 border border-white/10 p-10 md:p-14 rounded-[1.5rem]">
          <div className="mb-6">
            <h3 className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "0.5rem" }}><JellyText text={title} /></h3>
            <p style={{ fontSize: "1.2rem", color: "var(--accent)", fontWeight: 500 }}>{subtitle}</p>
          </div>
          <p className="lede" style={{ marginBottom: "2.5rem", fontSize: "1.1rem" }}>{desc}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {children}
          </div>
          
          <motion.button
            onClick={onWarp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors group mt-4"
            data-cursor="hover"
          >
            <Sparkles className="w-4 h-4" />
            <span style={{ letterSpacing: "0.05em" }}>TRAVEL AT WARP SPEED</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export function Products() {
  const revealRef = useReveal();
  const [warpActive, setWarpActive] = useState(false);
  const [warpUrl, setWarpUrl] = useState<string | null>(null);

  const triggerWarp = useCallback((url: string) => {
    setWarpUrl(url);
    setWarpActive(true);
  }, []);

  const handleWarpComplete = useCallback(() => {
    setWarpActive(false);
    if (warpUrl) {
      window.location.href = warpUrl;
      setWarpUrl(null);
    }
  }, [warpUrl]);

  return (
    <>
      <WarpEffect active={warpActive} onComplete={handleWarpComplete} />
      <section ref={revealRef} id="products" className="section" style={{ background: "var(--bg)", overflow: "hidden" }}>
      <div className="wrap" style={{ position: "relative", zIndex: 10 }}>
        {/* Massive Section Header */}
        <div className="section-head reveal">
          <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <JellyText text="A Connected" />
            <JellyText text="Suite." style={{ color: "var(--accent)" }} />
          </h2>
          <div className="headline-mark" />
          <p className="lede reveal reveal-d1" style={{ marginTop: "3rem", maxWidth: "800px", fontSize: "1.2rem" }}>
            Each built with obsession. Not just tools, but entire universes crafted for creators, developers, and visionaries.
          </p>
        </div>

        {/* GRAVITON */}
        <ProductCard
          title="Graviton"
          subtitle="Your personal AI workspace with a newspaper soul."
          desc="Connect every AI provider in one intelligent interface. Run local models via Ollama or connect cloud providers. Graviton wraps everything in a deeply customizable editorial interface featuring 'The Daily Brief' and 8 premium theme presets."
          image="/images/graviton.png"
          alignRight={false}
          onWarp={() => triggerWarp("https://graviton.anithix.com")}
        >
          <div className="trust mb-8">
            {['Multi-Provider AI', 'Ollama Models', '8 Themes'].map(tag => (
              <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.05)" }}>{tag}</span>
            ))}
          </div>
          <div className="feat-list" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", color: "var(--accent)", marginBottom: "0.5rem" }}>◐</div>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>Local & Cloud</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>Ollama, OpenRouter, Groq in one workspace.</p>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", color: "var(--accent)", marginBottom: "0.5rem" }}>📰</div>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>The Daily Brief</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>Live news, weather, and open threads.</p>
            </div>
          </div>
        </ProductCard>

        {/* ATOM */}
        <ProductCard
          title="Atom"
          subtitle="Your portfolio, from your pocket."
          desc="A mobile-first builder that lets you create and manage professional portfolio websites entirely from your smartphone. Upload a resume and watch AI transform it into a stunning live website in seconds."
          image="/images/atom.png"
          alignRight={true}
          onWarp={() => triggerWarp("https://atom.anithix.com")}
        >
          <div className="trust mb-8 justify-end">
            {['Resume to Portfolio', 'Mobile Management', 'Live Sync'].map(tag => (
              <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.05)" }}>{tag}</span>
            ))}
          </div>
          <div className="steps">
            {[
              { sn: "01", title: "Upload PDF", desc: "AI extracts data instantly." },
              { sn: "02", title: "AI Design", desc: "Generates stunning layouts." },
            ].map((step) => (
              <div key={step.sn} className="step" style={{ padding: "1rem 0" }}>
                <span className="sn" style={{ fontSize: "1rem", color: "var(--live)" }}>{step.sn}</span>
                <div>
                  <h5 style={{ fontSize: "1rem" }}>{step.title}</h5>
                  <p style={{ fontSize: "0.85rem" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ProductCard>

        {/* ORBIS */}
        <ProductCard
          title="Orbis"
          subtitle="Automate your content universe."
          desc="An AI Media OS that discovers trends, writes content, generates visuals, and publishes on autopilot. Features an advanced Analytics Dashboard, AI-driven A/B Testing, and Smart Scheduling."
          image="/images/orbis.png"
          alignRight={false}
          onWarp={() => triggerWarp("https://orbis.anithix.com")}
        >
          <div className="trust mb-8">
            {['AI Media OS', 'A/B Testing', 'Smart Schedule'].map(tag => (
              <span key={tag} className="chip" style={{ background: "rgba(255,255,255,0.05)" }}>{tag}</span>
            ))}
          </div>
          <div className="pipeline" style={{ justifyContent: "flex-start", marginBottom: "2rem" }}>
            <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Trends</span>
            <span className="pipe-arr">→</span>
            <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Content</span>
            <span className="pipe-arr">→</span>
            <span className="pipe" style={{ background: "rgba(255,255,255,0.05)" }}>Publish</span>
          </div>
        </ProductCard>

      </div>
    </section>
    </>
  );
}
