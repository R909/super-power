"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-cta",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
          }
        }
      );
    }, container);

    if (button && !("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        gsap.to(button, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const onMouseLeave = () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      };

      button.addEventListener("mousemove", onMouseMove);
      button.addEventListener("mouseleave", onMouseLeave);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#030712] py-32 md:py-44 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center"
      id="cta"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,_rgba(217,119,6,0.004)_1px,_transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,_black_40%,_transparent_100%)] z-0" />

      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[700px] md:w-[900px] h-[400px] rounded-full bg-gradient-to-t from-amber-500/[0.08] to-transparent blur-[120px] pointer-events-none mix-blend-screen z-0" />
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[350px] md:w-[500px] h-[100px] rounded-full bg-amber-400/[0.03] blur-[50px] pointer-events-none z-0" />

      <div className="fade-up-cta opacity-0 max-w-3xl flex flex-col items-center relative z-10 [transform-style:preserve-3d]">

        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 mb-6 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
          <span>✦</span> Get Started Immediately
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6 max-w-xl">
          Ready to love <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-amber-300 drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            your inbox again?
          </span>
        </h2>

        <p className="text-sm md:text-base text-slate-400 font-medium tracking-wide mb-10 max-w-md leading-relaxed">
          Free for 14 days. No credit card required. <br className="hidden sm:inline" />
          Cancel seamlessly with one click anytime.
        </p>

        <div className="relative p-4 [transform-style:preserve-3d]">
          <div className="absolute inset-4 rounded-full bg-amber-500/10 blur-xl scale-90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

          <button
            ref={buttonRef}
            onClick={() => window.location.href = '#'}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-b from-[#eab308] to-[#ca8a04] hover:from-[#facc15] hover:to-[#eab308] text-neutral-950 text-sm font-black tracking-tight shadow-[0_15px_40px_rgba(202,138,4,0.2),_inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 transform active:scale-95 will-change-transform cursor-pointer"
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
