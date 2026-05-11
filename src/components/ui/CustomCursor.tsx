"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevTarget = useRef({ x: 0, y: 0 });
  const isTouch = useRef(false);
  const inverted = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    ) {
      isTouch.current = true;
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      // Detect dark background elements under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const isDark = checkDark(el as HTMLElement);
        inverted.current = isDark;
      }
    };

    const checkDark = (el: HTMLElement): boolean => {
      let current: HTMLElement | null = el;
      while (current) {
        if (current.hasAttribute("data-dark")) return true;
        if (
          current.classList.contains("bg-black") ||
          current.classList.contains("bg-[#0a0a0a]") ||
          current.classList.contains("bg-dark-gray") ||
          current.classList.contains("bg-[#1a1a1a]")
        ) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };

    const animate = () => {
      // Lerp factor for smooth follow
      const lerp = 0.15;
      pos.current.x += (target.current.x - pos.current.x) * lerp;
      pos.current.y += (target.current.y - pos.current.y) * lerp;

      // Calculate velocity for stretch
      velocity.current.x = target.current.x - prevTarget.current.x;
      velocity.current.y = target.current.y - prevTarget.current.y;
      prevTarget.current = { ...target.current };

      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      );

      // Scale X based on speed (stretch horizontally when moving fast)
      const scaleX = 1 + Math.min(speed * 0.04, 1.8);
      const scaleY = 1 - Math.min(speed * 0.01, 0.3);

      // Rotation angle based on movement direction
      const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px) rotate(${speed > 1 ? angle : 0}deg) scale(${scaleX}, ${scaleY})`;
        cursorRef.current.style.backgroundColor = inverted.current
          ? "#ffffff"
          : "#ff5c00";
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Don't render anything on touch devices (checked at mount)
  // The ref check happens in useEffect, so we always render the element
  // but hide it via CSS on touch

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-50 pointer-events-none rounded-full mix-blend-difference"
      style={{
        width: 12,
        height: 12,
        backgroundColor: "#ff5c00",
        willChange: "transform",
        transition: "background-color 0.2s ease",
      }}
      // Hide on touch via media query applied below
      aria-hidden="true"
    >
      <style>{`
        @media (hover: none) and (pointer: coarse) {
          [aria-hidden="true"].fixed.pointer-events-none.rounded-full.mix-blend-difference {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
