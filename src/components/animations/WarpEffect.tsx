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

    // ── True 3D Hyperspace ──────────────────────────────────────────────────
    const COUNT = 1200;
    interface Star {
      x: number; y: number; z: number; pz: number;
      color: string;
    }

    const COLORS = ["#FFFFFF", "#FFFFFF", "#C4B5FD", "#8B5CF6", "#EDE9FE"];

    const spawnStar = (far = true) => {
      // Random angle and distance to ensure they spread across the screen
      const r = Math.random() * Math.max(W, H) * 2;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        z: far ? Math.random() * 2000 + 500 : Math.random() * 2000,
        pz: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const stars: Star[] = Array.from({ length: COUNT }, () => {
      const s = spawnStar(false);
      s.pz = s.z;
      return s;
    });

    const TOTAL = 2800; // ms

    const draw = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const t = Math.min(elapsed / TOTAL, 1);

      // ── Warp speed curve: true exponential acceleration ──
      let warp = 0;
      if (t < 0.1) {
        warp = (t / 0.1) * 10; // Launch kick
      } else if (t < 0.6) {
        // Exponential acceleration to massive speed
        warp = 10 + Math.pow((t - 0.1) / 0.5, 4) * 400; 
      } else if (t < 0.8) {
        warp = 410; // Hold peak
      } else {
        warp = 410 * Math.pow(1 - (t - 0.8) / 0.2, 2); // Fast Decelerate
      }

      // ── Clear screen ──
      // In 3D we don't rely heavily on motion blur trails, the lines ARE the trails.
      // But a slight fade looks nice.
      ctx.fillStyle = `rgba(5, 2, 12, ${t > 0.8 ? 0.9 : 0.6})`;
      ctx.fillRect(0, 0, W, H);

      // ── Initial FLASH ──
      if (t < 0.05) {
        const flashA = Math.sin((t / 0.05) * Math.PI) * 0.8;
        ctx.fillStyle = `rgba(139,92,246,${flashA})`;
        ctx.fillRect(0, 0, W, H);
      }

      const fov = Math.max(W, H); // Field of view depth

      // ── Draw 3D Stars ──
      stars.forEach((s) => {
        s.pz = s.z;
        s.z -= (2 + warp); // Base speed 2 + warp speed

        // Recycle stars that pass the camera
        if (s.z < 10) {
          const ns = spawnStar(true);
          s.x = ns.x;
          s.y = ns.y;
          s.z = 2000;
          s.pz = 2000;
          s.color = ns.color;
        }

        if (s.z > 0 && s.pz > 0) {
          // 3D Projection
          const sx = cx + (s.x / s.z) * fov;
          const sy = cy + (s.y / s.z) * fov;
          const px = cx + (s.x / s.pz) * fov;
          const py = cy + (s.y / s.pz) * fov;

          // Optimization: skip if both ends are completely off screen
          if ((sx < 0 || sx > W || sy < 0 || sy > H) && (px < 0 || px > W || py < 0 || py > H)) return;

          // Thicker lines as they get closer, boosted by warp speed
          const width = Math.max(0.5, Math.min(4, 1000 / s.z)) * (1 + warp * 0.002);
          
          // Smooth fade in from the back, fade out at the very front
          const distAlpha = Math.min(1, (2000 - s.z) / 400); 
          const closeAlpha = Math.min(1, s.z / 30); 
          const globalAlpha = distAlpha * closeAlpha;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = globalAlpha;
          ctx.lineWidth = width;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // ── Central vortex glow at peak warp ──
      if (warp > 100) {
        const glowR = Math.min(warp / 410, 1) * (W * 0.4);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        g.addColorStop(0, `rgba(196,181,253,${Math.min(warp / 410, 0.4)})`);
        g.addColorStop(0.3, `rgba(139,92,246,${Math.min(warp / 600, 0.2)})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Edge vignette for dramatic tunnel feel ──
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${0.2 + t * 0.4})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ── Arrival flash ──
      if (t > 0.85) {
        const arrivalA = ((t - 0.85) / 0.15); // Ramp up to white
        ctx.fillStyle = `rgba(255,255,255,${arrivalA})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        // Final white-out then complete
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(0, 0, W, H);
        setTimeout(onComplete, 50);
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
        zIndex: 100000,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
