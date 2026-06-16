"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid    = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll(".testi-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-testi-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" } }
      );

      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 80%" } }
      );
    }, section);

    if (!("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          (card as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          (card as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        });
      };
      grid.addEventListener("mousemove", onMouseMove);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full pt-10 pb-20 md:pt-14 md:pb-28 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: "#fce7f3" }}
    >
      {/* Rose grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,29,72,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)",
        }}
      />

      {/* Center orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(225,29,72,0.05)", filter: "blur(160px)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="fade-up-testi-header opacity-0 flex flex-col items-center text-center mb-20 gap-3">
          <div
            className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5"
            style={{ color: "#e11d48" }}
          >
            <span>✦</span> What people say
          </div>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight"
            style={{ color: "#1a0008" }}
          >
            Loved by founders, PMs &amp; operators.
          </h2>
        </div>

        {/* Cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 group">
          {TESTIMONIALS.map(({ quote, name, role, initials }) => (
            <div
              key={name}
              className="testi-card opacity-0 relative p-8 rounded-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.60)",
                border: "1px solid rgba(225,29,72,0.10)",
                boxShadow: "0 8px 28px rgba(225,29,72,0.06)",
                backgroundImage: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(225,29,72,0.07), transparent 45%)`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background  = "rgba(255,255,255,0.85)";
                el.style.borderColor = "rgba(225,29,72,0.22)";
                el.style.boxShadow   = "0 16px 40px rgba(225,29,72,0.12)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background  = "rgba(255,255,255,0.60)";
                el.style.borderColor = "rgba(225,29,72,0.10)";
                el.style.boxShadow   = "0 8px 28px rgba(225,29,72,0.06)";
              }}
            >
              {/* Spotlight shimmer on border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(225,29,72,0.08), transparent 60%)`,
                  WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                }}
              />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4"
                      style={{ color: "#e11d48", fill: "rgba(225,29,72,0.85)", filter: "drop-shadow(0 0 4px rgba(225,29,72,0.35))" }}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-[15px] leading-relaxed font-medium tracking-wide mb-8 italic"
                  style={{ color: "#7f1d1d" }}
                >
                  {quote}
                </p>
              </div>

              {/* Author */}
              <div
                className="flex items-center gap-3.5 pt-5 mt-auto"
                style={{ borderTop: "1px solid rgba(225,29,72,0.10)" }}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, rgba(254,205,211,0.8), rgba(252,231,243,0.9))",
                    border: "1px solid rgba(225,29,72,0.20)",
                    color: "#be123c",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  {initials}
                </div>

                <div className="flex flex-col">
                  <div
                    className="text-sm font-bold tracking-tight"
                    style={{ color: "#1a0008" }}
                  >
                    {name}
                  </div>
                  <div
                    className="text-[11px] font-semibold tracking-wide mt-0.5"
                    style={{ color: "#be123c" }}
                  >
                    {role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote: '"I used to spend 90 minutes on email every morning. Now it\'s 15. Super-Power handles everything I\'d normally delay or forget."',
    name: "Arjun Rao",
    role: "Founder, Stealth SaaS",
    initials: "AR",
  },
  {
    quote: '"Scheduling alone is worth it. Said \'set up a kickoff with design\' and three invites went out before I finished my coffee."',
    name: "Maya Liu",
    role: "Senior PM, Series B",
    initials: "ML",
  },
  {
    quote: '"The reply drafts are frighteningly good. My team thought I hired a comms consultant — it just learned from my existing emails."',
    name: "Clara Kim",
    role: "COO, Fintech scale-up",
    initials: "CK",
  },
];