"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import FerrariModel from "./FerrariModel";

/* -------------------------------------------------------------------------- */
/*  Mouse-parallax rig: tilts the car group based on pointer position          */
/* -------------------------------------------------------------------------- */

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  /* Track mouse position normalised to [-1, 1] */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const speed = 2.5;
    /* Subtle tilt — max ~6 degrees on each axis */
    const targetRotX = mouse.current.y * 0.1;
    const targetRotY = mouse.current.x * 0.12;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      delta * speed
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      delta * speed
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

/* -------------------------------------------------------------------------- */
/*  Inner scene contents (rendered inside <Canvas>)                            */
/* -------------------------------------------------------------------------- */

function SceneContents() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.35} />

      {/* Orange accent lights from two angles */}
      <pointLight
        color="#ff5c00"
        intensity={60}
        position={[4, 3, 2]}
        distance={16}
        decay={2}
      />
      <pointLight
        color="#ff5c00"
        intensity={40}
        position={[-3, 2, -4]}
        distance={14}
        decay={2}
      />

      {/* Soft white key light from above */}
      <directionalLight
        color="#ffffff"
        intensity={1.2}
        position={[2, 8, 3]}
      />

      <ParallaxRig>
        <FerrariModel />
      </ParallaxRig>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={14}
        blur={2.5}
        far={8}
        color="#0a0a0a"
      />

      {/* Hemisphere light for ambient fill and metallic reflections */}
      <hemisphereLight args={["#ffffff", "#444444", 0.6]} />

      {/* Extra directional lights to simulate environment reflections */}
      <directionalLight color="#e8e0d8" intensity={0.5} position={[-5, 3, -3]} />
      <directionalLight color="#d0e0ff" intensity={0.4} position={[3, 1, -5]} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading fallback                                                           */
/* -------------------------------------------------------------------------- */

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
      <span className="font-bebas text-3xl tracking-widest text-white/20 animate-pulse">
        GOUDOUKH
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exported HeroScene component                                               */
/* -------------------------------------------------------------------------- */

export default function HeroScene() {
  const handleCreated = useCallback(
    (state: { gl: THREE.WebGLRenderer }) => {
      /* Tone-mapping for nice metallic look */
      state.gl.toneMapping = THREE.ACESFilmicToneMapping;
      state.gl.toneMappingExposure = 1.1;
    },
    []
  );

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a]">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          camera={{
            position: [5.5, 2.8, 5.5],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          onCreated={handleCreated}
          style={{ background: "#0a0a0a" }}
        >
          <SceneContents />
        </Canvas>
      </Suspense>
    </div>
  );
}
