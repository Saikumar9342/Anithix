"use client";

import { TECH_STACK } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

export function Technology() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="technology"
      className="section"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">04</span> / Technology Stack
          </span>
          <h2 className="h-sec reveal reveal-d1">
            Engineered with<br />
            <span className="dim">the best tools.</span>
          </h2>
          <p className="lede reveal reveal-d2">
            A modern, battle-tested technology stack powering the entire Anithix ecosystem.
          </p>
        </div>

        <div
          className="reveal reveal-d1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            background: "var(--line)",
            border: "1px solid var(--line)",
            marginTop: "3rem",
          }}
        >
          {/* Frontend */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              Frontend
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              Backend
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["FastAPI", "Node.js", "Express", "Python"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Databases */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              Databases
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["PostgreSQL", "MongoDB"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* AI & Models */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              AI & Models
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["Ollama", "OpenRouter", "Groq", "Together AI", "OpenAI APIs"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              Infrastructure
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["Docker", "Linux", "Apache", "Nginx"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Approach */}
          <div className="cell" style={{ padding: "2rem", background: "var(--bg)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              Approach
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["AI-native", "Performance-first", "DX-obsessed"].map((tech) => (
                <span key={tech} className="pipe">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tech foot */}
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "2rem",
              background: "var(--bg)",
              textAlign: "center",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "0.8rem" }}>
              Built for scale
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--ink-2)" }}>
              Advanced · Next-gen · Intelligent · Technology · Hub for Innovation & eXcellence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
