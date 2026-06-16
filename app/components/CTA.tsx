"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef    = useRef<HTMLButtonElement>(null);
  const router       = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    const button    = buttonRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-cta",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: container, start: "top 85%" },
        }
      );
    }, container);

    if (button && !("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        gsap.to(button, {
          x: (e.clientX - (rect.left + rect.width  / 2)) * 0.35,
          y: (e.clientY - (rect.top  + rect.height / 2)) * 0.35,
          duration: 0.3, ease: "power2.out",
        });
      };
      const onMouseLeave = () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      };

      button.addEventListener("mousemove",  onMouseMove);
      button.addEventListener("mouseleave", onMouseLeave);
    }

    return () => ctx.revert();
  }, []);

  const getStarted = () => router.push("/dashboard");

  return (
    <section
      ref={containerRef}
      id="cta"
      className="relative w-full py-24 md:py-36 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "#fce7f3" }}
    >
      {/* Fine rose grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(45deg, rgba(225,29,72,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Bottom glow orbs */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: -150, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse at bottom, rgba(225,29,72,0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: -20, left: "50%", transform: "translateX(-50%)",
          width: 500, height: 100, borderRadius: "50%",
          background: "rgba(251,113,133,0.06)",
          filter: "blur(50px)",
        }}
      />

      <div className="fade-up-cta opacity-0 max-w-3xl flex flex-col items-center relative z-10 [transform-style:preserve-3d]">

        {/* Eyebrow */}
        <div
          className="text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-1.5"
          style={{ color: "#e11d48" }}
        >
          <span>✦</span> Get Started Immediately
        </div>

        {/* Headline */}
        <h2
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 max-w-xl"
          style={{ color: "#1a0008" }}
        >
          Ready to love <br />
          <span
            style={{
              background: "linear-gradient(90deg, #fb7185, #e11d48, #be123c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            your inbox again?
          </span>
        </h2>

        {/* Body */}
        <p
          className="text-sm md:text-base font-medium tracking-wide mb-10 max-w-md leading-relaxed"
          style={{ color: "#7f1d1d" }}
        >
          Free for 14 days. No credit card required. <br className="hidden sm:inline" />
          Cancel seamlessly with one click anytime.
        </p>

        {/* Button wrapper */}
        <div className="relative p-4 [transform-style:preserve-3d]">
          {/* Hover glow behind button */}
          <div
            className="absolute inset-4 rounded-full blur-xl scale-90 pointer-events-none"
            style={{ background: "rgba(225,29,72,0.15)" }}
          />

          <button
            ref={buttonRef}
            onClick={getStarted}
            className="group relative px-8 py-4 rounded-full text-white text-sm font-black tracking-tight transition-all duration-300 active:scale-95 will-change-transform cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
              boxShadow: "0 15px 40px rgba(225,29,72,0.30), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background =
                "linear-gradient(135deg, #fda4af, #fb7185, #e11d48)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 20px 50px rgba(225,29,72,0.40), inset 0 1px 0 rgba(255,255,255,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background =
                "linear-gradient(135deg, #fb7185, #e11d48, #be123c)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 15px 40px rgba(225,29,72,0.30), inset 0 1px 0 rgba(255,255,255,0.35)";
            }}
          >
            <span className="flex items-center gap-1.5 transform group-hover:translate-x-0.5 transition-transform duration-300">
              Start for free
              <span className="text-xs tracking-normal transform group-hover:translate-x-0.5 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}