"use client";

import { useState } from "react";
import type { CarCategory } from "@/data/fleet";

export interface FilterState {
  categories: CarCategory[];
  priceMin: string;
  priceMax: string;
  sortBy: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES: CarCategory[] = ["SUV", "Sedan", "Supercar", "Convertible"];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceMin: "",
    priceMax: "",
    sortBy: "",
  });

  const updateAndNotify = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCategory = (category: CarCategory) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateAndNotify({ ...filters, categories: next });
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      categories: [],
      priceMin: "",
      priceMax: "",
      sortBy: "",
    };
    updateAndNotify(cleared);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.sortBy !== "";

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bebas text-xl tracking-wide text-[#0a0a0a]">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-[#ff5c00] hover:text-[#e05200] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Category
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#f2f2f0]"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
              />
              <span className="text-sm text-[#0a0a0a]">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Price Range (MAD/day)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) =>
              updateAndNotify({ ...filters, priceMin: e.target.value })
            }
            placeholder="Min"
            min={0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) =>
              updateAndNotify({ ...filters, priceMax: e.target.value })
            }
            placeholder="Max"
            min={0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Sort By
        </p>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            updateAndNotify({ ...filters, sortBy: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#f2f2f0]"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
