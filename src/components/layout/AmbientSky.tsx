"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StarField } from "./StarField";

export type Period = "morning" | "afternoon" | "evening" | "night";

export function getPeriod(hour: number): Period {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 16) return "afternoon";
  if (hour >= 16 && hour < 20) return "evening";
  return "night";
}

/* Per-period look: sky wash, sun (disc core + glow halo), cloud tint, readability scrim */
const THEMES: Record<
  Exclude<Period, "night">,
  {
    sky: string;
    sun: { x: string; y: string; halo: number; disc: number; core: string; glow: string };
    cloud: string;
    cloudOpacity: number;
    scrim: number;
  }
> = {
  morning: {
    sky: "linear-gradient(180deg, rgba(255,196,140,0.7) 0%, rgba(255,170,150,0.45) 35%, rgba(120,140,200,0.3) 70%, rgba(8,8,10,0.2) 100%)",
    sun: { x: "20%", y: "30%", halo: 560, disc: 130, core: "rgba(255,240,200,1)", glow: "rgba(255,210,130,0.85)" },
    cloud: "rgba(255,245,235,1)",
    cloudOpacity: 0.75,
    scrim: 0.6,
  },
  afternoon: {
    sky: "linear-gradient(180deg, rgba(110,180,255,0.75) 0%, rgba(160,210,255,0.5) 45%, rgba(200,230,255,0.28) 80%, rgba(8,8,10,0.2) 100%)",
    sun: { x: "76%", y: "22%", halo: 520, disc: 120, core: "rgba(255,255,245,1)", glow: "rgba(255,250,220,0.9)" },
    cloud: "rgba(255,255,255,1)",
    cloudOpacity: 0.9,
    scrim: 0.55,
  },
  evening: {
    sky: "linear-gradient(180deg, rgba(255,120,60,0.7) 0%, rgba(220,80,130,0.5) 40%, rgba(110,60,140,0.4) 72%, rgba(20,15,40,0.3) 100%)",
    sun: { x: "76%", y: "30%", halo: 600, disc: 150, core: "rgba(255,220,160,1)", glow: "rgba(255,130,70,0.85)" },
    cloud: "rgba(255,180,150,1)",
    cloudOpacity: 0.65,
    scrim: 0.62,
  },
};

const NIGHT_SCRIM = 0.45;

type Cloud = {
  id: number;
  top: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
  startX: number;
  opacity: number;
};

function Clouds({ tint, baseOpacity }: { tint: string; baseOpacity: number }) {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    const c: Cloud[] = Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      top: Math.random() * 60 + 4,
      width: Math.random() * 320 + 280,
      height: Math.random() * 80 + 90,
      duration: Math.random() * 40 + 55,
      delay: -Math.random() * 80,
      startX: Math.random() * 100,
      opacity: baseOpacity * (Math.random() * 0.4 + 0.65),
    }));
    setClouds(c);
  }, [baseOpacity]);

  return (
    <>
      {clouds.map((cl) => (
        <motion.div
          key={cl.id}
          className="absolute"
          style={{
            top: cl.top + "vh",
            left: 0,
            width: cl.width,
            height: cl.height,
            borderRadius: "999px",
            background: `radial-gradient(ellipse at center, ${tint} 0%, rgba(255,255,255,0) 72%)`,
            filter: "blur(8px)",
            opacity: cl.opacity,
          }}
          initial={{ x: `${cl.startX}vw` }}
          animate={{ x: ["-35vw", "125vw"] }}
          transition={{
            duration: cl.duration,
            delay: cl.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}

export function AmbientSky({ period }: { period: Period }) {
  // Background layer: sits BEHIND the content (z-index -1). The content sections
  // are made transparent (body.theme-active) so this shows through, and a dark
  // scrim on top keeps text readable in both bright and dark themes.
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {period === "night" ? (
        <>
          <StarField position="absolute" opacity={0.9} />
          <div className="absolute inset-0" style={{ background: `rgba(8,8,10,${NIGHT_SCRIM})` }} />
        </>
      ) : (
        <>
          {/* Sky wash */}
          <div className="absolute inset-0" style={{ background: THEMES[period].sky }} />

          {/* Sun glow halo */}
          <div
            className="absolute rounded-full"
            style={{
              left: THEMES[period].sun.x,
              top: THEMES[period].sun.y,
              width: THEMES[period].sun.halo,
              height: THEMES[period].sun.halo,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${THEMES[period].sun.glow} 0%, rgba(255,255,255,0) 65%)`,
            }}
          />

          {/* Sun disc — bright core */}
          <div
            className="absolute rounded-full"
            style={{
              left: THEMES[period].sun.x,
              top: THEMES[period].sun.y,
              width: THEMES[period].sun.disc,
              height: THEMES[period].sun.disc,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${THEMES[period].sun.core} 0%, ${THEMES[period].sun.core} 55%, ${THEMES[period].sun.glow} 80%, rgba(255,255,255,0) 100%)`,
              filter: "blur(2px)",
            }}
          />

          {/* Drifting clouds */}
          <Clouds tint={THEMES[period].cloud} baseOpacity={THEMES[period].cloudOpacity} />

          {/* Readability scrim */}
          <div className="absolute inset-0" style={{ background: `rgba(8,8,10,${THEMES[period].scrim})` }} />
        </>
      )}
    </div>
  );
}
