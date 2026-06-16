"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section     = sectionRef.current;
    const gridWrapper = gridWrapperRef.current;
    if (!section || !gridWrapper) return;

    const cards = gridWrapper.querySelectorAll<HTMLElement>(".feature-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        }
      );

      gsap.fromTo(gridWrapper,
        { opacity: 0, y: 50, rotateX: 20, rotateY: -10, scale: 0.95 },
        {
          opacity: 1, y: 0, rotateX: 12, rotateY: -5, scale: 1,
          duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: gridWrapper, start: "top 80%" },
        }
      );
    }, section);

    if (!("ontouchstart" in window)) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        gsap.to(gridWrapper, {
          rotateX: 12 - y * 15,
          rotateY: -5 + x * 15,
          ease: "power2.out",
          duration: 0.5,
        });

        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - cardRect.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - cardRect.top}px`);
        });
      };

      const onMouseLeave = () => {
        gsap.to(gridWrapper, {
          rotateX: 12, rotateY: -5,
          ease: "power3.out", duration: 0.8,
        });
      };

      section.addEventListener("mousemove",  onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 overflow-hidden [perspective:1500px]"
      style={{ backgroundColor: "#fce7f3" }}
    >
      {/* Rose grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,29,72,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Center orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(225,29,72,0.05)", filter: "blur(150px)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="fade-up-header opacity-0 flex flex-col items-center text-center gap-3 mb-14">
          <div
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: "#e11d48" }}
          >
            ✦ Features
          </div>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight"
            style={{ color: "#1a0008" }}
          >
            Six superpowers for your inbox.
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridWrapperRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 group will-change-transform [transform-style:preserve-3d]"
          style={{ transformPerspective: "1500px" }}
        >
          {FEATURES.map(({ icon, color, title, desc }) => {
            // Rose-tinted glow per card variant
            const glowColor =
              color === "ic-pink" ? "rgba(225,29,72,0.10)"  :
              color === "ic-lav"  ? "rgba(251,113,133,0.10)" :
                                    "rgba(253,164,175,0.09)";

            return (
              <div
                key={title}
                className="feature-card relative p-8 rounded-xl overflow-hidden transition-all duration-300 ease-out [transform-style:preserve-3d] will-change-transform"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(225,29,72,0.10)",
                  backgroundImage: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 40%)`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background   = "rgba(255,255,255,0.85)";
                  el.style.borderColor  = "rgba(225,29,72,0.22)";
                  el.style.boxShadow    = "0 20px 50px rgba(225,29,72,0.12)";
                  el.style.transform    = "translateZ(20px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background  = "rgba(255,255,255,0.55)";
                  el.style.borderColor = "rgba(225,29,72,0.10)";
                  el.style.boxShadow   = "none";
                  el.style.transform   = "";
                }}
              >
                {/* Spotlight border shimmer */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(225,29,72,0.06), transparent 60%)`,
                    WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1px",
                  }}
                />

                <div className="text-2xl mb-4 [transform:translateZ(10px)]">{icon}</div>

                <div
                  className="text-lg font-bold tracking-tight mb-2 [transform:translateZ(15px)]"
                  style={{ color: "#1a0008" }}
                >
                  {title}
                </div>

                <p
                  className="text-sm leading-relaxed font-normal [transform:translateZ(5px)]"
                  style={{ color: "#7f1d1d" }}
                >
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
  { icon: "🧠", color: "ic-pink", title: "Smart Inbox Triage",        desc: "Reads every thread, surfaces only what needs you, and quietly handles the rest. Your inbox becomes a curated to-do list."              },
  { icon: "📅", color: "ic-lav",  title: "Autonomous Scheduling",      desc: "Just say who and when. Super-Power finds availability, creates the event, and sends the invite — zero back-and-forth."                  },
  { icon: "✍️", color: "ic-mint", title: "Reply in Your Voice",        desc: "Drafts responses that sound exactly like you, trained on your writing style. One click to send or tweak."                               },
  { icon: "🔗", color: "ic-pink", title: "Thread Memory",              desc: "Remembers context across emails and calendar history. You'll never need to scroll back through old threads again."                        },
  { icon: "🔒", color: "ic-lav",  title: "Zero-Knowledge Privacy",     desc: "Your email content never trains AI models. All processing is encrypted and completely isolated to your account."                          },
  { icon: "⚡", color: "ic-mint", title: "Command Anywhere",           desc: "A global shortcut opens the command bar from anywhere on screen. Type in plain English, done in seconds."                                 },
];