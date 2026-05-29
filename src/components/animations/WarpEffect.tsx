"use client";

import { useEffect, useRef, useCallback } from "react";

interface WarpEffectProps {
  active: boolean;
  onComplete: () => void;
}

export function WarpEffect({ active, onComplete }: WarpEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const run = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // ── Warp stars ──────────────────────────────────────────────────────────
    const COUNT = 600;
    interface Star {
      x: number; y: number; px: number; py: number;
      angle: number; radius: number;
      speed: number; size: number; color: string;
    }

    const COLORS = ["#FFFFFF", "#C4B5FD", "#8B5CF6", "#DDD6FE", "#EDE9FE"];

    const stars: Star[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60 + 5;
      const sx = cx + Math.cos(angle) * radius;
      const sy = cy + Math.sin(angle) * radius;
      return {
        x: sx, y: sy, px: sx, py: sy,
        angle,
        radius,
        speed: Math.random() * 3 + 1,
        size: Math.random() * 1.5 + 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    const TOTAL = 2800; // ms

    const draw = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const t = Math.min(elapsed / TOTAL, 1);

      // ── Warp speed curve: ease-in, hold, ease-out ──
      let warp: number;
      if (t < 0.08) {
        warp = (t / 0.08) * 80; // Flash launch
      } else if (t < 0.65) {
        warp = 80 + ((t - 0.08) / 0.57) * 120; // Accelerate to full warp
      } else if (t < 0.82) {
        warp = 200; // Hold peak
      } else {
        warp = 200 * (1 - (t - 0.82) / 0.18); // Decelerate
      }

      // ── Clear with motion-blur trail ──
      const trailAlpha = t < 0.1 ? 0.4 : t > 0.82 ? 0.55 : 0.12;
      ctx.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // ── Initial FLASH ──
      if (t < 0.06) {
        const flashA = Math.sin((t / 0.06) * Math.PI) * 0.9;
        ctx.fillStyle = `rgba(139,92,246,${flashA})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Stars ──
      stars.forEach((s) => {
        s.px = s.x;
        s.py = s.y;

        const dx = s.x - cx;
        const dy = s.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;

        const accel = s.speed + warp * (0.5 + dist / 300);
        s.x += nx * accel;
        s.y += ny * accel;

        // Wrap back to center when off screen
        if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 40 + 3;
          s.x = cx + Math.cos(a) * r;
          s.y = cy + Math.sin(a) * r;
          s.px = s.x;
          s.py = s.y;
        }

        if (warp < 2) return;

        // Color: white at low speed → violet at peak → white again
        const alpha = Math.min(0.95, (warp / 200) * 1.2);
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = s.size * (1 + warp * 0.008);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // ── Tunnel rings (concentric, zoom toward viewer) ──
      if (warp > 30) {
        const ringAlpha = Math.min((warp - 30) / 170, 0.5);
        const ringCount = 8;
        for (let i = 0; i < ringCount; i++) {
          const phase = ((t * 4 + i / ringCount) % 1);
          const radius = phase * Math.max(W, H) * 0.8;
          const a = ringAlpha * (1 - phase);
          ctx.beginPath();
          ctx.ellipse(cx, cy, radius, radius * 0.55, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139,92,246,${a})`;
          ctx.lineWidth = (1 - phase) * 2;
          ctx.stroke();
        }
      }

      // ── Central vortex glow ──
      if (warp > 20) {
        const glowR = Math.min(warp / 200, 1) * 180;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        g.addColorStop(0, `rgba(196,181,253,${Math.min(warp / 200, 0.8)})`);
        g.addColorStop(0.4, `rgba(139,92,246,${Math.min(warp / 400, 0.4)})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Edge vignette ──
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${0.3 + t * 0.4})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ── Arrival flash ──
      if (t > 0.9) {
        const arrivalA = ((t - 0.9) / 0.1) * 0.7;
        ctx.fillStyle = `rgba(255,255,255,${arrivalA})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        // Final white-out then complete
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, W, H);
        setTimeout(onComplete, 80);
      }
    };

    startTimeRef.current = Date.now();
    animRef.current = requestAnimationFrame(draw);
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    run();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, run]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
