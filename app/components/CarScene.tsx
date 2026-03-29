"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CarBody() {
  return (
    <group>
      {/* Main car body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.48, 1.3]} />
        <meshPhysicalMaterial
          color="#0a1628"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      {/* Roof/cabin */}
      <mesh position={[0.05, 0.44, 0]} castShadow>
        <boxGeometry args={[1.45, 0.42, 1.12]} />
        <meshPhysicalMaterial
          color="#071020"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Front windshield slope */}
      <mesh position={[0.72, 0.35, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.55, 0.06, 1.05]} />
        <meshPhysicalMaterial
          color="#0d1f40"
          metalness={0.8}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Rear slope */}
      <mesh position={[-0.68, 0.35, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.55, 0.06, 1.05]} />
        <meshPhysicalMaterial
          color="#0d1f40"
          metalness={0.8}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[1.45, -0.1, 0]}>
        <boxGeometry args={[0.1, 0.28, 1.2]} />
        <meshPhysicalMaterial color="#0a1020" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[-1.45, -0.1, 0]}>
        <boxGeometry args={[0.1, 0.28, 1.2]} />
        <meshPhysicalMaterial color="#0a1020" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Blue accent stripe */}
      <mesh position={[0, 0, 0.66]}>
        <boxGeometry args={[2.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0, -0.66]}>
        <boxGeometry args={[2.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} />
      </mesh>

      {/* Wheels */}
      {(
        [
          [0.92, -0.3, 0.7],
          [-0.82, -0.3, 0.7],
          [0.92, -0.3, -0.7],
          [-0.82, -0.3, -0.7],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
            <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 12]} />
            <meshStandardMaterial color="#c0c8d8" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Rim glow */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.21, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {([[1.41, 0.05, 0.42], [1.41, 0.05, -0.42]] as [number, number, number][]).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[0.04, 0.12, 0.22]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#3b82f6"
              emissiveIntensity={3}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight color="#3b82f6" intensity={2} distance={3} />
        </group>
      ))}

      {/* Taillights */}
      {([[-1.41, 0.05, 0.42], [-1.41, 0.05, -0.42]] as [number, number, number][]).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[0.04, 0.1, 0.2]} />
            <meshStandardMaterial
              color="#ff2200"
              emissive="#ff2200"
              emissiveIntensity={3}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight color="#ff2200" intensity={1} distance={2} />
        </group>
      ))}

      {/* Grille */}
      <mesh position={[1.42, -0.02, 0]}>
        <boxGeometry args={[0.05, 0.2, 0.7]} />
        <meshStandardMaterial color="#0a1020" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function AnimatedLights() {
  const blueLight = useRef<THREE.PointLight>(null);
  const goldLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (blueLight.current) {
      blueLight.current.intensity = 3 + Math.sin(t * 1.5) * 1.2;
      blueLight.current.position.x = Math.sin(t * 0.4) * 3;
      blueLight.current.position.z = Math.cos(t * 0.4) * 3;
    }
    if (goldLight.current) {
      goldLight.current.intensity = 2 + Math.cos(t * 1.2) * 0.8;
      goldLight.current.position.x = Math.cos(t * 0.3) * 3;
      goldLight.current.position.z = Math.sin(t * 0.3) * 3;
    }
  });

  return (
    <>
      <pointLight ref={blueLight} color="#3b82f6" intensity={3} position={[3, 2, 3]} />
      <pointLight ref={goldLight} color="#f59e0b" intensity={2} position={[-3, 2, -3]} />
      <pointLight color="#ffffff" intensity={0.8} position={[0, 5, 0]} />
      <ambientLight intensity={0.2} />
      {/* Dramatic under-glow */}
      <pointLight color="#3b82f6" intensity={1.5} position={[0, -1.5, 0]} />
    </>
  );
}

function GroundReflection() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#050810"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export default function CarScene() {
  return (
    <Canvas
      camera={{ position: [4, 2.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      shadows
      style={{ background: "transparent" }}
    >
      <AnimatedLights />
      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.5}
        fade
        speed={0.3}
      />
      <Sparkles
        count={60}
        scale={8}
        size={1.5}
        speed={0.4}
        color="#3b82f6"
        opacity={0.6}
      />
      <Float
        speed={1.2}
        rotationIntensity={0.2}
        floatIntensity={0.4}
        floatingRange={[-0.1, 0.1]}
      >
        <CarBody />
      </Float>
      <GroundReflection />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.6}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
