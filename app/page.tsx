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
  { Icon: SiGmail,          color: "#EA4335", label: "Gmail" },
  { Icon: SiGooglecalendar, color: "#4285F4", label: "Calendar" },
  { Icon: SiSlack,          color: "#611f69", label: "Slack" },
  { Icon: SiNotion,         color: "#1a1a1a", label: "Notion" },
  { Icon: SiZoom,           color: "#2D8CFF", label: "Zoom" },
  { Icon: SiGithub,         color: "#24292e", label: "GitHub" },
  { Icon: SiDropbox,        color: "#0061FF", label: "Dropbox" },
  { Icon: SiTrello,         color: "#0052CC", label: "Trello" },
  { Icon: SiGooglemeet,     color: "#00897B", label: "Meet" },
  { Icon: SiGoogledrive,    color: "#34A853", label: "Drive" },
];

// Deterministic confetti spread using prime multiplication for visual variety
const CONFETTI_COLORS = ["#f472b6", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#fb923c"];
const CONFETTI = Array.from({ length: 60 }, (_, i) => ({
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 4 + (i % 5) * 2,
  angle: (i / 60) * 360 + ((i * 13) % 22) - 11,
  dist: 70 + ((i * 43) % 190),
}));

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const icons = gsap.utils.toArray<HTMLElement>(".anim-icon");
      const NUM = icons.length;
      const VW = window.innerWidth;
      const VH = window.innerHeight;
      const R = Math.min(VW * 0.30, VH * 0.28, 230);

      // ── INITIAL SCATTER (golden-angle phyllotaxis pattern for natural scatter) ──
      const PHI_RAD = 2.39996; // golden angle in radians
      const scatterR = Math.min(VW * 0.40, VH * 0.38, 300);

      gsap.set(icons, {
        x: (i) => Math.cos(i * PHI_RAD) * scatterR * (0.45 + ((i * 7) % 10) * 0.055),
        y: (i) => Math.sin(i * PHI_RAD) * scatterR * (0.45 + ((i * 7) % 10) * 0.055) * 0.72,
        rotation: (i) => ((i * 23) % 50) - 25,
        opacity: 1,
        scale: 1,
      });

      gsap.set(".sp-box",        { opacity: 0, scale: 0.2 });
      gsap.set(".confetti-dot",  { opacity: 0, scale: 0, x: 0, y: 0 });
      gsap.set(".box-tagline",   { opacity: 0, y: 14 });

      // Pre-compute orbit positions (evenly spaced, starting from top)
      const orbitPos = icons.map((_, i) => {
        const angle = (i / NUM) * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(angle) * R, y: Math.sin(angle) * R };
      });

      // ── SCROLL-DRIVEN TIMELINE ────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=4800",
          scrub: 1.5,
          pin: true,
        },
      });

      // PHASE 1 — Icons gather to orbit  (t: 0 → 1.5)
      icons.forEach((icon, i) => {
        tl.to(icon, {
          x: orbitPos[i].x,
          y: orbitPos[i].y,
          rotation: 0,
          duration: 1.2,
          ease: "power3.inOut",
        }, i * 0.07);
      });

      // PHASE 2 — Orbit (one full revolution)  (t: 1.8 → 4.4)
      const xSet = icons.map((el) => gsap.quickSetter(el, "x", "px"));
      const ySet = icons.map((el) => gsap.quickSetter(el, "y", "px"));
      const orbitProxy = { t: 0 };

      tl.to(orbitProxy, {
        t: 1,
        duration: 2.6,
        ease: "none",
        onUpdate() {
          const delta = orbitProxy.t * Math.PI * 2;
          for (let i = 0; i < NUM; i++) {
            const a = (i / NUM) * Math.PI * 2 - Math.PI / 2 + delta;
            xSet[i](Math.cos(a) * R);
            ySet[i](Math.sin(a) * R);
          }
        },
      }, 1.8);

      // PHASE 3 — Box appears + icons collapse  (t: 4.5 → 5.8)
      tl.to(".sp-box", {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "back.out(2.5)",
      }, 4.5);

      // Snap icons to known orbit positions before collapse
      // (after exactly one revolution they're back at orbitPos)
      icons.forEach((icon, i) => {
        tl.set(icon, { x: orbitPos[i].x, y: orbitPos[i].y }, 4.45);
      });

      tl.to(icons, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.75,
        stagger: { each: 0.05, from: "random" },
        ease: "back.in(2.5)",
      }, 4.6);

      // PHASE 4 — Celebration  (t: 5.6 → 7.2)
      tl.to(".sp-box", {
        boxShadow:
          "0 0 0 6px rgba(244,114,182,0.25), 0 0 80px rgba(244,114,182,0.75), 0 0 180px rgba(167,139,250,0.55)",
        duration: 0.45,
      }, 5.6);

      tl.to(
        ".confetti-dot",
        {
          opacity: 1,
          scale: 1,
          x: (i: number) =>
            Math.cos((CONFETTI[i].angle * Math.PI) / 180) * CONFETTI[i].dist,
          y: (i: number) =>
            Math.sin((CONFETTI[i].angle * Math.PI) / 180) * CONFETTI[i].dist,
          duration: 0.55,
          stagger: { each: 0.006, from: "center" },
          ease: "power3.out",
        },
        5.7
      );

      tl.to(".confetti-dot", {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        stagger: { each: 0.005, from: "end" },
      }, 6.4);

      tl.to(".box-tagline", {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 6.0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════════
          INTRO ANIMATION SECTION
      ════════════════════════════════════════════════ */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(145deg, #0b0118 0%, #19082e 38%, #091628 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Ambient glow blobs */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 75% 55% at 18% 22%, rgba(167,139,250,0.16) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 65% 50% at 82% 78%, rgba(244,114,182,0.13) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 45% 40% at 50% 55%, rgba(52,211,153,0.07) 0%, transparent 70%)",
        }} />

        {/* Top ambient label */}
        <div style={{
          position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 22px",
          background: "rgba(255,255,255,0.055)",
          backdropFilter: "blur(14px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 999,
          color: "rgba(255,255,255,0.45)",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.09em", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          <span style={{ color: "#f472b6", fontSize: 14 }}>⚡</span>
          Connect all your apps · Let AI handle the rest
        </div>

        {/* ── Central Super-Power box ── */}
        <div
          className="sp-box"
          style={{
            position: "absolute",
            width: 192,
            height: 192,
            borderRadius: 32,
            background:
              "linear-gradient(145deg, rgba(244,114,182,0.18) 0%, rgba(167,139,250,0.22) 55%, rgba(52,211,153,0.10) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            border: "1.5px solid rgba(255,255,255,0.16)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(167,139,250,0.35), 0 0 120px rgba(244,114,182,0.12), inset 0 1px 0 rgba(255,255,255,0.18)",
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 46 }}>⚡</div>
          <div
            style={{
              fontFamily: "var(--font-nunito, sans-serif)",
              fontSize: 21,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.4px",
            }}
          >
            Super-Power
          </div>
          <div
            className="box-tagline"
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.52)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            All your apps. One AI.
          </div>
        </div>

        {/* ── Confetti particles ── */}
        {CONFETTI.map((p, i) => (
          <div
            key={i}
            className="confetti-dot"
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              zIndex: 15,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}99`,
            }}
          />
        ))}

        {/* ── App icons ── */}
        {ICONS.map(({ Icon, color, label }, i) => (
          <div
            key={i}
            className="anim-icon"
            style={{
              position: "absolute",
              width: 66,
              height: 66,
              borderRadius: 20,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 10px 44px rgba(0,0,0,0.32), 0 2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,1)",
              border: "1.5px solid rgba(255,255,255,0.82)",
              zIndex: 10,
              willChange: "transform",
            }}
          >
            <Icon size={32} color={color} title={label} />
          </div>
        ))}

        {/* ── Scroll cue ── */}
        <div
          className="scroll-cue"
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 9,
            color: "rgba(255,255,255,0.32)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>Scroll to see the magic</span>
          <div
            style={{
              width: 20,
              height: 34,
              border: "1.5px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              paddingTop: 5,
            }}
          >
            <div className="scroll-mouse-dot" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          MAIN LANDING PAGE CONTENT
      ════════════════════════════════════════════════ */}
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
