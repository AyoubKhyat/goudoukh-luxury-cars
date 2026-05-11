"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*  Styled loading states                                                      */
/* -------------------------------------------------------------------------- */

function HeroLoadingFallback() {
  return (
    <div className="relative w-full h-screen bg-white flex items-center justify-center">
      <span className="font-bebas text-4xl tracking-[0.25em] text-[#0a0a0a]/20 animate-pulse">
        GOUDOUKH
      </span>
    </div>
  );
}

function ViewerLoadingFallback() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-neutral-50 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-[#ff5c00] border-t-transparent animate-spin" />
        <span className="font-bebas text-lg tracking-widest text-neutral-300">
          GOUDOUKH
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dynamic imports — SSR disabled for Three.js components                     */
/* -------------------------------------------------------------------------- */

export const DynamicHeroScene = dynamic(
  () => import("./HeroScene"),
  {
    ssr: false,
    loading: () => <HeroLoadingFallback />,
  }
);

export const DynamicCarViewer = dynamic(
  () => import("./CarViewer"),
  {
    ssr: false,
    loading: () => <ViewerLoadingFallback />,
  }
);

/* -------------------------------------------------------------------------- */
/*  Wrapper components with Suspense boundaries                                */
/* -------------------------------------------------------------------------- */

export function HeroSceneProvider() {
  return (
    <Suspense fallback={<HeroLoadingFallback />}>
      <DynamicHeroScene />
    </Suspense>
  );
}

interface CarViewerProviderProps {
  color?: string;
  category?: "SUV" | "Sedan" | "Supercar" | "Convertible";
}

export function CarViewerProvider({
  color = "#0a0a0a",
  category = "Supercar",
}: CarViewerProviderProps) {
  return (
    <Suspense fallback={<ViewerLoadingFallback />}>
      <DynamicCarViewer color={color} category={category} />
    </Suspense>
  );
}
