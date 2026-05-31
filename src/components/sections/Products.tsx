"use client";

import { useReveal } from "@/hooks/useReveal";
import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { JellyText } from "@/components/animations/JellyText";
import { WarpEffect } from "@/components/animations/WarpEffect";
import { Sparkles, ArrowRight } from "lucide-react";

function ProductSlide({
  title,
  subtitle,
  desc,
  image,
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
  image: string;
  alignRight?: boolean;
  onWarp: () => void;
  bgColor: string;
  accentColor: string;
  index: number;
  collage: React.ReactNode;
  children: React.ReactNode;
}) {
  const scrollDriver = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollDriver,
    offset: ["start start", "end end"],
  });

  // Nesting scale & parallax shifts
  const slideScale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1.1, 1.05, 1.0, 0.95]);
  const slideOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.5, 1.0, 1.0, 0.3]);

  // Parallax layers for text & collage
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ["50px", "0px", "-50px"]);
  const collageY = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);

  // 3D Tilt springs
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

    rotateX.set(-((mouseY - height / 2) / (height / 2)) * 5);
    rotateY.set(((mouseX - width / 2) / (width / 2)) * 5);

    glowX.set(mouseX);
    glowY.set(mouseY);
    glowOpacity.set(0.12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  };

  return (
    <div
      ref={scrollDriver}
      style={{ height: "200vh", position: "relative" }}
      className="product-slide-driver"
    >
      {/* Sticky full-screen viewport */}
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: bgColor,
          scale: slideScale,
          opacity: slideOpacity,
        }}
        className="transition-colors duration-1000"
      >
        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
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
          <motion.div
            style={{ y: textY }}
            className={`lg:col-span-5 flex flex-col items-start ${alignRight ? "lg:order-2" : "lg:order-1"}`}
          >
            <TiltCard
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="glass-panel p-10 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden w-full"
            >
              {/* Radial cursor light wash */}
              <motion.div
                style={{
                  position: "absolute",
                  left: glowX,
                  top: glowY,
                  width: "250px",
                  height: "250px",
                  background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  opacity: glowOpacity,
                  mixBlendMode: "screen",
                }}
              />

              <div style={{ transform: "translateZ(20px)" }}>
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
                  SYSTEM // {String(index + 1).padStart(2, "0")}
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
            </TiltCard>
          </motion.div>

          {/* VISUAL COLLAGE: Interactive layered elements floating (Span 7) */}
          <motion.div
            style={{ y: collageY }}
            className={`lg:col-span-7 h-[70vh] relative flex items-center justify-center ${alignRight ? "lg:order-1" : "lg:order-2"}`}
          >
            {collage}
          </motion.div>

        </div>

        {/* Slide progress indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.6rem",
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === index ? "2.5rem" : "0.5rem",
                height: "0.25rem",
                borderRadius: "100px",
                background:
                  i === index ? "#fff" : "rgba(255,255,255,0.25)",
                transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

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
      <section
        ref={revealRef}
        id="products"
        style={{ background: "var(--bg)", overflow: "hidden" }}
      >
        {/* Section header */}
        <div className="wrap" style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
          <div className="section-head reveal">
            <h2
              className="display-massive"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <JellyText text="A Connected" />
              <JellyText text="Suite." style={{ color: "var(--ink-3)" }} />
            </h2>
            <p
              className="lede reveal-d1"
              style={{
                marginTop: "2rem",
                maxWidth: "700px",
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Each built with obsession. Not just tools, but entire universes
              crafted for creators, developers, and visionaries.
            </p>
          </div>
        </div>

        {/* GRAVITON SLIDE */}
        <ProductSlide
          index={0}
          title="Graviton"
          subtitle="Your personal AI workspace with a newspaper soul."
          desc="Connect every AI provider in one intelligent interface. Run local models via Ollama or connect cloud providers — wrapped in a deeply customizable editorial interface."
          image="/images/graviton.png"
          alignRight={false}
          bgColor="#181329"
          accentColor="#a78bfa"
          onWarp={() => triggerWarp("https://graviton.anithix.com")}
          collage={
            <div className="relative w-full h-[80%] flex items-center justify-center">
              {/* Massive back mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-[85%] h-[80%] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative"
              >
                <img src="/images/graviton.png" alt="Graviton Desktop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </motion.div>

              {/* Floating features blocks */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[5%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">📰</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>The Brief</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Daily live news curated by local AI.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-[10%] left-[5%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">◐</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Multi-Engine</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Ollama local models + cloud in one place.</p>
              </motion.div>
            </div>
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
        </ProductSlide>

        {/* ATOM SLIDE */}
        <ProductSlide
          index={1}
          title="Atom"
          subtitle="Your portfolio, from your pocket."
          desc="A mobile-first builder that lets you create and manage professional portfolio websites entirely from your smartphone. Upload a resume — AI does the rest."
          image="/images/atom.png"
          alignRight={true}
          bgColor="#07202b"
          accentColor="#06b6d4"
          onWarp={() => triggerWarp("https://atom.anithix.com")}
          collage={
            <div className="relative w-full h-[80%] flex items-center justify-center">
              {/* Central mobile mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="w-[45%] h-[85%] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl relative bg-black"
              >
                <img src="/images/atom.png" alt="Atom Mobile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </motion.div>

              {/* Floating features blocks */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[10%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">📄</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Resume Parsing</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>PDF upload to live site in 10 seconds.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute bottom-[20%] right-[10%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">📱</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Pocket Build</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Edit templates completely on mobile.</p>
              </motion.div>
            </div>
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
        </ProductSlide>

        {/* ORBIS SLIDE */}
        <ProductSlide
          index={2}
          title="Orbis"
          subtitle="Automate your content universe."
          desc="An AI Media OS that discovers trends, writes content, generates visuals, and publishes on autopilot. Analytics, A/B Testing, Smart Scheduling — all in one."
          image="/images/orbis.png"
          alignRight={false}
          bgColor="#07221b"
          accentColor="#10b981"
          onWarp={() => triggerWarp("https://orbis.anithix.com")}
          collage={
            <div className="relative w-full h-[80%] flex items-center justify-center">
              {/* Central dashboard mock */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1 }}
                className="w-[85%] h-[80%] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative"
              >
                <img src="/images/orbis.png" alt="Orbis Panel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </motion.div>

              {/* Floating features blocks */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[12%] right-[5%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">📈</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Auto Publish</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Hands-off publishing on smart schedules.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute bottom-[12%] left-[5%] glass-panel p-6 rounded-[1.5rem] border border-white/10 bg-black/60 shadow-2xl max-w-[200px]"
              >
                <span className="text-xl mb-2 block">🌌</span>
                <h5 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>Media OS</h5>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>A/B test and analyze content pipelines.</p>
              </motion.div>
            </div>
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
        </ProductSlide>
      </section>
    </>
  );
}
