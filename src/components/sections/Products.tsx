"use client";

import { useReveal } from "@/hooks/useReveal";

export function Products() {
  const ref = useReveal();
  return (
    <section ref={ref} id="products" style={{ background: "var(--bg)" }}>
      <div className="wrap" style={{ paddingTop: "clamp(5rem, 9vw, 8rem)" }}>
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">03</span> / Products
          </span>
          <h2 className="h-sec reveal reveal-d1">
            A connected suite,<br />
            <span className="dim">each built with obsession.</span>
          </h2>
        </div>
      </div>

      {/* GRAVITON */}
      <div className="wrap" style={{ marginTop: "clamp(4rem, 8vw, 6rem)" }}>
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <span className="eyebrow" style={{ marginBottom: "1rem", display: "block" }}>
            Product 01 — Graviton
          </span>
          <h2 className="h-sec" style={{ marginBottom: "0.5rem" }}>
            Graviton
          </h2>
          <p className="lede" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
            Your personal AI universe.
          </p>
          <p style={{ color: "var(--ink-2)", marginBottom: "1.5rem", maxWidth: "60ch" }}>
            A powerful personal AI workspace supporting local and cloud AI models with advanced
            customization and productivity tools. Connect every AI provider in one intelligent interface.
          </p>
          <span className="status-tag">
            <span className="dot"></span> Launching
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
            marginTop: "2rem",
          }}
        >
          <div className="reveal reveal-d1">
            <div className="feat-list" style={{ marginBottom: "2rem" }}>
              <div className="f">Multi-provider AI</div>
              <div className="f">Ollama integration</div>
              <div className="f">Local AI models</div>
              <div className="f">AI Chat</div>
              <div className="f">Research Mode</div>
              <div className="f">Developer Mode</div>
              <div className="f">Vision Models</div>
              <div className="f">Image Generation</div>
              <div className="f">Chat History</div>
              <div className="f">Custom Themes</div>
            </div>
            <a href="#contact" className="btn btn-ghost">
              Explore Graviton <span className="arr">→</span>
            </a>
          </div>

          <div className="reveal reveal-d2">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {[
                { ico: "◐", title: "Multi-Provider AI", desc: "Ollama, OpenRouter, Groq, Together AI, and any OpenAI-compatible API in one workspace." },
                { ico: "▦", title: "AI Workspace", desc: "Organize interactions into projects, workspaces, and custom environments." },
                { ico: "◇", title: "Research Mode", desc: "Deep research with web-aware models and document analysis." },
                { ico: "▤", title: "Dashboards", desc: "News, weather, and productivity dashboards in one unified view." },
              ].map((item, i) => (
                <div key={i} className="cell" style={{ padding: "1.2rem" }}>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      marginBottom: "0.8rem",
                      color: "var(--accent)",
                    }}
                  >
                    {item.ico}
                  </div>
                  <h5 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {item.title}
                  </h5>
                  <p style={{ fontSize: "0.82rem", color: "var(--ink-3)", lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Orbit card */}
            <div className="cell" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  color: "var(--accent)",
                }}
              >
                ◉
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {["Ollama", "OpenRouter", "Groq", "Together"].map((name) => (
                  <span key={name} className="chip">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="rule-fade" style={{ marginTop: "4rem", marginBottom: "4rem" }} />

      {/* ATOM */}
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
            gridAutoFlow: "dense",
          }}
        >
          <div className="reveal reveal-d1" style={{ gridColumn: "2" }}>
            <div className="steps">
              {[
                { sn: "01", title: "Upload your resume", desc: "Drop your existing resume or start fresh. AI extracts and structures your data instantly." },
                { sn: "02", title: "AI generates portfolio", desc: "The design engine creates a stunning portfolio website in seconds." },
                { sn: "03", title: "Customize & enhance", desc: "Fine-tune every detail from your phone. AI suggests improvements in real time." },
                { sn: "04", title: "Go live instantly", desc: "Publish your live portfolio with one tap. Custom domain support included." },
              ].map((step) => (
                <div key={step.sn} className="step">
                  <span className="sn">{step.sn}</span>
                  <div>
                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ gridColumn: "1" }}>
            <span className="eyebrow" style={{ marginBottom: "1rem", display: "block" }}>
              Product 02 — Atom
            </span>
            <h2 className="h-sec" style={{ marginBottom: "0.5rem" }}>
              Atom
            </h2>
            <p className="lede" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              Your portfolio, from your pocket.
            </p>
            <p style={{ color: "var(--ink-2)", marginBottom: "1.5rem", maxWidth: "60ch" }}>
              A mobile-first portfolio builder that lets you create and manage professional portfolio
              websites entirely from your smartphone. Upload a resume and watch AI transform it into
              a stunning live website.
            </p>
            <span className="status-tag" style={{ marginBottom: "1.5rem" }}>
              <span className="dot"></span> Launching
            </span>
            <div className="feat-list" style={{ marginBottom: "2rem" }}>
              <div className="f">Mobile management</div>
              <div className="f">Resume → Portfolio</div>
              <div className="f">AI enhancement</div>
              <div className="f">Portfolio analytics</div>
              <div className="f">Messaging system</div>
              <div className="f">Live updates</div>
              <div className="f">Multi-language</div>
              <div className="f">Domain integration</div>
            </div>
            <a href="#contact" className="btn btn-ghost">
              Explore Atom <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>

      <hr className="rule-fade" style={{ marginTop: "4rem", marginBottom: "4rem" }} />

      {/* ORBIS */}
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: "640px", marginBottom: "2rem" }}>
          <span className="eyebrow" style={{ marginBottom: "1rem", display: "block" }}>
            Product 03 — Orbis
          </span>
          <h2 className="h-sec" style={{ marginBottom: "0.5rem" }}>
            Orbis
          </h2>
          <p className="lede" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
            Automate your content universe.
          </p>
          <p style={{ color: "var(--ink-2)", maxWidth: "60ch" }}>
            An AI-powered automation platform that discovers trends, writes content, generates
            visuals, and publishes — all on autopilot.
          </p>
          <span className="status-tag" style={{ marginTop: "1rem" }}>
            <span className="dot"></span> In development
          </span>
        </div>

        <div className="reveal reveal-d1" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <div className="pipeline">
            <span className="pipe">News Sources</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">AI Analysis</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">Content Gen</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">Image Creation</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">Review</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">Publishing</span>
            <span className="pipe-arr">→</span>
            <span className="pipe">Analytics</span>
          </div>
        </div>

        <div className="lab-grid reveal reveal-d2">
          {[
            { ico: "↗", title: "Trend Discovery", desc: "Surface emerging topics automatically." },
            { ico: "✎", title: "AI Content", desc: "Generate posts and captions in your brand voice." },
            { ico: "◷", title: "AI Images", desc: "On-brand visuals created on demand." },
            { ico: "▤", title: "Analytics", desc: "Track reach and performance over time." },
          ].map((item, i) => (
            <div key={i} className="lab-cell">
              <div className="ico">{item.ico}</div>
              <h5>{item.title}</h5>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="rule-fade" style={{ marginTop: "4rem", marginBottom: "4rem" }} />

      {/* FUTURE LABS */}
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: "640px", marginBottom: "2rem" }}>
          <span className="eyebrow" style={{ marginBottom: "1rem", display: "block" }}>
            Product 04 — Future Labs
          </span>
          <h2 className="h-sec" style={{ marginBottom: "0.5rem" }}>
            Future Labs
          </h2>
          <p className="lede" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
            The future is being built here.
          </p>
          <p style={{ color: "var(--ink-2)", maxWidth: "60ch" }}>
            Experiments, prototypes, and emerging technologies shaping the next generation of
            Anithix products.
          </p>
          <span className="status-tag" style={{ marginTop: "1rem" }}>
            <span className="dot"></span> Research
          </span>
        </div>

        <div className="lab-grid reveal reveal-d1" style={{ marginTop: "2rem" }}>
          {[
            { ico: "⬡", title: "AI Agents", desc: "Autonomous agents that perceive, reason, and act across complex multi-step tasks." },
            { ico: "◈", title: "Research Projects", desc: "Cutting-edge experiments pushing the boundaries of AI and automation." },
            { ico: "✶", title: "Experimental Tech", desc: "Prototypes and concepts being actively tested inside the lab." },
            { ico: "⟐", title: "Future Products", desc: "Products in early conception that will expand the ecosystem further." },
          ].map((item, i) => (
            <div key={i} className="lab-cell">
              <div className="ico">{item.ico}</div>
              <h5>{item.title}</h5>
              <p>{item.desc}</p>
              <span
                className="soon"
                style={{
                  marginTop: "1rem",
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <span className="dot"></span> Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
