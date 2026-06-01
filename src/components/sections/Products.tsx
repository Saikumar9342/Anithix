"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { JellyText } from "@/components/animations/JellyText";
import { WarpEffect } from "@/components/animations/WarpEffect";
import { Sparkles, ArrowRight } from "lucide-react";

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
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    rotX.set(-y * 12);
    rotY.set(x * 12);
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
    glowOpacity.set(0.6);
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
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full cursor-pointer"
    >
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 400,
          height: 400,
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))",
        }}
      >
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}1c 0%, transparent 65%)`
        }}
      />
      <div className="wrap absolute inset-0 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
        <section
          id="products"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{ x: xTranslation, display: "flex", width: "400vw", height: "100%", transformStyle: "preserve-3d" }}
          >
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

            <HorizontalSlide
              index={1}
              title="Graviton"
              subtitle="Your personal AI workspace with a newspaper soul."
              desc="The ultimate AI command center that unifies every AI provider into one intelligent interface. Run local models via Ollama, connect to OpenAI, Claude, Gemini, and more — all wrapped in a beautifully crafted editorial interface inspired by the world's finest newspapers. Built for researchers, developers, and AI enthusiasts who demand both power and elegance."
              alignRight={false}
              bgColor="#181329"
              accentColor="#a78bfa"
              onWarp={() => triggerWarp("https://graviton.anithix.com")}
              collage={
                <VisualCollage accentColor="#a78bfa">
                  {/* Main Desktop Interface */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 80, rotateX: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[85%] h-[80%] rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl relative flex flex-col"
                    style={{ 
                      transform: "translateZ(20px)", 
                      transformStyle: "preserve-3d",
                      background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)"
                    }}
                  >
                    {/* Enhanced macOS Window Header */}
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-lg" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-lg" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-lg" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="text-xs text-white/40 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full">
                          graviton.anithix.com
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced content area */}
                    <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent" />
                      <img 
                        src="/images/graviton-real.png" 
                        alt="Graviton Desktop" 
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(1.1) contrast(1.05)" }}
                      />
                      {/* Overlay glow */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 60% 40%, #a78bfa20 0%, transparent 60%)`
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Clean, professional feature indicators */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-[15%] right-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Live</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">The Brief</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Daily live news curated by local AI models with intelligent summarization.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-[15%] left-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Engine</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">Multi-Engine</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Ollama local models + cloud providers unified in one elegant interface.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute top-[50%] right-[15%] p-4 rounded-lg border border-white/10 shadow-lg max-w-[180px]"
                    style={{ 
                      transform: "translateZ(30px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Themes</span>
                    </div>
                    <h6 className="font-semibold text-white text-xs mb-2">8 Themes</h6>
                    <p className="text-xs text-white/60 leading-relaxed">From minimal to editorial, customize your workspace aesthetic.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div className="flex flex-wrap gap-3">
                {[
                  "Multi-Provider AI",
                  "Ollama Integration", 
                  "8 Premium Themes",
                  "Research Mode",
                  "News Dashboard",
                  "Vision Models"
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:bg-white/10"
                    style={{
                      background: "rgba(167,139,250,0.1)",
                      border: "1px solid rgba(167,139,250,0.2)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </HorizontalSlide>

            <HorizontalSlide
              index={2}
              title="Atom"
              subtitle="Your portfolio, from your pocket."
              desc="The world's first truly mobile-native portfolio builder. Create stunning professional websites entirely from your smartphone. Upload your resume, and watch AI transform it into a beautiful, responsive portfolio in seconds. Edit templates, manage content, and publish updates — all from your pocket. Perfect for freelancers, creatives, and professionals on the go."
              alignRight={true}
              bgColor="#07202b"
              accentColor="#06b6d4"
              onWarp={() => triggerWarp("https://atom.anithix.com")}
              collage={
                <VisualCollage accentColor="#06b6d4">
                  {/* Enhanced mobile mockup with premium styling */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 100, rotateX: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[50%] h-[85%] rounded-[3rem] overflow-hidden border-[8px] shadow-2xl relative flex flex-col"
                    style={{ 
                      transform: "translateZ(30px)", 
                      transformStyle: "preserve-3d",
                      borderColor: "#1a1a1a",
                      background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                      boxShadow: `
                        0 40px 80px rgba(0,0,0,0.9),
                        0 0 0 1px rgba(6,182,212,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.1)
                      `
                    }}
                  >
                    {/* Enhanced Dynamic Island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black z-20 shadow-inner" 
                         style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)" }} />
                    
                    {/* Screen content with enhanced styling */}
                    <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent" />
                      <img 
                        src="/images/atom.png" 
                        alt="Atom Mobile" 
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(1.1) contrast(1.05)" }}
                      />
                      {/* Screen reflection effect */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `
                            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%),
                            radial-gradient(circle at 70% 30%, #06b6d420 0%, transparent 50%)
                          `
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Clean, professional feature indicators */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute top-[20%] left-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">AI Parser</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">AI Resume Parser</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Upload PDF resume, get live portfolio site in 10 seconds with AI enhancement.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute bottom-[20%] right-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Mobile</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">Mobile-First Builder</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Edit templates, manage content, and publish updates completely on mobile.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute top-[60%] left-[15%] p-4 rounded-lg border border-white/10 shadow-lg max-w-[180px]"
                    style={{ 
                      transform: "translateZ(30px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Sync</span>
                    </div>
                    <h6 className="font-semibold text-white text-xs mb-2">Live Sync</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Real-time updates across all devices and platforms.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div className="flex flex-wrap gap-3">
                {[
                  "AI Resume Parser",
                  "Mobile Management", 
                  "Live Sync",
                  "Custom Domains",
                  "Multi-Language",
                  "Analytics Dashboard"
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:bg-white/10"
                    style={{
                      background: "rgba(6,182,212,0.1)",
                      border: "1px solid rgba(6,182,212,0.2)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </HorizontalSlide>

            <HorizontalSlide
              index={3}
              title="Orbis"
              subtitle="Automate your content universe."
              desc="The ultimate AI-powered content automation platform that transforms how you create and manage social media. Discover trending topics, generate compelling content, create stunning visuals, and publish across all platforms — completely on autopilot. Built-in A/B testing, smart scheduling, and deep analytics help you optimize every post for maximum engagement and growth."
              alignRight={false}
              bgColor="#07221b"
              accentColor="#10b981"
              onWarp={() => triggerWarp("https://orbis.anithix.com")}
              collage={
                <VisualCollage accentColor="#10b981">
                  {/* Enhanced dashboard mockup */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 80, rotateX: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[85%] h-[80%] rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl relative flex flex-col"
                    style={{ 
                      transform: "translateZ(20px)", 
                      transformStyle: "preserve-3d",
                      background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)"
                    }}
                  >
                    {/* Enhanced macOS Window Header */}
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-lg" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-lg" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-lg" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="text-xs text-white/40 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full">
                          orbis.anithix.com
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced content area */}
                    <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent" />
                      <img 
                        src="/images/orbis.png" 
                        alt="Orbis Panel" 
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(1.1) contrast(1.05)" }}
                      />
                      {/* Overlay glow */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 60% 40%, #10b98120 0%, transparent 60%)`
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Clean, professional feature indicators */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-[15%] right-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Auto</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">Auto Publish</h6>
                    <p className="text-xs text-white/60 leading-relaxed">Hands-off publishing on smart schedules across all platforms.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-[15%] left-[8%] p-5 rounded-lg border border-white/10 shadow-lg max-w-[220px]"
                    style={{ 
                      transform: "translateZ(40px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">AI OS</span>
                    </div>
                    <h6 className="font-semibold text-white text-sm mb-2">AI Media OS</h6>
                    <p className="text-xs text-white/60 leading-relaxed">A/B test and analyze content pipelines with deep insights.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute top-[45%] left-[12%] p-4 rounded-lg border border-white/10 shadow-lg max-w-[180px]"
                    style={{ 
                      transform: "translateZ(30px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Trends</span>
                    </div>
                    <h6 className="font-semibold text-white text-xs mb-2">Trend Discovery</h6>
                    <p className="text-xs text-white/60 leading-relaxed">AI finds viral topics before they explode.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="absolute bottom-[45%] right-[12%] p-4 rounded-lg border border-white/10 shadow-lg max-w-[180px]"
                    style={{ 
                      transform: "translateZ(30px)",
                      background: "rgba(8,8,10,0.85)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.1)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Visual</span>
                    </div>
                    <h6 className="font-semibold text-white text-xs mb-2">Visual Generation</h6>
                    <p className="text-xs text-white/60 leading-relaxed">AI creates stunning visuals for every post.</p>
                  </motion.div>
                </VisualCollage>
              }
            >
              <div className="flex flex-wrap gap-3">
                {[
                  "AI Content Generation",
                  "Trend Discovery", 
                  "Visual AI",
                  "A/B Testing",
                  "Smart Scheduling",
                  "Deep Analytics"
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:bg-white/10"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </HorizontalSlide>
          </motion.div>
        </section>
      </div>
    </>
  );
}