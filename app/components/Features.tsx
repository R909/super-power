"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const gridWrapper = gridWrapperRef.current;
    if (!section || !gridWrapper) return;

    const cards = gridWrapper.querySelectorAll<HTMLElement>(".feature-card");

    // --- PHASE 1: SCROLL ENTRANCE & INITIAL 3D PLANE POSITION ---
    const ctx = gsap.context(() => {
      // Fade and slide header up smoothly
      gsap.fromTo(".fade-up-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" }
        }
      );

      // Transition the entire grid wrapper into a subtle 3D angled plane on scroll
      gsap.fromTo(gridWrapper,
        { 
          opacity: 0, 
          y: 50,
          rotateX: 20, 
          rotateY: -10, 
          scale: 0.95 
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 12, // The premium baseline resting angle
          rotateY: -5,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: gridWrapper, start: "top 80%" }
        }
      );
    }, section);

    // --- PHASE 2: GLOBAL MOUSE PERSPECTIVE TRACKING ---
    if (!("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        
        // Normalize mouse coordinates from -0.5 to 0.5 across the whole screen
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Shift the entire grid's perspective plane subtly based on mouse coordinates
        gsap.to(gridWrapper, {
          rotateX: 12 - y * 15, // Blends resting angle with dynamic feedback
          rotateY: -5 + x * 15,
          ease: "power2.out",
          duration: 0.5,
        });

        // Calculate card-local lighting spotlight variables
        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const cx = e.clientX - cardRect.left;
          const cy = e.clientY - cardRect.top;
          card.style.setProperty("--mouse-x", `${cx}px`);
          card.style.setProperty("--mouse-y", `${cy}px`);
        });
      };

      const onMouseLeave = () => {
        // Return whole deck smoothly to baseline resting matrix coordinates
        gsap.to(gridWrapper, {
          rotateX: 12,
          rotateY: -5,
          ease: "power3.out",
          duration: 0.8,
        });
      };

      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#030712] py-24 md:py-32 px-6 md:px-12 overflow-hidden [perspective:1500px]" 
      id="features"
    >
      {/* Background Geometrics */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.004)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.004)_1px,_transparent_1px)] bg-[size:80px_80px] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/[0.01] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="fade-up-header opacity-0 flex flex-col items-center text-center mb-24 gap-3">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500/80">
            ✦ Features
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-xl leading-tight">
            Six superpowers for your inbox.
          </h2>
        </div>

        {/* Unified 3D Perspective Plane Wrapper */}
        <div 
          ref={gridWrapperRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 group will-change-transform [transform-style:preserve-3d]"
          style={{ transformPerspective: "1500px" }}
        >
          {FEATURES.map(({ icon, color, title, desc }) => {
            const glowColor = 
              color === "ic-pink" ? "rgba(244,63,94,0.12)" :
              color === "ic-lav"  ? "rgba(168,85,247,0.12)" :
              "rgba(45,212,191,0.12)";

            return (
              <div 
                key={title} 
                className="feature-card relative p-8 rounded-xl bg-[#0b101d]/40 border border-white/[0.04] overflow-hidden transition-all duration-300 ease-out hover:bg-[#0b101d]/80 hover:border-white/10 hover:[transform:translateZ(20px)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] [transform-style:preserve-3d] will-change-transform"
                style={{
                  backgroundImage: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 40%)`
                }}
              >
                {/* Micro-Highlight Outer Border Tracking Edge */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.07), transparent 60%)`,
                    maskImage: 'linear-gradient(black, black) translate(1px, 1px) exclude',
                    WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px'
                  }}
                />

                {/* Content Layers with Internal Z-Space Elevation */}
                <div className="text-2xl mb-4 [transform:translateZ(10px)]">{icon}</div>

                <div className="text-lg font-bold text-white tracking-tight mb-2 [transform:translateZ(15px)]">
                  {title}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed font-normal [transform:translateZ(5px)]">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: "🧠", color: "ic-pink", title: "Smart Inbox Triage", desc: "Reads every thread, surfaces only what needs you, and quietly handles the rest. Your inbox becomes a curated to-do list." },
  { icon: "📅", color: "ic-lav",  title: "Autonomous Scheduling", desc: "Just say who and when. Super-Power finds availability, creates the event, and sends the invite — zero back-and-forth." },
  { icon: "✍️", color: "ic-mint", title: "Reply in Your Voice", desc: "Drafts responses that sound exactly like you, trained on your writing style. One click to send or tweak." },
  { icon: "🔗", color: "ic-pink", title: "Thread Memory", desc: "Remembers context across emails and calendar history. You'll never need to scroll back through old threads again." },
  { icon: "🔒", color: "ic-lav",  title: "Zero-Knowledge Privacy", desc: "Your email content never trains AI models. All processing is encrypted and completely isolated to your account." },
  { icon: "⚡", color: "ic-mint", title: "Command Anywhere", desc: "A global shortcut opens the command bar from anywhere on screen. Type in plain English, done in seconds." },
];