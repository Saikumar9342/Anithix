"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(8,8,10,0.8)"
            : "rgba(8,8,10,0.4)",
          borderBottom: scrolled
            ? "1px solid var(--line-2)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-[var(--pad)] flex items-center justify-between h-16">
          {/* Logo — editorial mark */}
          <Link
            href="/"
            className="flex items-center gap-2 font-600 tracking-wide"
            style={{ color: "var(--ink)" }}
          >
            <div
              className="w-6 h-6 flex items-center justify-center font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              ⚡
            </div>
            <span className="text-sm">ANITHIX</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-500 transition-colors rounded-lg"
                style={{
                  color: isActive(link.href) ? "var(--ink)" : "var(--ink-3)",
                  background: isActive(link.href) ? "var(--line)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.background = "var(--line)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--ink-3)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="btn btn-solid"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Get in touch
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--ink-3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="mobile-menu open"
          style={{
            top: "64px",
            zIndex: 99,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="w-full text-left px-0 py-3 font-500 block"
              style={{
                color: isActive(link.href) ? "var(--accent)" : "var(--ink)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="btn btn-solid w-full mt-4 block text-center"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Get in touch
          </Link>
        </nav>
      )}
    </>
  );
}
