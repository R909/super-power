"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path    = pathRef.current;
    if (!section || !path) return;

    const cards = section.querySelectorAll(".process-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-step-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" } }
      );

      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ".process-grid", start: "top 80%" } }
      );

      const pathLength = path.getTotalLength();
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.to(path, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".process-grid", start: "top 70%", end: "bottom 60%", scrub: 0.5 },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
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

      {/* Top orb */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(225,29,72,0.06)", filter: "blur(150px)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="fade-up-step-header opacity-0 flex flex-col items-center text-center mb-24 gap-3">
          <div
            className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5"
            style={{ color: "#e11d48" }}
          >
            <span>✦</span> How it works
          </div>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl leading-tight"
            style={{ color: "#1a0008" }}
          >
            Three steps and your inbox will never stress you out again.
          </h2>
        </div>

        {/* Grid */}
        <div className="process-grid relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* Connector line */}
          <div className="absolute top-[18%] left-[10%] right-[10%] h-1 pointer-events-none hidden lg:block z-0">
            <svg className="w-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,2 H 800" stroke="rgba(225,29,72,0.10)" strokeWidth="1.5" strokeDasharray="4 4" />
              <path ref={pathRef} d="M 0,2 H 800" stroke="url(#roseLaserGradient)" strokeWidth="2" />
              <defs>
                <linearGradient id="roseLaserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#fb7185" />
                  <stop offset="50%"  stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Card 1 ── */}
          <div
            className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl backdrop-blur-xl z-10 group transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.60)",
              border: "1px solid rgba(225,29,72,0.10)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "0 12px 40px rgba(225,29,72,0.10)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.10)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "none";
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black"
                style={{
                  background: "rgba(225,29,72,0.08)",
                  border: "1px solid rgba(225,29,72,0.20)",
                  color: "#e11d48",
                  boxShadow: "0 0 15px rgba(225,29,72,0.12)",
                }}
              >1</div>
              <span
                className="text-[10px] font-mono tracking-wider uppercase transition-colors"
                style={{ color: "#c084a0" }}
              >INIT_CONN</span>
            </div>

            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: "#1a0008" }}>
              Connect your accounts
            </h3>
            <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: "#7f1d1d" }}>
              Link Gmail and Google Calendar with one click. Super-Power reads your history to understand your style and contacts.
            </p>

            {/* Terminal block */}
            <div
              className="w-full p-4 rounded-xl font-mono text-xs leading-6"
              style={{ background: "rgba(255,240,242,0.7)", border: "1px solid rgba(225,29,72,0.10)" }}
            >
              <div className="flex items-center gap-2" style={{ color: "#e11d48" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#e11d48", boxShadow: "0 0 8px rgba(225,29,72,0.5)" }} />
                ✓ gmail_auth_connected
              </div>
              <div className="flex items-center gap-2" style={{ color: "#e11d48" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#e11d48", boxShadow: "0 0 8px rgba(225,29,72,0.5)" }} />
                ✓ gcal_sync_active
              </div>
              <div className="flex items-center gap-2 mt-1" style={{ color: "#be123c" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: "#fb7185" }} />
                … learning_tone_matrices
              </div>
            </div>
          </div>

          {/* ── Card 2 ── */}
          <div
            className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl backdrop-blur-xl z-10 group transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.60)",
              border: "1px solid rgba(225,29,72,0.10)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "0 12px 40px rgba(225,29,72,0.10)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.10)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "none";
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black"
                style={{
                  background: "rgba(225,29,72,0.08)",
                  border: "1px solid rgba(225,29,72,0.20)",
                  color: "#e11d48",
                  boxShadow: "0 0 15px rgba(225,29,72,0.12)",
                }}
              >2</div>
              <span
                className="text-[10px] font-mono tracking-wider uppercase"
                style={{ color: "#c084a0" }}
              >EXEC_TASK</span>
            </div>

            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: "#1a0008" }}>
              Give it a task
            </h3>
            <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: "#7f1d1d" }}>
              Type a natural-language command — or let Super-Power surface tasks proactively from what&apos;s already in your inbox.
            </p>

            <div
              className="w-full p-4 rounded-xl font-mono text-xs leading-6"
              style={{ background: "rgba(255,240,242,0.7)", border: "1px solid rgba(225,29,72,0.10)" }}
            >
              <div className="flex items-center gap-1.5" style={{ color: "#e11d48" }}>
                <span style={{ color: "#c084a0" }}>⌘</span> "Follow up with investors"
              </div>
              <div
                className="mt-2 flex items-center gap-2 pl-3"
                style={{ color: "#be123c", borderLeft: "1px solid rgba(225,29,72,0.15)" }}
              >
                <span className="w-1 h-1 rounded-full animate-bounce" style={{ background: "#fb7185" }} />
                parsing NLP matrix...
              </div>
              <div
                className="pl-3"
                style={{ color: "#9f1239", borderLeft: "1px solid rgba(225,29,72,0.15)" }}
              >
                → drafting contextual reply
              </div>
            </div>
          </div>

          {/* ── Card 3 ── */}
          <div
            className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl backdrop-blur-xl z-10 group transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.60)",
              border: "1px solid rgba(225,29,72,0.10)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "0 12px 40px rgba(225,29,72,0.10)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.10)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "none";
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black"
                style={{
                  background: "rgba(225,29,72,0.08)",
                  border: "1px solid rgba(225,29,72,0.20)",
                  color: "#e11d48",
                  boxShadow: "0 0 15px rgba(225,29,72,0.12)",
                }}
              >3</div>
              <span
                className="text-[10px] font-mono tracking-wider uppercase"
                style={{ color: "#c084a0" }}
              >DISPATCH</span>
            </div>

            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: "#1a0008" }}>
              Review &amp; send
            </h3>
            <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: "#7f1d1d" }}>
              Every action shows what it did and why. Approve in one key, edit freely, or enable auto-send for trusted actions.
            </p>

            <div
              className="w-full p-4 rounded-xl font-mono text-xs leading-5"
              style={{ background: "rgba(255,240,242,0.7)", border: "1px solid rgba(225,29,72,0.10)" }}
            >
              <div className="font-bold mb-1 flex items-center justify-between" style={{ color: "#e11d48" }}>
                <span>DRAFT_READY ✦</span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(225,29,72,0.08)",
                    color: "#be123c",
                    border: "1px solid rgba(225,29,72,0.18)",
                  }}
                >v1.0</span>
              </div>
              <div className="text-[11px] truncate mb-3" style={{ color: "#7f1d1d" }}>
                Re: Q3 Investor Update
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 py-1.5 rounded-md font-bold text-center transition-all cursor-pointer"
                  style={{
                    background: "rgba(225,29,72,0.08)",
                    color: "#e11d48",
                    border: "1px solid rgba(225,29,72,0.20)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(225,29,72,0.16)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(225,29,72,0.08)")}
                >
                  [Send]
                </button>
                <button
                  className="flex-1 py-1.5 rounded-md font-bold text-center transition-all cursor-pointer"
                  style={{
                    background: "rgba(225,29,72,0.04)",
                    color: "#be123c",
                    border: "1px solid rgba(225,29,72,0.12)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(225,29,72,0.09)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(225,29,72,0.04)")}
                >
                  [Edit]
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}