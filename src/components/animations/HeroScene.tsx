"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function ElegantObject() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow elegant rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.1;

    // Subtle mouse reaction
    groupRef.current.rotation.x += (mouse.y * 0.3 - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (mouse.x * 0.3 - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Glowing Core */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#9333ea" />
      </mesh>
      
      {/* Orbital Ring 1 */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#d8b4fe" transparent opacity={0.6} />
      </mesh>
      
      {/* Orbital Ring 2 */}
      <mesh rotation={[0, Math.PI / 2.5, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.4} />
      </mesh>
      
      {/* Orbital Ring 3 */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[3.4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <ElegantObject />
      </Float>
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.1}
          mipmapBlur 
          intensity={2.0} 
        />
      </EffectComposer>
    </>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-full min-h-[500px] z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
