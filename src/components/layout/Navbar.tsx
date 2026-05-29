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
            ? "rgba(8,8,10,0.85)"
            : "rgba(8,8,10,0.3)",
          borderBottom: scrolled
            ? "1px solid var(--line)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-[var(--pad)] flex items-center justify-between h-20">
          {/* Logo — editorial mark */}
          <Link
            href="/"
            className="flex items-center gap-2 font-600 tracking-wide flex-shrink-0"
            style={{ color: "var(--ink)" }}
          >
            <div
              className="w-6 h-6 flex items-center justify-center font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              ⚡
            </div>
            <span className="text-sm hidden sm:inline">ANITHIX</span>
          </Link>

          {/* Desktop nav — centered spacing */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-400 transition-all duration-300 relative"
                style={{
                  color: isActive(link.href) ? "var(--ink)" : "var(--ink-2)",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--ink)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "var(--ink-2)";
                  }
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--accent)",
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="btn btn-solid px-6 py-2"
              style={{ background: "var(--accent)", color: "var(--bg)", fontSize: "0.9rem" }}
            >
              Get in touch
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 transition-colors"
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
            top: "80px",
            zIndex: 99,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="w-full text-left px-0 py-4 font-400 block border-b"
              style={{
                color: isActive(link.href) ? "var(--accent)" : "var(--ink-2)",
                borderBottomColor: "var(--line)",
                fontSize: "1rem",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="btn btn-solid w-full mt-6 block text-center"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Get in touch
          </Link>
        </nav>
      )}
    </>
  );
}
