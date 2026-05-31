"use client";

import { Suspense, useRef, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";

const PLANET = "/models/planet.glb";   // red planet (before)
const ASTEROID = "/models/asteroid.glb"; // incoming rock
const LAVA = "/models/lava.glb";        // lava planet (after impact)

/* ── Error boundary: if a .glb is missing, render a procedural fallback ── */
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FallbackSphere({ color, emissive, emissiveIntensity = 0.3 }: { color: string; emissive: string; emissiveIntensity?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.7} metalness={0.2} />
    </mesh>
  );
}

function GLB({ path, scale }: { path: string; scale: number }) {
  const { scene } = useGLTF(path);
  // clone so the same asset can mount safely
  return <primitive object={scene.clone()} scale={scale} />;
}

/* ── The scene: reads scroll progress and orchestrates the impact ── */
function ImpactScene({ progress }: { progress: MotionValue<number> }) {
  const redRef = useRef<THREE.Group>(null);
  const lavaRef = useRef<THREE.Group>(null);
  const asteroidRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const p = progress.get(); // 0 → 1

    // Phase thresholds:
    // 0.00–0.25 : red planet calm
    // 0.25–0.55 : asteroid streaks in from top-right
    // 0.55–0.65 : IMPACT flash
    // 0.65–1.00 : lava planet revealed
    const impact = 0.58;

    // Continuous spin
    if (redRef.current) redRef.current.rotation.y += delta * 0.06;
    if (lavaRef.current) lavaRef.current.rotation.y += delta * 0.09;

    // Cross-fade planets at impact
    const beforeAmt = p < impact ? 1 : Math.max(0, 1 - (p - impact) / 0.05);
    const afterAmt = p < impact ? 0 : Math.min(1, (p - impact) / 0.1);
    if (redRef.current) {
      redRef.current.scale.setScalar(1.6 * beforeAmt);
      redRef.current.visible = beforeAmt > 0.01;
    }
    if (lavaRef.current) {
      lavaRef.current.scale.setScalar(afterAmt > 0.01 ? 1.6 * (0.6 + afterAmt * 0.4) : 0.0001);
      lavaRef.current.visible = afterAmt > 0.01;
    }

    // Asteroid: travels from off-screen top-right into the planet (0.20 → 0.60)
    if (asteroidRef.current) {
      const asteroidStart = 0.20;
      const asteroidEnd = impact + 0.02;
      const a = THREE.MathUtils.clamp((p - asteroidStart) / (asteroidEnd - asteroidStart), 0, 1);
      const vis = p >= asteroidStart - 0.01 && p <= asteroidEnd;
      asteroidRef.current.visible = vis;

      // Ease-in curve so it accelerates toward the planet
      const eased = a * a;
      asteroidRef.current.position.set(
        THREE.MathUtils.lerp(5, 0.2, eased),
        THREE.MathUtils.lerp(4, 0.1, eased),
        THREE.MathUtils.lerp(-1, 0.5, eased)
      );
      // Grows from visible size (0.4) to large (1.2) as it approaches
      const sc = THREE.MathUtils.lerp(0.35, 1.2, eased);
      asteroidRef.current.scale.setScalar(sc);
      asteroidRef.current.rotation.x += delta * 2.5;
      asteroidRef.current.rotation.z += delta * 1.8;
    }

    // Impact flash light
    if (flashRef.current) {
      const f = p > impact - 0.02 && p < impact + 0.1
        ? 1 - Math.abs(p - impact) / 0.1
        : 0;
      flashRef.current.intensity = Math.max(0, f) * 80;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#fff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.7} color="#7c5cff" />
      <pointLight ref={flashRef} position={[0.5, 0.5, 1.5]} intensity={0} color="#ff7b3a" distance={20} />

      {/* RED planet (before) */}
      <group ref={redRef}>
        <ModelBoundary fallback={<FallbackSphere color="#7a3b2e" emissive="#3a140c" emissiveIntensity={0.25} />}>
          <GLB path={PLANET} scale={1} />
        </ModelBoundary>
      </group>

      {/* LAVA planet (after) */}
      <group ref={lavaRef} visible={false}>
        <ModelBoundary fallback={<FallbackSphere color="#1c0f0a" emissive="#ff5a1e" emissiveIntensity={1.1} />}>
          <GLB path={LAVA} scale={1} />
        </ModelBoundary>
      </group>

      {/* Asteroid */}
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
          fontFamily: "var(--font-space), monospace",
          color: "rgba(196,188,255,0.85)",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 0 20px rgba(124,58,237,0.6)",
        }}
      >
        Rendering world… {Math.round(progress)}%
      </div>
    </Html>
  );
}

export function PlanetScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Bridge framer scroll value → r3f useFrame
  const progress = useMotionValue(0);
  useEffect(() => scrollYProgress.on("change", (v) => progress.set(v)), [scrollYProgress, progress]);

  // White impact flash overlay (DOM, on top of canvas)
  const flashOpacity = useTransform(scrollYProgress, [0.57, 0.6, 0.66], [0, 0.9, 0]);

  // Phase copy opacities
  const beforeOp = useTransform(scrollYProgress, [0.02, 0.12, 0.3, 0.4], [0, 1, 1, 0]);
  const afterOp = useTransform(scrollYProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 0.6]);

  return (
    <section ref={sectionRef} id="planet" className="relative w-full" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D canvas */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 42 }}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={<Loader />}>
              <ImpactScene progress={progress} />
            </Suspense>
          </Canvas>
        </div>

        {/* Impact white flash */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, #fff 0%, #ffd9a0 40%, transparent 75%)", opacity: flashOpacity }}
        />

        {/* BEFORE copy */}
        <motion.div
          style={{ opacity: beforeOp }}
          className="absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center pointer-events-none px-6"
        >
          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.8rem" }}>
            Origin — Year Zero
          </span>
          <h2 className="display-massive" style={{ maxWidth: "16ch", textShadow: "0 0 60px rgba(0,0,0,0.7)" }}>
            A quiet world,<br /><span style={{ color: "var(--accent)" }}>waiting.</span>
          </h2>
        </motion.div>

        {/* AFTER copy */}
        <motion.div
          style={{ opacity: afterOp }}
          className="absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center pointer-events-none px-6"
        >
          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#ff7b3a", marginBottom: "0.8rem" }}>
            Impact — Genesis
          </span>
          <h2 className="display-massive" style={{ maxWidth: "18ch", textShadow: "0 0 60px rgba(0,0,0,0.7)" }}>
            From collision,<br /><span style={{ color: "#ff7b3a" }}>creation.</span>
          </h2>
          <p className="lede" style={{ marginTop: "1.2rem", maxWidth: "44ch", color: "var(--ink-2)" }}>
            Out of impact, a new world forms — molten, alive, transformed. This is
            how Anithix builds: pressure into brilliance.
          </p>
        </motion.div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center" style={{ fontFamily: "var(--font-space), monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ink-4)" }}>
          Scroll to witness impact ↓
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(PLANET);
useGLTF.preload(ASTEROID);
useGLTF.preload(LAVA);
