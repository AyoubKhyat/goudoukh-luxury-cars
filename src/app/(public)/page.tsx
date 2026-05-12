"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { HeroSceneProvider } from "@/components/three/ThreeProvider";
import SectionTitle from "@/components/ui/SectionTitle";
import CarCard from "@/components/ui/CarCard";
import CountUp from "@/components/ui/CountUp";
import AnimatedLine from "@/components/ui/AnimatedLine";
import CustomCursor from "@/components/ui/CustomCursor";
import { fleetData } from "@/data/fleet";
import { testimonials } from "@/data/testimonials";
import { useLanguage } from "@/context/LanguageContext";

/* -------------------------------------------------------------------------- */
/*  Fade-in-on-scroll hook                                                     */
/* -------------------------------------------------------------------------- */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* -------------------------------------------------------------------------- */
/*  Marquee CSS keyframes (injected once)                                      */
/* -------------------------------------------------------------------------- */

const marqueeCSS = `
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/* -------------------------------------------------------------------------- */
/*  Feature card data                                                          */
/* -------------------------------------------------------------------------- */

const features = [
  {
    title: "Curated Fleet",
    description:
      "Hand-selected supercars, grand tourers, and luxury SUVs — maintained to concours standards and refreshed every season.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <path d="M5 17h14M3 13l2.5-6h13L21 13M6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM17.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "White-Glove Service",
    description:
      "Personal concierge from booking to return. Airport handovers, hotel delivery, and bespoke itinerary planning included.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Full Insurance",
    description:
      "Comprehensive coverage on every vehicle. Drive with complete confidence — zero surprise charges, zero deductibles.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "24/7 Concierge",
    description:
      "Round-the-clock support wherever you are. Roadside assistance, last-minute changes, and local expertise — always a call away.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Stats data                                                                 */
/* -------------------------------------------------------------------------- */

const stats = [
  { end: 47, suffix: "+", label: "Cars" },
  { end: 2400, suffix: "+", label: "Clients" },
  { end: 8, suffix: "", label: "Years" },
  { end: 24, suffix: "/7", label: "Concierge" },
];

/* ========================================================================== */
/*  HERO BOOKING FORM                                                          */
/* ========================================================================== */

function HeroBookingForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [carId, setCarId] = useState(fleetData[0].id);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ car: carId });
    if (pickupDate) params.set("pickup", pickupDate);
    if (dropoffDate) params.set("dropoff", dropoffDate);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:w-[340px] flex-shrink-0 rounded-xl bg-white/90 backdrop-blur-md shadow-xl border border-gray-200/60 p-5 space-y-4"
    >
      <p className="font-bebas text-xl tracking-wide text-[#0a0a0a]">
        {t("hero.quickBooking")}
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{t("hero.vehicle")}</label>
        <select
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        >
          {fleetData.map((car) => (
            <option key={car.id} value={car.id}>
              {car.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t("hero.pickup")}</label>
          <input
            type="date"
            min={todayStr}
            value={pickupDate}
            onChange={(e) => {
              setPickupDate(e.target.value);
              if (dropoffDate && e.target.value > dropoffDate) setDropoffDate("");
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t("hero.dropoff")}</label>
          <input
            type="date"
            min={pickupDate || todayStr}
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#ff5c00] py-3 font-bebas text-lg tracking-wider text-white transition-all duration-300 hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20"
      >
        {t("hero.checkAvailability")}
      </button>

      <p className="text-center text-[10px] text-gray-400">
        {t("hero.cashNote")}
      </p>
    </form>
  );
}

/* ========================================================================== */
/*  PAGE COMPONENT                                                             */
/* ========================================================================== */

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <CustomCursor />
      <style>{marqueeCSS}</style>

      {/* ------------------------------------------------------------------ */}
      {/*  1. HERO                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury car on road"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/60" />
        </div>

        {/* 3D scene overlay */}
        <div className="absolute inset-0 z-[1] mix-blend-screen opacity-70">
          <HeroSceneProvider />
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-[3] flex h-full items-end px-6 pb-24 sm:px-12 lg:px-20">
          <div className="flex w-full flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: headline */}
            <div className="flex-1">
              <h1 className="font-bebas text-hero tracking-tight text-white max-w-5xl">
                {t("hero.headline")}
              </h1>
              <p className="mt-4 max-w-lg font-inter text-lg text-gray-300 sm:text-xl">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/cars"
                  className="inline-flex items-center justify-center rounded-sm bg-[#ff5c00] px-8 py-3.5 font-bebas text-lg tracking-wider text-white transition-colors hover:bg-[#e05200]"
                >
                  {t("hero.exploreCTA")}
                </Link>
              </div>
            </div>

            {/* Right: mini booking form — hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block">
              <HeroBookingForm />
            </div>
          </div>
        </div>

        {/* Mobile booking form — stacked below headline content */}
        <div className="relative z-[3] px-6 pb-8 sm:px-12 lg:hidden">
          <HeroBookingForm />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-[3] -translate-x-1/2 hidden lg:block">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="font-inter text-xs uppercase tracking-[0.2em] text-gray-500">
              Scroll
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  2. MARQUEE STRIP                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden bg-[#0a0a0a] py-4">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee-scroll 20s linear infinite" }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-4 font-bebas text-sm tracking-[0.25em] text-[#ff5c00] sm:text-base"
            >
              0&ndash;100 in 3.2s &middot; Full insurance &middot; 24/7
              concierge &middot; Airport transfer &middot; Chauffeur service
              &middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  3. FEATURED FLEET                                                  */}
      {/* ------------------------------------------------------------------ */}
      <FleetSection />

      {/* ------------------------------------------------------------------ */}
      {/*  4. WHY GOUDOUKH                                                    */}
      {/* ------------------------------------------------------------------ */}
      <WhySection />

      {/* ------------------------------------------------------------------ */}
      {/*  5. TESTIMONIALS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <TestimonialsSection />

      {/* ------------------------------------------------------------------ */}
      {/*  6. CTA                                                             */}
      {/* ------------------------------------------------------------------ */}
      <CTASection />
    </>
  );
}

/* ========================================================================== */
/*  FLEET SECTION                                                              */
/* ========================================================================== */

function FleetSection() {
  const { ref, visible } = useInView<HTMLElement>();
  const { t } = useLanguage();

  return (
    <section ref={ref} className="bg-white px-6 py-24 sm:px-12 lg:px-20">
      <SectionTitle
        title={t("fleet.title")}
        subtitle={t("fleet.subtitle")}
      />

      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {fleetData.slice(0, 6).map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 font-inter text-base font-medium text-[#ff5c00] transition-colors hover:text-[#e05200]"
        >
          {t("fleet.viewAll")}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  WHY GOUDOUKH SECTION                                                       */
/* ========================================================================== */

function WhySection() {
  const { ref: statsRef, visible: statsVisible } = useInView<HTMLDivElement>();
  const { ref: cardsRef, visible: cardsVisible } = useInView<HTMLDivElement>();
  const { t } = useLanguage();

  return (
    <section data-dark className="relative bg-[#0a0a0a] px-6 py-24 sm:px-12 lg:px-20 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.07]"
        />
      </div>

      <div className="relative z-10">
        <SectionTitle title={t("why.title")} dark />

        {/* Stats row */}
        <div
          ref={statsRef}
          className={`mb-20 grid grid-cols-2 gap-8 sm:grid-cols-4 transition-all duration-700 ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl sm:text-6xl">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <p className="mt-2 font-inter text-sm uppercase tracking-[0.15em] text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <AnimatedLine className="mb-16" />

        {/* Feature cards */}
        <div
          ref={cardsRef}
          className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 delay-200 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-sm p-6 transition-colors hover:border-[#ff5c00]/40"
            >
              <div className="mb-4 text-[#ff5c00]">{feature.icon}</div>
              <h3 className="mb-2 font-bebas text-xl tracking-wide text-white">
                {feature.title}
              </h3>
              <p className="font-inter text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  TESTIMONIALS SECTION                                                       */
/* ========================================================================== */

function TestimonialsSection() {
  const { ref, visible } = useInView<HTMLElement>();
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    function updatePerPage() {
      setPerPage(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    }
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const totalPages = Math.ceil(testimonials.length / perPage);

  useEffect(() => {
    setCurrent(0);
  }, [perPage]);

  useEffect(() => {
    if (paused || totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, totalPages]);

  const visibleTestimonials = testimonials.slice(
    current * perPage,
    current * perPage + perPage
  );

  return (
    <section ref={ref} className="bg-white px-6 py-24 sm:px-12 lg:px-20">
      <SectionTitle title={t("testimonials.title")} />

      <div
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTestimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-[#f2f2f0] bg-white p-6 transition-all duration-500 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating ? "text-[#ff5c00]" : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mb-6 font-inter text-sm leading-relaxed text-gray-600">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center gap-3 border-t border-[#f2f2f0] pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bebas text-base tracking-wide text-[#0a0a0a]">
                    {item.name}
                  </p>
                  <p className="font-inter text-xs text-gray-400">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrent((c) => (c - 1 + totalPages) % totalPages)}
              className="rounded-full border border-[#f2f2f0] p-2 text-gray-400 transition-colors hover:border-[#ff5c00] hover:text-[#ff5c00]"
              aria-label="Previous"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-[#ff5c00]" : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((c) => (c + 1) % totalPages)}
              className="rounded-full border border-[#f2f2f0] p-2 text-gray-400 transition-colors hover:border-[#ff5c00] hover:text-[#ff5c00]"
              aria-label="Next"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  CTA SECTION                                                                */
/* ========================================================================== */

function CTASection() {
  const { ref, visible } = useInView<HTMLElement>();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      data-dark
      className="relative bg-[#0a0a0a] px-6 py-32 text-center sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
      </div>

      <div
        className={`relative z-10 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-bebas text-hero tracking-tight text-white">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-md font-inter text-lg text-gray-400">
          {t("cta.subtitle")}
        </p>
        <Link
          href="/booking"
          className="mt-10 inline-flex items-center justify-center rounded-sm bg-[#ff5c00] px-10 py-4 font-bebas text-xl tracking-wider text-white transition-colors hover:bg-[#e05200]"
        >
          {t("nav.bookNow")}
        </Link>
      </div>
    </section>
  );
}
