"use client";

import { motion } from "framer-motion";

/**
 * Black hole effect — spinning accretion disk, glowing photon ring, and a
 * dark event horizon. Shown after the Contact form is submitted: the message
 * is "pulled into" the black hole.
 */
export function BlackHole({ message }: { message?: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-10" style={{ minHeight: 380 }}>
      <div className="relative" style={{ width: 280, height: 280 }}>
        {/* Outer gravitational glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(196,188,255,0.25) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Accretion disk — outer, tilted, spinning */}
        <motion.div
          className="absolute"
          style={{
            inset: "30px",
            borderRadius: "50%",
            background:
              "conic-gradient(from 0deg, #ffb347, #ff5e9c, #c4b5fd, #6ea8ff, #ffb347)",
            maskImage: "radial-gradient(circle, transparent 38%, black 42%, black 70%, transparent 74%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 38%, black 42%, black 70%, transparent 74%)",
            transform: "rotateX(68deg)",
            filter: "blur(2px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Accretion disk — inner brighter ring */}
        <motion.div
          className="absolute"
          style={{
            inset: "55px",
            borderRadius: "50%",
            background:
              "conic-gradient(from 180deg, #fff, #ffd27a, #ff7eb3, #c4b5fd, #fff)",
            maskImage: "radial-gradient(circle, transparent 40%, black 46%, black 64%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 40%, black 46%, black 64%, transparent 70%)",
            transform: "rotateX(68deg)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Photon ring — thin bright halo around the horizon */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 130,
            height: 130,
            transform: "translate(-50%, -50%)",
            boxShadow:
              "0 0 2px 1px rgba(255,255,255,0.9), 0 0 18px 4px rgba(196,188,255,0.6), inset 0 0 12px rgba(255,255,255,0.4)",
          }}
        />

        {/* Event horizon — the black core */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 118,
            height: 118,
            transform: "translate(-50%, -50%)",
            background: "#000",
            boxShadow: "inset 0 0 30px rgba(0,0,0,1)",
          }}
        />

        {/* Matter being pulled in — particles spiraling toward the core */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 130;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{ width: 3, height: 3, background: "rgba(255,255,255,0.9)" }}
              initial={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.4, opacity: 0 }}
              animate={{
                x: [Math.cos(angle) * r, 0],
                y: [Math.sin(angle) * r * 0.4, 0],
                opacity: [0, 1, 0],
                scale: [1, 0.2],
              }}
              transition={{
                duration: 1.8,
                delay: i * 0.12,
                repeat: Infinity,
                ease: "easeIn",
              }}
            />
          );
        })}
      </div>

      {/* Confirmation copy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center mt-6"
        style={{ fontFamily: "var(--font-space), sans-serif" }}
      >
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
          Message sent into the void.
        </h3>
        <p style={{ color: "var(--ink-3)", fontSize: "0.9rem", marginTop: "0.5rem", maxWidth: "32ch" }}>
          {message ?? "Your transmission has crossed the event horizon — we'll reach you across the light-years soon."}
        </p>
      </motion.div>
    </div>
  );
}
