"use client";

import { useEffect, useRef } from "react";

interface ScrollWarpProps {
  /** 0–1 scroll progress of the hero section */
  progress: number;
}

export function ScrollWarp({ progress }: ScrollWarpProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const starsRef  = useRef<{ x: number; y: number; z: number; color: string }[]>([]);

  // Build star field once
  useEffect(() => {
    const COLORS = ["#ffffff", "#ffffff", "#c4b5fd", "#8b5cf6", "#ede9fe"];
    starsRef.current = Array.from({ length: 800 }, () => {
      const r   = Math.random() * Math.max(window.innerWidth, window.innerHeight) * 1.5;
      const ang = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(ang) * r,
        y: Math.sin(ang) * r,
        z: Math.random() * 1400 + 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    cancelAnimationFrame(animRef.current);

    const draw = () => {
      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const fov = Math.max(W, H);

      // p: 0 at progress=0.93, 1 at progress=1.0
      const p = Math.max(0, Math.min(1, (progress - 0.93) / 0.07));

      if (p <= 0) {
        ctx.clearRect(0, 0, W, H);
        return;
      }

      // Warp speed: exponential ramp
      const warp = Math.pow(p, 2) * 380;

      // Background fade from transparent → black
      ctx.fillStyle = `rgba(5, 2, 12, ${0.55 + p * 0.3})`;
      ctx.fillRect(0, 0, W, H);

      starsRef.current.forEach((s) => {
        const pz = s.z;
        s.z -= (1 + warp * 0.5);
        if (s.z < 1) s.z = 1400;

        const sx = cx + (s.x / s.z)  * fov;
        const sy = cy + (s.y / s.z)  * fov;
        const px2 = cx + (s.x / pz)  * fov;
        const py2 = cy + (s.y / pz)  * fov;

        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) return;

        const width = Math.max(0.5, Math.min(3, 800 / s.z)) * (1 + warp * 0.004);
        const alpha = Math.min(1, (1400 - s.z) / 300) * Math.min(1, s.z / 20) * p;

        ctx.beginPath();
        ctx.moveTo(px2, py2);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = width;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Central purple vortex glow
      if (p > 0.3) {
        const glowR = p * W * 0.35;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        g.addColorStop(0, `rgba(196,181,253,${p * 0.35})`);
        g.addColorStop(0.4, `rgba(139,92,246,${p * 0.15})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Edge vignette
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${0.3 + p * 0.5})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [progress]);

  // Invisible when progress < 0.82
  if (progress < 0.93) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
