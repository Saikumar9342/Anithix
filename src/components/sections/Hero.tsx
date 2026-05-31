"use client";

import {
  Suspense,
  useRef,
  useEffect,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "framer-motion";

const PLANET = "/models/planet.glb";
const ASTEROID = "/models/asteroid.glb";
const LAVA = "/models/lava.glb";

// ── Error boundary ────────────────────────────────────────────────────────────
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FallbackSphere({
  color,
  emissive,
  emissiveIntensity = 0.3,
}: {
  color: string;
  emissive: string;
  emissiveIntensity?: number;
}) {
  return (
    <mesh>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
}

function GLB({ path, scale }: { path: string; scale: number }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} scale={scale} />;
}

// ── 3D Scene ──────────────────────────────────────────────────────────────────
function ImpactScene({ progress }: { progress: MotionValue<number> }) {
  const redRef = useRef<THREE.Group>(null);
  const lavaRef = useRef<THREE.Group>(null);
  const asteroidRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const p = progress.get();
    const impact = 0.58;

    if (redRef.current) redRef.current.rotation.y += delta * 0.05;
    if (lavaRef.current) lavaRef.current.rotation.y += delta * 0.08;

    // Planet group drifts bottom-left as user scrolls
    if (groupRef.current) {
      const move = THREE.MathUtils.clamp((p - 0.08) / 0.22, 0, 1);
      const eased = move < 0.5 ? 2 * move * move : 1 - Math.pow(-2 * move + 2, 2) / 2;
      groupRef.current.position.x = THREE.MathUtils.lerp(0, -2.4, eased);
      groupRef.current.position.y = THREE.MathUtils.lerp(0, -1.2, eased);
    }

    // Planet cross-fade at impact
    const beforeAmt = p < impact ? 1 : Math.max(0, 1 - (p - impact) / 0.05);
    const afterAmt = p < impact ? 0 : Math.min(1, (p - impact) / 0.1);
    if (redRef.current) {
      redRef.current.scale.setScalar(1.6 * beforeAmt);
      redRef.current.visible = beforeAmt > 0.01;
    }
    if (lavaRef.current) {
      lavaRef.current.scale.setScalar(
        afterAmt > 0.01 ? 1.6 * (0.5 + afterAmt * 0.5) : 0.0001
      );
      lavaRef.current.visible = afterAmt > 0.01;
    }

    // Asteroid: from top-right → planet's bottom-left position
    if (asteroidRef.current) {
      const aStart = 0.22;
      const aEnd = impact + 0.02;
      const a = THREE.MathUtils.clamp((p - aStart) / (aEnd - aStart), 0, 1);
      const vis = p >= aStart - 0.01 && p <= aEnd;
      asteroidRef.current.visible = vis;
      const eased = a * a;
      asteroidRef.current.position.set(
        THREE.MathUtils.lerp(5, -2.1, eased),
        THREE.MathUtils.lerp(3.8, -0.9, eased),
        THREE.MathUtils.lerp(-1, 0.5, eased)
      );
      asteroidRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1.0, eased));
      asteroidRef.current.rotation.x += delta * 2.5;
      asteroidRef.current.rotation.z += delta * 1.8;
    }

    // Impact flash
    if (flashRef.current) {
      const f =
        p > impact - 0.02 && p < impact + 0.1
          ? 1 - Math.abs(p - impact) / 0.1
          : 0;
      flashRef.current.intensity = Math.max(0, f) * 80;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#fff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.7} color="#7c5cff" />
      <pointLight
        ref={flashRef}
        position={[0, 0, 2]}
        intensity={0}
        color="#ff7b3a"
        distance={20}
      />

      <group ref={groupRef}>
        <group ref={redRef}>
          <ModelBoundary
            fallback={
              <FallbackSphere color="#7a3b2e" emissive="#3a140c" emissiveIntensity={0.25} />
            }
          >
            <GLB path={PLANET} scale={1} />
          </ModelBoundary>
        </group>

        <group ref={lavaRef} visible={false}>
          <ModelBoundary
            fallback={
              <FallbackSphere color="#1c0f0a" emissive="#ff5a1e" emissiveIntensity={1.1} />
            }
          >
            <GLB path={LAVA} scale={1} />
          </ModelBoundary>
        </group>
      </group>

      {/* Asteroid in world space so it travels from top-right to planet */}
      <group ref={asteroidRef} visible={false}>
        <ModelBoundary fallback={<FallbackSphere color="#2a2a2e" emissive="#000" />}>
          <GLB path={ASTEROID} scale={1} />
        </ModelBoundary>
      </group>

      <Environment preset="night" />
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          fontFamily: "monospace",
          color: "rgba(196,188,255,0.85)",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Loading… {Math.round(progress)}%
      </div>
    </Html>
  );
}

const PRODUCTS = [
  { name: "Graviton", role: "AI Workspace", color: "#a78bfa", desc: "Multi-provider AI in one editorial interface." },
  { name: "Atom", role: "Portfolio Platform", color: "#06b6d4", desc: "Your portfolio, built from your pocket." },
  { name: "Orbis", role: "Content Automation", color: "#10b981", desc: "Publish your content universe on autopilot." },
];


// ── Main Hero export ──────────────────────────────────────────────────────────
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useMotionValue(0);
  useEffect(
    () => scrollYProgress.on("change", (v) => progress.set(v)),
    [scrollYProgress, progress]
  );

  const afterPanelRef = useRef<HTMLDivElement>(null);
  const heroPanelRef = useRef<HTMLDivElement>(null);

  // Drive both panels entirely via DOM refs
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // Hero panel: fade out as soon as user starts scrolling
      const hero = heroPanelRef.current;
      if (hero) {
        const heroFade = Math.max(0, 1 - v / 0.15);
        hero.style.opacity = String(heroFade);
        hero.style.transform = `translateY(${(1 - heroFade) * -50}px)`;
      }
      // After panel: hidden until 0.64
      const after = afterPanelRef.current;
      if (after) {
        const visible = v >= 0.64;
        const fadeIn = Math.max(0, Math.min(1, (v - 0.65) / 0.10));
        after.style.opacity = String(visible ? fadeIn : 0);
        after.style.transform = `translateY(${Math.max(0, (1 - fadeIn) * 40)}px)`;
        after.style.visibility = visible ? "visible" : "hidden";
      }
    });
  }, [scrollYProgress]);

  const flashOpacity = useTransform(scrollYProgress, [0.55, 0.58, 0.64], [0, 0.85, 0]);
  const hintOp = useTransform(scrollYProgress, [0, 0.04, 0.10], [1, 1, 0]);

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <section
        id="hero"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "var(--bg)" }}
      >
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={<Loader />}>
              <ImpactScene progress={progress} />
            </Suspense>
          </Canvas>
        </div>

        {/* Impact flash */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "radial-gradient(circle at 30% 70%, #fff 0%, #ffd9a0 40%, transparent 75%)",
            opacity: flashOpacity,
          }}
        />

        {/* Hero headline */}
        <div
          ref={heroPanelRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-6"
        >
         
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45 }}
            style={{
              fontSize: "clamp(3.8rem, 8vw, 8rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textShadow: "0 0 80px rgba(0,0,0,0.8)",
            }}
          >
            We build
            <br />
            <span style={{ color: "var(--accent)" }}>intelligent</span>
            <br />
            products.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
            style={{
              marginTop: "1.8rem",
              maxWidth: "480px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            AI-powered software, automation platforms, and developer tools
            for creators who demand precision.
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOp }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-3"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Scroll to witness impact
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "48px",
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
        </motion.div>

        {/* After-impact panel — DOM ref controlled, starts hidden */}
        <div
          ref={afterPanelRef}
          style={{
            opacity: 0, visibility: "hidden", transform: "translateY(40px)",
            position: "absolute", right: 0, top: 0, height: "100%", zIndex: 20,
            display: "flex", flexDirection: "column", justifyContent: "center",
            pointerEvents: "none", padding: "0 clamp(2.5rem, 5vw, 7rem) 0 1.5rem",
            width: "min(50vw, 580px)",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.4rem" }}>
            <div style={{ width: "2rem", height: "1px", background: "#ff7b3a" }} />
            <span style={{
              fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#ff7b3a",
            }}>
              Impact — Genesis
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: "clamp(2.8rem, 4vw, 4.2rem)", fontWeight: 900,
            lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: "1.4rem",
          }}>
            From collision,<br />
            <span style={{ color: "#ff7b3a" }}>creation.</span>
          </h2>

          <p style={{
            fontSize: "0.9rem", lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)", marginBottom: "2.2rem", maxWidth: "34ch",
          }}>
            Pressure forged into brilliance. Anithix builds products that transform how people work, create, and connect.
          </p>

          {/* Product list — horizontal divider style */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: "1.1rem",
                padding: "1rem 0",
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                {/* Color dot */}
                <div style={{
                  width: "0.45rem", height: "0.45rem", borderRadius: "50%",
                  background: p.color, boxShadow: `0 0 10px ${p.color}`,
                  flexShrink: 0,
                }} />
                {/* Name */}
                <span style={{
                  fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)",
                  letterSpacing: "-0.01em", minWidth: "5rem",
                }}>{p.name}</span>
                {/* Role */}
                <span style={{
                  fontSize: "0.72rem", color: "rgba(255,255,255,0.35)",
                  fontFamily: "monospace", letterSpacing: "0.05em",
                }}>{p.role}</span>
                {/* Arrow */}
                <span style={{
                  marginLeft: "auto", fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.2)",
                }}>→</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href="#products" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginTop: "2rem", fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--bg)", background: "var(--accent)",
            padding: "0.85rem 1.8rem", borderRadius: "100px",
            pointerEvents: "auto", textDecoration: "none",
            width: "fit-content",
          }}>
            Explore the suite →
          </a>
        </div>
      </section>
    </div>
  );
}

useGLTF.preload(PLANET);
useGLTF.preload(ASTEROID);
useGLTF.preload(LAVA);
