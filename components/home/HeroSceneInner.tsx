"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Individual orb ─────────────────────────────────────────────────────────
function Orb({
  position, radius, speed, phaseX, phaseY, color, opacity, metalness,
}: {
  position: [number, number, number];
  radius: number; speed: number; phaseX: number; phaseY: number;
  color: string; opacity: number; metalness: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const lastFrame = useRef(0);

  const geo = useMemo(() => new THREE.SphereGeometry(radius, 20, 20), [radius]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    roughness: 0.15,
    metalness,
    side: THREE.FrontSide,
  }), [color, opacity, metalness]);

  useFrame((state) => {
    // Cap at ~30fps
    if (state.clock.elapsedTime - lastFrame.current < 1 / 30) return;
    lastFrame.current = state.clock.elapsedTime;

    const t = state.clock.elapsedTime;
    mesh.current.position.x = position[0] + Math.sin(t * speed * 0.6 + phaseX) * 0.45;
    mesh.current.position.y = position[1] + Math.sin(t * speed + phaseY) * 0.55;
    mesh.current.position.z = position[2];
    mesh.current.rotation.x = t * speed * 0.08;
    mesh.current.rotation.y = t * speed * 0.12;
    mesh.current.rotation.z = t * speed * 0.05;
  });

  return <mesh ref={mesh} geometry={geo} material={mat} />;
}

// ── Orbiting lights ─────────────────────────────────────────────────────────
function Lights({ isDark }: { isDark: boolean }) {
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);
  const lastFrame = useRef(0);

  const gold = isDark ? "#D4A82C" : "#C09020";
  const rose = isDark ? "#F42870" : "#E80060";

  useFrame((state) => {
    if (state.clock.elapsedTime - lastFrame.current < 1 / 30) return;
    lastFrame.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime * 0.25;
    light1.current.position.set(Math.sin(t) * 6, Math.cos(t * 0.8) * 3, 3);
    light2.current.position.set(Math.cos(t * 1.1) * 5, Math.sin(t * 0.6) * 4, 2);
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.25 : 0.5} color={isDark ? "#EEE4D8" : "#FCF6EF"} />
      <pointLight ref={light1} intensity={isDark ? 2.5 : 1.8} color={gold} distance={12} />
      <pointLight ref={light2} intensity={isDark ? 1.8 : 1.2} color={rose} distance={10} />
    </>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({ isDark }: { isDark: boolean }) {
  const orbs = useMemo(() => {
    const g = isDark ? "#D4A82C" : "#C09020";
    const r = isDark ? "#F42870" : "#E80060";
    const gl = isDark ? "#EAC84A" : "#D8AE38";
    return [
      { position: [-2.8,  0.6, -3.5] as [number,number,number], radius: 1.4, speed: 0.28, phaseX: 0.0, phaseY: 1.1, color: g,  opacity: 0.13, metalness: 0.7 },
      { position: [ 3.2, -0.9, -5.0] as [number,number,number], radius: 1.1, speed: 0.35, phaseX: 1.4, phaseY: 2.3, color: r,  opacity: 0.09, metalness: 0.5 },
      { position: [ 0.4,  2.1, -7.0] as [number,number,number], radius: 2.2, speed: 0.18, phaseX: 0.9, phaseY: 0.5, color: gl, opacity: 0.07, metalness: 0.8 },
      { position: [-1.2, -2.2, -4.0] as [number,number,number], radius: 0.7, speed: 0.48, phaseX: 2.2, phaseY: 3.5, color: g,  opacity: 0.16, metalness: 0.6 },
      { position: [ 1.8,  0.3, -2.5] as [number,number,number], radius: 0.5, speed: 0.55, phaseX: 3.7, phaseY: 0.8, color: r,  opacity: 0.20, metalness: 0.4 },
      { position: [-3.5, -1.5, -6.0] as [number,number,number], radius: 1.7, speed: 0.22, phaseX: 1.8, phaseY: 4.2, color: gl, opacity: 0.06, metalness: 0.9 },
    ];
  }, [isDark]);

  return (
    <>
      <Lights isDark={isDark} />
      {orbs.map((o, i) => <Orb key={i} {...o} />)}
    </>
  );
}

// ── Exported canvas ────────────────────────────────────────────────────────
export default function HeroSceneInner({ isDark }: { isDark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
    >
      <Scene isDark={isDark} />
    </Canvas>
  );
}
