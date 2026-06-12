"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiGmail,
  SiGooglecalendar,
  SiSlack,
  SiNotion,
  SiZoom,
  SiGithub,
  SiDropbox,
  SiTrello,
  SiGooglemeet,
  SiGoogledrive,
} from "react-icons/si";

import Background from "@/app/components/Background";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Marquee from "@/app/components/Marquee";
import Features from "@/app/components/Features";
import HowItWorks from "@/app/components/HowItWorks";
import Testimonials from "@/app/components/Testimonials";
import CTA from "@/app/components/CTA";
import Footer from "@/app/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [
  { Icon: SiGmail,          bg: "#EA4335", label: "Gmail"    },
  { Icon: SiGooglecalendar, bg: "#4285F4", label: "Calendar" },
  { Icon: SiSlack,          bg: "#611f69", label: "Slack"    },
  { Icon: SiNotion,         bg: "#F4511E", label: "Notion"   },
  { Icon: SiZoom,           bg: "#2D8CFF", label: "Zoom"     },
  { Icon: SiGithub,         bg: "#24292e", label: "GitHub"   },
  { Icon: SiDropbox,        bg: "#0061FF", label: "Dropbox"  },
  { Icon: SiTrello,         bg: "#F7B731", label: "Trello"   },
  { Icon: SiGooglemeet,     bg: "#00897B", label: "Meet"     },
  { Icon: SiGoogledrive,    bg: "#34A853", label: "Drive"    },
];

// Final resting positions of each tile (offset from viewport center)
const SCATTERED = [
  { x: -295, y: -198, r: -18, s: 1.05 },
  { x: -132, y: -258, r:   8, s: 0.88 },
  { x:   44, y: -268, r: -12, s: 1.00 },
  { x:  194, y: -218, r:  15, s: 0.90 },
  { x:  308, y: -128, r:  -8, s: 0.85 },
  { x: -328, y:  -42, r:  12, s: 1.00 },
  { x: -312, y:  118, r: -15, s: 0.90 },
  { x:  332, y:   34, r: -10, s: 1.00 },
  { x:  308, y:  178, r:   9, s: 0.85 },
  { x:  -82, y:  204, r:  10, s: 0.88 },
];

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const icons = gsap.utils.toArray<HTMLElement>(".anim-icon");

      // Start at laptop screen center, invisible
      gsap.set(icons, { x: 0, y: -48, scale: 0, opacity: 0, rotation: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2200",
          scrub: 1.5,
          pin: true,
        },
      });

      // Burst from screen out to scattered positions
      icons.forEach((icon, i) => {
        const p = SCATTERED[i];
        tl.to(
          icon,
          { x: p.x, y: p.y, rotation: p.r, scale: p.s, opacity: 1,
            duration: 1.2, ease: "power3.out" },
          i * 0.08,
        );
      });

      // Hold the scattered state
      tl.to({}, { duration: 1.0 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ════ INTRO: laptop + flying icons ════ */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at 50% 40%, #93b3cc 0%, #5e829f 45%, #3b5e7e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ── CSS Laptop ── */}
        <div
          style={{
            position: "relative",
            width: 540,
            height: 355,
            flexShrink: 0,
            zIndex: 5,
            transform: "perspective(1400px) rotateX(4deg)",
          }}
        >
          {/* Screen lid */}
          <div
            style={{
              position: "absolute",
              top: 0, left: "3%",
              width: "94%", height: "70%",
              background: "#1c1c1e",
              borderRadius: "14px 14px 0 0",
              padding: 10,
              boxShadow: "0 0 0 1.5px #2d2d2d, 0 24px 80px rgba(0,0,0,0.55)",
            }}
          >
            {/* Screen glass */}
            <div
              style={{
                width: "100%", height: "100%",
                background: "linear-gradient(140deg, #f8f8f8 0%, #ececec 100%)",
                borderRadius: 6,
                overflow: "hidden",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                padding: 20,
                alignContent: "flex-start",
              }}
            >
              {ICONS.slice(0, 6).map(({ Icon, bg, label }, i) => (
                <div
                  key={i}
                  style={{
                    width: 42, height: 42,
                    borderRadius: 10,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px ${bg}55`,
                  }}
                >
                  <Icon size={21} color="#fff" title={label} />
                </div>
              ))}
            </div>
            {/* Glare */}
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.08) 0%, transparent 55%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Hinge */}
          <div
            style={{
              position: "absolute",
              top: "69.5%", left: "2%",
              width: "96%", height: 8,
              background: "linear-gradient(180deg, #9a9a9a 0%, #7a7a7a 100%)",
              borderRadius: "0 0 4px 4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          />

          {/* Keyboard base */}
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0,
              width: "100%", height: "33%",
              background: "linear-gradient(180deg, #d2d2d2 0%, #bebebe 100%)",
              borderRadius: "0 0 16px 16px",
              border: "1px solid #aaa",
              boxShadow:
                "0 10px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.55)",
            }}
          >
            {/* Key rows */}
            <div
              style={{
                padding: "10px 24px 0",
                display: "flex", flexDirection: "column", gap: 4,
              }}
            >
              {([13, 13, 11] as number[]).map((count, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "flex", gap: 3,
                    width: ri === 2 ? "82%" : "100%",
                    margin: "0 auto",
                  }}
                >
                  {Array.from({ length: count }).map((_, ki) => (
                    <div
                      key={ki}
                      style={{
                        flex: 1, height: 7,
                        background: "#c2c2c2",
                        borderRadius: 2,
                        border: "0.5px solid #b0b0b0",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Touchpad */}
            <div
              style={{
                position: "absolute",
                bottom: "12%", left: "50%",
                transform: "translateX(-50%)",
                width: "26%", height: "38%",
                background: "#c0c0c0",
                borderRadius: 6,
                border: "0.5px solid #aaa",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            />
          </div>

          {/* Ground shadow */}
          <div
            style={{
              position: "absolute",
              bottom: -28, left: "6%",
              width: "88%", height: 28,
              background: "rgba(0,0,0,0.22)",
              filter: "blur(18px)",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* ── Flying icon tiles ── */}
        {ICONS.map(({ Icon, bg, label }, i) => (
          <div
            key={i}
            className="anim-icon"
            style={{
              position: "absolute",
              width: 70, height: 70,
              borderRadius: 18,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 16px 48px ${bg}77, 0 4px 16px rgba(0,0,0,0.35)`,
              zIndex: 10,
              willChange: "transform, opacity",
            }}
          >
            <Icon size={32} color="#fff" title={label} />
          </div>
        ))}

        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
            color: "rgba(255,255,255,0.45)",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}
        >
          <span>Scroll to explore</span>
          <div
            style={{
              width: 20, height: 32,
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: 10,
              display: "flex", justifyContent: "center",
              paddingTop: 5,
            }}
          >
            <div
              style={{
                width: 3, height: 6,
                background: "rgba(255,255,255,0.4)",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      </div>

      {/* ════ REST OF LANDING PAGE ════ */}
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
