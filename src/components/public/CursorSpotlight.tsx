"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !hasFinePointer) {
      return;
    }

    let rafId = 0;
    function handlePointerMove(e: PointerEvent) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!overlayRef.current) return;
        overlayRef.current.style.setProperty("--spotlight-x", `${e.clientX}px`);
        overlayRef.current.style.setProperty("--spotlight-y", `${e.clientY}px`);
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(600px circle at var(--spotlight-x, 28%) var(--spotlight-y, 32%), var(--color-spotlight), transparent 80%)",
      }}
    />
  );
}

