"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import { WarpEffect } from "@/components/animations/WarpEffect";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  launching: { label: "Launching Soon", color: "#8B5CF6" },
  development: { label: "In Development", color: "#A78BFA" },
  research: { label: "Research Phase", color: "#C4B5FD" },
  future: { label: "Future Lab", color: "#DDD6FE" },
};

/* ── 3D-tilt planet card ──────────────────────────────────── */
function Planet({
  product,
  isActive,
  onHover,
  onLeave,
  onWarp,
  index,
  inView,
}: {
  product: (typeof PRODUCTS)[0];
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onWarp: () => void;
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<number>(0);
  const [orbitAngle, setOrbitAngle] = useState(index * 60);

  // Satellite orbit
  useEffect(() => {
    if (isActive) return;
    let last = 0;
    const speed = 0.01 + index * 0.003;
    const animate = (t: number) => {
      if (last) setOrbitAngle((a) => a + speed * (t - last));
      last = t;
      orbitRef.current = requestAnimationFrame(animate);
    };
    orbitRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(orbitRef.current);
  }, [isActive, index]);

  // 3D tilt on hover
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-y * 18);
    rotY.set(x * 18);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    onLeave();
  };

  const satelliteX = Math.cos((orbitAngle * Math.PI) / 180) * 55;
  const satelliteY = Math.sin((orbitAngle * Math.PI) / 180) * 20;

  // Planet colors — all violet variants on black
  const planetColors: Record<string, { glow: string; surface: string; accent: string }> = {
    graviton:    { glow: "#7C3AED", surface: "#4C1D95", accent: "#A78BFA" },
    atom:        { glow: "#6D28D9", surface: "#3B0764", accent: "#8B5CF6" },
    orbis:       { glow: "#5B21B6", surface: "#2E1065", accent: "#7C3AED" },
    "future-labs": { glow: "#8B5CF6", surface: "#581C87", accent: "#C4B5FD" },
  };
  const pc = planetColors[product.id] ?? { glow: "#8B5CF6", surface: "#4C1D95", accent: "#A78BFA" };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.4, y: 40 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.3 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center cursor-pointer select-none"
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onWarp}
      data-cursor="hover"
      style={{ perspective: 800 }}
    >
      <motion.div
        style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: "preserve-3d" }}
        className="relative"
        animate={{ scale: isActive ? 1.18 : 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Outer atmosphere glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: pc.glow, opacity: 0 }}
          animate={{ opacity: isActive ? 0.6 : 0.25, scale: isActive ? 1.4 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Planet body 140x140 */}
        <div className="relative w-36 h-36">
          {/* Rings */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-20"
            style={{ width: 190, height: 60, borderColor: pc.glow, transform: "translate(-50%,-50%) rotateX(75deg)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 border rounded-full opacity-10"
            style={{ width: 210, height: 65, borderColor: pc.accent, transform: "translate(-50%,-50%) rotateX(75deg)" }}
          />

          {/* Main sphere */}
          <motion.div
            className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${pc.accent}80, ${pc.glow}CC 50%, #0a0010 100%)`,
              boxShadow: isActive
                ? `0 0 50px ${pc.glow}80, 0 0 100px ${pc.glow}30, inset 0 0 30px rgba(0,0,0,0.6)`
                : `0 0 20px ${pc.glow}35, inset 0 0 20px rgba(0,0,0,0.5)`,
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Surface shimmer */}
            <motion.div
              className="absolute inset-0 opacity-25"
              style={{
                background: `repeating-linear-gradient(-45deg, transparent, transparent 5px, ${pc.accent}15 5px, ${pc.accent}15 10px)`,
              }}
              animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* Atmosphere band */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(ellipse at 65% 55%, ${pc.accent}30 0%, transparent 55%)` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25 + index * 4, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative text-white font-bold text-xs tracking-wider z-10 text-center leading-tight px-2 drop-shadow-lg">
              {product.name}
            </span>
          </motion.div>

          {/* Satellites */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `calc(50% + ${satelliteX}px)`,
              top: `calc(50% + ${satelliteY}px)`,
              transform: "translate(-50%,-50%)",
              background: pc.accent,
              boxShadow: `0 0 8px ${pc.glow}80`,
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full opacity-50"
            style={{
              left: `calc(50% + ${-satelliteX * 0.5}px)`,
              top: `calc(50% + ${-satelliteY * 0.5 + 10}px)`,
              transform: "translate(-50%,-50%)",
              background: pc.glow,
            }}
          />
        </div>
      </motion.div>

      {/* Label */}
      <motion.div
        className="mt-5 text-center"
        animate={isActive ? { y: -4 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-white font-semibold text-sm mb-1">{product.name}</div>
        <div className="text-white/40 text-xs mb-2">{product.category}</div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: `${STATUS_LABELS[product.status]?.color ?? "#8B5CF6"}12`,
            color: STATUS_LABELS[product.status]?.color ?? "#8B5CF6",
            border: `1px solid ${STATUS_LABELS[product.status]?.color ?? "#8B5CF6"}25`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: STATUS_LABELS[product.status]?.color ?? "#8B5CF6" }}
          />
          {STATUS_LABELS[product.status]?.label ?? "Soon"}
        </div>

        {/* "Click to travel" hint on hover */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs text-violet-400/80 font-medium flex items-center gap-1 justify-center"
            >
              <Sparkles className="w-3 h-3" />
              Click to travel
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Detail panel ─────────────────────────────────────────── */
function ProductDetail({
  product,
  onWarp,
}: {
  product: (typeof PRODUCTS)[0] | null;
  onWarp: (id: string) => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {product ? (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 30, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-2xl p-6 border border-violet-500/15 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 text-violet-300"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            {product.category}
          </div>
          <h3 className="text-white font-bold text-2xl mb-2">{product.name}</h3>
          <p className="text-white/55 text-sm leading-relaxed mb-5">{product.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.features.slice(0, 8).map((f) => (
              <span
                key={f}
                className="px-2 py-1 rounded-lg text-xs text-white/60"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
              >
                {f}
              </span>
            ))}
            {product.features.length > 8 && (
              <span className="px-2 py-1 rounded-lg text-xs text-white/30 bg-white/4">
                +{product.features.length - 8} more
              </span>
            )}
          </div>

          <motion.button
            onClick={() => onWarp(product.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors group"
            data-cursor="hover"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Travel to {product.name}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center h-60"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Sparkles className="w-8 h-8 text-violet-500/40" />
          </motion.div>
          <p className="text-white/30 text-sm">Hover a planet to explore</p>
          <p className="text-white/20 text-xs mt-1">Click to travel at warp speed</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main export ──────────────────────────────────────────── */
export function ProductGalaxy() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [warpActive, setWarpActive] = useState(false);
  const [warpTarget, setWarpTarget] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const active = PRODUCTS.find((p) => p.id === activeProduct) ?? null;

  const triggerWarp = useCallback((productId: string) => {
    setWarpTarget(productId);
    setWarpActive(true);
  }, []);

  const handleWarpComplete = useCallback(() => {
    setWarpActive(false);
    if (warpTarget) {
      const el = document.querySelector(`#${warpTarget}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
      setWarpTarget(null);
    }
  }, [warpTarget]);

  return (
    <>
      <WarpEffect active={warpActive} onComplete={handleWarpComplete} />

      <section id="products" className="relative py-32 overflow-hidden" ref={sectionRef}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/25 text-violet-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Product Galaxy
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl font-bold text-white mb-5"
            >
              Each product is
              <br />
              <span className="gradient-text">its own universe.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 text-lg max-w-lg mx-auto"
            >
              Click any planet to travel there at warp speed.
            </motion.p>
          </div>

          {/* Planets grid + detail panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Planets */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
              {PRODUCTS.map((product, i) => (
                <Planet
                  key={product.id}
                  product={product}
                  isActive={activeProduct === product.id}
                  onHover={() => setActiveProduct(product.id)}
                  onLeave={() => setActiveProduct(null)}
                  onWarp={() => triggerWarp(product.id)}
                  index={i}
                  inView={inView}
                />
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-1 lg:sticky lg:top-32">
              <ProductDetail product={active} onWarp={triggerWarp} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
