"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import type { } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
extend(THREE);

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x001a2e),
        emissive: new THREE.Color(0x003366),
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.003 * delta * 60;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1.2, 4]} />
    </mesh>
  );
}

function NeuralRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.4;
      ring1.current.rotation.z = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.3;
      ring2.current.rotation.z = -t * 0.15;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -t * 0.25;
      ring3.current.rotation.y = t * 0.35;
    }
  });

  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x00f5ff),
        emissive: new THREE.Color(0x00f5ff),
        emissiveIntensity: 0.8,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  const ring2Mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0066ff),
        emissive: new THREE.Color(0x0066ff),
        emissiveIntensity: 0.8,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.5,
      }),
    []
  );

  const ring3Mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x7b2fff),
        emissive: new THREE.Color(0x7b2fff),
        emissiveIntensity: 0.6,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  return (
    <>
      <mesh ref={ring1} material={ringMat}>
        <torusGeometry args={[1.8, 0.015, 8, 120]} />
      </mesh>
      <mesh ref={ring2} material={ring2Mat}>
        <torusGeometry args={[2.2, 0.012, 8, 120]} />
      </mesh>
      <mesh ref={ring3} material={ring3Mat}>
        <torusGeometry args={[2.7, 0.008, 8, 120]} />
      </mesh>
    </>
  );
}

function ParticleField() {
  const count = 800;
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Gradient from cyan to blue to purple
      const mix = Math.random();
      if (mix < 0.5) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      } else if (mix < 0.8) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 0.48;
        colors[i * 3 + 1] = 0.18;
        colors[i * 3 + 2] = 1;
      }
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.001 * delta * 60;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function DataStreams() {
  const count = 20;
  const groupRef = useRef<THREE.Group>(null);

  const streams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.5;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.002 * delta * 60;
    groupRef.current.children.forEach((child, i) => {
      const s = streams[i];
      const mesh = child as THREE.Mesh;
      mesh.position.y =
        Math.sin(state.clock.elapsedTime * s.speed + s.phase) * 1.5;
      (mesh.material as THREE.MeshStandardMaterial).opacity =
        0.3 + Math.sin(state.clock.elapsedTime * s.speed + s.phase + 1) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {streams.map((s, i) => (
        <mesh key={i} position={[s.x, 0, s.z]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#0066ff" : "#7b2fff"}
            emissive={i % 3 === 0 ? "#00f5ff" : i % 3 === 1 ? "#0066ff" : "#7b2fff"}
            emissiveIntensity={1}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function AICore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
      aria-hidden="true"
      onCreated={({ gl, scene }) => {
        // Cleanup: dispose all geometries and materials when Canvas unmounts
        return () => {
          scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          });
          gl.dispose();
        };
      }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#0066ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7b2fff" />

      <CoreSphere />
      <NeuralRings />
      <ParticleField />
      <DataStreams />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
