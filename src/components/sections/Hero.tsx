"use client";

import {
  Suspense,
  useRef,
  useEffect,
  useState,
  Component,
  type ReactNode,
} from "react";
import { ScrollWarp } from "@/components/animations/ScrollWarp";
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

const DEBRIS = "/models/debris.glb";
const DEBRIS_COUNT = 120;

// Each piece has a fixed blast velocity direction + rotation axis
// Seeded once so it's deterministic
function seeded(n: number) {
  // simple deterministic pseudo-random from index
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}
const DEBRIS_DATA = Array.from({ length: DEBRIS_COUNT }, (_, i) => {
  // Full 360° spherical blast — rocks go in every direction
  const theta = seeded(i * 3 + 0) * Math.PI * 2;         // 0–360° horizontal
  const phi   = (seeded(i * 3 + 1) - 0.5) * Math.PI;     // -90–90° vertical
  const vx = Math.cos(phi) * Math.cos(theta);
  const vy = Math.sin(phi) * 1.1;
  const vz = Math.cos(phi) * Math.sin(theta) * 0.7;       // depth variation
  // Smaller rocks travel further (realistic explosion physics)
  const scale  = 0.10 + seeded(i * 7 + 1) * 0.32;
  const speed  = (1.0 / (scale + 0.1)) * (1.2 + seeded(i * 3 + 2) * 1.8);
  const rotX   = (seeded(i * 5 + 0) - 0.5) * 12;
  const rotZ   = (seeded(i * 5 + 1) - 0.5) * 14;
  const heat   = 0.2 + seeded(i * 11 + 3) * 0.8;
  return { vx, vy, vz, speed, scale, rotX, rotZ, heat };
});

// Simple sphere-based trail blob
function TrailBlob({ idx, trailRefs, color }: { idx: number; trailRefs: React.MutableRefObject<(THREE.Mesh | null)[]>; color: string }) {
  return (
    <mesh ref={(el) => { trailRefs.current[idx] = el; }}>
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// ── 3D Scene ──────────────────────────────────────────────────────────────────
const TRAIL_COUNT = 6;

function ImpactScene({ progress }: { progress: MotionValue<number> }) {
  const PLANET_SCALE = 1.55;
  const impact = 0.58;

  const redRef       = useRef<THREE.Group>(null);
  const lavaRef      = useRef<THREE.Group>(null);
  const asteroidRef  = useRef<THREE.Group>(null);
  const glowRef      = useRef<THREE.Mesh>(null);
  const heatLightRef = useRef<THREE.PointLight>(null);
  const flashRef     = useRef<THREE.PointLight>(null);
  const rimRef       = useRef<THREE.PointLight>(null);
  const groupRef     = useRef<THREE.Group>(null);
  const trailRefs     = useRef<(THREE.Mesh | null)[]>(Array(TRAIL_COUNT).fill(null));
  const debrisRefs    = useRef<(THREE.Group | null)[]>(Array(120).fill(null));
  const debrisT       = useRef(0);
  const impactOrigin  = useRef<[number, number]>([-2.2, -1.1]);
  const shakeT        = useRef(0);

  // Travel path: start clearly visible top-right, end at planet surface
  // Camera at z=5, fov=42 — visible x range ≈ ±3.5, y ≈ ±2.2 at z=0
  const START = { x: 3.8, y: 2.8, z: 0.0 };
  const END   = { x: -1.5, y: -0.6, z: 0.5 };

  useFrame((state, delta) => {
    const p = progress.get();

    if (redRef.current) redRef.current.rotation.y += delta * 0.04;
    if (lavaRef.current) lavaRef.current.rotation.y += delta * 0.07;

    // Planet drifts bottom-left
    if (groupRef.current) {
      const move = THREE.MathUtils.clamp((p - 0.08) / 0.22, 0, 1);
      const e = move < 0.5 ? 2 * move * move : 1 - Math.pow(-2 * move + 2, 2) / 2;
      groupRef.current.position.x = THREE.MathUtils.lerp(0, -2.2, e);
      groupRef.current.position.y = THREE.MathUtils.lerp(0, -1.1, e);
    }

    // Planet cross-fade — both same scale
    const beforeAmt = p < impact ? 1 : Math.max(0, 1 - (p - impact) / 0.04);
    const afterAmt  = p < impact ? 0 : Math.min(1, (p - impact) / 0.08);
    if (redRef.current) {
      redRef.current.scale.setScalar(PLANET_SCALE * beforeAmt);
      redRef.current.visible = beforeAmt > 0.01;
    }
    if (lavaRef.current) {
      lavaRef.current.scale.setScalar(PLANET_SCALE);
      lavaRef.current.visible = afterAmt > 0.01;
    }

    // Asteroid — quintic ease so it starts slow and ROCKETS at the end
    const aStart = 0.22, aEnd = impact;
    const raw = THREE.MathUtils.clamp((p - aStart) / (aEnd - aStart), 0, 1);
    const e5  = raw * raw * raw * raw * raw;
    const vis = p >= aStart && p <= impact + 0.01;

    const ax = THREE.MathUtils.lerp(START.x, END.x, e5);
    const ay = THREE.MathUtils.lerp(START.y, END.y, e5);
    const az = THREE.MathUtils.lerp(START.z, END.z, e5);

    if (asteroidRef.current) {
      asteroidRef.current.visible = vis;
      asteroidRef.current.position.set(ax, ay, az);
      asteroidRef.current.scale.setScalar(0.42);
      const spin = 3 + e5 * 22;
      asteroidRef.current.rotation.x += delta * spin;
      asteroidRef.current.rotation.z += delta * spin * 0.6;
    }

    // Glow shell — brightens as it speeds up
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + e5 * 8;
      mat.opacity = vis ? 0.15 + e5 * 0.35 : 0;
    }

    // Heat light tracks asteroid
    if (heatLightRef.current) {
      heatLightRef.current.position.set(ax, ay, az + 0.5);
      heatLightRef.current.intensity = vis ? 1 + e5 * 12 : 0;
    }

    // Trail blobs — spaced behind along the travel direction
    const dx = END.x - START.x, dy = END.y - START.y, dz = END.z - START.z;
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
    const nx = dx/len, ny = dy/len, nz = dz/len;
    trailRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (i + 1) * 0.22 * (0.3 + e5 * 0.7);
      mesh.visible = vis && e5 > 0.03;
      mesh.position.set(ax - nx * t, ay - ny * t, az - nz * t);
      const fade = (1 - (i + 1) / (TRAIL_COUNT + 1)) * e5 * 0.7;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.max(0, fade);
      // Scale: elongate along travel dir to look like a streak
      const stretchZ = 1 + e5 * 3;
      mesh.scale.set(1 - i * 0.1, 1 - i * 0.1, stretchZ);
    });

    // Camera shake at impact
    const shakeAmt = p > impact - 0.005 && p < impact + 0.1
      ? (1 - Math.abs(p - impact) / 0.09) * 0.2 : 0;
    if (shakeAmt > 0) {
      shakeT.current += delta * 80;
      state.camera.position.x = Math.sin(shakeT.current * 1.9) * shakeAmt;
      state.camera.position.y = Math.cos(shakeT.current * 2.7) * shakeAmt * 0.6;
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 10);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, delta * 10);
    }

    // Impact flash
    const f = p > impact - 0.01 && p < impact + 0.1
      ? Math.max(0, 1 - Math.abs(p - impact) / 0.08) : 0;
    if (flashRef.current) flashRef.current.intensity = f * 160;
    if (rimRef.current)   rimRef.current.intensity   = afterAmt * 5;

    // Snapshot planet position at moment of impact
    if (afterAmt <= 0.01 && groupRef.current) {
      impactOrigin.current = [groupRef.current.position.x, groupRef.current.position.y];
    }

    // Debris: driven purely by afterAmt scroll progress
    if (afterAmt > 0.01) {
      debrisT.current += delta;
      const [ox, oy] = impactOrigin.current;

      const blastT = Math.min(1, afterAmt / 0.6);
      // Ease-out quart — explosive fast start, smooth deceleration
      const eased = 1 - Math.pow(1 - blastT, 4);

      debrisRefs.current.forEach((dr, i) => {
        if (!dr) return;
        const d = DEBRIS_DATA[i];
        const dist = d.speed * eased;

        dr.visible = true;
        dr.position.set(
          ox + d.vx * dist,
          oy + d.vy * dist,
          d.vz * dist
        );
        const tumbleSpeed = Math.max(0.05, 1 - eased * 0.8);
        dr.rotation.x += delta * d.rotX * tumbleSpeed;
        dr.rotation.z += delta * d.rotZ * tumbleSpeed;
        dr.scale.setScalar(d.scale * Math.min(1, blastT * 4));
      });
    } else {
      debrisRefs.current.forEach((dr) => { if (dr) dr.visible = false; });
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} color="#fff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.5} color="#7c5cff" />
      <pointLight ref={heatLightRef} position={[START.x, START.y, START.z]} intensity={0} color="#ff4400" distance={5} />
      <pointLight ref={flashRef} position={[-1.5, -0.5, 1.5]} intensity={0} color="#ff8c3a" distance={20} />
      <pointLight ref={rimRef} position={[-2, -1, 0.5]} intensity={0} color="#ff3300" distance={12} />

      {/* Planet group */}
      <group ref={groupRef}>
        <group ref={redRef}>
          <ModelBoundary fallback={<FallbackSphere color="#7a3b2e" emissive="#3a140c" emissiveIntensity={0.25} />}>
            <GLB path={PLANET} scale={1} />
          </ModelBoundary>
        </group>
        <group ref={lavaRef} visible={false}>
          <ModelBoundary fallback={<FallbackSphere color="#1c0f0a" emissive="#ff5a1e" emissiveIntensity={1.1} />}>
            <GLB path={LAVA} scale={1} />
          </ModelBoundary>
        </group>
      </group>

      {/* Trail blobs */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <TrailBlob
          key={i}
          idx={i}
          trailRefs={trailRefs}
          color={i < 2 ? "#ff4400" : i < 4 ? "#ff8800" : "#ffaa44"}
        />
      ))}

      {/* Asteroid with red-hot glow shell */}
      <group ref={asteroidRef} visible={false}>
        <ModelBoundary fallback={<FallbackSphere color="#1a1a1e" emissive="#ff2200" emissiveIntensity={2} />}>
          <GLB path={ASTEROID} scale={1} />
        </ModelBoundary>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.52, 24, 24]} />
          <meshStandardMaterial
            color="#ff2200" emissive="#ff1100" emissiveIntensity={2}
            transparent opacity={0} side={THREE.BackSide} depthWrite={false}
          />
        </mesh>
      </group>

      {/* Debris blasted from impact — first 40 use GLB, rest are procedural for perf */}
      {Array.from({ length: DEBRIS_COUNT }).map((_, i) => (
        <group key={`d${i}`} ref={(el) => { debrisRefs.current[i] = el; }} visible={false}>
          {i < 40 ? (
            <ModelBoundary fallback={
              <mesh>
                <dodecahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                  color="#26262b"
                  emissive="#d44000"
                  emissiveIntensity={DEBRIS_DATA[i].heat * 0.15}
                  roughness={0.9}
                />
              </mesh>
            }>
              <GLB path={DEBRIS} scale={1} />
            </ModelBoundary>
          ) : (
            // Lightweight procedural rocks for count > 40 (cooled, dark asteroids)
            <mesh>
              <dodecahedronGeometry args={[0.12 + seeded(i * 13) * 0.1, 0]} />
              <meshStandardMaterial
                color="#1a1a1e"
                emissive="#d44000"
                emissiveIntensity={DEBRIS_DATA[i].heat * 0.1}
                roughness={0.95}
                metalness={0.05}
              />
            </mesh>
          )}
        </group>
      ))}

      <Environment preset="night" />
    </>
  );
}

useGLTF.preload(DEBRIS);

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

  const [scrollProgress, setScrollProgress] = useState(0);
  const progress = useMotionValue(0);
  useEffect(
    () => scrollYProgress.on("change", (v) => {
      progress.set(v);
      setScrollProgress(v);
    }),
    [scrollYProgress, progress]
  );

  const afterPanelRef = useRef<HTMLDivElement>(null);
  const heroPanelRef  = useRef<HTMLDivElement>(null);
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
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "transparent" }}
      >
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 55 }}
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

        {/* Space Warp effect on scroll transition */}
        <ScrollWarp progress={scrollProgress} />

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
