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
      gsap.fromTo(
        ".fade-up-pricing-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".pricing-card",
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-grid", start: "top 80%" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#030712] py-24 md:py-32 px-6 md:px-12 overflow-hidden"
      id="pricing"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,_black_40%,_transparent_100%)] z-0" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-amber-500/[0.04] via-orange-500/[0.025] to-amber-500/[0.04] blur-[140px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10">

        <div className="fade-up-pricing-header opacity-0 flex flex-col items-center text-center mb-14 gap-3">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
            <span>✦</span> Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Simple, transparent pricing.
          </h2>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-1">
            Start for free. Upgrade when you need more power.
          </p>

          <div className="flex items-center gap-3 mt-6 bg-white/[0.03] border border-white/[0.06] rounded-full px-5 py-2.5">
            <span className={`text-xs font-bold transition-colors duration-200 ${!annual ? "text-white" : "text-slate-600"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual((v) => !v)}
              aria-label="Toggle annual billing"
              className={`relative flex-shrink-0 rounded-full transition-colors duration-300 ${annual ? "bg-amber-500" : "bg-white/10"}`}
              style={{ width: 40, height: 22 }}
            >
              <span
                className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform duration-300"
                style={{ transform: annual ? "translateX(18px)" : "translateX(0)" }}
              />
            </button>
            <span className={`text-xs font-bold transition-colors duration-200 ${annual ? "text-white" : "text-slate-600"}`}>
              Annual
            </span>
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full tracking-wide">
              Save 20%
            </span>
          </div>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => {
            const price = annual ? tier.annual : tier.monthly;
            const yearSaving = tier.monthly > 0 ? (tier.monthly - tier.annual) * 12 : 0;

            const cardContent = (
              <div
                className={`relative flex flex-col h-full p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                  tier.gradient
                    ? "bg-[#0b1020] hover:bg-[#0d1228]"
                    : "bg-[#090d16]/60 border border-white/[0.05] hover:border-white/[0.09] hover:bg-[#090d16]/90"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black text-white tracking-[0.15em] uppercase shadow-[0_4px_16px_rgba(251,146,60,0.4)] whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600 mb-5">
                  {tier.name}
                </div>

                <div className="flex items-end gap-1.5 mb-1">
                  {price === 0 ? (
                    <span className="text-4xl font-black text-white tracking-tight">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black text-white tracking-tight">${price}</span>
                      <span className="text-slate-500 text-sm font-medium mb-1.5">/mo</span>
                    </>
                  )}
                </div>

                <div className="h-5 mb-4">
                  {annual && yearSaving > 0 && (
                    <span className="text-[11px] text-amber-400/80 font-semibold">
                      Billed ${price * 12}/yr · saves ${yearSaving}
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-slate-400 leading-relaxed border-t border-white/[0.05] pt-4 mb-7">
                  {tier.desc}
                </p>

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-300 font-medium">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.gradient ? "text-amber-400" : "text-slate-500"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 ${
                    tier.gradient
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_4px_20px_rgba(251,146,60,0.28)]"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.07] hover:border-white/[0.13]"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );

            return tier.gradient ? (
              <div
                key={tier.name}
                className="pricing-card opacity-0 relative rounded-2xl p-[1px] bg-gradient-to-b from-amber-500/50 via-orange-500/15 to-transparent shadow-[0_0_50px_rgba(251,146,60,0.09)]"
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

        <p className="text-center text-[11px] text-slate-700 mt-10 font-medium tracking-wide">
          All plans include 256-bit encryption · No credit card required on free tier · Cancel any time
        </p>
      </div>
    </section>
  );
}
