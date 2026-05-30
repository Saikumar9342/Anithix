"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* Realistic star colors — subtle stellar temperatures (mostly white) */
const STAR_TINTS = [
  "255,255,255", // white
  "255,255,255", // white (weighted)
  "255,248,236", // warm
  "236,244,255", // cool blue
];

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  tint: string;
  brightness: number;
  twinkleDur: number;
  twinkleDelay: number;
  glint: boolean;
};

type Shooter = {
  id: number;
  top: number;
  left: number;
  length: number;
  angle: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  repeatDelay: number;
};

type StarFieldProps = {
  /** Layer opacity (0–1). Lower keeps content readable. */
  opacity?: number;
  /** Number of stars. */
  count?: number;
  /** Whether to render shooting stars. */
  shooting?: boolean;
  /** `fixed` covers the viewport; `absolute` fills the positioned parent. */
  position?: "fixed" | "absolute";
  /** z-index of the layer (only meaningful for `fixed`). */
  z?: number;
};

export function StarField({
  opacity = 0.55,
  count = 180,
  shooting = true,
  position = "fixed",
  z = 80,
}: StarFieldProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shooters, setShooters] = useState<Shooter[]>([]);

  useEffect(() => {
    const s: Star[] = Array.from({ length: count }).map((_, i) => {
      const r = Math.random();
      const bright = r > 0.88;
      const size = bright ? Math.random() * 2.5 + 3 : Math.random() * 1.6 + 1.6;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
        brightness: bright ? 1 : Math.random() * 0.35 + 0.6,
        twinkleDur: Math.random() * 3 + 2.5,
        twinkleDelay: Math.random() * 6,
        glint: bright,
      };
    });
    setStars(s);

    if (shooting) {
      const sh: Shooter[] = Array.from({ length: 3 }).map((_, i) => {
        const angle = Math.random() * 20 + 20; // 20–40° downward
        const dist = Math.max(window.innerWidth, window.innerHeight) * 1.2;
        const rad = (angle * Math.PI) / 180;
        return {
          id: i,
          top: Math.random() * 35 + 2,
          left: Math.random() * 50 + 5,
          length: Math.random() * 100 + 140,
          angle,
          dx: Math.cos(rad) * dist,
          dy: Math.sin(rad) * dist,
          duration: Math.random() * 0.5 + 0.9,
          delay: Math.random() * 5 + i * 5,
          repeatDelay: Math.random() * 10 + 8,
        };
      });
      setShooters(sh);
    }
  }, [count, shooting]);

  return (
    <div
      className={`${position === "fixed" ? "fixed" : "absolute"} inset-0 pointer-events-none overflow-hidden`}
      style={{ opacity, zIndex: position === "fixed" ? z : undefined }}
    >
      {/* Realistic stars — round glowing points, subtle twinkle */}
      {stars.map((st) => (
        <motion.div
          key={st.id}
          className="absolute"
          style={{ left: st.x + "vw", top: st.y + "vh", width: st.size, height: st.size }}
          animate={{ opacity: [st.brightness * 0.55, st.brightness, st.brightness * 0.65] }}
          transition={{
            duration: st.twinkleDur,
            delay: st.twinkleDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* core point */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `rgba(${st.tint},1)`,
              boxShadow: `0 0 ${st.size * 3}px ${st.size * 0.7}px rgba(${st.tint},0.7)`,
            }}
          />
          {/* diffraction glint on bright stars */}
          {st.glint && (
            <>
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  width: st.size * 9,
                  height: 1,
                  transform: "translate(-50%, -50%)",
                  background: `linear-gradient(90deg, transparent, rgba(${st.tint},0.7), transparent)`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  width: 1,
                  height: st.size * 9,
                  transform: "translate(-50%, -50%)",
                  background: `linear-gradient(180deg, transparent, rgba(${st.tint},0.7), transparent)`,
                }}
              />
            </>
          )}
        </motion.div>
      ))}

      {/* Shooting stars — travel along their own direction */}
      {shooters.map((s) => (
        <motion.div
          key={`shoot-${s.id}`}
          className="absolute"
          style={{
            top: s.top + "vh",
            left: s.left + "vw",
            width: s.length,
            height: 2,
            borderRadius: "999px",
            rotate: `${s.angle}deg`,
            transformOrigin: "left center",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 80%, #ffffff 100%)",
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.65)",
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, s.dx], y: [0, s.dy] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: "easeIn",
            times: [0, 0.1, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}
