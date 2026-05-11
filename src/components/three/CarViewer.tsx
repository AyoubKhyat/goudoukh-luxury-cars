"use client";

import { Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import CarModel from "./CarModel";
import type { CarCategory } from "@/data/fleet";

interface CarViewerProps {
  color?: string;
  category?: CarCategory;
}

/* -------------------------------------------------------------------------- */
/*  Inner scene contents                                                       */
/* -------------------------------------------------------------------------- */

function ShowroomScene({
  color,
  category,
}: {
  color: string;
  category: CarCategory;
}) {
  return (
    <>
      {/* Fill */}
      <ambientLight intensity={0.4} />

      {/* Key light — warm white from above-right */}
      <directionalLight
        color="#fff5ee"
        intensity={1.5}
        position={[5, 8, 3]}
        castShadow
      />

      {/* Rim light — orange accent from behind */}
      <pointLight
        color="#ff5c00"
        intensity={30}
        position={[-4, 3, -5]}
        distance={14}
        decay={2}
      />

      {/* Fill light — soft cool from left */}
      <pointLight
        color="#c8d8ff"
        intensity={20}
        position={[3, 2, 5]}
        distance={14}
        decay={2}
      />

      {/* Subtle top-down spot for showroom feel */}
      <spotLight
        color="#ffffff"
        intensity={25}
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        distance={20}
        decay={2}
      />

      <CarModel color={color} category={category} />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={14}
        blur={2.5}
        far={6}
        color="#0a0a0a"
      />

      {/* Hemisphere + directional lights for showroom reflections */}
      <hemisphereLight args={["#ffffff", "#555555", 0.7]} />
      <directionalLight color="#e8e0d8" intensity={0.5} position={[-5, 3, -3]} />
      <directionalLight color="#d0e0ff" intensity={0.4} position={[3, 1, -5]} />

      {/* Orbit controls — auto-rotate, user drag enabled */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.2}
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={14}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading fallback                                                           */
/* -------------------------------------------------------------------------- */

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#ff5c00] border-t-transparent animate-spin" />
        <span className="text-xs tracking-widest text-neutral-400 uppercase">
          Loading 3D Viewer
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exported CarViewer component                                               */
/* -------------------------------------------------------------------------- */

export default function CarViewer({
  color = "#0a0a0a",
  category = "Supercar",
}: CarViewerProps) {
  const handleCreated = useCallback(
    (state: { gl: THREE.WebGLRenderer }) => {
      state.gl.toneMapping = THREE.ACESFilmicToneMapping;
      state.gl.toneMappingExposure = 1.0;
    },
    []
  );

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{
            position: [6, 3, 6],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          onCreated={handleCreated}
          style={{ background: "transparent" }}
        >
          <ShowroomScene color={color} category={category} />
        </Canvas>
      </Suspense>
    </div>
  );
}
