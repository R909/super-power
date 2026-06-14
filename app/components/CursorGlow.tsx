"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || "ontouchstart" in window) return;

    const SIZE = 700;
    let tx = 0, ty = 0;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      glow.style.transform = `translate3d(${cx - SIZE / 2}px, ${cy - SIZE / 2}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[99] mix-blend-screen"
      style={{
        width: 700,
        height: 700,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(251,146,60,0.07) 0%, rgba(245,158,11,0.04) 35%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
