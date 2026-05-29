"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { TIMELINE } from "@/lib/constants";

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  // Handle reveal animations when section comes into view
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

  return (
    <section
      id="timeline"
      className="section"
      ref={sectionRef}
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow reveal">
            <span className="idx">05</span> / Our Journey
          </span>
          <h2 className="h-sec reveal reveal-d1">
            From vision<br />
            <span className="dim">to reality.</span>
          </h2>
        </div>

        <div
          className="reveal reveal-d2"
          style={{
            position: "relative",
            marginTop: "3rem",
          }}
        >
          {/* Animated vertical line */}
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: 0,
              bottom: 0,
              width: "1px",
              background: "var(--line-2)",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                width: "1px",
                height: lineHeight,
                background: "var(--accent)",
              }}
            />
          </div>

          {/* Timeline items */}
          <div style={{ paddingLeft: "4rem" }}>
            {TIMELINE.map((item, i) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "relative",
                  paddingBottom: "2rem",
                }}
              >
                {/* Marker dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-3.25rem",
                    top: "0.25rem",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    border: "3px solid var(--bg)",
                    boxShadow: "0 0 8px rgba(196, 188, 255, 0.4)",
                  }}
                />

                {/* Content */}
                <div>
                  <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--accent)" }}>{item.year}</span>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.3rem", color: "var(--ink)" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--ink-3)", fontSize: "0.95rem" }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
