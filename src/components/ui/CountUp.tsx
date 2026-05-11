"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

/** Ease-out cubic for a natural deceleration feel. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    function animate() {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(easedProgress * end);

        setValue(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="font-bebas text-[#ff5c00]">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
