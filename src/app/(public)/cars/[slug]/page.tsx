"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { fleetData } from "@/data/fleet";
import { formatMAD, calculatePrice } from "@/lib/utils";
import { CarViewerProvider } from "@/components/three/ThreeProvider";
import AnimatedLine from "@/components/ui/AnimatedLine";

/* -------------------------------------------------------------------------- */
/*  Availability helper (deterministic per car)                               */
/* -------------------------------------------------------------------------- */
const AVAILABILITY_OPTIONS = ["Available now", "Last unit"] as const;

function getAvailability(id: string): (typeof AVAILABILITY_OPTIONS)[number] {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVAILABILITY_OPTIONS[hash % 2];
}

/* -------------------------------------------------------------------------- */
/*  Engine label helper                                                        */
/* -------------------------------------------------------------------------- */
function getEngineLabel(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("huracan") || lower.includes("huracán")) return "5.2L V10";
  if (lower.includes("f8")) return "3.9L Twin-Turbo V8";
  if (lower.includes("720s")) return "4.0L Twin-Turbo V8";
  if (lower.includes("911")) return "3.0L Twin-Turbo Flat-6";
  if (lower.includes("amg gt")) return "4.0L Biturbo V8";
  if (lower.includes("m8")) return "4.4L Twin-Turbo V8";
  if (lower.includes("s-class")) return "3.0L Inline-6 Turbo";
  if (lower.includes("rs7")) return "4.0L Twin-Turbo V8";
  if (lower.includes("range rover")) return "4.4L Twin-Turbo V8";
  if (lower.includes("bentayga")) return "4.0L Twin-Turbo V8";
  if (lower.includes("cayenne")) return "4.0L Twin-Turbo V8";
  if (lower.includes("dawn")) return "6.6L Twin-Turbo V12";
  return "High-Performance Engine";
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                             */
/* -------------------------------------------------------------------------- */
export default function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const car = fleetData.find((c) => c.id === slug);

  /* ---- state ---- */
  const [selectedColor, setSelectedColor] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [extras, setExtras] = useState({
    insurance: false,
    driver: false,
    childSeat: false,
  });

  /* ---- derived values ---- */
  const days = useMemo(() => {
    if (!pickupDate || !dropoffDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  }, [pickupDate, dropoffDate]);

  const totalPrice = useMemo(() => {
    if (!car || days === 0) return 0;
    return calculatePrice(car.pricePerDay, days, extras);
  }, [car, days, extras]);

  /* ---- Not found ---- */
  if (!car) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <h1 className="font-bebas text-6xl tracking-wide text-[#0a0a0a]">
          Car Not Found
        </h1>
        <p className="mt-4 text-gray-500">
          The vehicle you are looking for does not exist in our fleet.
        </p>
        <Link
          href="/cars"
          className="mt-8 rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#e05200]"
        >
          Back to Fleet
        </Link>
      </section>
    );
  }

  const availability = getAvailability(car.id);
  const activeHex = car.colors[selectedColor]?.hex ?? "#0a0a0a";

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <section className="min-h-screen bg-white pt-20">
      {/* ================================================================== */}
      {/*  TOP: 3D Viewer + Color Picker                                      */}
      {/* ================================================================== */}
      <div className="relative w-full bg-[#f2f2f0]">
        {/* 3D Viewer */}
        <div className="relative mx-auto h-[50vh] w-full max-w-7xl sm:h-[60vh]">
          <CarViewerProvider color={activeHex} category={car.category} />
        </div>

        {/* Color Picker */}
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-6 py-5 lg:px-8">
          {car.colors.map((color, i) => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(i)}
              title={color.name}
              aria-label={`Select ${color.name}`}
              className="group relative flex items-center justify-center"
            >
              <span
                className={`block h-8 w-8 rounded-full border-2 transition-all duration-300 ${
                  selectedColor === i
                    ? "border-[#ff5c00] scale-110"
                    : "border-transparent hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.hex }}
              />
              {/* Outer ring for active */}
              {selectedColor === i && (
                <span className="absolute inset-[-4px] rounded-full border-2 border-[#ff5c00]/40" />
              )}
              {/* Tooltip */}
              <span className="pointer-events-none absolute -bottom-7 whitespace-nowrap rounded bg-[#0a0a0a] px-2 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/*  BOTTOM: Car Info + Booking                                          */}
      {/* ================================================================== */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* ---- Left Column: Car Info (60%) ---- */}
          <div className="lg:w-[60%]">
            {/* Name + Category */}
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="font-bebas text-5xl tracking-wide text-[#0a0a0a] md:text-6xl">
                {car.name}
              </h1>
              <span className="rounded bg-[#f2f2f0] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
                {car.category}
              </span>
            </div>

            <AnimatedLine className="mt-4" delay={100} />

            {/* Description */}
            <p className="mt-6 max-w-xl leading-relaxed text-gray-600">
              {car.description}
            </p>

            {/* Specs Table */}
            <div className="mt-10">
              <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a]">
                Specifications
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* 0-100 */}
                <div className="rounded-lg border border-[#f2f2f0] p-4">
                  <div className="mb-1 h-1 w-8 rounded bg-[#ff5c00]" />
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    0-100 km/h
                  </p>
                  <p className="mt-1 font-bebas text-2xl text-[#0a0a0a]">
                    {car.zeroToHundred}
                  </p>
                </div>

                {/* Top Speed */}
                <div className="rounded-lg border border-[#f2f2f0] p-4">
                  <div className="mb-1 h-1 w-8 rounded bg-[#ff5c00]" />
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Top Speed
                  </p>
                  <p className="mt-1 font-bebas text-2xl text-[#0a0a0a]">
                    {car.topSpeed} km/h
                  </p>
                </div>

                {/* Seats */}
                <div className="rounded-lg border border-[#f2f2f0] p-4">
                  <div className="mb-1 h-1 w-8 rounded bg-[#ff5c00]" />
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Seats
                  </p>
                  <p className="mt-1 font-bebas text-2xl text-[#0a0a0a]">
                    {car.seats}
                  </p>
                </div>

                {/* Engine */}
                <div className="rounded-lg border border-[#f2f2f0] p-4">
                  <div className="mb-1 h-1 w-8 rounded bg-[#ff5c00]" />
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Engine
                  </p>
                  <p className="mt-1 font-bebas text-2xl text-[#0a0a0a]">
                    {getEngineLabel(car.name)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Right Column: Booking Card (40%) ---- */}
          <div className="lg:w-[40%]">
            <div className="sticky top-28 rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-xl shadow-black/5">
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">Starting from</p>
                <p className="font-bebas text-4xl tracking-wide text-[#0a0a0a]">
                  {formatMAD(car.pricePerDay)}
                  <span className="ml-1 font-inter text-base font-normal text-gray-400">
                    /day
                  </span>
                </p>
              </div>

              <AnimatedLine className="mb-6" delay={300} />

              {/* Date Inputs */}
              <div className="mb-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pickup Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    // reset dropoff if it's before new pickup
                    if (dropoffDate && e.target.value > dropoffDate) {
                      setDropoffDate("");
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Dropoff Date
                </label>
                <input
                  type="date"
                  min={pickupDate || todayStr}
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>

              {/* Days Display */}
              {days > 0 && (
                <div className="mb-5 flex items-center justify-between rounded-lg bg-[#f2f2f0] px-4 py-2.5">
                  <span className="text-sm text-gray-500">Rental duration</span>
                  <span className="font-semibold text-[#0a0a0a]">
                    {days} {days === 1 ? "day" : "days"}
                    {days >= 7 && (
                      <span className="ml-2 text-xs font-medium text-[#ff5c00]">
                        -10% applied
                      </span>
                    )}
                  </span>
                </div>
              )}

              <AnimatedLine className="mb-5" delay={400} />

              {/* Extras */}
              <div className="mb-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Extras
                </p>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extras.insurance}
                      onChange={(e) =>
                        setExtras((p) => ({ ...p, insurance: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                    />
                    <span className="text-sm text-[#0a0a0a]">
                      Full Insurance
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    +500 MAD/day
                  </span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extras.driver}
                      onChange={(e) =>
                        setExtras((p) => ({ ...p, driver: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                    />
                    <span className="text-sm text-[#0a0a0a]">
                      Personal Driver
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    +1,200 MAD/day
                  </span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extras.childSeat}
                      onChange={(e) =>
                        setExtras((p) => ({
                          ...p,
                          childSeat: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                    />
                    <span className="text-sm text-[#0a0a0a]">Child Seat</span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    +150 MAD/day
                  </span>
                </label>
              </div>

              {/* Total */}
              {days > 0 && (
                <div className="mb-6 flex items-end justify-between rounded-lg bg-[#0a0a0a] px-5 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Total
                    </p>
                    <p className="font-bebas text-3xl tracking-wide text-[#ff5c00]">
                      {formatMAD(totalPrice)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    for {days} {days === 1 ? "day" : "days"}
                  </p>
                </div>
              )}

              {/* CTA */}
              <Link
                href={`/booking?car=${car.id}`}
                className="block w-full rounded-lg bg-[#ff5c00] py-4 text-center font-bebas text-xl tracking-wider text-white transition-all duration-300 hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20"
              >
                Book This Car
              </Link>

              {/* Availability Badge */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {availability === "Available now" ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Available now
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                    </span>
                    <span className="text-sm font-medium text-amber-600">
                      Last unit
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
