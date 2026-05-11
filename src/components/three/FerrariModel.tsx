"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/ferrari.glb");

export default function FerrariModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/ferrari.glb");

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, 0.77, 0]} rotation={[0, Math.PI / 4, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}
