"use client";

import { useState, useEffect, useMemo, useRef, Suspense, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SITE_CONFIG } from "@/lib/constants";
import { JellyText } from "@/components/animations/JellyText";

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

function Terrain() {
  const geom = useMemo(() => {
    const size = 32;
    const segments = 45;
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Displace vertices to form organic alien ridges/craters
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Beautiful space terrain peaks using wave overlapping (softened heights)
      const z = (Math.sin(x * 0.22) * Math.cos(y * 0.22) * 1.6 + 
                Math.sin(x * 0.5) * Math.sin(y * 0.5) * 0.6 + 
                Math.cos(x * 0.12) * 0.8) * 0.62;
      pos.setZ(i, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3.2, 0]}>
      <meshStandardMaterial
        color="#080312"
        wireframe
        emissive="#8b5cf6"
        emissiveIntensity={1.3}
        roughness={0.25}
        metalness={0.8}
      />
    </mesh>
  );
}

function StarDust() {
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
    <points>
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
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Spaceship() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/spaceship.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const actionName = Object.keys(actions)[0];
      if (actionName && actions[actionName]) {
        actions[actionName]?.play();
      }
    }
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    
    // 10-second high-end loop timeline
    const cycle = 10;
    const p = t % cycle; // Time elapsed in current cycle (0s to 10s)
    
    let x = 0;
    let y = 1.8;
    let z = 2.4;
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    
    if (p < 2.5) {
      // PHASE 1: CRUISE IN FROM RIGHT TO CENTER (0s to 2.5s)
      // Comes from offscreen right (x = 16.0) to center (x = 0.0)
      // Facing left (rotY = -Math.PI / 2)
      const factor = p / 2.5; // 0 to 1
      const eased = 1 - Math.pow(1 - factor, 3); // Cubic ease-out for a smooth brake
      
      x = 16.0 - eased * 16.0;
      y = 1.8 + Math.sin(t * 1.8) * 0.05;
      rotY = -Math.PI / 2;
      rotX = Math.sin(t * 1.8) * 0.02;
      rotZ = 0.08 * (1 - factor); // Hover tilt
      group.current.visible = true;
      
    } else if (p >= 2.5 && p < 3.5) {
      // PHASE 2: EASED TURN TO FACE CAMERA & DOCK (2.5s to 3.5s)
      // Stays in center (x = 0.0), rotates from facing left (-Math.PI / 2) to facing forward (0.0)
      const factor = (p - 2.5) / 1.0; // 0 to 1
      const eased = Math.sin((factor * Math.PI) / 2); // Sine ease-out
      
      x = 0;
      y = 1.8 + Math.sin(t * 1.5) * 0.06;
      rotY = -Math.PI / 2 * (1 - eased);
      rotX = Math.sin(t * 1.5) * 0.02;
      rotZ = 0;
      group.current.visible = true;
      
    } else if (p >= 3.5 && p < 7.0) {
      // PHASE 3: STATIONARY ASSEMBLY / SHOWCASE HOVER (3.5s to 7.0s)
      // Completely parked in center (x = 0.0), facing forward (rotY = 0.0)
      // Elegant hovering & slow rotation wobble representing the assembly hold
      x = 0;
      y = 1.8 + Math.sin(t * 1.5) * 0.07;
      rotY = Math.sin(t * 0.5) * 0.03; // Tiny cosmetic drift
      rotX = Math.sin(t * 1.5) * 0.02;
      rotZ = Math.cos(t * 1.5) * 0.02;
      group.current.visible = true;
      
    } else if (p >= 7.0 && p < 8.0) {
      // PHASE 4: PRE-TAKEOFF PIVOT & CHARGE (7.0s to 8.0s)
      // Prepares for takeoff. Pivots to face left (rotY = -Math.PI / 2)
      // Stays in center (x = 0.0), dips slightly (y) as thrusters charge
      const factor = (p - 7.0) / 1.0;
      const eased = Math.pow(factor, 2); // Ease-in
      
      x = 0;
      y = 1.8 - eased * 0.20 + Math.sin(t * 2.5) * 0.04; // Dip
      rotY = -Math.PI / 2 * eased; // Pivot to face left
      rotX = -0.05 * eased; // Nose down slightly
      rotZ = 0;
      group.current.visible = true;
      
    } else if (p >= 8.0 && p < 9.2) {
      // PHASE 5: HYPER-ACCELERATION TAKEOFF LEFT (8.0s to 9.2s)
      // Shoots from center (x = 0.0) to offscreen left (x = -16.0)
      // Facing left (rotY = -Math.PI / 2) with high speed ease-in acceleration
      const factor = (p - 8.0) / 1.2; // 0 to 1
      const eased = Math.pow(factor, 3); // High dynamic acceleration
      
      x = -eased * 16.0;
      y = 1.6 + eased * 1.40 + Math.sin(t * 4.0) * 0.03; // Ascends as it leaves
      rotY = -Math.PI / 2;
      rotX = 0.05 * factor; // Nose up as it flies away
      rotZ = 0.35 * factor; // Heavy leftward roll bank for maximum speed aesthetic
      group.current.visible = true;
      
    } else {
      // PHASE 6: OFFSCREEN COOLDOWN, RESET ON RIGHT (9.2s to 10.0s)
      // Sits far offscreen, completely invisible, preventing any visual pop to the right
      x = -99.0;
      y = -99.0;
      rotY = -Math.PI / 2;
      rotX = 0;
      rotZ = 0;
      group.current.visible = false;
    }
    
    // Always apply position and rotation to prevent visibility state locks
    group.current.position.set(x, y, z);
    group.current.rotation.set(rotX, rotY, rotZ);
  });

  return (
    <group ref={group} scale={2.6}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/spaceship.glb");

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer style={{ background: "var(--bg)", paddingTop: "12rem", paddingBottom: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", zIndex: 10 }}>
      {/* 3D wireframe land rendering backgdrop */}
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-45">
          <Canvas camera={{ position: [0, 1.2, 5.5], fov: 42 }}>
            <ambientLight intensity={1.8} />
            <pointLight position={[0, 6, 6]} intensity={3.5} color="#c084fc" />
            <directionalLight position={[4, 5, 5]} intensity={2.5} color="#38bdf8" />
            <directionalLight position={[0, 4, 8]} intensity={3.0} color="#ffffff" />
            <Suspense fallback={null}>
              <Terrain />
              <StarDust />
              <ModelBoundary fallback={null}>
                <Spaceship />
              </ModelBoundary>
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Background glow overlay */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none blur-[120px] opacity-25 z-0"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(124, 58, 237, 0.35), transparent 70%)",
        }}
      />

      <div className="wrap relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-24">
          
          {/* Brand Info */}
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink)", marginBottom: "1.5rem" }}>
              ANITHIX
            </div>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.6, maxWidth: "300px" }}>
              Building the next generation of intelligent software, automation platforms, and developer tools.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink)", fontWeight: 700, marginBottom: "1.5rem" }}>Ecosystem</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["Graviton", "Atom", "Orbis"].map(l => (
                  <li key={l}>
                    <a href="#products" style={{ color: "var(--ink-3)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-3)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink)", fontWeight: 700, marginBottom: "1.5rem" }}>Company</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["About", "Timeline", "Contact"].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} style={{ color: "var(--ink-3)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-3)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Typography */}
        <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(4rem, 18vw, 20rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.03)", userSelect: "none", lineHeight: 0.8 }}>
            <JellyText text="ANITHIX" />
          </h2>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", color: "var(--ink-4)" }}>
          <div className="mono" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            &copy; {new Date().getFullYear()} Anithix. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>GitHub</a>
            <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>LinkedIn</a>
            <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-4)"}>Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
