"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";
import { BlackHole } from "@/components/animations/BlackHole";

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 7000);
  };

  // Card slide-up & scale
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], ["60px", "0px", "-40px"]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9, 1], [0, 1, 1, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.4, 0.9, 1], [0.95, 1.0, 1.0, 0.95]);

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

  return (
    <div ref={containerRef} style={{ height: "140vh", position: "relative" }}>
      {/* Sticky full-viewport frame */}
      <section
        id="contact"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "transparent",
          display: "flex",
          alignItems: "center",
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
            left: "2%",
            top: "50%",
            transform: "translateY(-50%) rotate(270deg)",
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
            CONTACT
          </span>
        </div>

        {/* Glowing floating vector backdrops */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
          <div
            className="absolute"
            style={{
              top: "10%",
              left: "15%",
              width: "350px",
              height: "350px",
              background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "10%",
              right: "15%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="wrap relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title (Span 5) */}
          <div ref={revealRef} className="lg:col-span-5 flex flex-col items-start text-left">
            <h2
              className="display-massive"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.0,
              }}
            >
              <JellyText text="Let's build" />
              <JellyText text="something great." style={{ color: "var(--accent)" }} />
            </h2>
            <p
              className="lede reveal-d1"
              style={{
                marginTop: "2rem",
                maxWidth: "380px",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.6,
              }}
            >
              Whether you're curious about our products, want to partner, or just want to say hi — we'd love to hear from you.
            </p>
          </div>

          {/* Right Column: Interactive Form Card (Span 7) */}
          <motion.div
            style={{
              y: cardY,
              opacity: cardOpacity,
              scale: cardScale,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[2.2rem] border border-white/5 bg-black/45 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Floating Radial Cursor Glow Highlight */}
            <motion.div
              style={{
                position: "absolute",
                left: glowX,
                top: glowY,
                width: "250px",
                height: "250px",
                background: "radial-gradient(circle, rgba(196, 188, 255, 0.9) 0%, transparent 70%)",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                opacity: glowOpacity,
                mixBlendMode: "screen",
              }}
            />

            <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
              {submitted ? (
                <BlackHole />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        className="eyebrow"
                        style={{
                          display: "flex",
                          marginBottom: "0.5rem",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--ink-4)",
                          fontWeight: 700,
                        }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "0.9rem",
                          padding: "1rem 1.2rem",
                          color: "#fff",
                          fontSize: "0.95rem",
                          outline: "none",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                      />
                    </div>
                    <div>
                      <label
                        className="eyebrow"
                        style={{
                          display: "flex",
                          marginBottom: "0.5rem",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--ink-4)",
                          fontWeight: 700,
                        }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "0.9rem",
                          padding: "1rem 1.2rem",
                          color: "#fff",
                          fontSize: "0.95rem",
                          outline: "none",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      className="eyebrow"
                      style={{
                        display: "flex",
                        marginBottom: "0.75rem",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                        fontWeight: 700,
                      }}
                    >
                      Inquiry type
                    </label>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                      {["General", "Product", "Business"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm({ ...form, type: type.toLowerCase() })}
                          style={{
                            padding: "0.65rem 1.3rem",
                            borderRadius: "100px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            border: "1px solid",
                            borderColor:
                              form.type === type.toLowerCase()
                                ? "var(--accent)"
                                : "rgba(255,255,255,0.08)",
                            background:
                              form.type === type.toLowerCase()
                                ? "var(--accent)"
                                : "transparent",
                            color:
                              form.type === type.toLowerCase()
                                ? "var(--bg)"
                                : "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      className="eyebrow"
                      style={{
                        display: "flex",
                        marginBottom: "0.5rem",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                        fontWeight: 700,
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you have in mind…"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "1rem",
                        padding: "1rem 1.2rem",
                        color: "#fff",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                        resize: "none",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      background: "var(--accent)",
                      color: "var(--bg)",
                      padding: "1rem",
                      borderRadius: "100px",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 10px 30px rgba(124, 58, 237, 0.2)",
                      transition: "transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
