"use client";

import React, {
  useRef, useState, useEffect, useMemo,
  Suspense, useCallback, FC,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X, ChevronRight, ExternalLink,
  Users, Cpu, Palette, Building2,
  Activity, Database, Radio,
} from "lucide-react";

/* ================================================================
   DISTRICT DEFINITIONS
   ================================================================ */

type IconComp = FC<{ size?: number; color?: string; strokeWidth?: number }>;

interface DistrictDef {
  id: string;
  label: string;
  tagline: string;
  hex: string;
  hexSec: string;
  hexEm: string;
  rgba: string;
  center: [number, number, number];
  camPos: [number, number, number];
  camLook: [number, number, number];
  description: string;
  capabilities: string[];
  stats: { label: string; value: string }[];
  techs: string[];
  href: string;
  external: boolean;
  Icon: IconComp;
}

const DISTRICTS: DistrictDef[] = [
  {
    id: "nexforce",
    label: "NEXFORCE",
    tagline: "Human Intelligence",
    hex: "#2563eb",
    hexSec: "#93c5fd",
    hexEm: "#1d4ed8",
    rgba: "rgba(37,99,235,0.6)",
    center: [-10, 0, -10],
    camPos: [-20, 12, -2],
    camLook: [-10, 2, -10],
    description:
      "Human workforce transformation engine powering enterprise intelligence at planetary scale. Strategic workforce architecture meets operational excellence.",
    capabilities: [
      "Strategic Workforce Planning",
      "BOT Models (Build-Operate-Transfer)",
      "Managed Operations",
      "Compliance Teams",
      "Industrial Staffing",
      "Project Resource Management",
    ],
    stats: [
      { label: "Teams Deployed", value: "500+" },
      { label: "Industries Served", value: "24" },
      { label: "Success Rate", value: "98%" },
      { label: "Countries Active", value: "12" },
    ],
    techs: ["AI Talent Matching", "Real-time Analytics", "Compliance Engine", "BOT Framework"],
    href: "/nexforce",
    external: false,
    Icon: Users,
  },
  {
    id: "nextech",
    label: "NEXTECH",
    tagline: "Phygital Bridge",
    hex: "#06b6d4",
    hexSec: "#67e8f9",
    hexEm: "#0e7490",
    rgba: "rgba(6,182,212,0.6)",
    center: [10, 0, -10],
    camPos: [20, 12, -2],
    camLook: [10, 2, -10],
    description:
      "AI-first technology architecture bridging physical reality with digital intelligence. Advanced phygital systems transforming how the world operates.",
    capabilities: [
      "AI Systems Development",
      "Digital Transformation",
      "IoT & Edge Integration",
      "Data Engineering",
      "Cloud Architecture",
      "Computer Vision Solutions",
    ],
    stats: [
      { label: "AI Models Deployed", value: "48+" },
      { label: "Systems Built", value: "200+" },
      { label: "Uptime SLA", value: "99.9%" },
      { label: "Data Points/Day", value: "10M+" },
    ],
    techs: ["Machine Learning", "Computer Vision", "NLP", "Edge Computing", "Quantum-Ready"],
    href: "/nextech",
    external: false,
    Icon: Cpu,
  },
  {
    id: "nexdesign",
    label: "NEXDESIGN",
    tagline: "Design Intelligence",
    hex: "#7c3aed",
    hexSec: "#c4b5fd",
    hexEm: "#6d28d9",
    rgba: "rgba(124,58,237,0.6)",
    center: [-10, 0, 10],
    camPos: [-20, 12, 17],
    camLook: [-10, 2, 10],
    description:
      "Creative intelligence studio engineering transcendent experiences at the frontier of design, technology, and human perception.",
    capabilities: [
      "Brand Identity & Strategy",
      "UI/UX Engineering",
      "3D Visualization & VR",
      "Motion Design",
      "Digital Marketing",
      "Interactive Installations",
    ],
    stats: [
      { label: "Brands Crafted", value: "300+" },
      { label: "Design Awards", value: "18" },
      { label: "Client Retention", value: "95%" },
      { label: "Digital Assets", value: "12,400+" },
    ],
    techs: ["Figma", "Blender 3D", "After Effects", "WebGL/Three.js", "AI Generative Design"],
    href: "/nexdesign",
    external: false,
    Icon: Palette,
  },
  {
    id: "nexbuild",
    label: "NEXBUILD",
    tagline: "Smart Communities",
    hex: "#ea580c",
    hexSec: "#fdba74",
    hexEm: "#c2410c",
    rgba: "rgba(234,88,12,0.6)",
    center: [10, 0, 10],
    camPos: [20, 12, 17],
    camLook: [10, 2, 10],
    description:
      "Smart construction and physical infrastructure engineering — building the tangible substrate of tomorrow's digital civilization.",
    capabilities: [
      "Smart City Development",
      "Construction Management",
      "Digital Blueprint Systems",
      "Infrastructure Planning",
      "Project Delivery & Control",
      "Structural Holographic Design",
    ],
    stats: [
      { label: "Projects Completed", value: "124+" },
      { label: "Smart Nodes", value: "6,800" },
      { label: "Built Area", value: "2M+ sqft" },
      { label: "Smart Systems", value: "340+" },
    ],
    techs: ["BIM/CAD", "Digital Twins", "IoT Sensors", "Smart Materials", "GIS Mapping"],
    href: "https://buildmate.sharvas.in",
    external: true,
    Icon: Building2,
  },
];

const METRICS = [
  { label: "Projects Active", target: 124, Icon: Activity },
  { label: "AI Systems Running", target: 48, Icon: Cpu },
  { label: "Digital Assets Managed", target: 12400, Icon: Database },
  { label: "Smart Infrastructure Nodes", target: 6800, Icon: Radio },
];

/* ================================================================
   SEEDED RANDOM (for deterministic background city)
   ================================================================ */
function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ================================================================
   THREE.JS BUILDING PRIMITIVES
   ================================================================ */

interface BuildProps {
  pos: [number, number, number];
  sz: [number, number, number];
  hex: string;
  em: string;
  hovered: boolean;
  pulse?: number;
}

function Build({ pos, sz, hex, em, hovered, pulse = 0 }: BuildProps) {
  const mRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (mRef.current) {
      const base = hovered ? 0.72 : 0.24;
      mRef.current.emissiveIntensity =
        base + Math.sin(clock.elapsedTime * 1.8 + pulse) * 0.12;
    }
  });
  return (
    <mesh
      position={[pos[0], pos[1] + sz[1] / 2, pos[2]]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={sz} />
      <meshStandardMaterial
        ref={mRef}
        color={hex}
        emissive={em}
        emissiveIntensity={0.24}
        metalness={0.78}
        roughness={0.22}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function BuildWire({
  pos,
  sz,
  hex,
}: {
  pos: [number, number, number];
  sz: [number, number, number];
  hex: string;
}) {
  return (
    <mesh position={[pos[0], pos[1] + sz[1] / 2, pos[2]]}>
      <boxGeometry
        args={[sz[0] + 0.045, sz[1] + 0.045, sz[2] + 0.045]}
      />
      <meshStandardMaterial
        color={hex}
        emissive={hex}
        emissiveIntensity={0.55}
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function DistrictGround({
  hex,
  hovered,
  radius = 5.5,
}: {
  hex: string;
  hovered: boolean;
  radius?: number;
}) {
  const mRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (mRef.current) {
      mRef.current.emissiveIntensity =
        (hovered ? 0.22 : 0.06) +
        Math.sin(clock.elapsedTime * 1.2) * 0.03;
      mRef.current.opacity = hovered ? 0.38 : 0.22;
    }
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <circleGeometry args={[radius, 48]} />
      <meshStandardMaterial
        ref={mRef}
        color={hex}
        emissive={hex}
        emissiveIntensity={0.06}
        transparent
        opacity={0.22}
      />
    </mesh>
  );
}

function DistrictLabel({
  label,
  tagline,
  hex,
  hexSec,
  hovered,
  yPos,
}: {
  label: string;
  tagline: string;
  hex: string;
  hexSec: string;
  hovered: boolean;
  yPos: number;
}) {
  return (
    <Html position={[0, yPos, 0]} center distanceFactor={14}>
      <div
        className="pointer-events-none select-none"
        style={{
          textAlign: "center",
          opacity: hovered ? 1 : 0.6,
          transform: `scale(${hovered ? 1.12 : 1})`,
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div
          style={{
            color: hexSec,
            fontFamily:
              "var(--font-display, 'Rajdhani', sans-serif)",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "3.5px",
            textShadow: `0 0 16px ${hex}, 0 0 32px ${hex}80`,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: hexSec,
            fontFamily:
              "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: "8.5px",
            letterSpacing: "2px",
            opacity: 0.65,
            marginTop: "2px",
            whiteSpace: "nowrap",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            width: hovered ? "40px" : "20px",
            height: "1px",
            background: hexSec,
            margin: "4px auto 0",
            transition: "width 0.4s ease",
            boxShadow: `0 0 6px ${hex}`,
          }}
        />
      </div>
    </Html>
  );
}

/* ================================================================
   NEXFORCE DISTRICT — Blue, NW (-10, 0, -10)
   Smart offices, HR hub, digital workforce indicators
   ================================================================ */
const NF_B: Array<{
  pos: [number, number, number];
  sz: [number, number, number];
}> = [
  { pos: [0, 0, 0], sz: [1.5, 6.8, 1.5] },
  { pos: [-2.5, 0, 0.5], sz: [1.2, 4.5, 1.2] },
  { pos: [2.5, 0, -1], sz: [1.0, 3.8, 1.0] },
  { pos: [-1.5, 0, 2.5], sz: [1.1, 3.2, 1.1] },
  { pos: [1.5, 0, 2.5], sz: [1.8, 2.2, 2.0] },
  { pos: [-2.5, 0, -2], sz: [0.8, 2.6, 0.8] },
  { pos: [1.0, 0, -2.5], sz: [0.7, 2.0, 0.7] },
];

/* Holographic person node orbiting the HQ tower */
function HoloNode({
  baseRadius,
  speed,
  offset,
  hex,
  hovered,
}: {
  baseRadius: number;
  speed: number;
  offset: number;
  hex: string;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * baseRadius;
    ref.current.position.z = Math.sin(t) * baseRadius;
    ref.current.position.y = 4 + Math.sin(clock.elapsedTime * 2 + offset) * 0.25;
    (ref.current.children[0] as THREE.Mesh & {
      material: THREE.MeshStandardMaterial;
    }).material.emissiveIntensity =
      (hovered ? 1.2 : 0.45) + Math.sin(clock.elapsedTime * 3 + offset) * 0.2;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function NexForceDistrict({
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const d = DISTRICTS[0];
  const gRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (gRef.current)
      gRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.38) * 0.05;
  });
  return (
    <group
      ref={gRef}
      position={d.center}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {NF_B.map((b, i) => (
        <group key={i}>
          <Build
            pos={b.pos}
            sz={b.sz}
            hex={d.hex}
            em={d.hexEm}
            hovered={hovered}
            pulse={i * 0.68}
          />
          <BuildWire pos={b.pos} sz={b.sz} hex={d.hexSec} />
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <HoloNode
          key={i}
          baseRadius={2.2 + i * 0.3}
          speed={0.6 + i * 0.15}
          offset={(i * Math.PI * 2) / 3}
          hex={d.hex}
          hovered={hovered}
        />
      ))}
      <DistrictGround hex={d.hex} hovered={hovered} />
      {/* Reduced intensity district light - 1 per district (4 total) */}
      <pointLight
        position={[0, 8, 0]}
        color={d.hex}
        intensity={hovered ? 2.5 : 0.8}
        distance={18}
        decay={2}
      />
      <DistrictLabel
        label={d.label}
        tagline={d.tagline}
        hex={d.hex}
        hexSec={d.hexSec}
        hovered={hovered}
        yPos={9.5}
      />
    </group>
  );
}

/* ================================================================
   NEXTECH DISTRICT — Cyan, NE (10, 0, -10)
   AI towers, neural network nodes, data spire
   ================================================================ */
const NT_B: Array<{
  pos: [number, number, number];
  sz: [number, number, number];
}> = [
  { pos: [0, 0, 0], sz: [0.85, 10.5, 0.85] }, // AI data spire
  { pos: [-2.2, 0, 0.5], sz: [1.2, 5.5, 1.2] },
  { pos: [2.2, 0, 0.5], sz: [1.0, 6.5, 1.0] },
  { pos: [-1.5, 0, -2.5], sz: [0.8, 3.8, 0.8] },
  { pos: [2.0, 0, -2.0], sz: [1.4, 4.2, 1.4] },
  { pos: [0.0, 0, 2.5], sz: [2.5, 2.0, 2.0] }, // data center
];

const NT_NEURAL: [number, number, number][] = [
  [-1.0, 4.5, -1.0],
  [1.0, 6.0, 1.0],
  [-1.5, 7.2, 0.5],
  [0.5, 8.8, -0.5],
  [1.5, 5.5, -1.5],
];

function NeuralNode({
  pos,
  hex,
  hovered,
  idx,
}: {
  pos: [number, number, number];
  hex: string;
  hovered: boolean;
  idx: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      pos[1] + Math.sin(clock.elapsedTime * 1.5 + idx) * 0.28;
    (ref.current
      .material as THREE.MeshStandardMaterial).emissiveIntensity =
      (hovered ? 1.2 : 0.45) +
      Math.sin(clock.elapsedTime * 2.5 + idx) * 0.25;
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.18, 8, 8]} />
      <meshStandardMaterial
        color={hex}
        emissive={hex}
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.05}
      />
    </mesh>
  );
}

/* Neural connections — lines between nodes */
function NeuralConnections({ hex }: { hex: string }) {
  const pairs: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [1, 3],
  ];
  return (
    <group>
      {pairs.map(([a, b], i) => (
        <Line
          key={i}
          points={[NT_NEURAL[a], NT_NEURAL[b]]}
          color={hex}
          lineWidth={0.4}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
}

function NexTechDistrict({
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const d = DISTRICTS[1];
  const gRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (gRef.current)
      gRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.44 + 1) * 0.05;
  });
  return (
    <group
      ref={gRef}
      position={d.center}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {NT_B.map((b, i) => (
        <group key={i}>
          <Build
            pos={b.pos}
            sz={b.sz}
            hex={d.hex}
            em={d.hexEm}
            hovered={hovered}
            pulse={i * 0.85}
          />
          <BuildWire pos={b.pos} sz={b.sz} hex={d.hexSec} />
        </group>
      ))}
      {NT_NEURAL.map((np, i) => (
        <NeuralNode
          key={i}
          pos={np}
          hex={d.hex}
          hovered={hovered}
          idx={i}
        />
      ))}
      <NeuralConnections hex={d.hex} />
      <DistrictGround hex={d.hex} hovered={hovered} radius={6.2} />
      <pointLight position={[0, 12, 0]} color={d.hex} intensity={hovered ? 2.5 : 0.8} distance={18} decay={2} />
      <DistrictLabel
        label={d.label}
        tagline={d.tagline}
        hex={d.hex}
        hexSec={d.hexSec}
        hovered={hovered}
        yPos={13}
      />
    </group>
  );
}

/* ================================================================
   NEXDESIGN DISTRICT — Purple, SW (-10, 0, 10)
   Creative studio towers, floating gem, geometric meshes
   ================================================================ */
const ND_B: Array<{
  pos: [number, number, number];
  sz: [number, number, number];
}> = [
  { pos: [0, 0, 0], sz: [1.3, 5.2, 1.3] },
  { pos: [-2.0, 0, 1.0], sz: [1.0, 4.5, 0.8] },
  { pos: [2.0, 0, 0.0], sz: [0.8, 6.5, 0.8] },
  { pos: [0.5, 0, -2.5], sz: [1.2, 3.8, 1.2] },
  { pos: [-2.0, 0, -2.0], sz: [0.9, 2.6, 0.9] },
  { pos: [2.0, 0, 2.5], sz: [1.5, 3.2, 1.2] },
];

function FloatingGem({ hex, hovered }: { hex: string; hovered: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, delta }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.014 * delta * 60;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.22;
      coreRef.current.position.y = 7.8 + Math.sin(t * 0.9) * 0.38;
      (
        coreRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity =
        (hovered ? 1.3 : 0.5) + Math.sin(t * 2) * 0.22;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.01 * delta * 60;
      ring1Ref.current.position.y = 7.8 + Math.sin(t * 0.9) * 0.38;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += 0.007 * delta * 60;
      ring2Ref.current.position.y = 7.8 + Math.sin(t * 0.9) * 0.38;
    }
  });
  return (
    <group>
      <mesh ref={coreRef} position={[0, 7.8, 0]}>
        <octahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={0.7}
          metalness={0.92}
          roughness={0.04}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh ref={ring1Ref} position={[0, 7.8, 0]}>
        <torusGeometry args={[1.45, 0.055, 8, 52]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={0.5}
          metalness={0.92}
          roughness={0.06}
        />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 7.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.038, 8, 52]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

function NexDesignDistrict({
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const d = DISTRICTS[2];
  const gRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (gRef.current)
      gRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.35 + 2) * 0.05;
  });
  return (
    <group
      ref={gRef}
      position={d.center}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {ND_B.map((b, i) => (
        <group key={i}>
          <Build
            pos={b.pos}
            sz={b.sz}
            hex={d.hex}
            em={d.hexEm}
            hovered={hovered}
            pulse={i * 1.05}
          />
          <BuildWire pos={b.pos} sz={b.sz} hex={d.hexSec} />
        </group>
      ))}
      <FloatingGem hex={d.hex} hovered={hovered} />
      <DistrictGround hex={d.hex} hovered={hovered} />
      <pointLight position={[0, 9, 0]} color={d.hex} intensity={hovered ? 2.5 : 0.8} distance={16} decay={2} />
      <DistrictLabel
        label={d.label}
        tagline={d.tagline}
        hex={d.hex}
        hexSec={d.hexSec}
        hovered={hovered}
        yPos={11.5}
      />
    </group>
  );
}

/* ================================================================
   NEXBUILD DISTRICT — Orange, SE (10, 0, 10)
   Megastructures, crane, smart construction zone
   ================================================================ */
const NB_B: Array<{
  pos: [number, number, number];
  sz: [number, number, number];
}> = [
  { pos: [0, 0, 0], sz: [2.1, 9.5, 2.1] }, // megastructure
  { pos: [-2.8, 0, 0.5], sz: [1.5, 5.5, 1.5] },
  { pos: [2.8, 0, -0.5], sz: [1.3, 6.5, 1.3] },
  { pos: [0.0, 0, -2.5], sz: [1.2, 4.5, 1.2] },
  { pos: [-2.0, 0, -2.5], sz: [0.9, 3.2, 0.9] },
  { pos: [2.0, 0, 2.5], sz: [1.8, 4.5, 1.8] },
  { pos: [-1.0, 0, 2.8], sz: [0.8, 2.8, 0.8] },
];

function CraneStructure({ hex, hovered }: { hex: string; hovered: boolean }) {
  const armRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (armRef.current) {
      (armRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        (hovered ? 0.9 : 0.35) + Math.sin(clock.elapsedTime * 2) * 0.12;
    }
  });
  return (
    <group position={[3.8, 0, -3.8]}>
      {/* vertical pole */}
      <mesh position={[0, 3.8, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 7.5, 6]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      {/* horizontal arm */}
      <mesh ref={armRef} position={[1.3, 7.5, 0]}>
        <boxGeometry args={[3.0, 0.14, 0.14]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={0.4}
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      {/* dangling cable */}
      <mesh position={[2.6, 6.8, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.5, 4]} />
        <meshStandardMaterial
          color={hex}
          emissive={hex}
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
}

function NexBuildDistrict({
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const d = DISTRICTS[3];
  const gRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (gRef.current)
      gRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.3 + 3) * 0.05;
  });
  return (
    <group
      ref={gRef}
      position={d.center}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {NB_B.map((b, i) => (
        <group key={i}>
          <Build
            pos={b.pos}
            sz={b.sz}
            hex={d.hex}
            em={d.hexEm}
            hovered={hovered}
            pulse={i * 0.78}
          />
          <BuildWire pos={b.pos} sz={b.sz} hex={d.hexSec} />
        </group>
      ))}
      <CraneStructure hex={d.hex} hovered={hovered} />
      <DistrictGround hex={d.hex} hovered={hovered} radius={6.5} />
      <pointLight position={[0, 11, 0]} color={d.hex} intensity={hovered ? 2.5 : 0.8} distance={18} decay={2} />
      <DistrictLabel
        label={d.label}
        tagline={d.tagline}
        hex={d.hex}
        hexSec={d.hexSec}
        hovered={hovered}
        yPos={13}
      />
    </group>
  );
}

/* ================================================================
   DRONE FLEET — 14 drones orbiting the city
   ================================================================ */
const DRONE_DATA = Array.from({ length: 6 }, (_, i) => ({
  radius: 3 + (i % 4) * 3.5,
  height: 7.5 + (i % 5) * 2.5,
  speed: 0.22 + (i % 3) * 0.14,
  offset: (i * Math.PI * 2) / 14,
  cx: ((i % 4) - 1.5) * 7,
  cz: (Math.floor(i / 4) - 1) * 7,
  bob: 0.75 + (i % 3) * 0.38,
  bobOff: i * 0.4,
}));

function Drone({ d }: { d: (typeof DRONE_DATA)[0] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * d.speed + d.offset;
    ref.current.position.set(
      d.cx + Math.cos(t) * d.radius,
      d.height + Math.sin(clock.elapsedTime * d.bob + d.bobOff) * 0.55,
      d.cz + Math.sin(t) * d.radius
    );
    ref.current.rotation.y = -t + Math.PI;
  });
  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* pointLight removed — emissiveIntensity handles the glow at zero GPU cost */}
    </group>
  );
}

/* ================================================================
   VEHICLE TRAFFIC — tiny vehicles along road grid
   ================================================================ */
const VEH_DATA = [
  { axis: "z" as const, track: 0.45, from: -18, to: 18, speed: 2.5, off: 0 },
  { axis: "z" as const, track: -0.45, from: 18, to: -18, speed: 2.0, off: 5 },
  { axis: "x" as const, track: 0.45, from: -18, to: 18, speed: 3.0, off: 2 },
  { axis: "x" as const, track: -0.45, from: 18, to: -18, speed: 2.2, off: 8 },
  { axis: "z" as const, track: -5.4, from: -12, to: 0, speed: 1.8, off: 3 },
  { axis: "z" as const, track: 5.4, from: 0, to: 12, speed: 2.3, off: 1 },
  { axis: "x" as const, track: 5.4, from: 12, to: -12, speed: 1.6, off: 6 },
  { axis: "x" as const, track: -5.4, from: -10, to: 10, speed: 2.7, off: 4 },
];

function Vehicle({ d }: { d: (typeof VEH_DATA)[0] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const range = Math.abs(d.to - d.from);
    const t = ((clock.elapsedTime * d.speed + d.off) % range) / range;
    const pos = d.from + (d.to - d.from) * t;
    if (d.axis === "z") ref.current.position.set(d.track, 0.15, pos);
    else ref.current.position.set(pos, 0.15, d.track);
  });
  return (
    <mesh ref={ref} position={[0, 0.15, 0]}>
      <boxGeometry args={[0.35, 0.17, 0.65]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

/* ================================================================
   DATA PACKET NETWORK — glowing orbs flying along connection lines
   ================================================================ */
const CONNECTIONS: Array<{
  s: [number, number, number];
  e: [number, number, number];
  col: string;
  speed: number;
  off: number;
}> = [
  { s: [-10, 3.5, -10], e: [10, 3.5, -10], col: "#2563eb", speed: 0.38, off: 0 },
  { s: [-10, 3.5, -10], e: [-10, 3.5, 10], col: "#7c3aed", speed: 0.32, off: 2 },
  { s: [10, 3.5, -10], e: [10, 3.5, 10], col: "#ea580c", speed: 0.42, off: 4 },
  { s: [-10, 3.5, 10], e: [10, 3.5, 10], col: "#06b6d4", speed: 0.36, off: 6 },
  { s: [-10, 5.5, -10], e: [0, 3.2, 0], col: "#2563eb", speed: 0.48, off: 1 },
  { s: [10, 5.5, -10], e: [0, 3.2, 0], col: "#06b6d4", speed: 0.44, off: 3 },
  { s: [-10, 5.5, 10], e: [0, 3.2, 0], col: "#7c3aed", speed: 0.4, off: 5 },
  { s: [10, 5.5, 10], e: [0, 3.2, 0], col: "#ea580c", speed: 0.5, off: 7 },
  { s: [-10, 4.5, -10], e: [10, 4.5, 10], col: "#00f5ff", speed: 0.28, off: 0.5 },
  { s: [10, 4.5, -10], e: [-10, 4.5, 10], col: "#00f5ff", speed: 0.3, off: 2.5 },
  { s: [-10, 3.5, -10], e: [10, 3.5, 10], col: "#ffffff", speed: 0.25, off: 1.5 },
];

function DataPacket({
  sv,
  ev,
  col,
  speed,
  off,
}: {
  sv: THREE.Vector3;
  ev: THREE.Vector3;
  col: string;
  speed: number;
  off: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const tmp = useRef(new THREE.Vector3());
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * speed + off) % 1 + 1) % 1;
    tmp.current.lerpVectors(sv, ev, t);
    ref.current.position.copy(tmp.current);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.9 + Math.sin(clock.elapsedTime * 4 + off) * 0.18;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 5, 5]} />
      <meshStandardMaterial
        color={col}
        emissive={col}
        emissiveIntensity={1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function DataNetwork() {
  const conns = useMemo(
    () =>
      CONNECTIONS.map((c) => ({
        ...c,
        sv: new THREE.Vector3(...c.s),
        ev: new THREE.Vector3(...c.e),
      })),
    []
  );
  return (
    <group>
      {conns.map((c, i) => (
        <group key={i}>
          <Line
            points={[c.s, c.e]}
            color={c.col}
            lineWidth={0.5}
            transparent
            opacity={0.22}
          />
          <DataPacket
            sv={c.sv}
            ev={c.ev}
            col={c.col}
            speed={c.speed}
            off={c.off}
          />
        </group>
      ))}
    </group>
  );
}

/* ================================================================
   PARTICLE FIELD — rising digital mist
   ================================================================ */
const PARTICLE_COUNT = 420; // reduced from 900 — maintains visual, halves GPU buffer writes

function Particles() {
  const { positions } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (sr(i * 3) - 0.5) * 55;
      positions[i * 3 + 1] = sr(i * 3 + 1) * 22;
      positions[i * 3 + 2] = (sr(i * 3 + 2) - 0.5) * 55;
    }
    return { positions };
  }, []);

  const attrRef = useRef<THREE.BufferAttribute>(null);

  useFrame(({ delta }) => {
    if (!attrRef.current) return;
    const arr = attrRef.current.array as Float32Array;
    const rise = 0.006 * delta * 60;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += rise;
      if (arr[i * 3 + 1] > 22) arr[i * 3 + 1] = 0;
    }
    attrRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.065}
        transparent
        opacity={0.24}
        sizeAttenuation
      />
    </points>
  );
}

/* ================================================================
   GROUND & ROADS
   ================================================================ */
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial
          color="#010810"
          metalness={0.5}
          roughness={0.82}
        />
      </mesh>
      {/* E-W road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[65, 1.15]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.11}
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* N-S road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.15, 65]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.11}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

/* ================================================================
   CITY CENTER HUB — pulsing NEXGIGA core
   ================================================================ */
function CenterHub() {
  const coreRef = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  useFrame(({ clock, delta }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.018 * delta * 60;
      coreRef.current.rotation.x += 0.009 * delta * 60;
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.95 + Math.sin(t * 2.5) * 0.3;
    }
    if (r1.current) r1.current.rotation.y += 0.009 * delta * 60;
    if (r2.current) r2.current.rotation.z += 0.006 * delta * 60;
    if (r3.current) {
      r3.current.rotation.x += 0.004 * delta * 60;
      r3.current.rotation.y -= 0.003 * delta * 60;
    }
  });
  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.88, 1]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.1}
          metalness={0.96}
          roughness={0.02}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={r1}>
        <torusGeometry args={[2.1, 0.055, 8, 72]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.72}
          metalness={0.95}
          roughness={0.04}
        />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.9, 0.04, 8, 72]} />
        <meshStandardMaterial
          color="#0066ff"
          emissive="#0066ff"
          emissiveIntensity={0.52}
          metalness={0.9}
          roughness={0.08}
          transparent
          opacity={0.82}
        />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.028, 8, 72]} />
        <meshStandardMaterial
          color="#7b2fff"
          emissive="#7b2fff"
          emissiveIntensity={0.42}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 48]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.28}
          transparent
          opacity={0.1}
        />
      </mesh>
      <pointLight color="#00f5ff" intensity={3} distance={20} decay={2} />
    </group>
  );
}

/* ================================================================
   BACKGROUND CITY — distant low-detail buildings
   ================================================================ */
function BackgroundCity() {
  const buildings = useMemo(() => {
    const arr: Array<{
      pos: [number, number, number];
      sz: [number, number, number];
    }> = [];
    let seed = 17;
    for (let x = -30; x <= 30; x += 3.6) {
      for (let z = -30; z <= 30; z += 3.6) {
        if (Math.abs(x) < 9 && Math.abs(z) < 9) continue;
        seed++;
        if (sr(seed) < 0.32) continue;
        seed++;
        const h = 0.5 + sr(seed) * 3.2;
        seed++;
        const w = 0.4 + sr(seed) * 0.85;
        seed++;
        const ox = (sr(seed) - 0.5) * 0.8;
        seed++;
        const oz = (sr(seed) - 0.5) * 0.8;
        arr.push({
          pos: [x + ox, 0, z + oz],
          sz: [w, h, w],
        });
      }
    }
    return arr;
  }, []);
  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.pos[0], b.sz[1] / 2, b.pos[2]]}>
          <boxGeometry args={b.sz} />
          {/* meshLambertMaterial: no specular/PBR calculation — ~40% cheaper for bg geometry */}
          <meshLambertMaterial
            color="#010e1c"
            emissive="#001120"
            emissiveIntensity={0.2}
            transparent
            opacity={0.58}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================
   CAMERA RIG — handles hover zoom, fly-through, scroll orbit
   ================================================================ */
interface CamRigProps {
  hovRef: React.MutableRefObject<string | null>;
  flyRef: React.MutableRefObject<string | null>;
  scrollRef: React.MutableRefObject<number>;
  flyDoneRef: React.MutableRefObject<boolean>;
  onFlyDone: () => void;
}

function CameraRig({
  hovRef,
  flyRef,
  scrollRef,
  flyDoneRef,
  onFlyDone,
}: CamRigProps) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(0, 22, 33));
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const tp = useRef(new THREE.Vector3());
  const tl = useRef(new THREE.Vector3());
  const inited = useRef(false);

  if (!inited.current) {
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
    inited.current = true;
  }

  useFrame(({ delta }) => {
    const fly    = flyRef.current;
    const hov    = hovRef.current;
    const scroll = scrollRef.current;

    if (fly) {
      const d = DISTRICTS.find((d) => d.id === fly);
      if (d) {
        tp.current.set(...d.camPos);
        tl.current.set(...d.camLook);
        pos.current.lerp(tp.current, 0.026);
        look.current.lerp(tl.current, 0.030);
        if (
          !flyDoneRef.current &&
          pos.current.distanceTo(tp.current) < 0.9
        ) {
          flyDoneRef.current = true;
          onFlyDone();
        }
      }
    } else if (hov) {
      flyDoneRef.current = false;
      const d = DISTRICTS.find((d) => d.id === hov);
      if (d) {
        const partial = new THREE.Vector3(...d.camPos).multiplyScalar(0.62);
        partial.y = Math.max(15, partial.y);
        tl.current.set(...d.camLook);
        pos.current.lerp(partial, 0.048);
        look.current.lerp(tl.current, 0.055);
      }
    } else {
      flyDoneRef.current = false;
      // Scroll-driven orbit
      const angle  = scroll * Math.PI * 1.5;
      const radius = 33 - scroll * 5;
      const height = 22 - scroll * 6;
      tp.current.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
      tl.current.set(0, scroll * 2, 0);
      pos.current.lerp(tp.current, 0.022);
      look.current.lerp(tl.current, 0.028);
    }

    // Early exit if camera barely moved — avoids matrix recalculation
    const moved = camera.position.distanceToSquared(pos.current);
    if (moved < 0.00001 && !fly && !hov) return;

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}

/* ================================================================
   FULL CITY SCENE
   ================================================================ */
interface SceneProps {
  hovRef: React.MutableRefObject<string | null>;
  flyRef: React.MutableRefObject<string | null>;
  scrollRef: React.MutableRefObject<number>;
  flyDoneRef: React.MutableRefObject<boolean>;
  onHover: (id: string | null) => void;
  onClickDist: (id: string) => void;
  onFlyDone: () => void;
  reducedMotion?: boolean;
}

function CityScene({
  hovRef,
  flyRef,
  scrollRef,
  flyDoneRef,
  onHover,
  onClickDist,
  onFlyDone,
  reducedMotion = false,
}: SceneProps) {
  const [hov, setHov] = useState<string | null>(null);

  const enter = useCallback(
    (id: string) => {
      setHov(id);
      hovRef.current = id;
      onHover(id);
    },
    [hovRef, onHover]
  );

  const leave = useCallback(() => {
    setHov(null);
    hovRef.current = null;
    onHover(null);
  }, [hovRef, onHover]);

  return (
    <>
      <fog attach="fog" args={["#010508", 30, 68]} />
      <ambientLight intensity={0.11} color="#001428" />
      <directionalLight
        position={[0, 28, 0]}
        intensity={0.22}
        color="#002255"
      />

      <Ground />
      <BackgroundCity />
      <CenterHub />
      <Particles />

      {DRONE_DATA.map((d, i) => (
        <Drone key={i} d={d} />
      ))}
      {VEH_DATA.map((d, i) => (
        <Vehicle key={i} d={d} />
      ))}
      <DataNetwork />

      <NexForceDistrict
        hovered={hov === "nexforce"}
        onEnter={() => enter("nexforce")}
        onLeave={leave}
        onClick={() => onClickDist("nexforce")}
      />
      <NexTechDistrict
        hovered={hov === "nextech"}
        onEnter={() => enter("nextech")}
        onLeave={leave}
        onClick={() => onClickDist("nextech")}
      />
      <NexDesignDistrict
        hovered={hov === "nexdesign"}
        onEnter={() => enter("nexdesign")}
        onLeave={leave}
        onClick={() => onClickDist("nexdesign")}
      />
      <NexBuildDistrict
        hovered={hov === "nexbuild"}
        onEnter={() => enter("nexbuild")}
        onLeave={leave}
        onClick={() => onClickDist("nexbuild")}
      />

      <CameraRig
        hovRef={hovRef}
        flyRef={flyRef}
        scrollRef={scrollRef}
        flyDoneRef={flyDoneRef}
        onFlyDone={onFlyDone}
      />
    </>
  );
}

/* ================================================================
   HTML UI — MINIMAP
   ================================================================ */
function Minimap({
  hovered,
  active,
}: {
  hovered: string | null;
  active: string | null;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "76px",
        right: "20px",
        width: "142px",
        height: "152px",
        background: "rgba(1,5,8,0.93)",
        border: "1px solid rgba(0,245,255,0.18)",
        borderRadius: "10px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 20,
        padding: "10px",
        boxShadow:
          "0 0 30px rgba(0,245,255,0.07), inset 0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          fontSize: "7.5px",
          color: "rgba(0,245,255,0.45)",
          letterSpacing: "2.5px",
          marginBottom: "8px",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          textTransform: "uppercase",
        }}
      >
        District Map
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px",
          width: "100%",
        }}
      >
        {DISTRICTS.map((d) => {
          const isOn = hovered === d.id || active === d.id;
          return (
            <div
              key={d.id}
              style={{
                background: isOn ? `${d.hex}28` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isOn ? d.hex + "88" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "5px",
                padding: "6px 4px",
                textAlign: "center",
                fontSize: "7px",
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                letterSpacing: "0.8px",
                color: isOn ? d.hexSec : "rgba(255,255,255,0.22)",
                transition: "all 0.35s ease",
                boxShadow: isOn ? `0 0 10px ${d.rgba}` : "none",
                textTransform: "uppercase",
              }}
            >
              {d.label.replace("NEX", "")}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8px",
          gap: "5px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#00f5ff",
            boxShadow: "0 0 8px #00f5ff",
          }}
        />
        <span
          style={{
            fontSize: "7px",
            color: "rgba(0,245,255,0.45)",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            letterSpacing: "1px",
          }}
        >
          NEXGIGA HQ
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   HTML UI — LIVE METRICS PANEL
   ================================================================ */
function LiveMetrics() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const started = useRef(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const targets = METRICS.map((m) => m.target);
          const start = Date.now();
          const durations = [1900, 1700, 2300, 2100];
          const tick = () => {
            const elapsed = Date.now() - start;
            const nc = targets.map((t, i) => {
              const p = Math.min(1, elapsed / durations[i]);
              return Math.floor((1 - Math.pow(1 - p, 3)) * t);
            });
            setCounts(nc);
            if (elapsed < Math.max(...durations))
              requestAnimationFrame(tick);
            else setCounts(targets);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        position: "absolute",
        bottom: "56px",
        left: "20px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        gap: "7px",
      }}
    >
      {METRICS.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.18 + 0.4, duration: 0.5 }}
          style={{
            background: "rgba(1,5,8,0.9)",
            border: "1px solid rgba(0,245,255,0.11)",
            borderRadius: "7px",
            padding: "7px 13px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              "0 0 18px rgba(0,245,255,0.04), inset 0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          <m.Icon
            size={13}
            color="#00f5ff"
            strokeWidth={1.5}
          />
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#00f5ff",
                fontFamily:
                  "var(--font-display, 'Rajdhani', sans-serif)",
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              {counts[i].toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "7.5px",
                color: "rgba(255,255,255,0.32)",
                fontFamily:
                  "var(--font-mono, 'JetBrains Mono', monospace)",
                letterSpacing: "1.5px",
                marginTop: "1px",
                textTransform: "uppercase",
              }}
            >
              {m.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================================================================
   HTML UI — DISTRICT FULL-SCREEN OVERLAY MODAL
   ================================================================ */
function DistrictOverlay({
  district,
  onClose,
}: {
  district: DistrictDef | null;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleCTA = useCallback(() => {
    onClose();
    setTimeout(() => {
      if (district?.external) window.open(district.href, "_blank");
      else if (district) router.push(district.href);
    }, 320);
  }, [district, onClose, router]);

  return (
    <AnimatePresence>
      {district && (
        <motion.div
          key="overlay-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38 }}
          style={{
            position: "fixed",
            inset: 0,
            background: `linear-gradient(135deg, rgba(0,0,0,0.88) 0%, ${district.rgba.replace(
              "0.6",
              "0.12"
            )} 100%)`,
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
          onClick={onClose}
        >
          <motion.div
            key="overlay-panel"
            initial={{ scale: 0.82, y: 35, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.82, y: 35, opacity: 0 }}
            transition={{
              duration: 0.42,
              type: "spring",
              damping: 22,
              stiffness: 180,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(1,5,8,0.97)",
              border: `1px solid ${district.hex}55`,
              borderRadius: "18px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "38px 36px 36px",
              position: "relative",
              boxShadow: `0 0 90px ${district.rgba.replace(
                "0.6",
                "0.22"
              )}, 0 0 220px ${district.rgba.replace("0.6", "0.1")}`,
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${district.hex}, ${district.hexSec}, transparent)`,
                borderRadius: "18px 18px 0 0",
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} />
            </button>

            {/* Wing icon badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.14, type: "spring" }}
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${district.hex}28, ${district.hexSec}10)`,
                border: `1px solid ${district.hex}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
                boxShadow: `0 0 26px ${district.rgba}`,
              }}
            >
              <district.Icon
                size={26}
                color={district.hexSec}
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Label pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: `${district.hex}12`,
                border: `1px solid ${district.hex}30`,
                borderRadius: "100px",
                padding: "3px 14px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: district.hexSec,
                  boxShadow: `0 0 6px ${district.hex}`,
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  color: district.hexSec,
                  letterSpacing: "2px",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  textTransform: "uppercase",
                }}
              >
                NexGiga Wing
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 42px)",
                fontWeight: 700,
                fontFamily:
                  "var(--font-display, 'Rajdhani', sans-serif)",
                letterSpacing: "3px",
                marginBottom: "6px",
                background: `linear-gradient(135deg, #ffffff, ${district.hexSec})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              {district.label}
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: district.hexSec,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                letterSpacing: "2.5px",
                marginBottom: "18px",
                opacity: 0.78,
              }}
            >
              {district.tagline}
            </p>
            <p
              style={{
                fontSize: "14.5px",
                color: "rgba(255,255,255,0.52)",
                lineHeight: 1.78,
                marginBottom: "28px",
              }}
            >
              {district.description}
            </p>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                marginBottom: "26px",
              }}
            >
              {district.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.08 }}
                  style={{
                    background: `${district.hex}10`,
                    border: `1px solid ${district.hex}25`,
                    borderRadius: "9px",
                    padding: "14px 15px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "23px",
                      fontWeight: 700,
                      color: district.hexSec,
                      fontFamily:
                        "var(--font-display, 'Rajdhani', sans-serif)",
                      letterSpacing: "1px",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "8.5px",
                      color: "rgba(255,255,255,0.32)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      letterSpacing: "1.5px",
                      marginTop: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Capabilities */}
            <div style={{ marginBottom: "22px" }}>
              <h3
                style={{
                  fontSize: "9.5px",
                  letterSpacing: "2.5px",
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Key Capabilities
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {district.capabilities.map((cap) => (
                  <span
                    key={cap}
                    style={{
                      background: `${district.hex}15`,
                      border: `1px solid ${district.hex}35`,
                      color: district.hexSec,
                      fontSize: "11px",
                      padding: "4px 13px",
                      borderRadius: "100px",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      letterSpacing: "0.4px",
                      opacity: 0.9,
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontSize: "9.5px",
                  letterSpacing: "2.5px",
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Technologies
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {district.techs.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.42)",
                      fontSize: "10px",
                      padding: "3px 11px",
                      borderRadius: "4px",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              onClick={handleCTA}
              style={{
                width: "100%",
                padding: "15px 24px",
                background: `linear-gradient(135deg, ${district.hex}, ${district.hexEm})`,
                border: "none",
                borderRadius: "9px",
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-display, 'Rajdhani', sans-serif)",
                letterSpacing: "2.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textTransform: "uppercase",
                boxShadow: `0 6px 26px ${district.rgba}, 0 0 0 1px ${district.hex}45`,
              }}
            >
              Explore {district.label}
              {district.external ? (
                <ExternalLink size={15} />
              ) : (
                <ChevronRight size={15} />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   HTML UI — SECTION HEADER
   ================================================================ */
function SectionHeader() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "56px 20px 0",
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0,245,255,0.04)",
          border: "1px solid rgba(0,245,255,0.14)",
          borderRadius: "100px",
          padding: "6px 18px",
          marginBottom: "22px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#00f5ff",
            boxShadow: "0 0 8px #00f5ff",
          }}
        />
        <span
          style={{
            fontSize: "10.5px",
            color: "rgba(0,245,255,0.78)",
            letterSpacing: "3px",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            textTransform: "uppercase",
          }}
        >
          Digital Twin City Navigation
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, delay: 0.08 }}
        style={{
          fontSize: "clamp(26px, 4.5vw, 52px)",
          fontWeight: 700,
          color: "white",
          fontFamily: "var(--font-display, 'Rajdhani', sans-serif)",
          letterSpacing: "2px",
          lineHeight: 1.08,
          marginBottom: "10px",
        }}
      >
        Explore the
        <span
          style={{
            display: "block",
            background: "linear-gradient(135deg, #00f5ff, #0066ff, #7b2fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NexGiga Ecosystem
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.18 }}
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.38)",
          maxWidth: "420px",
          margin: "0 auto 10px",
          lineHeight: 1.55,
        }}
      >
        Four intelligent districts. One connected ecosystem.
        Hover to illuminate. Click to enter.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35 }}
        style={{
          fontSize: "9.5px",
          color: "rgba(0,245,255,0.38)",
          letterSpacing: "2.5px",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          paddingBottom: "18px",
          textTransform: "uppercase",
        }}
      >
        ↕ Scroll to Orbit · Hover to Zoom · Click to Enter
      </motion.p>
    </div>
  );
}

/* ================================================================
   LOADING PLACEHOLDER
   ================================================================ */
function LoadingCity() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#010508",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          border: "2px solid rgba(0,245,255,0.08)",
          borderTopColor: "#00f5ff",
          borderRadius: "50%",
          animation: "dtc-spin 1s linear infinite",
        }}
      />
      <p
        style={{
          color: "rgba(0,245,255,0.4)",
          fontSize: "10px",
          letterSpacing: "3px",
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
        }}
      >
        Initializing City
      </p>
    </div>
  );
}

/* ================================================================
   MOBILE FALLBACK — 2×2 district cards
   ================================================================ */
function MobileFallback({
  onDistrictClick,
}: {
  onDistrictClick: (d: DistrictDef) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background: "#010508",
        gap: "16px",
      }}
    >
      <p
        style={{
          fontSize: "9.5px",
          color: "rgba(0,245,255,0.4)",
          letterSpacing: "2.5px",
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        Select a district
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          width: "100%",
          maxWidth: "440px",
        }}
      >
        {DISTRICTS.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onDistrictClick(d)}
            style={{
              background: `linear-gradient(135deg, ${d.hex}18, ${d.hexEm}0a)`,
              border: `1px solid ${d.hex}45`,
              borderRadius: "14px",
              padding: "22px 16px",
              cursor: "pointer",
              textAlign: "left",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: `0 0 22px ${d.rgba.replace("0.6", "0.14")}`,
            }}
          >
            <d.Icon size={22} color={d.hexSec} strokeWidth={1.5} />
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "white",
                  fontFamily:
                    "var(--font-display, 'Rajdhani', sans-serif)",
                  letterSpacing: "2px",
                  marginBottom: "3px",
                }}
              >
                {d.label}
              </div>
              <div
                style={{
                  fontSize: "8.5px",
                  color: d.hexSec,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  letterSpacing: "1.5px",
                  opacity: 0.7,
                }}
              >
                {d.tagline}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN EXPORT — DigitalTwinCity
   ================================================================ */
export default function DigitalTwinCity() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const hovRef = useRef<string | null>(null);
  const flyRef = useRef<string | null>(null);
  const flyDoneRef = useRef(false);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [flyingToId, setFlyingToId] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<DistrictDef | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [inTransit, setInTransit] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Reduced-motion detection (WCAG 2.1 SC 2.3.3)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll progress for camera orbit
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total =
        sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      scrollRef.current = Math.min(1, scrolled / Math.max(total, 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const handleClickDistrict = useCallback(
    (id: string) => {
      if (inTransit || flyingToId) return;
      flyDoneRef.current = false;
      flyRef.current = id;
      setFlyingToId(id);
      setInTransit(true);
    },
    [inTransit, flyingToId]
  );

  const handleFlyDone = useCallback(() => {
    const d = DISTRICTS.find((d) => d.id === flyRef.current);
    if (d) setActiveDistrict(d);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setActiveDistrict(null);
    flyRef.current = null;
    setFlyingToId(null);
    setInTransit(false);
  }, []);

  const handleMobileClick = useCallback((d: DistrictDef) => {
    setActiveDistrict(d);
  }, []);

  const flashDistrict = DISTRICTS.find((d) => d.id === flyingToId);

  return (
    <section
      ref={sectionRef}
      id="digital-twin-city"
      aria-label="NexGiga Digital Twin City Navigation"
      style={{
        position: "relative",
        minHeight: "120vh",
        background:
          "linear-gradient(180deg, #010508 0%, #020c18 22%, #010a16 75%, #010508 100%)",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric district glows */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      >
        <div style={{ position: "absolute", top: "18%", left: "8%", width: "520px", height: "520px", background: "rgba(37,99,235,0.035)", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", top: "12%", right: "6%", width: "460px", height: "460px", background: "rgba(6,182,212,0.035)", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "18%", left: "6%", width: "420px", height: "420px", background: "rgba(124,58,237,0.035)", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "12%", right: "8%", width: "480px", height: "480px", background: "rgba(234,88,12,0.035)", borderRadius: "50%", filter: "blur(90px)" }} />
        {/* Center hub glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "380px", height: "380px", background: "rgba(0,245,255,0.025)", borderRadius: "50%", filter: "blur(70px)" }} />
      </div>

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.018) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Section header text */}
      <SectionHeader />

      {/* ── Keyboard / Screen-reader navigation for 3D districts ─────────────
           These buttons are visually hidden but fully keyboard-focusable.
           They trigger the same fly-through logic as mouse clicks on the 3D
           canvas, making the core interaction WCAG AA compliant.             */}
      <div
        role="navigation"
        aria-label="Navigate to NexGiga districts"
        style={{ position: "absolute", top: "50%", left: 0, zIndex: 20 }}
      >
        {DISTRICTS.map((d) => (
          <button
            key={d.id}
            className="sr-only"
            onClick={() => handleClickDistrict(d.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClickDistrict(d.id);
              }
            }}
            aria-label={`Explore ${d.name} — ${d.tagline}`}
          >
            {d.name}: {d.tagline}
          </button>
        ))}
      </div>

      {/* ── Sticky 3D viewport ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          zIndex: 5,
        }}
      >
        {!isMobile ? (
          <Suspense fallback={<LoadingCity />}>
            <Canvas
              camera={{ position: [0, 22, 33], fov: 50 }}
              gl={{
                antialias: typeof window !== "undefined" ? window.devicePixelRatio <= 1 : true,
                alpha: false,
                powerPreference: "high-performance",
                stencil: false,        // not using stencil buffer — saves VRAM
                depth: true,
              }}
              style={{
                background: "#010508",
                width: "100%",
                height: "100%",
              }}
              dpr={
                typeof window !== "undefined"
                  ? Math.min(window.devicePixelRatio, 1.5)
                  : 1
              }
              performance={{ min: 0.5 }} // R3F adaptive DPR: reduces to 0.5× under load
              onCreated={({ gl, scene }) => {
                return () => {
                  scene.traverse((obj) => {
                    const mesh = obj as THREE.Mesh;
                    if (mesh.geometry) mesh.geometry.dispose();
                    if (mesh.material) {
                      Array.isArray(mesh.material)
                        ? mesh.material.forEach((m: THREE.Material) => m.dispose())
                        : (mesh.material as THREE.Material).dispose();
                    }
                  });
                  gl.dispose();
                };
              }}
            >
              <CityScene
                hovRef={hovRef}
                flyRef={flyRef}
                scrollRef={scrollRef}
                flyDoneRef={flyDoneRef}
                onHover={handleHover}
                onClickDist={handleClickDistrict}
                onFlyDone={handleFlyDone}
                reducedMotion={reducedMotion}
              />
            </Canvas>
          </Suspense>
        ) : (
          <MobileFallback onDistrictClick={handleMobileClick} />
        )}

        {/* Minimap + metrics (desktop only) */}
        {!isMobile && (
          <>
            <Minimap hovered={hoveredId} active={flyingToId} />
            <LiveMetrics />
          </>
        )}

        {/* Hover hint bar */}
        <motion.div
          animate={{ opacity: hoveredId || inTransit ? 0 : 0.48 }}
          transition={{ duration: 0.45 }}
          style={{
            position: "absolute",
            bottom: "22px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "9px",
            color: "rgba(0,245,255,0.5)",
            letterSpacing: "3px",
            fontFamily:
              "var(--font-mono, 'JetBrains Mono', monospace)",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 10,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Hover a district · Click to explore
        </motion.div>

        {/* District name tooltip on hover */}
        <AnimatePresence>
          {hoveredId && !inTransit && (
            <motion.div
              key={hoveredId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.28 }}
              style={{
                position: "absolute",
                bottom: "22px",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                zIndex: 11,
              }}
            >
              {(() => {
                const d = DISTRICTS.find((d) => d.id === hoveredId);
                if (!d) return null;
                return (
                  <div
                    style={{
                      background: "rgba(1,5,8,0.92)",
                      border: `1px solid ${d.hex}55`,
                      borderRadius: "8px",
                      padding: "8px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backdropFilter: "blur(14px)",
                      boxShadow: `0 0 22px ${d.rgba}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <d.Icon size={14} color={d.hexSec} strokeWidth={1.5} />
                    <span
                      style={{
                        color: d.hexSec,
                        fontSize: "12px",
                        fontFamily:
                          "var(--font-display, 'Rajdhani', sans-serif)",
                        fontWeight: 700,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {d.label}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "9px",
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {d.tagline}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "rgba(0,245,255,0.5)",
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                        letterSpacing: "1.5px",
                      }}
                    >
                      · Click to enter
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic transition flash */}
        <AnimatePresence>
          {inTransit && !activeDistrict && flashDistrict && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, times: [0, 0.15, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at center, ${flashDistrict.hex}55 0%, transparent 65%)`,
                pointerEvents: "none",
                zIndex: 8,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* District overlay modal */}
      <DistrictOverlay
        district={activeDistrict}
        onClose={handleCloseOverlay}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes dtc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
