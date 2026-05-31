"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { JellyText } from "@/components/animations/JellyText";
import { WarpEffect } from "@/components/animations/WarpEffect";
import { Sparkles, ArrowRight } from "lucide-react";

function TiltCard({
  children,
  style,
  className,
  onMouseMove,
  onMouseLeave
}: {
  children: React.ReactNode;
  style?: any;
  className?: string;
  onMouseMove?: any;
  onMouseLeave?: any;
}) {
  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function VisualCollage({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: string;
}) {
  const rotX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    rotX.set(-((mouseY - height / 2) / (height / 2)) * 7);
    rotY.set(((mouseX - width / 2) / (width / 2)) * 7);
    glowX.set(mouseX);
    glowY.set(mouseY);
    glowOpacity.set(0.18);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className="w-full h-full relative flex items-center justify-center pointer-events-auto"
    >
      {/* Floating Radial Cursor Glow wash behind the mockup */}
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          width: "320px",
          height: "320px",
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: glowOpacity,
          mixBlendMode: "screen",
          zIndex: 0,
        }}
      />
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d", position: "relative" }}>
        {children}
      </div>
    </motion.div>
  );
}

function HorizontalSlide({
  title,
  subtitle,
  desc,
  alignRight,
  onWarp,
  bgColor,
  accentColor,
  index,
  collage,
  children,
}: {
  title: string;
  subtitle: string;
  desc: string;
  alignRight?: boolean;
  onWarp: () => void;
  bgColor: string;
  accentColor: string;
  index: number;
  collage: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
      className="shrink-0 transition-colors duration-1000"
    >
      {/* Soft color wash background glow (keeps stars visible!) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}1c 0%, transparent 65%)`
        }}
      />
      {/* Massive outline background text (Delassus styling) */}
      <div
        style={{
          position: "absolute",
          [alignRight ? "left" : "right"]: "2%",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center center",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.05,
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
          {title}
        </span>
      </div>

      {/* Layout Grid */}
      <div className="wrap absolute inset-0 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* TEXT PANEL: Stiff, clean typography (Span 5) */}
        <div
          className={`lg:col-span-5 flex flex-col items-start ${
            alignRight ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div
            className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                color: accentColor,
                fontWeight: 800,
                marginBottom: "1rem",
                display: "block",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              SYSTEM // {String(index).padStart(2, "0")}
            </span>

            <h3
              className="display"
              style={{
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                lineHeight: 1.0,
                marginBottom: "0.75rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h3>

            <p
              style={{
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
                marginBottom: "1.5rem",
              }}
            >
              {subtitle}
            </p>

            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                marginBottom: "2rem",
              }}
            >
              {desc}
            </p>

            <div style={{ marginBottom: "2rem" }}>{children}</div>

            <motion.button
              onClick={onWarp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#fff",
                background: accentColor,
                padding: "0.85rem 1.8rem",
                borderRadius: "100px",
                cursor: "pointer",
                border: "none",
                boxShadow: `0 10px 30px ${accentColor}44`,
              }}
              data-cursor="hover"
            >
              <Sparkles style={{ width: 14, height: 14 }} />
              <span>TRAVEL AT WARP SPEED</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </motion.button>
          </div>
        </div>

        {/* VISUAL COLLAGE: Interactive layered elements floating (Span 7) */}
        <div
          className={`lg:col-span-7 h-[70vh] relative flex items-center justify-center ${
            alignRight ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {collage}
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [warpActive, setWarpActive] = useState(false);
  const [warpUrl, setWarpUrl] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 4 slides in horizontal pinner (Intro + 3 products) = translate 0% to -75%
  const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

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
      <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
        {/* Sticky full-screen viewport */}
        <section
          id="products"
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
          {/* Subtle grid mesh overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              zIndex: 2,
            }}
          />

          {/* Horizontal scroll track */}
          <motion.div
            style={{ x: xTranslation, display: "flex", width: "400vw", height: "100%", transformStyle: "preserve-3d" }}
          >
            {/* SLIDE 0: INTRO */}
            <div
              style={{
                width: "100vw",
                height: "100vh",
                background: "transparent",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
              className="shrink-0"
            >
              <div className="wrap text-left relative z-10 w-full">
                <div className="section-head">
                  <h2
                    className="display-massive"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      lineHeight: 1.0,
                    }}
                  >
                    <JellyText text="A Connected" />
                    <JellyText text="Suite." style={{ color: "var(--ink-3)" }} />
                  </h2>
                  <p
                    className="lede"
                    style={{
                      marginTop: "2rem",
                      maxWidth: "700px",
                      fontSize: "1.1rem",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    Each built with obsession. Not just tools, but entire universes
                    crafted for creators, developers, and visionaries. Scroll down to travel through the ecosystem.
                  </p>
                </div>
              </div>
            </div>

            {/* SLIDE 1: GRAVITON */}
            <HorizontalSlide
              index={1}
              title="Graviton"
              subtitle="Your personal AI workspace with a newspaper soul."
              desc="Connect every AI provider in one intelligent interface. Run local models via Ollama or connect cloud providers — wrapped in a deeply customizable editorial interface."
              alignRight={false}
              bgColor="#181329"
              accentColor="#a78bfa"
              onWarp={() => triggerWarp("https://graviton.anithix.com")}
              collage={
                <VisualCollage accentColor="#a78bfa">
                  {/* Massive back mockup with macOS Window Frame header */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-[80%] h-[75%] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl relative flex flex-col bg-black/40"
                    style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  >
                    {/* macOS Window Header */}
                    <div className="flex items-center gap-1.5 px-6 py-3.5 border-b border-white/5 bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      <div className="text-[10px] text-white/20 font-mono ml-4 tracking-wider uppercase">graviton.anithix.com</div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <img src="/images/graviton.png" alt="Graviton Desktop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </motion.div>

                  {/* Floating features blocks with translateZ(40px) */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[6%] right-[0%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">📰</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>The Brief</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Daily live news curated by local AI.</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-[6%] left-[0%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">◐</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Multi-Engine</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Ollama local models + cloud in one place.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Multi-Provider AI", "Ollama Models", "8 Themes"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "0.35rem 0.85rem",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HorizontalSlide>

            {/* SLIDE 2: ATOM */}
            <HorizontalSlide
              index={2}
              title="Atom"
              subtitle="Your portfolio, from your pocket."
              desc="A mobile-first builder that lets you create and manage professional portfolio websites entirely from your smartphone. Upload a resume — AI does the rest."
              alignRight={true}
              bgColor="#07202b"
              accentColor="#06b6d4"
              onWarp={() => triggerWarp("https://atom.anithix.com")}
              collage={
                <VisualCollage accentColor="#06b6d4">
                  {/* Central mobile mockup with dynamic island smartphone bezel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                    className="w-[44%] h-[80%] rounded-[2.8rem] overflow-hidden border-[6px] border-[#1d1d1f] shadow-2xl relative bg-black flex flex-col"
                    style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  >
                    {/* Dynamic Island Screen Header cut-out */}
                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-full bg-black z-20" />
                    <div className="flex-1 overflow-hidden relative">
                      <img src="/images/atom.png" alt="Atom Mobile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </motion.div>

                  {/* Floating features blocks framed diagonally and cleanly spaced */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[2%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">📄</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Resume Parsing</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>PDF upload to live site in 10 seconds.</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute bottom-[15%] right-[2%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">📱</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Pocket Build</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Edit templates completely on mobile.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Resume to Portfolio", "Mobile Management", "Live Sync"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "100px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </HorizontalSlide>

            {/* SLIDE 3: ORBIS */}
            <HorizontalSlide
              index={3}
              title="Orbis"
              subtitle="Automate your content universe."
              desc="An AI Media OS that discovers trends, writes content, generates visuals, and publishes on autopilot. Analytics, A/B Testing, Smart Scheduling — all in one."
              alignRight={false}
              bgColor="#07221b"
              accentColor="#10b981"
              onWarp={() => triggerWarp("https://orbis.anithix.com")}
              collage={
                <VisualCollage accentColor="#10b981">
                  {/* Central dashboard mock with macOS Window Frame header */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1 }}
                    className="w-[80%] h-[75%] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl relative flex flex-col bg-black/40"
                    style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                  >
                    {/* macOS Window Header */}
                    <div className="flex items-center gap-1.5 px-6 py-3.5 border-b border-white/5 bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      <div className="text-[10px] text-white/20 font-mono ml-4 tracking-wider uppercase">orbis.anithix.com</div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <img src="/images/orbis.png" alt="Orbis Panel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </motion.div>

                  {/* Floating features blocks balanced diagonally */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[6%] right-[0%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">📈</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Auto Publish</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Hands-off publishing on smart schedules.</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute bottom-[6%] left-[0%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <span className="text-xl mb-2 block">🌌</span>
                    <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Media OS</h5>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>A/B test and analyze content pipelines.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["AI Media OS", "A/B Testing", "Smart Schedule"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "0.35rem 0.85rem",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HorizontalSlide>
          </motion.div>

          {/* Slider progress indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.6rem",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            {[0, 1, 2, 3].map((i) => {
              // Highlight indicator dynamically based on scrollYProgress. 
              // Bounds: 4 slides = [0..0.25, 0.25..0.5, 0.5..0.75, 0.75..1.0]
              const start = (i / 4) - 0.05;
              const end = ((i + 1) / 4) + 0.05;
              
              const dotWidth = useTransform(
                scrollYProgress,
                [start < 0 ? 0 : start, i / 4, (i + 1) / 4, end > 1 ? 1 : end],
                ["0.5rem", "2.5rem", "2.5rem", "0.5rem"]
              );
              
              const dotOpacity = useTransform(
                scrollYProgress,
                [start < 0 ? 0 : start, i / 4, (i + 1) / 4, end > 1 ? 1 : end],
                [0.25, 1.0, 1.0, 0.25]
              );

              return (
                <motion.div
                  key={i}
                  style={{
                    height: "0.25rem",
                    borderRadius: "100px",
                    background: "#fff",
                    width: dotWidth,
                    opacity: dotOpacity,
                  }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
