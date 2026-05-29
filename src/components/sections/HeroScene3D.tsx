"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Global mouse (no re-renders) ─── */
const ptr = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
}

/* ── Procedural studio environment canvas ─── */
function makeStudioCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  // base gradient — dark room, brighter ceiling
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#3a3a40");
  g.addColorStop(0.45, "#17171b");
  g.addColorStop(1, "#070708");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  // soft key softbox (top-left), warm-neutral
  const soft = (cx: number, cy: number, r: number, col: string) => {
    const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, col); rg.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = rg; x.fillRect(0, 0, 1024, 512);
  };
  soft(300, 120, 260, "rgba(255,255,255,0.95)"); // key light
  soft(820, 180, 200, "rgba(200,205,255,0.55)"); // cool fill (accent)
  soft(560, 470, 320, "rgba(120,120,130,0.4)");  // floor bounce
  // thin bright strip — crisp specular streak
  x.fillStyle = "rgba(255,255,255,0.85)";
  x.fillRect(120, 60, 420, 10);
  return c;
}

/* ── Main PBR orb scene ─── */
function Scene() {
  const worldRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { gl, scene } = useThree();
  const scrollRef = useRef(0);
  const curRef = useRef({ x: 0, y: 0 });

  // Build PMREM env map from the studio canvas
  useEffect(() => {
    const canvas = makeStudioCanvas();
    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envRT = pmrem.fromEquirectangular(tex);
    scene.environment = envRT.texture;
    tex.dispose();
    pmrem.dispose();
  }, [gl, scene]);

  // Satellite configs
  const satConfigs = [
    { r: 2.55, size: 0.13, speed: 0.32, phase: 0.0,  tilt: 0.62,  bright: true  },
    { r: 2.55, size: 0.09, speed: 0.32, phase: 2.3,  tilt: 0.62,  bright: false },
    { r: 3.25, size: 0.11, speed: 0.2,  phase: 1.2,  tilt: -0.35, bright: false },
    { r: 3.6,  size: 0.07, speed: 0.16, phase: 4.1,  tilt: 0.9,   bright: true  },
  ];

  // Satellite refs
  const satRefs = useRef<Array<{ mesh: THREE.Mesh | null; pivot: THREE.Group | null }>>([]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth cursor tracking
    curRef.current.x += (ptr.x - curRef.current.x) * 0.045;
    curRef.current.y += (ptr.y - curRef.current.y) * 0.045;

    // Orb rotation
    if (orbRef.current) orbRef.current.rotation.y = t * 0.12;
    if (linesRef.current) linesRef.current.rotation.y = -t * 0.04;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.06;

    // Satellites
    satRefs.current.forEach((s, i) => {
      if (!s.mesh || !s.pivot) return;
      const cfg = satConfigs[i];
      const a = t * cfg.speed + cfg.phase;
      s.mesh.position.set(Math.cos(a) * cfg.r, 0, Math.sin(a) * cfg.r);
    });

    if (!worldRef.current) return;

    // Pointer parallax
    worldRef.current.rotation.y = curRef.current.x * 0.22;
    worldRef.current.rotation.x = curRef.current.y * 0.14;

    // Composition: offset right on wide screens
    const wide = window.innerWidth > 900;
    const baseX = wide ? 2.05 : 0;
    const baseY = wide ? 0.1 : 0.6;
    const baseS = wide ? 1 : 0.74;

    // Scroll-driven float + scale out
    worldRef.current.position.x = baseX;
    worldRef.current.position.y = baseY + Math.sin(t * 0.6) * 0.06 + scrollRef.current * 1.6;
    worldRef.current.scale.setScalar(baseS * (1 - scrollRef.current * 0.25));
  });

  // Listen to scroll
  useEffect(() => {
    const h = () => {
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Satellite material
  const satDarkMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a30, metalness: 1, roughness: 0.3, clearcoat: 1, envMapIntensity: 1.1 });
  const satBrightMat = new THREE.MeshPhysicalMaterial({ color: 0xe8e8ee, metalness: 1, roughness: 0.15, clearcoat: 1, envMapIntensity: 1.3 });

  return (
    <>
      {/* Lighting — studio setup */}
      <directionalLight position={[-4, 5, 6]} intensity={2.4} castShadow />
      <directionalLight position={[5, -2, -4]} intensity={1.6} color="#c6caff" />
      <pointLight position={[3, 1, 5]} intensity={0.6} />
      <ambientLight intensity={0.6} color="#404048" />

      {/* Shadow catcher */}
      <mesh rotation-x={-Math.PI / 2} position-y={-2.4} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      <group ref={worldRef}>
        {/* ── Main orb: polished dark metal ── */}
        <mesh ref={orbRef} castShadow>
          <sphereGeometry args={[1.62, 128, 128]} />
          <meshPhysicalMaterial
            color={0x121214}
            metalness={1.0}
            roughness={0.22}
            clearcoat={1.0}
            clearcoatRoughness={0.18}
            envMapIntensity={1.25}
          />
          {/* Latitude lines engraved on the orb */}
          <group ref={linesRef}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => {
              const t2 = i / 8;
              const r = Math.sin(Math.PI * t2) * 1.628;
              const y = Math.cos(Math.PI * t2) * 1.628;
              return (
                <mesh key={i} rotation-x={Math.PI / 2} position-y={y}>
                  <torusGeometry args={[r, 0.004, 8, 160]} />
                  <meshBasicMaterial color={0xffffff} transparent opacity={0.07} />
                </mesh>
              );
            })}
          </group>
        </mesh>

        {/* ── Glass orbital ring ── */}
        <mesh ref={ringRef} rotation={[Math.PI * 0.62, Math.PI * 0.1, 0]}>
          <torusGeometry args={[2.55, 0.045, 24, 220]} />
          <meshPhysicalMaterial
            color={0xdadbe6}
            metalness={0.4}
            roughness={0.08}
            transmission={0.55}
            transparent
            opacity={0.9}
            envMapIntensity={1.4}
            ior={1.4}
          />
        </mesh>

        {/* ── Orbiting satellites ── */}
        {satConfigs.map((cfg, i) => (
          <group key={i} rotation-z={cfg.tilt} ref={(g) => { if (!satRefs.current[i]) satRefs.current[i] = { mesh: null, pivot: null }; satRefs.current[i].pivot = g; }}>
            <mesh
              ref={(m) => { if (!satRefs.current[i]) satRefs.current[i] = { mesh: null, pivot: null }; satRefs.current[i].mesh = m; }}
              material={cfg.bright ? satBrightMat : satDarkMat}
            >
              <sphereGeometry args={[cfg.size, 48, 48]} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export function HeroScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      shadows
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
