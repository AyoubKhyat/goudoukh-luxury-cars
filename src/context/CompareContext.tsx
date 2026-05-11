"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const MAX_COMPARE = 3;
const STORAGE_KEY = "goudoukh-compare";

interface CompareContextValue {
  compareList: string[];
  toggleCompare: (carId: string) => void;
  isComparing: (carId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function getInitialList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_COMPARE);
    }
  } catch {
    // sessionStorage may be unavailable
  }
  return [];
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydrate from sessionStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setCompareList(getInitialList());
    setMounted(true);
  }, []);

  // Persist to sessionStorage whenever the list changes
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch {
      // sessionStorage may be unavailable
    }
  }, [compareList, mounted]);

  const toggleCompare = useCallback((carId: string) => {
    setCompareList((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, carId];
    });
  }, []);

  const isComparing = useCallback(
    (carId: string) => compareList.includes(carId),
    [compareList]
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{ compareList, toggleCompare, isComparing, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
