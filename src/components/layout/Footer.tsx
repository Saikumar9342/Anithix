"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { JellyText } from "@/components/animations/JellyText";

export function Footer() {
  return (
    <footer style={{ background: "var(--bg)", paddingTop: "10rem", paddingBottom: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 10 }}>
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(124, 58, 237, 0.4), transparent 70%)",
        }}
      />

      <div className="wrap relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-24">
          
          {/* Brand Info */}
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink)", marginBottom: "1.5rem" }}>
              ANITHIX
            </div>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.6, maxWidth: "300px" }}>
              Building the next generation of intelligent software, automation platforms, and developer tools.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink)", fontWeight: 700, marginBottom: "1.5rem" }}>Ecosystem</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["Graviton", "Atom", "Orbis", "Future Labs"].map(l => (
                  <li key={l}>
                    <a href="#products" style={{ color: "var(--ink-3)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-3)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink)", fontWeight: 700, marginBottom: "1.5rem" }}>Company</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["About", "Technology", "Timeline", "Contact"].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} style={{ color: "var(--ink-3)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-3)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Typography */}
        <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(4rem, 18vw, 20rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.03)", userSelect: "none", lineHeight: 0.8 }}>
            <JellyText text="ANITHIX" />
          </h2>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", color: "var(--ink-4)" }}>
          <div className="mono" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            &copy; {new Date().getFullYear()} Anithix. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>GitHub</a>
            <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>LinkedIn</a>
            <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
