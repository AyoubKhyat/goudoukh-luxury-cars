"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fleetData, Car } from "@/data/fleet";
import { formatMAD, cn, calculatePrice } from "@/lib/utils";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */
interface FormData {
  carId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  insurance: boolean;
  driver: boolean;
  childSeat: boolean;
  gps: boolean;
  fullName: string;
  email: string;
  phone: string;
}

const STEP_LABELS = ["Trip Details", "Extras & Add-ons", "Confirmation"];

/* ──────────────────────────────────────────────
   Icons (inline SVG)
   ────────────────────────────────────────────── */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function SeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18v-3a5 5 0 0 1 10 0v3" />
      <path d="M5 18h14" />
      <path d="M7 18v3" />
      <path d="M17 18v3" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Helper: number of days between two dates
   ────────────────────────────────────────────── */
function daysBetween(start: string, end: string): number {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

/* ──────────────────────────────────────────────
   Progress Bar
   ────────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-10">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500",
                i + 1 <= step
                  ? "bg-[#ff5c00] text-white"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              {i + 1 <= step ? (
                i + 1 < step ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  i + 1
                )
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "hidden sm:block text-sm font-medium transition-colors duration-300",
                i + 1 <= step ? "text-[#0a0a0a]" : "text-gray-400"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* Animated bar */}
      <div className="relative h-1 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#ff5c00] transition-all duration-700 ease-out"
          style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Summary Sidebar
   ────────────────────────────────────────────── */
function Summary({ form, car, days }: { form: FormData; car: Car | undefined; days: number }) {
  const extras = useMemo(
    () => ({ insurance: form.insurance, driver: form.driver, childSeat: form.childSeat }),
    [form.insurance, form.driver, form.childSeat]
  );

  const total = useMemo(
    () => (car ? calculatePrice(car.pricePerDay, days, extras) : 0),
    [car, days, extras]
  );

  const baseTotal = car ? car.pricePerDay * days : 0;
  const insuranceTotal = form.insurance ? 500 * days : 0;
  const driverTotal = form.driver ? 1200 * days : 0;
  const childSeatTotal = form.childSeat ? 150 * days : 0;
  const gpsTotal = form.gps ? 100 * days : 0;
  const discount = days >= 7 ? Math.round((baseTotal + insuranceTotal + driverTotal + childSeatTotal) * 0.1) : 0;

  return (
    <div className="rounded-lg bg-[#0a0a0a] p-6 lg:p-8 text-white">
      <h3 className="font-bebas text-2xl tracking-wide text-white mb-6">
        Booking Summary
      </h3>

      {car ? (
        <>
          <div className="mb-4 pb-4 border-b border-white/10">
            <p className="font-bebas text-xl tracking-wide text-[#ff5c00]">
              {car.name}
            </p>
            <p className="text-sm text-gray-400">{car.category}</p>
          </div>

          {form.pickupDate && form.dropoffDate && (
            <div className="mb-4 pb-4 border-b border-white/10 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pickup</span>
                <span>{form.pickupDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Dropoff</span>
                <span>{form.dropoffDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span>{days} {days === 1 ? "day" : "days"}</span>
              </div>
            </div>
          )}

          <div className="mb-4 pb-4 border-b border-white/10 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Base ({formatMAD(car.pricePerDay)}/day)
              </span>
              <span>{formatMAD(baseTotal)}</span>
            </div>

            {form.insurance && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Full Insurance</span>
                <span>{formatMAD(insuranceTotal)}</span>
              </div>
            )}
            {form.driver && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Personal Chauffeur</span>
                <span>{formatMAD(driverTotal)}</span>
              </div>
            )}
            {form.childSeat && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Child Seat</span>
                <span>{formatMAD(childSeatTotal)}</span>
              </div>
            )}
            {form.gps && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">GPS Navigation</span>
                <span>{formatMAD(gpsTotal)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>7+ day discount (10%)</span>
                <span>-{formatMAD(discount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="font-bebas text-3xl tracking-wide text-[#ff5c00]">
              {formatMAD(total + gpsTotal)}
            </span>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Select a car to see pricing.</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Booking Form Content (uses useSearchParams)
   ────────────────────────────────────────────── */
function BookingFormContent() {
  const searchParams = useSearchParams();
  const preselectedCar = searchParams.get("car") || "";
  const preselectedPickup = searchParams.get("pickup") || "";
  const preselectedDropoff = searchParams.get("dropoff") || "";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<FormData>({
    carId: preselectedCar || fleetData[0].id,
    pickupLocation: "Marrakesh Airport",
    dropoffLocation: "",
    pickupDate: preselectedPickup,
    dropoffDate: preselectedDropoff,
    insurance: false,
    driver: false,
    childSeat: false,
    gps: false,
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (preselectedCar || preselectedPickup || preselectedDropoff) {
      setForm((prev) => ({
        ...prev,
        ...(preselectedCar && { carId: preselectedCar }),
        ...(preselectedPickup && { pickupDate: preselectedPickup }),
        ...(preselectedDropoff && { dropoffDate: preselectedDropoff }),
      }));
    }
  }, [preselectedCar, preselectedPickup, preselectedDropoff]);

  const selectedCar = fleetData.find((c) => c.id === form.carId);
  const days = daysBetween(form.pickupDate, form.dropoffDate);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.email) {
      setSubmitError("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: form.carId,
          customerName: form.fullName,
          customerEmail: form.email,
          customerPhone: form.phone,
          pickupDate: form.pickupDate,
          dropoffDate: form.dropoffDate,
          pickupLocation: form.pickupLocation || "Marrakesh Airport",
          dropoffLocation: form.dropoffLocation || form.pickupLocation || "Marrakesh Airport",
          insurance: form.insurance,
          chauffeur: form.driver,
          childSeat: form.childSeat,
          gps: form.gps,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Confirmation ── */
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff5c00]/10">
            <CheckIcon className="h-10 w-10 text-[#ff5c00]" />
          </div>
          <h2 className="font-bebas text-4xl tracking-wide mb-3">Booking Request Sent</h2>
          <p className="text-gray-500 mb-6">
            Thank you for choosing Goudoukh Luxury Cars. Our team will call you shortly
            to confirm your reservation. Payment is made in cash when you receive the car.
          </p>
          <Link
            href="/"
            className="inline-block rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* ── Left: Form ── */}
      <div className="lg:col-span-2">
        <ProgressBar step={step} />

        {/* ── Step 1: Trip Details ── */}
        {step === 1 && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
            <h2 className="font-bebas text-3xl tracking-wide">Trip Details</h2>

            {/* Car selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Vehicle
              </label>
              <select
                value={form.carId}
                onChange={(e) => update("carId", e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
              >
                {fleetData.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} — {formatMAD(car.pricePerDay)}/day
                  </option>
                ))}
              </select>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={form.pickupLocation}
                  onChange={(e) => update("pickupLocation", e.target.value)}
                  placeholder="Marrakesh Airport"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  value={form.dropoffLocation}
                  onChange={(e) => update("dropoffLocation", e.target.value)}
                  placeholder="Same as pickup"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={form.pickupDate}
                  onChange={(e) => update("pickupDate", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dropoff Date
                </label>
                <input
                  type="date"
                  value={form.dropoffDate}
                  onChange={(e) => update("dropoffDate", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={nextStep}
                className="rounded bg-[#ff5c00] px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Extras ── */}
        {step === 2 && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
            <h2 className="font-bebas text-3xl tracking-wide">Extras & Add-ons</h2>
            <p className="text-gray-500 text-sm">
              Enhance your experience with our premium add-on services.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Insurance */}
              <button
                type="button"
                onClick={() => update("insurance", !form.insurance)}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-lg border-2 p-5 text-left transition-all duration-300",
                  form.insurance
                    ? "border-[#ff5c00] bg-[#ff5c00]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {form.insurance && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5c00]">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <ShieldIcon
                  className={cn(
                    "h-8 w-8 transition-colors",
                    form.insurance ? "text-[#ff5c00]" : "text-gray-400"
                  )}
                />
                <div>
                  <p className="font-semibold text-sm">Full Insurance Coverage</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Comprehensive protection for complete peace of mind
                  </p>
                </div>
                <p className="font-bebas text-lg text-[#ff5c00] tracking-wide">
                  +500 MAD/day
                </p>
              </button>

              {/* Chauffeur */}
              <button
                type="button"
                onClick={() => update("driver", !form.driver)}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-lg border-2 p-5 text-left transition-all duration-300",
                  form.driver
                    ? "border-[#ff5c00] bg-[#ff5c00]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {form.driver && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5c00]">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <PersonIcon
                  className={cn(
                    "h-8 w-8 transition-colors",
                    form.driver ? "text-[#ff5c00]" : "text-gray-400"
                  )}
                />
                <div>
                  <p className="font-semibold text-sm">Personal Chauffeur</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Professional driver for a fully relaxed experience
                  </p>
                </div>
                <p className="font-bebas text-lg text-[#ff5c00] tracking-wide">
                  +1,200 MAD/day
                </p>
              </button>

              {/* Child Seat */}
              <button
                type="button"
                onClick={() => update("childSeat", !form.childSeat)}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-lg border-2 p-5 text-left transition-all duration-300",
                  form.childSeat
                    ? "border-[#ff5c00] bg-[#ff5c00]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {form.childSeat && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5c00]">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <SeatIcon
                  className={cn(
                    "h-8 w-8 transition-colors",
                    form.childSeat ? "text-[#ff5c00]" : "text-gray-400"
                  )}
                />
                <div>
                  <p className="font-semibold text-sm">Child Seat</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Safety-certified seat for young passengers
                  </p>
                </div>
                <p className="font-bebas text-lg text-[#ff5c00] tracking-wide">
                  +150 MAD/day
                </p>
              </button>

              {/* GPS */}
              <button
                type="button"
                onClick={() => update("gps", !form.gps)}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-lg border-2 p-5 text-left transition-all duration-300",
                  form.gps
                    ? "border-[#ff5c00] bg-[#ff5c00]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {form.gps && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5c00]">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <MapIcon
                  className={cn(
                    "h-8 w-8 transition-colors",
                    form.gps ? "text-[#ff5c00]" : "text-gray-400"
                  )}
                />
                <div>
                  <p className="font-semibold text-sm">GPS Navigation</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Turn-by-turn navigation across Morocco
                  </p>
                </div>
                <p className="font-bebas text-lg text-[#ff5c00] tracking-wide">
                  +100 MAD/day
                </p>
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="rounded border border-gray-300 px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="rounded bg-[#ff5c00] px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
            <h2 className="font-bebas text-3xl tracking-wide">Confirm Your Booking</h2>

            <div className="rounded-lg border border-[#ff5c00]/20 bg-[#ff5c00]/5 px-5 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-[#ff5c00] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M12 12h.01" />
                  <path d="M17 12h.01" />
                  <path d="M7 12h.01" />
                </svg>
                <div>
                  <p className="font-semibold text-sm text-[#0a0a0a]">Pay in Cash at Pickup</p>
                  <p className="text-sm text-gray-600 mt-1">
                    No online payment required. You pay the full amount in cash (MAD) when you meet our
                    team at your pickup location. We&apos;ll confirm everything beforehand by phone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Your Contact Details</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">How it works</p>
              <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
                <li>Submit your reservation request</li>
                <li>Our team calls you to confirm details</li>
                <li>We deliver the car to your pickup location</li>
                <li>You pay in cash upon handover</li>
              </ol>
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                disabled={submitting}
                className="rounded border border-gray-300 px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded bg-[#ff5c00] px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting…
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Summary Sidebar ── */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-28">
          <Summary form={form} car={selectedCar} days={days} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */
export default function BookingPage() {
  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h1 className="font-bebas text-hero tracking-tight text-[#0a0a0a] mb-2">
          BOOK YOUR RIDE
        </h1>
        <p className="text-gray-500 mb-12 max-w-xl">
          Reserve your dream car in minutes. Select your vehicle, customize your
          experience, and hit the road.
        </p>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
            </div>
          }
        >
          <BookingFormContent />
        </Suspense>
      </div>
    </section>
  );
}
