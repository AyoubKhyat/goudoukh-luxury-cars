"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Car } from "@/data/fleet";
import { formatMAD } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
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
  const { toggleCompare, isComparing } = useCompare();
  const { t } = useLanguage();

  const compared = isComparing(car.id);
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

            {/* Compare button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(car.id);
              }}
              className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
                compared
                  ? "bg-[#ff5c00] text-white shadow-md shadow-[#ff5c00]/25"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-[#ff5c00] backdrop-blur-sm"
              }`}
              title={compared ? t("compare.removeFromCompare") : t("compare.addToCompare")}
            >
              {compared ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 5v10M5 10h10" strokeLinecap="round" />
                </svg>
              )}
              {compared ? t("compare.removeFromCompare") : t("compare.addToCompare")}
            </button>

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
