"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedLineProps {
  className?: string;
  delay?: number;
}

export default function AnimatedLine({
  className,
  delay = 0,
}: AnimatedLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative h-[2px] w-full overflow-hidden", className)}>
      <div
        className="absolute inset-y-0 left-0 bg-[#ff5c00]"
        style={{
          width: inView ? "100%" : "0%",
          transition: `width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        }}
      />
    </div>
  );
}
