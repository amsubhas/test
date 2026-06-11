"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Seeded PRNG (replaces Math.random to get deterministic layout) ──────────
function makePRNG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function NetworkNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const lineGeoRef = useRef<THREE.BufferGeometry | null>(null);

  const { positions, connections } = useMemo(() => {
    const rand = makePRNG(42);
    const nodeCount = 60;
    const pos: [number, number, number][] = [];

    for (let i = 0; i < nodeCount; i++) {
      pos.push([
        (rand() - 0.5) * 8,
        (rand() - 0.5) * 6,
        (rand() - 0.5) * 4,
      ]);
    }

    const conns: { from: number; to: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i][0] - pos[j][0];
        const dy = pos[i][1] - pos[j][1];
        const dz = pos[i][2] - pos[j][2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.5 && conns.length < 120) {
          conns.push({ from: i, to: j });
        }
      }
    }
    return { positions: pos, connections: conns };
  }, []);

  // Build line geometry once and hold a ref for disposal
  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    connections.forEach(({ from, to }) => {
      points.push(...positions[from], ...positions[to]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    lineGeoRef.current = geo;
    return geo;
  }, [connections, positions]);

  // Dispose geometry when component unmounts
  useEffect(() => {
    return () => {
      lineGeoRef.current?.dispose();
    };
  }, []);

  // Time-based rotation (already frame-rate independent)
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#00f5ff" transparent opacity={0.12} linewidth={1} />
      </lineSegments>

      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#00f5ff" : i % 4 === 1 ? "#0066ff" : i % 4 === 2 ? "#7b2fff" : "#ffffff"}
            emissive={i % 4 === 0 ? "#00f5ff" : i % 4 === 1 ? "#0066ff" : "#7b2fff"}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function NeuralNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
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
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#7b2fff" />
      <NetworkNodes />
    </Canvas>
  );
}
