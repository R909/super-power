"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll(".testi-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-testi-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" }
        }
      );

      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 80%" }
        }
      );
    }, section);

    if (!("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
          (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
        });
      };

      grid.addEventListener("mousemove", onMouseMove);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#030712] pt-10 pb-20 md:pt-14 md:pb-28 px-6 md:px-12 overflow-hidden" id="testimonials">

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,_black_60%,_transparent_100%)] z-0" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.015] blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="fade-up-testi-header opacity-0 flex flex-col items-center text-center mb-20 gap-3">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
            <span>✦</span> What people say
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-xl leading-tight">
            Loved by founders, PMs &amp; operators.
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 group">
          {TESTIMONIALS.map(({ quote, name, role, initials }) => (
            <div
              key={name}
              className="testi-card opacity-0 relative p-8 rounded-2xl bg-[#090d16]/40 border border-white/[0.04] backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:bg-[#090d16]/70 hover:border-amber-500/20 shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              style={{
                backgroundImage: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245,158,11,0.08), transparent 45%)`
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245,158,11,0.15), transparent 60%)`,
                  maskImage: 'linear-gradient(black, black) translate(1px, 1px) exclude',
                  WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '1px'
                }}
              />

              <div>
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400/90 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[15px] text-slate-300 leading-relaxed font-medium tracking-wide mb-8 italic">
                  {quote}
                </p>
              </div>

              <div className="flex items-center gap-3.5 border-t border-white/[0.03] pt-5 mt-auto">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#312713] to-[#1e170a] border border-amber-500/20 text-xs font-black text-amber-300 shadow-inner tracking-wider">
                  {initials}
                </div>

                <div className="flex flex-col">
                  <div className="text-sm font-bold text-white tracking-tight">
                    {name}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 tracking-wide mt-0.5">
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
