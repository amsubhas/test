"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

function Building({
  position,
  height,
  width,
  color,
  emissive,
}: {
  position: [number, number, number];
  height: number;
  width: number;
  color: string;
  emissive: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity =
      0.3 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[position[0], position[1] + height / 2, position[2]]}>
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
        wireframe={false}
      />
    </mesh>
  );
}

function WireBuilding({
  position,
  height,
  width,
}: {
  position: [number, number, number];
  height: number;
  width: number;
}) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]}>
      <boxGeometry args={[width + 0.02, height + 0.02, width + 0.02]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ── Seeded PRNG for deterministic city layout ──────────────────────────────
function makePRNG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function City() {
  const groupRef = useRef<THREE.Group>(null);

  const buildings = useMemo(() => {
    const rand = makePRNG(99);
    const b = [];
    const grid = 6;
    for (let x = -grid; x <= grid; x += 2) {
      for (let z = -grid; z <= grid; z += 2) {
        if (rand() > 0.2) {
          const height = 0.5 + rand() * 3;
          const width = 0.4 + rand() * 0.6;
          const t = rand();
          b.push({
            position: [x + (rand() - 0.5) * 0.5, 0, z + (rand() - 0.5) * 0.5] as [number, number, number],
            height,
            width,
            color: t < 0.5 ? "#001a2e" : t < 0.8 ? "#000d1a" : "#001020",
            emissive: t < 0.5 ? "#003366" : t < 0.8 ? "#001a4d" : "#002244",
          });
        }
      }
    }
    return b;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#000810" metalness={0.8} roughness={0.5} />
      </mesh>

      {/* Grid lines */}
      <Grid
        position={[0, 0.01, 0]}
        args={[30, 30]}
        cellColor="#00f5ff"
        sectionColor="#00f5ff"
        cellThickness={0.3}
        sectionThickness={0.8}
        cellSize={2}
        sectionSize={6}
        fadeDistance={25}
        fadeStrength={2}
        infiniteGrid={false}
      />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <group key={i}>
          <Building {...b} />
          <WireBuilding position={b.position} height={b.height} width={b.width} />
        </group>
      ))}

      {/* Scan plane */}
      <ScanPlane />
    </group>
  );
}

function ScanPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const y = ((state.clock.elapsedTime * 0.8) % 4) - 0.5;
    meshRef.current.position.y = y;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
      0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={1}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function DigitalTwinCity() {
  return (
    <Canvas
      camera={{ position: [10, 8, 10], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
      aria-hidden="true"
      onCreated={({ gl, scene }) => {
        return () => {
          scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              Array.isArray(mesh.material)
                ? mesh.material.forEach((m) => m.dispose())
                : mesh.material.dispose();
            }
          });
          gl.dispose();
        };
      }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00f5ff" />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#0066ff" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#7b2fff" />

      <City />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}
