"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const COMMANDS = [
  {
    cmd: "> scanning inbox for priority threads...",
    out: "  ✓ 3 threads flagged — replies drafted",
  },
  {
    cmd: "> scheduling team sync with Design...",
    out: "  ✓ Invite sent · 4 attendees confirmed",
  },
  {
    cmd: "> drafting follow-up for investor thread...",
    out: '  ✓ "Re: Q3 Update" ready in your voice',
  },
  {
    cmd: "> summarising 47 unread threads...",
    out: "  ✓ Digest ready · 8 need your reply",
  },
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:         "#fce7f3",          // rose-100 tint
  surface:    "#fff1f5",          // very light rose
  card:       "#ffffff",
  border:     "rgba(225,29,72,0.12)",
  borderSoft: "rgba(225,29,72,0.07)",
  accent:     "#e11d48",          // rose-600
  accentMid:  "#f43f5e",          // rose-500
  accentLt:   "#fb7185",          // rose-400
  gradient:   "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
  gradientSoft: "linear-gradient(135deg, #fce7f3, #ffe4e6)",
  textPri:    "#1a0008",
  textSec:    "#7f1d1d",
  textMuted:  "#be185d",
  textDim:    "#f9a8d4",
  terminal:   "#2d0010",          // very dark rose for terminal bg
};

export default function LoginPage() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase,   setPhase]   = useState<"cmd" | "out" | "pause">("cmd");
  const [loading, setLoading] = useState(false);

  const current  = COMMANDS[lineIdx];
  const target   = phase === "cmd" ? current.cmd : current.out;
  const prevLine = lineIdx > 0 ? COMMANDS[(lineIdx - 1 + COMMANDS.length) % COMMANDS.length] : null;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "pause") {
      timer = setTimeout(() => {
        setLineIdx((i) => (i + 1) % COMMANDS.length);
        setCharIdx(0);
        setPhase("cmd");
      }, 1600);
    } else if (charIdx < target.length) {
      timer = setTimeout(() => setCharIdx((c) => c + 1), phase === "cmd" ? 36 : 20);
    } else if (phase === "cmd") {
      timer = setTimeout(() => { setPhase("out"); setCharIdx(0); }, 250);
    } else {
      timer = setTimeout(() => setPhase("pause"), 120);
    }

    return () => clearTimeout(timer);
  }, [charIdx, phase, target]);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float-a  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,30px) scale(1.05); } }
        @keyframes float-b  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,-20px) scale(1.04); } }
        @keyframes left-in  { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes card-in  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes icon-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes icon-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes icon-spin-smile { 0%{transform:rotate(-8deg) scale(1)} 50%{transform:rotate(8deg) scale(1.15)} 100%{transform:rotate(-8deg) scale(1)} }
        @keyframes scan-line { 0%{top:-2px} 100%{top:100%} }
      `}</style>

      <div
        className="relative min-h-screen w-full overflow-hidden flex items-stretch"
        style={{ background: T.bg }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(225,29,72,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        {/* Ambient blobs */}
        <div
          className="absolute -top-24 -right-24 w-[560px] h-[560px] rounded-full pointer-events-none z-0"
          style={{ background: "rgba(251,113,133,0.18)", filter: "blur(120px)", animation: "float-a 14s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-32 -left-20 w-[480px] h-[480px] rounded-full pointer-events-none z-0"
          style={{ background: "rgba(225,29,72,0.10)", filter: "blur(110px)", animation: "float-b 11s ease-in-out infinite" }}
        />

        {/* Scan line accent */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none z-0"
          style={{ background: "linear-gradient(to right, transparent, rgba(225,29,72,0.15), transparent)", animation: "scan-line 12s linear infinite 3s" }}
        />

        {/* ══════════ LEFT PANEL ══════════ */}
        <div
          className="hidden lg:flex flex-col justify-center w-1/2 px-16 xl:px-24 relative z-10"
          style={{ animation: "left-in 0.9s ease-out both" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-14">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: T.gradient, boxShadow: "0 4px 18px rgba(225,29,72,0.35)" }}
            >
              ⚡
            </div>
            <span className="font-bold tracking-tight text-base" style={{ color: T.textPri }}>Super-Power</span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] mb-5"
            style={{ color: T.textPri }}
          >
            Your inbox,
            <br />
            <span style={{ background: T.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              supercharged.
            </span>
          </h1>

          <p className="text-sm leading-relaxed max-w-sm mb-10 font-medium" style={{ color: T.textMuted }}>
            Connect Gmail and Google Calendar. Let Super-Power handle replies,
            scheduling, and follow-ups — so you focus on what actually matters.
          </p>

          {/* Terminal */}
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background: T.terminal, border: `1px solid rgba(225,29,72,0.15)`, boxShadow: "0 20px 60px rgba(190,18,60,0.20)" }}
          >
            {/* Traffic lights */}
            <div
              className="flex items-center gap-1.5 px-4 py-3"
              style={{ borderBottom: `1px solid rgba(225,29,72,0.10)` }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400/70" />
              <span className="ml-2 text-[10px] font-mono tracking-wide" style={{ color: "rgba(225,29,72,0.40)" }}>
                super-power ~ agent
              </span>
            </div>

            {/* Typed output */}
            <div className="px-4 py-4 font-mono text-xs flex flex-col justify-end h-[92px] overflow-hidden">
              {prevLine && (
                <div className="mb-2 space-y-0.5 leading-5" style={{ opacity: 0.20 }}>
                  <div style={{ color: T.accentLt }}>{prevLine.cmd}</div>
                  <div style={{ color: "#86efac" }}>{prevLine.out}</div>
                </div>
              )}
              <div className="space-y-0.5 leading-5">
                <div style={{ color: T.accentLt }}>
                  {phase === "cmd" ? current.cmd.substring(0, charIdx) : current.cmd}
                  {phase === "cmd" && (
                    <span
                      className="inline-block w-[2px] h-[12px] ml-px align-middle"
                      style={{ background: T.accentLt, animation: "blink 1s step-end infinite" }}
                    />
                  )}
                </div>
                {(phase === "out" || phase === "pause") && (
                  <div style={{ color: "#86efac" }}>
                    {phase === "out" ? current.out.substring(0, charIdx) : current.out}
                    {phase === "out" && (
                      <span
                        className="inline-block w-[2px] h-[12px] ml-px align-middle"
                        style={{ background: "#86efac", animation: "blink 1s step-end infinite" }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-10">
            {[
              { value: "4.2h",  label: "saved / week" },
              { value: "12k+",  label: "happy teams"  },
              { value: "99.9%", label: "uptime"        },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xl font-black tracking-tight" style={{ color: T.textPri }}>{value}</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: T.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ RIGHT PANEL ══════════ */}
        <div
          className="flex flex-col items-center justify-center w-full lg:w-1/2 px-6 py-16 relative z-10"
          style={{ borderLeft: `1px solid ${T.borderSoft}` }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-12">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: T.gradient, boxShadow: "0 4px 18px rgba(225,29,72,0.35)" }}
            >
              ⚡
            </div>
            <span className="font-bold tracking-tight text-base" style={{ color: T.textPri }}>Super-Power</span>
          </div>

          {/* Card */}
          <div
            className="w-full max-w-sm"
            style={{ animation: "card-in 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
          >
            <div
              className="relative p-8 rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: `1px solid ${T.border}`,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 30px 80px rgba(225,29,72,0.12), 0 0 0 1px rgba(225,29,72,0.04)",
              }}
            >
              {/* Radial glow inside card */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(251,113,133,0.15) 0%, transparent 65%)" }}
              />

              <div className="relative z-10">
                {/* Animated icons */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                    style={{
                      boxShadow: "0 4px 16px rgba(225,29,72,0.15)",
                      animation: "icon-float 3s ease-in-out infinite",
                    }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M2 19V8.5L12 15l10-6.5V19a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
                      <path fill="#34A853" d="M2 8.5V19l4.5-5.25z"/>
                      <path fill="#FBBC05" d="M22 8.5V19l-4.5-5.25z"/>
                      <path fill="#EA4335" d="M3 4h18a1 1 0 011 1v3.5L12 15 2 8.5V5a1 1 0 011-1z"/>
                    </svg>
                  </div>

                  <span
                    className="text-2xl select-none leading-none"
                    style={{ display: "inline-block", animation: "icon-spin-smile 2.4s ease-in-out infinite" }}
                  >
                    😊
                  </span>

                  <div
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                    style={{
                      boxShadow: "0 4px 16px rgba(225,29,72,0.15)",
                      animation: "icon-bounce 2.8s ease-in-out infinite 0.4s",
                    }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 48 48">
                      <rect x="4" y="8" width="40" height="36" rx="3" fill="#fff" stroke="#DADCE0" strokeWidth="2"/>
                      <rect x="4" y="8" width="40" height="13" rx="3" fill="#1A73E8"/>
                      <rect x="4" y="17" width="40" height="4" fill="#1A73E8"/>
                      <line x1="16" y1="8" x2="16" y2="14" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="32" y1="8" x2="32" y2="14" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                      <text x="24" y="37" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1A73E8" fontFamily="Arial,sans-serif">14</text>
                    </svg>
                  </div>
                </div>

                {/* Eyebrow */}
                <div
                  className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5 mb-4"
                  style={{ color: T.accent }}
                >
                  <span>✦</span> Sign in
                </div>

                <h2 className="text-2xl font-black tracking-tight mb-1.5" style={{ color: T.textPri }}>
                  Welcome back.
                </h2>
                <p className="text-[13px] font-medium mb-8 leading-relaxed" style={{ color: T.textMuted }}>
                  One click away from a calmer inbox.
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: T.border }} />
                  <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: T.textMuted }}>
                    continue with
                  </span>
                  <div className="flex-1 h-px" style={{ background: T.border }} />
                </div>

                {/* Google button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? T.surface : "#fff",
                    border: `1.5px solid ${T.border}`,
                    boxShadow: "0 4px 20px rgba(225,29,72,0.10)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                >
                  {loading ? (
                    <div
                      className="w-5 h-5 rounded-full border-2 animate-spin"
                      style={{ borderColor: T.border, borderTopColor: T.accent }}
                    />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="text-[13px] font-bold tracking-wide" style={{ color: T.textPri }}>
                    {loading ? "Connecting..." : "Continue with Google"}
                  </span>
                </button>

                {/* Trust copy */}
                <p className="text-center text-[11px] mt-6 font-medium leading-relaxed" style={{ color: T.textMuted }}>
                  Free for 14 days · No credit card needed
                  <br />
                  <span style={{ color: T.textSec }}>256-bit encrypted · Cancel any time</span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] mt-5 font-medium" style={{ color: T.textMuted }}>
              By continuing you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-2 transition-colors"
                style={{ color: T.accent }}
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-2 transition-colors"
                style={{ color: T.accent }}
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}