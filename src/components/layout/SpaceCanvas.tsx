"use client";

import { useEffect, useRef, useState, Suspense, Component, type ReactNode, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

const SPACESHIP = "/models/spaceship.glb";
const PLANET = "/models/planet.glb";
const ASTEROID = "/models/asteroid.glb";
const DEBRIS = "/models/debris.glb";

// ── Error boundary for 3D Assets ─────────────────────────────────────────────
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

// Fallback sphere if GLTF fails to load
function FallbackSphere({ color, size = 1.0 }: { color: string; size?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// GLTF Primitive Loader Helper
function GLB({ path, scale }: { path: string; scale: number }) {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

// ── Terrain and StarDust (from original Footer) ──────────────────────────────
function Terrain({ opacity }: { opacity: number }) {
  const geom = useMemo(() => {
    const size = 32;
    const segments = 45;
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = (Math.sin(x * 0.22) * Math.cos(y * 0.22) * 1.6 + 
                Math.sin(x * 0.5) * Math.sin(y * 0.5) * 0.6 + 
                Math.cos(x * 0.12) * 0.8) * 0.62;
      pos.setZ(i, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3.2, 0]} visible={opacity > 0.01}>
      <meshStandardMaterial
        color="#080312"
        wireframe
        emissive="#8b5cf6"
        emissiveIntensity={1.3}
        roughness={0.25}
        metalness={0.8}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function StarDust({ opacity }: { opacity: number }) {
  const points = useMemo(() => {
    const count = 70;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = Math.random() * 5 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  return (
    <points visible={opacity > 0.01}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a78bfa"
        size={0.065}
        transparent
        opacity={opacity * 0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ── Debris Data Seed ─────────────────────────────────────────────────────────
const DEBRIS_COUNT = 80;
function seeded(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}
// Establish individual orbit radii, speeds, inclinations, and sizes for asteroid remnants
const DEBRIS_DATA = Array.from({ length: DEBRIS_COUNT }, (_, i) => {
  const radius = 1.3 + seeded(i * 3 + 0) * 1.5;         // Orbit radius around planet
  const speed = 0.35 + seeded(i * 3 + 1) * 0.9;         // Rotation speed
  const phase = seeded(i * 3 + 2) * Math.PI * 2;        // Phase offset
  const inclination = (seeded(i * 5 + 0) - 0.5) * 0.5;  // Orbit tilt
  const scale = 0.06 + seeded(i * 7 + 1) * 0.16;        // Size
  const heat = 0.3 + seeded(i * 11 + 3) * 0.7;          // Cooling emissive glow
  return { radius, speed, phase, inclination, scale, heat };
});

// ── Global Loader Overlay (runs outside Canvas to avoid setState warnings) ────
function GlobalLoader() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);

  // Smooth fade-out delay when loaded
  useEffect(() => {
    if (!active) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#05020c] z-50 pointer-events-auto transition-opacity duration-700"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated premium glassmorphic spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-violet-500/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-violet-500 rounded-full animate-spin" />
        </div>
        <div className="mono text-violet-400 text-xs tracking-[0.3em] uppercase select-none mt-2">
          Initializing space system... {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

// ── Cinematic R3F Scene Controller ──────────────────────────────────────────
interface SpaceSceneProps {
  scrollProgress: number;
}

function SpaceScene({ scrollProgress }: { scrollProgress: number }) {
  const planetRef = useRef<THREE.Group>(null);
  const asteroidRef = useRef<THREE.Group>(null);
  const asteroidGlowRef = useRef<THREE.Mesh>(null);
  const spaceshipRef = useRef<THREE.Group>(null);
  const laserRef      = useRef<THREE.Group>(null);
  const laserLightRef = useRef<THREE.PointLight>(null);
  const explosionLightRef = useRef<THREE.PointLight>(null);
  const explosionGroupRef = useRef<THREE.Group>(null);
  const debrisRefs    = useRef<(THREE.Group | null)[]>(Array(DEBRIS_COUNT).fill(null));
  
  const currentScroll = useRef(0);
  const shakeT = useRef(0);
  
  // Preload spaceship animations
  const { scene: shipScene, animations: shipAnims } = useGLTF(SPACESHIP);
  const { actions: shipActions } = useAnimations(shipAnims, spaceshipRef);

  useEffect(() => {
    if (shipActions) {
      const actionName = Object.keys(shipActions)[0];
      if (actionName && shipActions[actionName]) {
        shipActions[actionName]?.play();
      }
    }
  }, [shipActions]);

  // Travel path limits
  const ASTEROID_START   = { x: 4.5, y: -0.3, z: 1.5 };  // from right, lower
  const ASTEROID_EXPLODE = { x: 2.2, y: -0.6, z: 1.3 };  // explodes lower so full explosion visible

  // Planet: starts center, moves left on scroll
  const PLANET_START = { x: 0.0,  y: -0.2, z: -1.0 };
  const PLANET_END   = { x: -2.8, y: -0.5, z: -1.0 };
  const PLANET_SCALE = 1.4;

  useFrame((state, delta) => {
    // Smooth scroll interpolation (creates beautiful Lenis momentum lag)
    currentScroll.current = THREE.MathUtils.lerp(currentScroll.current, scrollProgress, 0.08);
    const p = currentScroll.current;
    const t = state.clock.getElapsedTime();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. THE PLANET (saved, smaller, no lava planet cross-fade!)
    // ──────────────────────────────────────────────────────────────────────────
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.05;

      // Planet moves left as soon as user starts scrolling (p 0 → 0.20)
      const driftFactor = THREE.MathUtils.clamp(p / 0.20, 0, 1);
      const easedDrift = 1 - Math.pow(1 - driftFactor, 3);

      planetRef.current.position.x = THREE.MathUtils.lerp(PLANET_START.x, PLANET_END.x, easedDrift);
      planetRef.current.position.y = THREE.MathUtils.lerp(PLANET_START.y, PLANET_END.y, easedDrift);
      planetRef.current.position.z = PLANET_START.z;
      planetRef.current.scale.setScalar(PLANET_SCALE);
      // Hide planet before reaching "Connected Suite" section (around p=0.45-0.50)
      planetRef.current.visible = p < 0.45;
    }


    // ──────────────────────────────────────────────────────────────────────────
    // 2. THE ASTEROID
    // ──────────────────────────────────────────────────────────────────────────
    // Approaching planet and getting destroyed at p = 0.15
    // Asteroid: visible p=0.05→0.13, destroyed exactly when laser fires at p=0.08
    const isAsteroidAlive = p >= 0.05 && p < 0.13;
    const asteroidFactor = THREE.MathUtils.clamp((p - 0.05) / 0.08, 0, 1);
    const easedAsteroid = Math.pow(asteroidFactor, 3); // slow start, rockets in

    const ax = THREE.MathUtils.lerp(ASTEROID_START.x, ASTEROID_EXPLODE.x, easedAsteroid);
    const ay = THREE.MathUtils.lerp(ASTEROID_START.y, ASTEROID_EXPLODE.y, easedAsteroid);
    const az = THREE.MathUtils.lerp(ASTEROID_START.z, ASTEROID_EXPLODE.z, easedAsteroid);

    if (asteroidRef.current) {
      asteroidRef.current.visible = isAsteroidAlive;
      asteroidRef.current.position.set(ax, ay, az);
      asteroidRef.current.scale.setScalar(0.55);
      const spin = 0.3 + easedAsteroid * 1.2; // slow, realistic tumble
      asteroidRef.current.rotation.x += delta * spin;
      asteroidRef.current.rotation.z += delta * spin * 0.6;
    }

    if (asteroidGlowRef.current) {
      const glowMat = asteroidGlowRef.current.material as THREE.MeshStandardMaterial;
      glowMat.emissiveIntensity = 2 + easedAsteroid * 6;
      glowMat.opacity = isAsteroidAlive ? 0.1 + easedAsteroid * 0.4 : 0;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. SPACESHIP SCROLL FLIGHT PATH (Cruises through layout)
    // ──────────────────────────────────────────────────────────────────────────
    let sx = 0;
    let sy = 0.4;
    let sz = 2.0;
    let sRotX = 0;
    let sRotY = 0;
    let sRotZ = 0;

    // Define multi-section path coordinate spline based on page scroll
    if (p < 0.20) {
      if (p < 0.05) {
        // Idle: bottom-left area in front of planet, hovering calmly
        sx = -0.6 + Math.sin(t * 0.9) * 0.06;
        sy = -0.5 + Math.sin(t * 1.1) * 0.05;
        sz = 1.5;
        sRotY = Math.PI * 0.15;
        sRotX = Math.sin(t * 1.0) * 0.02;
        sRotZ = Math.cos(t * 0.8) * 0.02;
      } else if (p >= 0.05 && p < 0.16) {
        // Ship moves right to intercept — gets between asteroid and planet
        const interceptF = THREE.MathUtils.clamp((p - 0.05) / 0.11, 0, 1);
        const interceptE = 1 - Math.pow(1 - interceptF, 2);
        sx = THREE.MathUtils.lerp(-0.6, 0.4, interceptE) + Math.sin(t * 0.9) * 0.03;
        sy = THREE.MathUtils.lerp(-0.5, 0.0, interceptE) + Math.sin(t * 1.1) * 0.03;
        sz = 1.5;
        const dx = ax - sx, dy = ay - sy, dz2 = az - sz;
        sRotY = Math.atan2(dx, dz2);
        sRotX = -Math.atan2(dy, Math.sqrt(dx * dx + dz2 * dz2)) * 0.5;
        sRotZ = Math.sin(t * 1.2) * 0.01;
      } else {
        // After firing — ship hovers at intercept position
        sx = 0.4 + Math.sin(t * 0.9) * 0.04;
        sy = 0.0 + Math.sin(t * 1.1) * 0.04;
        sz = 1.5;
        sRotY = -Math.PI * 0.5;
        sRotX = Math.sin(t * 1.0) * 0.02;
        sRotZ = Math.cos(t * 0.8) * 0.01;
      }
      
    } else if (p >= 0.20 && p < 0.45) {
      // TRANSITION HERO -> PRODUCTS TOP: Swoop right and roll
      const factor = (p - 0.20) / 0.25;
      const eased = Math.sin((factor * Math.PI) / 2); // Sine ease
      
      sx = THREE.MathUtils.lerp(-1.3, 1.3, eased);
      sy = THREE.MathUtils.lerp(0.4, -0.4, eased) + Math.sin(t * 1.2) * 0.04;
      sz = 2.0;

      sRotY = -Math.PI / 2 + eased * Math.PI; // Pivots around as it glides right
      sRotZ = -0.35 * Math.sin(factor * Math.PI); // Strong roll banking
      sRotX = -0.05 + Math.sin(t * 1.2) * 0.02;
      
    } else if (p >= 0.45 && p < 0.70) {
      // TRANSITION PRODUCTS TOP -> PRODUCTS BOTTOM: Swoop back left
      const factor = (p - 0.45) / 0.25;
      const eased = factor * factor * (3 - 2 * factor); // smoothstep
      
      sx = THREE.MathUtils.lerp(1.3, -1.3, eased);
      sy = THREE.MathUtils.lerp(-0.4, -0.5, eased) + Math.sin(t * 1.2) * 0.04;
      sz = 2.0;

      sRotY = Math.PI / 2 - eased * Math.PI;
      sRotZ = 0.25 * Math.sin(factor * Math.PI); // Reverse bank roll
      sRotX = Math.sin(t * 1.2) * 0.02;
      
    } else if (p >= 0.70 && p < 0.85) {
      // TRANSITION PRODUCTS BOTTOM -> CONTACT: Cruise to middle-right
      const factor = (p - 0.70) / 0.15;
      const eased = factor * factor; // ease-in
      
      sx = THREE.MathUtils.lerp(-1.3, 1.2, eased);
      sy = THREE.MathUtils.lerp(-0.5, -0.4, eased) + Math.sin(t * 1.2) * 0.03;
      sz = 2.0;

      sRotY = -Math.PI / 2 + eased * Math.PI * 0.8;
      sRotZ = -0.20 * factor;
      sRotX = Math.sin(t * 1.2) * 0.02;
      
    } else {
      // FOOTER DOCKING & LANDING (p >= 0.85 to 1.0): Merge with time-based loop!
      const factor = THREE.MathUtils.clamp((p - 0.85) / 0.15, 0, 1);
      const eased = factor * factor * (3 - 2 * factor);
      
      // Scroll destination coordinate in Footer (center)
      const scrollSx = THREE.MathUtils.lerp(1.2, 0.0, eased);
      const scrollSy = THREE.MathUtils.lerp(-0.4, 0.15, eased);
      const scrollSz = 2.0;
      
      // Time-driven Footer docking timeline (10-second loop cycle)
      const cycle = 10;
      const loopP = t % cycle;
      
      let loopSx = 0;
      let loopSy = 0.25;
      let loopSz = 2.0;
      let loopRotX = 0;
      let loopRotY = -Math.PI / 2;
      let loopRotZ = 0;
      
      if (loopP < 2.5) {
        // Cruise-in from right
        const lf = loopP / 2.5;
        const le = 1 - Math.pow(1 - lf, 3);
        loopSx = 12.0 - le * 12.0;
        loopSy = 0.25 + Math.sin(t * 1.8) * 0.05;
        loopRotY = -Math.PI / 2;
        loopRotX = Math.sin(t * 1.8) * 0.02;
        loopRotZ = 0.08 * (1 - lf);
      } else if (loopP >= 2.5 && loopP < 3.5) {
        // Dock rotation
        const lf = (loopP - 2.5) / 1.0;
        const le = Math.sin((lf * Math.PI) / 2);
        loopSx = 0;
        loopSy = 0.25 + Math.sin(t * 1.5) * 0.06;
        loopRotY = -Math.PI / 2 * (1 - le);
        loopRotX = Math.sin(t * 1.5) * 0.02;
      } else if (loopP >= 3.5 && loopP < 7.0) {
        // Center assembly hold hover
        loopSx = 0;
        loopSy = 0.25 + Math.sin(t * 1.5) * 0.07;
        loopRotY = Math.sin(t * 0.5) * 0.03;
        loopRotX = Math.sin(t * 1.5) * 0.02;
        loopRotZ = Math.cos(t * 1.5) * 0.02;
      } else if (loopP >= 7.0 && loopP < 8.0) {
        // Pivot left thruster charge
        const lf = (loopP - 7.0) / 1.0;
        const le = lf * lf;
        loopSx = 0;
        loopSy = 0.25 - le * 0.15 + Math.sin(t * 2.5) * 0.04;
        loopRotY = -Math.PI / 2 * le;
        loopRotX = -0.05 * le;
      } else if (loopP >= 8.0 && loopP < 9.2) {
        // Hyper-acceleration takeoff left
        const lf = (loopP - 8.0) / 1.2;
        const le = Math.pow(lf, 3);
        loopSx = -le * 12.0;
        loopSy = 0.1 + le * 0.8 + Math.sin(t * 4.0) * 0.03;
        loopRotY = -Math.PI / 2;
        loopRotX = 0.05 * lf;
        loopRotZ = 0.35 * lf;
      } else {
        // Offscreen cooldown hidden
        loopSx = -99.0;
        loopSy = -99.0;
      }

      // Merge scroll-based positioning into time-driven loop
      const mergeFactor = THREE.MathUtils.clamp((p - 0.90) / 0.10, 0, 1);
      sx = THREE.MathUtils.lerp(scrollSx, loopSx, mergeFactor);
      sy = THREE.MathUtils.lerp(scrollSy, loopSy, mergeFactor);
      sz = THREE.MathUtils.lerp(scrollSz, loopSz, mergeFactor);
      
      sRotX = THREE.MathUtils.lerp(Math.sin(t * 1.2) * 0.02, loopRotX, mergeFactor);
      sRotY = THREE.MathUtils.lerp(-Math.PI / 2 + eased * Math.PI * 0.8, loopRotY, mergeFactor);
      sRotZ = THREE.MathUtils.lerp(-0.20 * factor, loopRotZ, mergeFactor);

      // Hide ship when time loop puts it far offscreen
      if (spaceshipRef.current) {
        if (mergeFactor > 0.99 && loopSx < -50) {
          spaceshipRef.current.visible = false;
        } else {
          spaceshipRef.current.visible = true;
        }
      }
    }

    if (spaceshipRef.current) {
      spaceshipRef.current.position.set(sx, sy, sz);
      spaceshipRef.current.rotation.set(sRotX, sRotY, sRotZ);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. LASER BEAM RAPID FIRING
    // ──────────────────────────────────────────────────────────────────────────
    if (laserRef.current) {
      const isFiring = p >= 0.08 && p < 0.13;
      laserRef.current.visible = isFiring;

      if (laserLightRef.current) {
        laserLightRef.current.intensity = isFiring ? 6 + Math.sin(t * 30) * 3 : 0;
      }

      if (isFiring) {
        const burst = (t * 18) % 1;
        // Fire from ship nose — ship model's front is along -Z in its local space
        // Get ship's world forward direction from its rotation matrix
        const shipForward = new THREE.Vector3();
        if (spaceshipRef.current) {
          spaceshipRef.current.getWorldDirection(shipForward);
        }
        // Nose offset: move 0.25 units in ship's forward direction from ship center
        const noseX = sx + shipForward.x * 0.25;
        const noseY = sy + shipForward.y * 0.25;
        const noseZ = sz + shipForward.z * 0.25;
        const dx = ax - noseX;
        const dy = ay - noseY;
        const dz = az - noseZ;
        laserRef.current.position.set(noseX + dx * burst, noseY + dy * burst, noseZ + dz * burst);
        laserRef.current.scale.set(1.0, 1.0, 1.8);
        const dir = new THREE.Vector3(dx, dy, dz).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        laserRef.current.setRotationFromQuaternion(quat);
        if (laserLightRef.current) {
          laserLightRef.current.position.set(noseX + dx * 0.5, noseY + dy * 0.5, noseZ + dz * 0.5);
        }
      }
    }

    // Explosion: compact burst — core flash + 2 expanding rings
    // Explosion GLB: show at asteroid destroy point, scale up then fade
    const exploding = p >= 0.12 && p < 0.24;
    const ef = THREE.MathUtils.clamp((p - 0.12) / 0.12, 0, 1);
    const EX = ASTEROID_EXPLODE.x, EY = ASTEROID_EXPLODE.y, EZ = ASTEROID_EXPLODE.z;

    if (explosionGroupRef.current) {
      explosionGroupRef.current.visible = exploding;
      if (exploding) {
        // Pop in fast, hold, then fade — scale drives the "burst" feel
        const s = ef < 0.3 ? (ef / 0.3) * 0.5 : 0.5;
        explosionGroupRef.current.scale.setScalar(s);
        explosionGroupRef.current.position.set(EX, EY, EZ);
        explosionGroupRef.current.rotation.y += delta * 0.5;
        // Fade out by scaling down after peak
        if (ef > 0.5) {
          const fade = 1 - (ef - 0.5) / 0.5;
          explosionGroupRef.current.scale.setScalar(0.5 * fade);
        }
      }
    }
    if (explosionLightRef.current) {
      explosionLightRef.current.intensity = exploding ? Math.max(0, (1 - ef) * 25) : 0;
      explosionLightRef.current.position.set(EX, EY, EZ);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. CAMERA IMPACT SHAKE & FLASH
    // ──────────────────────────────────────────────────────────────────────────
    const shakeAmt = p > 0.145 && p < 0.22 
      ? (1 - Math.abs(p - 0.15) / 0.07) * 0.18 : 0;
      
    if (shakeAmt > 0) {
      shakeT.current += delta * 70;
      state.camera.position.x = Math.sin(shakeT.current * 1.8) * shakeAmt;
      state.camera.position.y = Math.cos(shakeT.current * 2.5) * shakeAmt * 0.6;
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 8);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, delta * 8);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 6. ASTEROID REMNANTS (Orbiting Debris Rings around Planet)
    // ──────────────────────────────────────────────────────────────────────────
    const hasExploded = p >= 0.15;
    const explodedProgress = THREE.MathUtils.clamp((p - 0.15) / 0.35, 0, 1);
    
    // Planet's current position to pivot around
    const planetX = planetRef.current ? planetRef.current.position.x : PLANET_START.x;
    const planetY = planetRef.current ? planetRef.current.position.y : PLANET_START.y;
    const planetZ = planetRef.current ? planetRef.current.position.z : PLANET_START.z;

    debrisRefs.current.forEach((dr, i) => {
      if (!dr) return;
      
      // Hide debris when we move away from planet (same timing as planet)
      dr.visible = hasExploded && p < 0.45;
      
      if (hasExploded) {
        const d = DEBRIS_DATA[i];
        
        // Circular orbit angles rotating slowly
        const angle = d.phase + (t * d.speed) * 0.8;
        
        // Expanded ring coordinates tilted relative to planet
        const rx = Math.cos(angle) * d.radius;
        const rz = Math.sin(angle) * d.radius;
        const ry = Math.sin(angle) * d.radius * d.inclination; // Slight inclination tilt

        // Spawn blast expansion from impact origin, easing into stable orbit
        const scaleIn = Math.min(1, explodedProgress * 5);
        const radiusMultiplier = THREE.MathUtils.lerp(0.1, 1.0, Math.sin((explodedProgress * Math.PI) / 2));
        
        // Position relative to moving planet
        dr.position.set(
          planetX + rx * radiusMultiplier,
          planetY + ry * radiusMultiplier,
          planetZ + rz * radiusMultiplier
        );
        
        dr.rotation.x += delta * 1.5;
        dr.rotation.y += delta * 0.8;
        dr.scale.setScalar(d.scale * scaleIn * PLANET_SCALE);
      }
    });
  });

  // Calculate terrain and stardust opacities (fades in as user scrolls to footer)
  const footerFadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.15));
  const terrainOpacity = footerFadeProgress * 0.50; // opacity capped at 50% for legibility

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={1.8} />
      <pointLight position={[0, 6, 6]} intensity={3.5} color="#c084fc" />
      <pointLight ref={laserLightRef} position={[0, 0, 2]} intensity={0} color="#8b5cf6" distance={8} />
      <directionalLight position={[4, 5, 5]} intensity={2.5} color="#38bdf8" />
      <directionalLight position={[0, 4, 8]} intensity={3.0} color="#ffffff" />
      
      {/* 1. Saved Planet */}
      <group ref={planetRef} position={[PLANET_START.x, PLANET_START.y, PLANET_START.z]}>
        <ModelBoundary fallback={<FallbackSphere color="#8b5cf6" size={PLANET_SCALE} />}>
          <GLB path={PLANET} scale={1} />
        </ModelBoundary>
      </group>

      {/* 2. Asteroid */}
      <group ref={asteroidRef} position={[ASTEROID_START.x, ASTEROID_START.y, ASTEROID_START.z]}>
        <ModelBoundary fallback={<FallbackSphere color="#27272a" size={0.35} />}>
          <GLB path={ASTEROID} scale={1} />
        </ModelBoundary>
        <mesh ref={asteroidGlowRef}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color="#ff2200"
            emissive="#ff1100"
            emissiveIntensity={2}
            transparent
            opacity={0}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 3. Spaceship */}
      <group ref={spaceshipRef} position={[-0.6, -0.5, 1.5]} scale={0.07}>
        <primitive object={shipScene} />
      </group>

      {/* Explosion GLB */}
      <pointLight ref={explosionLightRef} position={[2.2, 0.5, 1.3]} intensity={0} color="#ff8c3a" distance={8} />
      <group ref={explosionGroupRef} visible={false}>
        <ModelBoundary fallback={<mesh><sphereGeometry args={[0.3,8,8]} /><meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={4} transparent opacity={0.8} /></mesh>}>
          <GLB path="/models/explosion.glb" scale={0.4} />
        </ModelBoundary>
      </group>

      {/* 4. Violet plasma laser beams */}
      <group ref={laserRef} visible={false}>
        {/* Core beam — bright violet */}
        <mesh position={[-0.06, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.008, 1.0, 8]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={8} toneMapped={false} />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.008, 1.0, 8]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={8} toneMapped={false} />
        </mesh>
        {/* Outer glow — wide soft halo */}
        <mesh position={[-0.06, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.03, 1.0, 8]} />
          <meshStandardMaterial color="#a78bfa" emissive="#6d28d9" emissiveIntensity={3} transparent opacity={0.25} toneMapped={false} depthWrite={false} />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.03, 1.0, 8]} />
          <meshStandardMaterial color="#a78bfa" emissive="#6d28d9" emissiveIntensity={3} transparent opacity={0.25} toneMapped={false} depthWrite={false} />
        </mesh>
      </group>

      {/* 5. Orbital Asteroid Remnants (Debris) */}
      {Array.from({ length: DEBRIS_COUNT }).map((_, i) => (
        <group key={`debris-${i}`} ref={(el) => { debrisRefs.current[i] = el; }} visible={false}>
          <ModelBoundary fallback={
            <mesh>
              <dodecahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial
                color="#2e2e33"
                emissive="#d44000"
                emissiveIntensity={DEBRIS_DATA[i].heat * 0.25}
                roughness={0.9}
              />
            </mesh>
          }>
            <GLB path={DEBRIS} scale={1} />
          </ModelBoundary>
        </group>
      ))}

      {/* 6. Footer Terrain & StarDust */}
      <Terrain opacity={terrainOpacity} />
      <StarDust opacity={terrainOpacity} />

      <Environment preset="night" />
    </>
  );
}

// ── Global Canvas Wrap Export ───────────────────────────────────────────────
export function SpaceCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger immediately to sync starting state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 w-full h-screen">
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
        <Suspense fallback={null}>
          <SpaceScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
      <GlobalLoader />
    </div>
  );
}

// Preload models for immediate startup performance
useGLTF.preload(SPACESHIP);
useGLTF.preload(PLANET);
useGLTF.preload(ASTEROID);
useGLTF.preload(DEBRIS);
useGLTF.preload("/models/explosion.glb");
