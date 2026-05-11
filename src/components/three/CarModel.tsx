"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CarCategory = "Supercar" | "SUV" | "Sedan" | "Convertible";

interface CarModelProps {
  color?: string;
  category?: CarCategory;
}

/* -------------------------------------------------------------------------- */
/*  Dimension presets per category                                             */
/* -------------------------------------------------------------------------- */

interface CarDimensions {
  bodyLength: number;
  bodyWidth: number;
  bodyHeight: number;
  cabinHeight: number;
  cabinLength: number;
  cabinOffsetY: number;
  wheelRadius: number;
  wheelWidth: number;
  groundClearance: number;
  hasSpoiler: boolean;
  hasRoof: boolean;
  bodyTaperFront: number;
  bodyTaperRear: number;
}

function getDimensions(category: CarCategory): CarDimensions {
  switch (category) {
    case "Supercar":
      return {
        bodyLength: 4.4,
        bodyWidth: 2.0,
        bodyHeight: 0.5,
        cabinHeight: 0.55,
        cabinLength: 1.6,
        cabinOffsetY: 0.42,
        wheelRadius: 0.36,
        wheelWidth: 0.28,
        groundClearance: 0.12,
        hasSpoiler: true,
        hasRoof: true,
        bodyTaperFront: 0.65,
        bodyTaperRear: 0.75,
      };
    case "SUV":
      return {
        bodyLength: 4.6,
        bodyWidth: 2.1,
        bodyHeight: 0.8,
        cabinHeight: 0.75,
        cabinLength: 2.2,
        cabinOffsetY: 0.55,
        wheelRadius: 0.44,
        wheelWidth: 0.3,
        groundClearance: 0.28,
        hasSpoiler: false,
        hasRoof: true,
        bodyTaperFront: 0.8,
        bodyTaperRear: 0.85,
      };
    case "Sedan":
      return {
        bodyLength: 4.6,
        bodyWidth: 1.9,
        bodyHeight: 0.6,
        cabinHeight: 0.65,
        cabinLength: 2.0,
        cabinOffsetY: 0.48,
        wheelRadius: 0.38,
        wheelWidth: 0.26,
        groundClearance: 0.16,
        hasSpoiler: false,
        hasRoof: true,
        bodyTaperFront: 0.7,
        bodyTaperRear: 0.8,
      };
    case "Convertible":
      return {
        bodyLength: 4.2,
        bodyWidth: 1.95,
        bodyHeight: 0.5,
        cabinHeight: 0.35,
        cabinLength: 1.4,
        cabinOffsetY: 0.38,
        wheelRadius: 0.36,
        wheelWidth: 0.28,
        groundClearance: 0.12,
        hasSpoiler: false,
        hasRoof: false,
        bodyTaperFront: 0.65,
        bodyTaperRear: 0.7,
      };
  }
}

/* -------------------------------------------------------------------------- */
/*  Wheel sub-component                                                        */
/* -------------------------------------------------------------------------- */

function Wheel({
  position,
  radius,
  width,
}: {
  position: [number, number, number];
  radius: number;
  width: number;
}) {
  return (
    <group position={position}>
      {/* Tyre */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[radius, radius * 0.3, 12, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.6, radius * 0.6, width * 0.9, 20]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      {/* Hub cap */}
      <mesh position={[width * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.25, radius * 0.25, 0.04, 16]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main CarModel component                                                    */
/* -------------------------------------------------------------------------- */

export default function CarModel({
  color = "#0a0a0a",
  category = "Supercar",
}: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const targetColor = useMemo(() => new THREE.Color(color), [color]);

  const d = useMemo(() => getDimensions(category), [category]);

  /* Auto-rotation */
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    /* Smooth color lerp for color picker transitions */
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, delta * 4);
    }
  });

  /* Vertical offset so the car sits on the ground plane */
  const baseY = d.groundClearance + d.wheelRadius;

  /* Wheel positions */
  const wheelBase = d.bodyLength * 0.35;
  const trackHalf = d.bodyWidth * 0.48;

  /* Body shape via extruded shape for the tapered lower body */
  const bodyShape = useMemo(() => {
    const shape = new THREE.Shape();
    const hl = d.bodyLength / 2;
    const hw = d.bodyWidth / 2;
    const tf = d.bodyTaperFront;
    const tr = d.bodyTaperRear;

    // Start at front-right
    shape.moveTo(hl * tf, hw * 0.85);
    // Front edge
    shape.quadraticCurveTo(hl * 1.02, 0, hl * tf, -hw * 0.85);
    // Right side going to rear
    shape.lineTo(-hl * tr, -hw);
    // Rear edge
    shape.quadraticCurveTo(-hl * 1.02, 0, -hl * tr, hw);
    // Left side back to front
    shape.lineTo(hl * tf, hw * 0.85);

    return shape;
  }, [d]);

  const bodyExtrudeSettings = useMemo(
    () => ({
      depth: d.bodyHeight,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4,
    }),
    [d]
  );

  return (
    <group ref={groupRef}>
      <group position={[0, baseY, 0]}>
        {/* ── Lower body (extruded shape) ─────────────────────────── */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -d.bodyHeight * 0.1, 0]}
        >
          <extrudeGeometry args={[bodyShape, bodyExtrudeSettings]} />
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            metalness={0.85}
            roughness={0.18}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* ── Upper body / hood (slightly narrower flat section) ─── */}
        <mesh position={[d.bodyLength * 0.05, d.bodyHeight * 0.5, 0]}>
          <boxGeometry
            args={[
              d.bodyLength * 0.88,
              d.bodyHeight * 0.25,
              d.bodyWidth * 0.92,
            ]}
          />
          <meshStandardMaterial
            color={color}
            metalness={0.85}
            roughness={0.18}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* ── Cabin / windshield area ─────────────────────────────── */}
        {d.hasRoof ? (
          <mesh position={[-d.bodyLength * 0.06, d.cabinOffsetY + d.cabinHeight * 0.4, 0]}>
            <boxGeometry
              args={[d.cabinLength, d.cabinHeight, d.bodyWidth * 0.82]}
            />
            <meshPhysicalMaterial
              color="#111111"
              metalness={0.3}
              roughness={0.1}
              transparent
              opacity={0.45}
              envMapIntensity={2.0}
            />
          </mesh>
        ) : (
          /* Convertible - low windshield only */
          <mesh
            position={[d.cabinLength * 0.35, d.cabinOffsetY + 0.12, 0]}
            rotation={[0, 0, Math.PI * 0.06]}
          >
            <boxGeometry args={[0.08, d.cabinHeight * 0.6, d.bodyWidth * 0.78]} />
            <meshPhysicalMaterial
              color="#222222"
              metalness={0.3}
              roughness={0.1}
              transparent
              opacity={0.5}
              envMapIntensity={2.0}
            />
          </mesh>
        )}

        {/* ── Front windshield angle accent ───────────────────────── */}
        {d.hasRoof && (
          <mesh
            position={[
              -d.bodyLength * 0.06 + d.cabinLength * 0.52,
              d.cabinOffsetY + d.cabinHeight * 0.2,
              0,
            ]}
            rotation={[0, 0, Math.PI * 0.15]}
          >
            <boxGeometry args={[0.05, d.cabinHeight * 0.7, d.bodyWidth * 0.8]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.4}
              roughness={0.1}
              transparent
              opacity={0.55}
              envMapIntensity={1.5}
            />
          </mesh>
        )}

        {/* ── Headlights ─────────────────────────────────────────── */}
        {[-1, 1].map((side) => (
          <mesh
            key={`headlight-${side}`}
            position={[
              d.bodyLength * 0.44,
              d.bodyHeight * 0.25,
              side * d.bodyWidth * 0.38,
            ]}
          >
            <boxGeometry args={[0.15, 0.08, 0.22]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              metalness={0.1}
              roughness={0.05}
            />
          </mesh>
        ))}

        {/* ── Tail lights ────────────────────────────────────────── */}
        {[-1, 1].map((side) => (
          <mesh
            key={`taillight-${side}`}
            position={[
              -d.bodyLength * 0.48,
              d.bodyHeight * 0.3,
              side * d.bodyWidth * 0.36,
            ]}
          >
            <boxGeometry args={[0.08, 0.07, 0.28]} />
            <meshStandardMaterial
              color="#cc0000"
              emissive="#cc0000"
              emissiveIntensity={0.6}
              metalness={0.1}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* ── Side mirrors ───────────────────────────────────────── */}
        {[-1, 1].map((side) => (
          <group
            key={`mirror-${side}`}
            position={[
              d.cabinLength * 0.2,
              d.cabinOffsetY * 0.8,
              side * (d.bodyWidth * 0.52 + 0.08),
            ]}
          >
            {/* Mirror arm */}
            <mesh>
              <boxGeometry args={[0.14, 0.05, 0.12]} />
              <meshStandardMaterial
                color={color}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>
            {/* Mirror face */}
            <mesh position={[0.02, 0, side * 0.08]}>
              <boxGeometry args={[0.1, 0.07, 0.02]} />
              <meshStandardMaterial
                color="#aaaaaa"
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          </group>
        ))}

        {/* ── Spoiler (supercars only) ───────────────────────────── */}
        {d.hasSpoiler && (
          <group position={[-d.bodyLength * 0.44, d.bodyHeight * 0.7, 0]}>
            {/* Spoiler blade */}
            <mesh>
              <boxGeometry args={[0.3, 0.04, d.bodyWidth * 0.75]} />
              <meshStandardMaterial
                color={color}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>
            {/* Spoiler mounts */}
            {[-1, 1].map((side) => (
              <mesh
                key={`mount-${side}`}
                position={[0.05, -0.12, side * d.bodyWidth * 0.28]}
              >
                <boxGeometry args={[0.06, 0.24, 0.06]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.85}
                  roughness={0.18}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* ── Front splitter accent ──────────────────────────────── */}
        <mesh
          position={[d.bodyLength * 0.47, -d.bodyHeight * 0.15, 0]}
        >
          <boxGeometry args={[0.08, 0.06, d.bodyWidth * 0.85]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>

        {/* ── Rear diffuser accent ───────────────────────────────── */}
        <mesh
          position={[-d.bodyLength * 0.47, -d.bodyHeight * 0.15, 0]}
        >
          <boxGeometry args={[0.08, 0.06, d.bodyWidth * 0.7]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>

        {/* ── Side skirts ────────────────────────────────────────── */}
        {[-1, 1].map((side) => (
          <mesh
            key={`skirt-${side}`}
            position={[0, -d.bodyHeight * 0.2, side * d.bodyWidth * 0.49]}
          >
            <boxGeometry
              args={[d.bodyLength * 0.7, 0.06, 0.06]}
            />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
        ))}

        {/* ── Wheels ─────────────────────────────────────────────── */}
        <Wheel
          position={[wheelBase, -d.bodyHeight * 0.15, trackHalf]}
          radius={d.wheelRadius}
          width={d.wheelWidth}
        />
        <Wheel
          position={[wheelBase, -d.bodyHeight * 0.15, -trackHalf]}
          radius={d.wheelRadius}
          width={d.wheelWidth}
        />
        <Wheel
          position={[-wheelBase, -d.bodyHeight * 0.15, trackHalf]}
          radius={d.wheelRadius}
          width={d.wheelWidth}
        />
        <Wheel
          position={[-wheelBase, -d.bodyHeight * 0.15, -trackHalf]}
          radius={d.wheelRadius}
          width={d.wheelWidth}
        />
      </group>
    </group>
  );
}
