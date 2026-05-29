"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number; x: number; y: number; size: number;
  duration: number; delay: number; opacity: number;
}

export function HeroParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Only generate & render after client hydration — eliminates any server/client mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 50,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.3 + 0.05,
      }))
    );
  }, []);

  // Nothing rendered on server — particles appear after mount
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(139,92,246,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 6}px rgba(139,92,246,${p.opacity * 0.5})`,
          }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 0.2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
