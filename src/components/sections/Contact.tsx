"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { JellyText } from "@/components/animations/JellyText";

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Skew up to 8 degrees based on scroll velocity
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-8, 8]);

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
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="section relative" style={{ background: "var(--bg-1)" }} ref={sectionRef}>
      <div ref={revealRef} className="wrap">
        <div className="section-head reveal">
          
          {/* Velocity Skewed Text */}
          <motion.div style={{ skewY, transformOrigin: "left center" }}>
            <h2 className="display-massive" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <JellyText text="Let's build" />
              <JellyText className="dim" text="something great." style={{ color: "var(--accent)" }} />
            </h2>
            <div className="headline-mark" />
          </motion.div>

          <p className="lede reveal-d1" style={{ marginTop: "2rem", maxWidth: "600px" }}>
            Whether you're curious about our products, want to partner, or just want to say hi —
            we'd love to hear from you.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            marginTop: "6rem",
            alignItems: "start",
          }}
        >
          {/* Contact info */}
          <div className="reveal">
            {/* Contact list */}
            <div style={{ marginBottom: "2rem" }}>
              {[
                {
                  label: "Email us",
                  value: SITE_CONFIG.email,
                  href: `mailto:${SITE_CONFIG.email}`,
                },
                {
                  label: "GitHub",
                  value: "github.com/anithix",
                  href: SITE_CONFIG.github,
                },
                {
                  label: "LinkedIn",
                  value: "linkedin.com/company/anithix",
                  href: SITE_CONFIG.linkedin,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glass-panel"
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    textDecoration: "none",
                    borderRadius: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--accent)",
                    }}
                  >
                    ◈
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "1.1rem", color: "var(--ink)", marginTop: "0.2rem" }}>
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="glass-panel reveal reveal-d1" style={{ padding: "3rem", borderRadius: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem", color: "var(--accent)" }}>✓</div>
                <h3 className="display" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  Message sent!
                </h3>
                <p style={{ color: "var(--ink-3)", fontSize: "1.1rem" }}>
                  Thanks for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div>
                    <label className="eyebrow" style={{ display: "flex", marginBottom: "0.5rem" }}>Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.8rem",
                        padding: "1rem 1.2rem",
                        color: "var(--ink)",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                  <div>
                    <label className="eyebrow" style={{ display: "flex", marginBottom: "0.5rem" }}>Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.8rem",
                        padding: "1rem 1.2rem",
                        color: "var(--ink)",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label className="eyebrow" style={{ display: "flex", marginBottom: "1rem" }}>Inquiry type</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {["General", "Product", "Business"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type: type.toLowerCase() })}
                        style={{
                          padding: "0.8rem 1.5rem",
                          borderRadius: "2rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          border: "1px solid",
                          borderColor: form.type === type.toLowerCase() ? "var(--accent)" : "rgba(255,255,255,0.1)",
                          background: form.type === type.toLowerCase() ? "var(--accent)" : "transparent",
                          color: form.type === type.toLowerCase() ? "var(--bg)" : "var(--ink-3)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label className="eyebrow" style={{ display: "flex", marginBottom: "0.5rem" }}>Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you have in mind…"
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "1rem",
                      padding: "1rem 1.2rem",
                      color: "var(--ink)",
                      fontSize: "1rem",
                      fontFamily: "inherit",
                      resize: "none",
                      outline: "none",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "var(--accent)",
                    color: "var(--bg)",
                    padding: "1.2rem",
                    borderRadius: "1rem",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
