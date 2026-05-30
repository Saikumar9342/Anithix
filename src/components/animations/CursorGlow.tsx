"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

export function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  // Halo follows with spring — creates the "lag behind" effect
  const springX = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.5 });

  const trailRef = useRef<TrailDot[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    // Only show on non-touch
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      rawX.set(x);
      rawY.set(y);
      dotX.set(x);
      dotY.set(y);

      if (!visible) setVisible(true);

      // Trail
      const dot: TrailDot = { id: idRef.current++, x, y, opacity: 1 };
      trailRef.current = [dot, ...trailRef.current.slice(0, 14)];
      setTrail([...trailRef.current]);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("button, a, [data-cursor='hover'], input, textarea, select, [role='button']");
      setHovering(!!interactive);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [visible, rawX, rawY, dotX, dotY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Trail dots */}
      {visible && trail.map((dot, i) => (
        <motion.div
          key={dot.id}
          style={{
            position: "fixed",
            left: dot.x,
            top: dot.y,
            x: "-50%",
            y: "-50%",
            width: 4 - i * 0.2,
            height: 4 - i * 0.2,
            borderRadius: "50%",
            background: `rgba(139,92,246,${Math.max(0, (1 - i / 15) * 0.28)})`,
            pointerEvents: "none",
            zIndex: 9997,
            filter: "blur(1px)",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Halo ring — spring-lagged. Subtle by default, expands on interactive elements. */}
      <motion.div
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          x: "-50%",
          y: "-50%",
          width: hovering ? 46 : clicking ? 24 : 30,
          height: hovering ? 46 : clicking ? 24 : 30,
          borderRadius: "50%",
          border: `1px solid rgba(139,92,246,${hovering ? 0.8 : 0.28})`,
          boxShadow: hovering ? "0 0 18px rgba(139,92,246,0.4)" : "none",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: visible ? 1 : 0, opacity: visible ? (hovering ? 1 : 0.6) : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Small dot — instant */}
      <motion.div
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          width: hovering ? 6 : 4,
          height: hovering ? 6 : 4,
          borderRadius: "50%",
          background: hovering ? "#C4B5FD" : "#8B5CF6",
          boxShadow: hovering ? "0 0 8px #8B5CF6" : "0 0 5px rgba(139,92,246,0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.15s, height 0.15s, background 0.15s",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: visible ? 1 : 0, opacity: visible ? (hovering ? 1 : 0.7) : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
