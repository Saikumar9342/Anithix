"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { JellyText } from "@/components/animations/JellyText";
import { WarpEffect } from "@/components/animations/WarpEffect";
import { Sparkles, ArrowRight } from "lucide-react";

function VisualShowcase({
  imageSrc,
  alt,
  accentColor,
  isMobile = false,
}: {
  imageSrc: string;
  alt: string;
  accentColor: string;
  isMobile?: boolean;
}) {
  const rotX = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 });
  const scale = useSpring(useMotionValue(1), { stiffness: 100, damping: 25 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    rotX.set(-y * 10);
    rotY.set(x * 10);
    scale.set(1.02);
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
    glowOpacity.set(0.5);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    scale.set(1);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        scale: scale,
        transformStyle: "preserve-3d",
      }}
      className="relative cursor-pointer flex items-center justify-center w-full h-full max-w-[560px]"
    >
      {/* Ambient Radial Color Backlight */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "360px",
          height: "360px",
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
      
      {/* Soft fallback backing static glow */}
      <div
        className="absolute pointer-events-none rounded-full opacity-20 blur-[80px]"
        style={{
          width: "280px",
          height: "280px",
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          zIndex: -1,
        }}
      />

      {/* Clean high-fidelity visual display frame */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className={`relative transition-all duration-500 ${
          isMobile 
            ? "w-[260px] h-[520px]" 
            : "overflow-hidden border border-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-[1.8rem] w-full aspect-[16/10] hover:border-white/10"
        }`}
        style={{
          background: isMobile ? "transparent" : "rgba(10, 8, 16, 0.8)",
          transform: "translateZ(20px)",
        }}
      >
        {/* Specular glare sheen (only for non-mobile frame) */}
        {!isMobile && (
          <div 
            className="absolute inset-0 pointer-events-none z-10" 
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)",
            }}
          />
        )}
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-contain select-none pointer-events-none"
          style={{ filter: "brightness(1.02) contrast(1.02)" }}
        />
      </motion.div>
    </motion.div>
  );
}

function HorizontalSlide({
  title,
  subtitle,
  desc,
  alignRight,
  onWarp,
  accentColor,
  index,
  collage,
  scrollYProgress,
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
  scrollYProgress: any;
  children: React.ReactNode;
}) {
  // Card Centers in products horizontal scroll
  const cardCenters = [0.28, 0.62, 0.92];
  const center = cardCenters[index - 1];

  // Subtle wind sway offsets for clean spatial motion
  const textWindX = useTransform(
    scrollYProgress,
    [center - 0.20, center - 0.08, center, center + 0.08, center + 0.20],
    [0, 16, 0, -16, 0]
  );
  const textWindY = useTransform(
    scrollYProgress,
    [center - 0.20, center - 0.08, center, center + 0.08, center + 0.20],
    [0, -4, -10, -4, 0]
  );

  const springText = { stiffness: 90, damping: 14, mass: 1 };
  const textX = useSpring(textWindX, springText);
  const textY = useSpring(textWindY, springText);

  const visualWindX = useTransform(
    scrollYProgress,
    [center - 0.20, center - 0.08, center, center + 0.08, center + 0.20],
    [0, 24, 0, -24, 0]
  );
  const visualWindY = useTransform(
    scrollYProgress,
    [center - 0.20, center - 0.08, center, center + 0.08, center + 0.20],
    [0, -8, -18, -8, 0]
  );

  const springVisual = { stiffness: 80, damping: 12, mass: 1 };
  const visualX = useSpring(visualWindX, springVisual);
  const visualY = useSpring(visualWindY, springVisual);

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
      className="shrink-0 animate-products-slide"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}08 0%, transparent 65%)`
        }}
      />
      <div className="wrap absolute inset-0 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left/Right Text Panel Wrapper */}
        <motion.div
          className={`lg:col-span-5 flex flex-col items-start ${alignRight ? "lg:order-2" : "lg:order-1"}`}
          style={{
            x: textX,
            y: textY,
          }}
        >
          {/* Cardless Clean Typography */}
          <div className="w-full flex flex-col items-start text-left select-none relative">
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                color: accentColor,
                fontWeight: 700,
                marginBottom: "1.2rem",
                display: "block",
                fontFamily: "var(--font-space), monospace",
                textShadow: `0 0 10px ${accentColor}35`,
              }}
            >
              {String(index).padStart(2, "0")} // {title.toUpperCase()}
            </span>

            <h3
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
                lineHeight: 1.05,
                marginBottom: "1rem",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              {title}
            </h3>

            <p
              style={{
                fontSize: "1.12rem",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
                marginBottom: "1.5rem",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.48)",
                marginBottom: "2rem",
              }}
            >
              {desc}
            </p>

            <div style={{ marginBottom: "2rem", width: "100%" }}>{children}</div>

            {/* Premium Minimalist Text CTA Link */}
            <motion.button
              onClick={onWarp}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: accentColor,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 0",
                position: "relative",
              }}
              className="group"
              data-cursor="hover"
            >
              <span>EXPLORE PLATFORM</span>
              <motion.span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </motion.span>
              
              {/* Subtle underline sweep */}
              <div 
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:scale-x-100"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Visual Showcase Wrapper */}
        <motion.div
          className={`lg:col-span-7 h-[70vh] relative flex items-center justify-center ${alignRight ? "lg:order-1" : "lg:order-2"}`}
          style={{
            x: visualX,
            y: visualY,
          }}
        >
          {collage}
        </motion.div>
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
            {/* Slide 0: A Connected Suite Title Slide */}
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
              <div className="wrap relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Empty left side where the planet sits */}
                <div className="lg:col-span-5 xl:col-span-6" />

                {/* Right-aligned text panel, clear of the planet with high contrast over dark space */}
                <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start">
                  <div className="section-head text-left w-full">
                    <span
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.3em",
                        color: "#a78bfa",
                        fontWeight: 700,
                        marginBottom: "1.2rem",
                        display: "block",
                        fontFamily: "var(--font-space), monospace",
                        textShadow: "0 0 8px rgba(167, 139, 250, 0.4)",
                      }}
                    >
                      THE ECOSYSTEM // SYSTEM 00
                    </span>

                    <h2
                      className="display-massive"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        lineHeight: 1.0,
                        fontSize: "clamp(3rem, 5.5vw, 5rem)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        color: "#fff",
                      }}
                    >
                      <JellyText text="A Connected" />
                      <JellyText text="Suite." style={{ color: "#a78bfa" }} />
                    </h2>
                    <p
                      className="lede"
                      style={{
                        marginTop: "1.8rem",
                        maxWidth: "600px",
                        fontSize: "1.05rem",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.65,
                      }}
                    >
                      Each built with obsession. Not just tools, but entire universes
                      crafted for creators, developers, and visionaries. Scroll down to witness the swoosh of our ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 1: Graviton (Purple Accent) */}
            <HorizontalSlide
              index={1}
              title="Graviton"
              subtitle="Your personal AI workspace with a newspaper soul."
              desc="The ultimate AI command center that unifies every AI provider into one intelligent interface. Run local models via Ollama, connect to OpenAI, Claude, Gemini, and more — all wrapped in a beautifully crafted editorial interface inspired by the world's finest newspapers. Built for researchers, developers, and AI enthusiasts who demand both power and elegance."
              alignRight={false}
              bgColor="#181329"
              accentColor="#a78bfa"
              scrollYProgress={scrollYProgress}
              onWarp={() => triggerWarp("https://graviton.anithix.com")}
              collage={
                <VisualShowcase 
                  imageSrc="/images/graviton-real.png" 
                  alt="Graviton Desktop" 
                  accentColor="#a78bfa" 
                />
              }
            >
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Multi-Provider AI",
                  "Ollama Local",
                  "8 Premium Themes",
                  "Research Mode",
                  "Editorial UI",
                  "Vision Models"
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.45)",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      border: "1px solid rgba(255,255,255,0.04)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HorizontalSlide>

            {/* Slide 2: Atom (Cyan Accent) */}
            <HorizontalSlide
              index={2}
              title="Atom"
              subtitle="Your portfolio, from your pocket."
              desc="The world's first truly mobile-native portfolio builder. Create stunning professional websites entirely from your smartphone. Upload your resume, and watch AI transform it into a beautiful, responsive portfolio in seconds. Edit templates, manage content, and publish updates — all from your pocket. Perfect for freelancers, creatives, and professionals on the go."
              alignRight={true}
              bgColor="#07202b"
              accentColor="#06b6d4"
              scrollYProgress={scrollYProgress}
              onWarp={() => triggerWarp("https://atom.anithix.com")}
              collage={
                <VisualShowcase 
                  imageSrc="/images/atom.png" 
                  alt="Atom Mobile" 
                  accentColor="#06b6d4" 
                  isMobile={true} 
                />
              }
            >
              <div className="flex flex-wrap gap-2.5">
                {[
                  "AI Resume Parser",
                  "Pocket Builder",
                  "Mobile Dashboard",
                  "Custom Domains",
                  "Live Sync",
                  "Analytics UI"
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.45)",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      border: "1px solid rgba(255,255,255,0.04)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HorizontalSlide>

            {/* Slide 3: Orbis (Emerald Accent) */}
            <HorizontalSlide
              index={3}
              title="Orbis"
              subtitle="Automate your content universe."
              desc="The ultimate AI-powered content automation platform that transforms how you create and manage social media. Discover trending topics, generate compelling content, create stunning visuals, and publish across all platforms — completely on autopilot. Built-in A/B testing, smart scheduling, and deep analytics help you optimize every post for maximum engagement and growth."
              alignRight={false}
              bgColor="#07221b"
              accentColor="#10b981"
              scrollYProgress={scrollYProgress}
              onWarp={() => triggerWarp("https://orbis.anithix.com")}
              collage={
                <VisualShowcase 
                  imageSrc="/images/orbis.png" 
                  alt="Orbis Automation" 
                  accentColor="#10b981" 
                />
              }
            >
              <div className="flex flex-wrap gap-2.5">
                {[
                  "AI Automation",
                  "Trend Discovery",
                  "Visual Generator",
                  "A/B Marketing OS",
                  "Omni Publish",
                  "Deep Metrics"
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.45)",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      border: "1px solid rgba(255,255,255,0.04)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HorizontalSlide>
          </motion.div>
        </section>
      </div>
    </>
  );
}