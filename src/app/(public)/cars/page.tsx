"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fleetData, type CarCategory } from "@/data/fleet";
import CarCard from "@/components/ui/CarCard";
import SectionTitle from "@/components/ui/SectionTitle";

const CATEGORIES: ("All" | CarCategory)[] = [
  "All",
  "SUV",
  "Sedan",
  "Supercar",
  "Convertible",
];

export default function CarsPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | CarCategory>("All");

  const filteredCars = useMemo(() => {
    if (activeFilter === "All") return fleetData;
    return fleetData.filter((car) => car.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <SectionTitle
          title="OUR FLEET"
          subtitle="12 handpicked vehicles for the discerning driver"
        />

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-[#ff5c00] text-white shadow-lg shadow-[#ff5c00]/20"
                  : "border border-gray-300 text-[#1a1a1a] hover:border-[#ff5c00] hover:text-[#ff5c00]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Car Count */}
        <p className="mb-8 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-[#0a0a0a]">
            {filteredCars.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#0a0a0a]">
            {fleetData.length}
          </span>{" "}
          vehicles
        </p>

        {/* Car Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-bebas text-2xl tracking-wide text-gray-300">
              No vehicles in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
