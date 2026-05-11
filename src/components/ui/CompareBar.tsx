"use client";

import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
import { fleetData } from "@/data/fleet";

export default function CompareBar() {
  const { compareList, clearCompare } = useCompare();
  const { t } = useLanguage();

  const selectedCars = compareList
    .map((id) => fleetData.find((c) => c.id === id))
    .filter(Boolean);

  const isVisible = compareList.length > 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-[#ff5c00]/20 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          {/* Selected car names */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 text-xs font-semibold text-[#ff5c00]">
              {compareList.length}/3
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {selectedCars.map((car) => (
                <span
                  key={car!.id}
                  className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                >
                  {car!.name}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={clearCompare}
              className="rounded-full px-4 py-2 text-xs font-medium text-gray-400 transition-colors duration-200 hover:text-white"
            >
              {t("compare.clear")}
            </button>
            {compareList.length >= 2 ? (
              <Link
                href="/compare"
                className="rounded-full bg-[#ff5c00] px-5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#e05200]"
              >
                {t("compare.compareNow")}
              </Link>
            ) : (
              <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-medium text-gray-500">
                {t("compare.compareNow")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
