"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const handleReveal = () => {
      if (sectionRef.current) {
        const reveals = sectionRef.current.querySelectorAll(".reveal");
        reveals.forEach((el) => {
          el.classList.add("in");
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

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
    <section
      id="contact"
      ref={sectionRef}
      className="section"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">08</span> / Get in Touch
          </span>
          <h2 className="h-sec reveal reveal-d1">
            Let's build<br />
            <span className="dim">something great.</span>
          </h2>
          <p className="lede reveal reveal-d2">
            Whether you're curious about our products, want to partner, or just want to say hi —
            we'd love to hear from you.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "3rem",
            marginTop: "3rem",
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
                  className="cell"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1.2rem",
                    marginBottom: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      color: "var(--accent)",
                    }}
                  >
                    ✉
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-4)" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--ink)" }}>
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability */}
            <div className="cell" style={{ padding: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                <span className="dot"></span>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--live)" }}>
                  Available for collaboration
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-3)", lineHeight: 1.5 }}>
                Open to product partnerships, developer collaborations, and early access inquiries.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="reveal reveal-d1">
            {submitted ? (
              <div className="cell" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✓</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Message sent!
                </h3>
                <p style={{ color: "var(--ink-3)" }}>
                  Thanks for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cell" style={{ padding: "2rem" }}>
                {/* Name & Email */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.7rem",
                        color: "var(--ink-4)",
                        fontFamily: "var(--mono)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
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
                        background: "transparent",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        padding: "0.6rem 0.8rem",
                        color: "var(--ink)",
                        fontSize: "0.9rem",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.7rem",
                        color: "var(--ink-4)",
                        fontFamily: "var(--mono)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
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
                        background: "transparent",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        padding: "0.6rem 0.8rem",
                        color: "var(--ink)",
                        fontSize: "0.9rem",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "var(--ink-4)",
                      fontFamily: "var(--mono)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.8rem",
                    }}
                  >
                    Inquiry type
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["General", "Product", "Business"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type: type.toLowerCase() })}
                        style={{
                          padding: "0.6rem 1rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          border: "1px solid var(--line)",
                          background: form.type === type.toLowerCase() ? "var(--bg-1)" : "transparent",
                          color: form.type === type.toLowerCase() ? "var(--accent)" : "var(--ink-3)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          form.type !== type.toLowerCase() &&
                          (e.currentTarget.style.borderColor = "var(--accent)")
                        }
                        onMouseLeave={(e) =>
                          form.type !== type.toLowerCase() &&
                          (e.currentTarget.style.borderColor = "var(--line)")
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "var(--ink-4)",
                      fontFamily: "var(--mono)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
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
                      background: "transparent",
                      border: "1px solid var(--line)",
                      borderRadius: "4px",
                      padding: "0.6rem 0.8rem",
                      color: "var(--ink)",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                      resize: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-solid"
                  style={{
                    width: "100%",
                    background: "var(--accent)",
                    color: "var(--bg)",
                  }}
                >
                  Send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
