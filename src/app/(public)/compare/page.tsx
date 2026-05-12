"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
import { fleetData, type Car } from "@/data/fleet";
import { formatMAD } from "@/lib/utils";

/** Parse "3.6s" -> 3.6 for numeric comparison. */
function parseZeroToHundred(value: string): number {
  return parseFloat(value.replace("s", ""));
}

/**
 * Given an array of cars and a getter, return the set of car IDs that have
 * the "best" (lowest or highest) value.
 */
function getBestIds(
  cars: Car[],
  getValue: (c: Car) => number,
  mode: "lowest" | "highest"
): Set<string> {
  if (cars.length === 0) return new Set();
  const values = cars.map(getValue);
  const best = mode === "lowest" ? Math.min(...values) : Math.max(...values);
  const ids = new Set<string>();
  cars.forEach((c, i) => {
    if (values[i] === best) ids.add(c.id);
  });
  // Only highlight if there is a real difference (i.e. not all the same)
  if (ids.size === cars.length) return new Set();
  return ids;
}

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { t } = useLanguage();

  const cars = compareList
    .map((id) => fleetData.find((c) => c.id === id))
    .filter((c): c is Car => c !== undefined);

  // Best-value sets
  const bestPrice = getBestIds(cars, (c) => c.pricePerDay, "lowest");
  const bestAcceleration = getBestIds(
    cars,
    (c) => parseZeroToHundred(c.zeroToHundred),
    "lowest"
  );
  const bestTopSpeed = getBestIds(cars, (c) => c.topSpeed, "highest");
  const bestSeats = getBestIds(cars, (c) => c.seats, "highest");

  // Empty state
  if (cars.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f2f2f0]">
          <svg
            className="h-10 w-10 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0-4h18" />
          </svg>
        </div>
        <h1 className="font-bebas text-3xl tracking-wide text-[#0a0a0a] md:text-4xl">
          {t("compare.noCarsSelected")}
        </h1>
        <p className="mt-3 max-w-md text-gray-500">
          {t("compare.noCarsDescription")}
        </p>
        <Link
          href="/cars"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff5c00] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e05200]"
        >
          {t("compare.browseFleet")}
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </section>
    );
  }

  const colClass =
    cars.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-bebas text-4xl tracking-wide text-[#0a0a0a] md:text-5xl">
          {t("compare.title")}
        </h1>
        <p className="mt-2 text-gray-500">{t("compare.subtitle")}</p>
        <button
          onClick={clearCompare}
          className="mt-4 text-sm font-medium text-[#ff5c00] underline-offset-2 hover:underline"
        >
          {t("compare.clear")}
        </button>
      </div>

      {/* Comparison grid */}
      <div className={`grid gap-6 ${colClass}`}>
        {cars.map((car) => {
          const primaryColor = car.colors[0]?.hex ?? "#0a0a0a";

          return (
            <div
              key={car.id}
              className="relative overflow-hidden rounded-xl border border-[#f2f2f0] bg-white"
            >
              {/* Remove button */}
              <button
                onClick={() => toggleCompare(car.id)}
                className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-400 backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-500"
                title={t("compare.removeFromCompare")}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Car image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Car name */}
              <div className="border-b border-[#f2f2f0] px-5 py-4">
                <h2 className="font-bebas text-2xl tracking-wide text-[#0a0a0a]">
                  {car.name}
                </h2>
                <span className="mt-1 inline-block rounded bg-[#f2f2f0] px-2 py-0.5 text-xs font-medium text-[#1a1a1a]">
                  {car.category}
                </span>
              </div>

              {/* Specs */}
              <div className="divide-y divide-[#f2f2f0]">
                {/* Price */}
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">
                    {t("compare.price")}
                  </span>
                  <div className="flex items-center gap-2">
                    {bestPrice.has(car.id) && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                        {t("compare.best")}
                      </span>
                    )}
                    <span className="font-semibold text-[#0a0a0a]">
                      {formatMAD(car.pricePerDay)}
                      <span className="ml-0.5 text-xs font-normal text-gray-400">
                        {t("fleet.perDay")}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 0-100 */}
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">
                    {t("compare.zeroToHundred")}
                  </span>
                  <div className="flex items-center gap-2">
                    {bestAcceleration.has(car.id) && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                        {t("compare.best")}
                      </span>
                    )}
                    <span className="font-semibold text-[#0a0a0a]">
                      {car.zeroToHundred}
                    </span>
                  </div>
                </div>

                {/* Top Speed */}
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">
                    {t("compare.topSpeed")}
                  </span>
                  <div className="flex items-center gap-2">
                    {bestTopSpeed.has(car.id) && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                        {t("compare.best")}
                      </span>
                    )}
                    <span className="font-semibold text-[#0a0a0a]">
                      {car.topSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* Seats */}
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">
                    {t("compare.seats")}
                  </span>
                  <div className="flex items-center gap-2">
                    {bestSeats.has(car.id) && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                        {t("compare.best")}
                      </span>
                    )}
                    <span className="font-semibold text-[#0a0a0a]">
                      {car.seats}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-5 py-4">
                  <p className="text-xs leading-relaxed text-gray-500">
                    {car.description}
                  </p>
                </div>
              </div>

              {/* Book button */}
              <div className="border-t border-[#f2f2f0] px-5 py-4">
                <Link
                  href={`/booking?car=${car.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e05200]"
                >
                  {t("compare.bookThisCar")}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
