"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const cards = section.querySelectorAll(".process-card");

    const ctx = gsap.context(() => {
      // Fade and slide text content up smoothly
      gsap.fromTo(".fade-up-step-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 85%" } }
      );

      // Staggered reveal for the process panels
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".process-grid", start: "top 80%" }
        }
      );

      // --- SCROLL-BOUND CONNECTING LINE ---
      const pathLength = path.getTotalLength();
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".process-grid",
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.5,
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#030712] py-24 md:py-32 px-6 md:px-12 overflow-hidden" id="how-it-works">
      
      {/* Background Geometrics */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,_black_60%,_transparent_100%)] z-0" />
      
      {/* Soft Premium Amber Ambient Backdrop Glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.015] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Layout */}
        <div className="fade-up-step-header opacity-0 flex flex-col items-center text-center mb-24 gap-3">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
            <span>✦</span> How it works
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
            Three steps and your inbox will never stress you out again.
          </h2>
        </div>

        {/* Dynamic Connected Process Grid */}
        <div className="process-grid relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Animated Connecting Vector Path */}
          <div className="absolute top-[18%] left-[10%] right-[10%] h-1 pointer-events-none hidden lg:block z-0">
            <svg className="w-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,2 H 800" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Premium Luxury Gold/Amber Gradient Wire */}
              <path ref={pathRef} d="M 0,2 H 800" stroke="url(#goldLaserGradient)" strokeWidth="2" />
              <defs>
                <linearGradient id="goldLaserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* STEP 1 */}
          <div className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl bg-[#090d16]/50 border border-white/[0.04] backdrop-blur-xl z-10 group hover:border-amber-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                1
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-600 uppercase group-hover:text-amber-400/60 transition-colors">INIT_CONN</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Connect your accounts</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
              Link Gmail and Google Calendar with one click. Super-Power reads your history to understand your style and contacts.
            </p>

            {/* Terminal Window 1 */}
            <div className="w-full p-4 rounded-xl bg-[#03060b] border border-white/[0.03] font-mono text-xs text-slate-400 leading-6 shadow-inner">
              <div className="flex items-center gap-2 text-amber-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span>✓ gmail_auth_connected</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span>✓ gcal_sync_active</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500/60 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                <span className="tracking-wide">… learning_tone_matrices</span>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl bg-[#090d16]/50 border border-white/[0.04] backdrop-blur-xl z-10 group hover:border-amber-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                2
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-600 uppercase group-hover:text-amber-400/60 transition-colors">EXEC_TASK</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Give it a task</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
              Type a natural-language command — or let Super-Power surface tasks proactively from what&apos;s already in your inbox.
            </p>

            {/* Console Window 2 */}
            <div className="w-full p-4 rounded-xl bg-[#03060b] border border-white/[0.03] font-mono text-xs leading-6 shadow-inner">
              <div className="text-amber-400 flex items-center gap-1.5">
                <span className="text-slate-600">⌘</span> "Follow up with investors"
              </div>
              <div className="text-slate-500 mt-2 flex items-center gap-2 pl-3 border-l border-amber-500/10">
                <span className="w-1 h-1 rounded-full bg-amber-600 animate-bounce" />
                <span>parsing NLP matrix...</span>
              </div>
              <div className="text-yellow-500 pl-3 border-l border-amber-500/10">
                <span>→ drafting contextual reply</span>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="process-card opacity-0 relative flex flex-col p-7 md:p-8 rounded-2xl bg-[#090d16]/50 border border-white/[0.04] backdrop-blur-xl z-10 group hover:border-amber-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                3
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-600 uppercase group-hover:text-amber-400/60 transition-colors">DISPATCH</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Review &amp; send</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
              Every action shows what it did and why. Approve in one key, edit freely, or enable auto-send for trusted actions.
            </p>

            {/* Console Window 3 */}
            <div className="w-full p-4 rounded-xl bg-[#03060b] border border-white/[0.03] font-mono text-xs leading-5 shadow-inner">
              <div className="text-amber-400 font-bold mb-1 flex items-center justify-between">
                <span>DRAFT_READY ✦</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">v1.0</span>
              </div>
              <div className="text-slate-400 text-[11px] truncate mb-3">Re: Q3 Investor Update</div>
              
              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold border border-amber-500/20 text-center transition-all cursor-pointer">
                  [Send]
                </button>
                <button className="flex-1 py-1.5 rounded-md bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 font-bold border border-white/10 text-center transition-all cursor-pointer">
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