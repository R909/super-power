"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    desc: "Try Super-Power risk-free. No credit card, no commitment.",
    cta: "Get started free",
    gradient: false,
    badge: null,
    features: [
      "50 AI actions per month",
      "Gmail integration",
      "Basic scheduling",
      "7-day email history",
      "Community support",
    ],
  },
  {
    name: "Pro",
    monthly: 19,
    annual: 15,
    desc: "For busy professionals who want to move at 10× speed.",
    cta: "Start 14-day trial",
    badge: "Most Popular",
    gradient: true,
    features: [
      "Unlimited AI actions",
      "Gmail + Calendar OS",
      "Reply in your voice",
      "Thread memory (1 year)",
      "Custom commands",
      "Priority support",
    ],
  },
  {
    name: "Team",
    monthly: 49,
    annual: 39,
    desc: "AI-powered collaboration for fast-moving teams at scale.",
    cta: "Talk to sales",
    gradient: false,
    badge: null,
    features: [
      "Everything in Pro",
      "Up to 25 seats",
      "Shared inbox triage",
      "Team calendar sync",
      "Analytics dashboard",
      "SSO & SCIM",
    ],
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up-pricing-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" } }
      );

      gsap.fromTo(".pricing-card",
        { opacity: 0, y: 50, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 80%" } }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
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
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Center orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: "linear-gradient(90deg, rgba(225,29,72,0.06), rgba(251,113,133,0.04), rgba(225,29,72,0.06))",
          filter: "blur(140px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="fade-up-pricing-header opacity-0 flex flex-col items-center text-center mb-14 gap-3">
          <div
            className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5"
            style={{ color: "#e11d48" }}
          >
            <span>✦</span> Pricing
          </div>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight"
            style={{ color: "#1a0008" }}
          >
            Simple, transparent pricing.
          </h2>
          <p className="text-sm max-w-sm leading-relaxed mt-1" style={{ color: "#7f1d1d" }}>
            Start for free. Upgrade when you need more power.
          </p>

          {/* Toggle */}
          <div
            className="flex items-center gap-3 mt-6 rounded-full px-5 py-2.5"
            style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(225,29,72,0.12)" }}
          >
            <span className="text-xs font-bold transition-colors duration-200"
              style={{ color: !annual ? "#1a0008" : "#c084a0" }}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual((v) => !v)}
              aria-label="Toggle annual billing"
              className="relative flex-shrink-0 rounded-full transition-colors duration-300"
              style={{
                width: 40, height: 22,
                background: annual ? "#e11d48" : "rgba(225,29,72,0.12)",
              }}
            >
              <span
                className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform duration-300"
                style={{ transform: annual ? "translateX(18px)" : "translateX(0)" }}
              />
            </button>
            <span className="text-xs font-bold transition-colors duration-200"
              style={{ color: annual ? "#1a0008" : "#c084a0" }}>
              Annual
            </span>
            <span
              className="text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide"
              style={{ color: "#be123c", background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.18)" }}
            >
              Save 20%
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => {
            const price      = annual ? tier.annual : tier.monthly;
            const yearSaving = tier.monthly > 0 ? (tier.monthly - tier.annual) * 12 : 0;

            const cardContent = (
              <div
                className={`relative flex flex-col h-full p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                  tier.gradient ? "" : ""
                }`}
                style={
                  tier.gradient
                    ? {
                        background: "rgba(255,255,255,0.90)",
                        boxShadow: "0 8px 32px rgba(225,29,72,0.12)",
                      }
                    : {
                        background: "rgba(255,255,255,0.55)",
                        border: "1px solid rgba(225,29,72,0.10)",
                      }
                }
                onMouseEnter={e => {
                  if (!tier.gradient) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.22)";
                    (e.currentTarget as HTMLElement).style.background   = "rgba(255,255,255,0.80)";
                  }
                }}
                onMouseLeave={e => {
                  if (!tier.gradient) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,29,72,0.10)";
                    (e.currentTarget as HTMLElement).style.background   = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black text-white tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
                      boxShadow: "0 4px 16px rgba(225,29,72,0.35)",
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                {/* Tier name */}
                <div
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
                  style={{ color: "#c084a0" }}
                >
                  {tier.name}
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5 mb-1">
                  {price === 0 ? (
                    <span className="text-4xl font-black tracking-tight" style={{ color: "#1a0008" }}>Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black tracking-tight" style={{ color: "#1a0008" }}>${price}</span>
                      <span className="text-sm font-medium mb-1.5" style={{ color: "#be123c" }}>/mo</span>
                    </>
                  )}
                </div>

                {/* Annual saving note */}
                <div className="h-5 mb-4">
                  {annual && yearSaving > 0 && (
                    <span className="text-[11px] font-semibold" style={{ color: "#e11d48" }}>
                      Billed ${price * 12}/yr · saves ${yearSaving}
                    </span>
                  )}
                </div>

                {/* Desc */}
                <p
                  className="text-[13px] leading-relaxed pt-4 mb-7"
                  style={{ color: "#7f1d1d", borderTop: "1px solid rgba(225,29,72,0.10)" }}
                >
                  {tier.desc}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] font-medium"
                      style={{ color: "#3d0a14" }}>
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: tier.gradient ? "#e11d48" : "#c084a0" }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95"
                  style={
                    tier.gradient
                      ? {
                          background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
                          color: "#fff",
                          boxShadow: "0 4px 20px rgba(225,29,72,0.30)",
                        }
                      : {
                          background: "rgba(225,29,72,0.06)",
                          color: "#be123c",
                          border: "1px solid rgba(225,29,72,0.18)",
                        }
                  }
                  onMouseEnter={e => {
                    if (tier.gradient) {
                      (e.currentTarget as HTMLElement).style.background =
                        "linear-gradient(135deg, #fda4af, #fb7185, #e11d48)";
                    } else {
                      (e.currentTarget as HTMLElement).style.background = "rgba(225,29,72,0.12)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (tier.gradient) {
                      (e.currentTarget as HTMLElement).style.background =
                        "linear-gradient(135deg, #fb7185, #e11d48, #be123c)";
                    } else {
                      (e.currentTarget as HTMLElement).style.background = "rgba(225,29,72,0.06)";
                    }
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            );

            return tier.gradient ? (
              <div
                key={tier.name}
                className="pricing-card opacity-0 relative rounded-2xl p-[1px]"
                style={{
                  background: "linear-gradient(to bottom, rgba(225,29,72,0.45), rgba(251,113,133,0.12), transparent)",
                  boxShadow: "0 0 50px rgba(225,29,72,0.10)",
                }}
              >
                {cardContent}
              </div>
            ) : (
              <div key={tier.name} className="pricing-card opacity-0">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] mt-10 font-medium tracking-wide" style={{ color: "#c084a0" }}>
          All plans include 256-bit encryption · No credit card required on free tier · Cancel any time
        </p>
      </div>
    </section>
  );
}