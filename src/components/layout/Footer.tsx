"use client";

import { SITE_CONFIG, PRODUCTS } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      className="relative border-t overflow-hidden"
      style={{
        background: "var(--bg)",
        borderColor: "var(--line)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none blur-[80px]"
        style={{
          background: "rgba(196,188,255,0.04)",
          transform: "translateX(-50%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-[var(--pad)] py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-sm font-600 tracking-wide"
                style={{ color: "var(--ink)" }}
              >
                ANITHIX
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--ink-3)" }}>
              Building intelligent products that matter.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: SITE_CONFIG.github, label: "GH" },
                { href: SITE_CONFIG.linkedin, label: "LI" },
                { href: `mailto:${SITE_CONFIG.email}`, label: "@" },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded flex items-center justify-center text-xs font-500 transition-all"
                  style={{
                    border: "1px solid var(--line-2)",
                    color: "var(--ink-3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--line-2)";
                    e.currentTarget.style.color = "var(--ink-3)";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="eyebrow mb-4">Products</h4>
            <ul className="space-y-2">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="text-sm transition-colors"
                    style={{ color: "var(--ink-3)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--ink)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--ink-3)")
                    }
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                "About",
                "Ecosystem",
                "Technology",
                "Timeline",
                "AI Lab",
                "Founder",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm transition-colors"
                    style={{ color: "var(--ink-3)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--ink)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--ink-3)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="eyebrow mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm transition-colors"
                  style={{ color: "var(--ink-3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--ink)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--ink-3)")
                  }
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: "var(--ink-3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--ink)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--ink-3)")
                  }
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: "var(--ink-3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--ink)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--ink-3)")
                  }
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            © {new Date().getFullYear()} ANITHIX. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            Designed with precision. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
