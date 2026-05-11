"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Car } from "@/data/fleet";
import { formatMAD } from "@/lib/utils";
import CarSilhouette from "./CarSilhouette";

interface CarCardProps {
  car: Car;
}

const AVAILABILITY_OPTIONS = ["Available now", "Last unit"] as const;

function getAvailability(id: string): (typeof AVAILABILITY_OPTIONS)[number] {
  // Deterministic based on car id so it doesn't flicker on re-render
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVAILABILITY_OPTIONS[hash % 2];
}

export default function CarCard({ car }: CarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const availability = getAvailability(car.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max rotation of 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const primaryColor = car.colors[0]?.hex ?? "#0a0a0a";

  return (
    <Link href={`/cars/${car.id}`} className="block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-lg border border-[#f2f2f0] bg-white transition-shadow duration-300"
        style={{
          perspective: "800px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3D tilt wrapper */}
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Car visual area */}
          <div
            className="relative flex h-52 items-end justify-center overflow-hidden px-6 pb-2"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}18 0%, ${primaryColor}08 50%, #f8f8f8 100%)`,
            }}
          >
            <div className={`w-full max-w-[280px] transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}>
              <CarSilhouette category={car.category} color={primaryColor} />
            </div>

            {/* Availability badge */}
            <div className="absolute top-3 right-3">
              {availability === "Available now" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff5c00]/10 px-3 py-1 text-xs font-semibold text-[#ff5c00]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5c00] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff5c00]" />
                  </span>
                  Available now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Last unit
                </span>
              )}
            </div>
          </div>

          {/* Card content */}
          <div className="p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-bebas text-xl tracking-wide text-[#0a0a0a]">
                {car.name}
              </h3>
              <span className="shrink-0 rounded bg-[#f2f2f0] px-2 py-0.5 text-xs font-medium text-[#1a1a1a]">
                {car.category}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
              <span>
                0-100:{" "}
                <span className="font-semibold text-[#ff5c00]">
                  {car.zeroToHundred}
                </span>
              </span>
              <span>{car.seats} seats</span>
            </div>

            <div className="flex items-end justify-between border-t border-[#f2f2f0] pt-4">
              <div>
                <span className="text-xs text-gray-400">From</span>
                <p className="font-bebas text-lg tracking-wide text-[#0a0a0a]">
                  {formatMAD(car.pricePerDay)}
                  <span className="ml-1 font-inter text-xs font-normal text-gray-400">
                    / day
                  </span>
                </p>
              </div>

              <span className="text-sm font-medium text-[#ff5c00] transition-transform duration-200 group-hover:translate-x-1">
                View details &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Orange glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: "inset 0 0 0 1.5px #ff5c00, 0 0 20px #ff5c0020",
          }}
        />
      </div>
    </Link>
  );
}
