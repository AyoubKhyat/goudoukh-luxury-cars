"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { fleetData } from "@/data/fleet";
import { formatMAD, calculatePrice } from "@/lib/utils";

/* ──────────────────────────────────────────────
   Check Icon
   ────────────────────────────────────────────── */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */
export default function BookCarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const car = fleetData.find((c) => c.id === slug);

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Marrakesh Airport");
  const [extras, setExtras] = useState({
    insurance: false,
    driver: false,
    childSeat: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

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
          Browse Fleet
        </Link>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="min-h-screen bg-white pt-28 pb-20">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff5c00]/10">
            <CheckIcon className="h-10 w-10 text-[#ff5c00]" />
          </div>
          <h1 className="font-bebas text-4xl tracking-wide text-[#0a0a0a] mb-3">
            Booking Request Sent
          </h1>
          <p className="text-gray-500 mb-2">
            Your <span className="font-semibold text-[#0a0a0a]">{car.name}</span> has been reserved.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Our team will call you shortly to confirm the details.
            Payment is made in cash when you receive the car.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
            >
              Back to Home
            </Link>
            <Link
              href="/cars"
              className="rounded border border-gray-300 px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-gray-50"
            >
              Browse More Cars
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href={`/cars/${car.id}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#ff5c00] transition-colors mb-4"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to {car.name}
          </Link>
          <h1 className="font-bebas text-hero tracking-tight text-[#0a0a0a] mb-2">
            BOOK {car.name.toUpperCase()}
          </h1>
          <p className="text-gray-500">
            {formatMAD(car.pricePerDay)}/day &middot; {car.category}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pickup Location
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Marrakesh Airport"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pickup Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (dropoffDate && e.target.value > dropoffDate) {
                      setDropoffDate("");
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dropoff Date
                </label>
                <input
                  type="date"
                  min={pickupDate || todayStr}
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Add-ons</p>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extras.insurance}
                    onChange={(e) => setExtras((p) => ({ ...p, insurance: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                  />
                  <span className="text-sm text-[#0a0a0a]">Full Insurance</span>
                </div>
                <span className="text-xs font-medium text-gray-400">+500 MAD/day</span>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extras.driver}
                    onChange={(e) => setExtras((p) => ({ ...p, driver: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                  />
                  <span className="text-sm text-[#0a0a0a]">Personal Chauffeur</span>
                </div>
                <span className="text-xs font-medium text-gray-400">+1,200 MAD/day</span>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#ff5c00]/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extras.childSeat}
                    onChange={(e) => setExtras((p) => ({ ...p, childSeat: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                  />
                  <span className="text-sm text-[#0a0a0a]">Child Seat</span>
                </div>
                <span className="text-xs font-medium text-gray-400">+150 MAD/day</span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={() => setSubmitted(true)}
              disabled={days === 0}
              className="w-full rounded-lg bg-[#ff5c00] py-4 text-center font-bebas text-xl tracking-wider text-white transition-all duration-300 hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          </div>

          {/* Summary - 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-lg bg-[#0a0a0a] p-6 text-white">
              <h3 className="font-bebas text-2xl tracking-wide text-white mb-4">
                Summary
              </h3>

              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="font-bebas text-xl tracking-wide text-[#ff5c00]">
                  {car.name}
                </p>
                <p className="text-sm text-gray-400">{car.category}</p>
              </div>

              {days > 0 && (
                <div className="mb-4 pb-4 border-b border-white/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span>{days} {days === 1 ? "day" : "days"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base rate</span>
                    <span>{formatMAD(car.pricePerDay * days)}</span>
                  </div>
                  {extras.insurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Insurance</span>
                      <span>{formatMAD(500 * days)}</span>
                    </div>
                  )}
                  {extras.driver && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Chauffeur</span>
                      <span>{formatMAD(1200 * days)}</span>
                    </div>
                  )}
                  {extras.childSeat && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Child Seat</span>
                      <span>{formatMAD(150 * days)}</span>
                    </div>
                  )}
                  {days >= 7 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>7+ day discount</span>
                      <span>-10%</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="font-bebas text-3xl tracking-wide text-[#ff5c00]">
                  {days > 0 ? formatMAD(totalPrice) : "---"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
