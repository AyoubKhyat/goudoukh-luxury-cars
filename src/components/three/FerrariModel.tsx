"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/ferrari.glb");

export default function FerrariModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/ferrari.glb");

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, 1.1 * 0.7, 0]} rotation={[0, Math.PI / 4, 0]}>
      <primitive object={scene} />
    </group>
  );
}
