"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const COMMANDS = [
  {
    cmd: "> scanning inbox for priority threads...",
    out: "  ✓ 3 threads flagged — replies drafted",
    outColor: "text-emerald-400",
  },
  {
    cmd: "> scheduling team sync with Design...",
    out: "  ✓ Invite sent · 4 attendees confirmed",
    outColor: "text-emerald-400",
  },
  {
    cmd: "> drafting follow-up for investor thread...",
    out: '  ✓ "Re: Q3 Update" ready in your voice',
    outColor: "text-emerald-400",
  },
  {
    cmd: "> summarising 47 unread threads...",
    out: "  ✓ Digest ready · 8 need your reply",
    outColor: "text-emerald-400",
  },
];

export default function LoginPage() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"cmd" | "out" | "pause">("cmd");
  const [loading, setLoading] = useState(false);

  const current = COMMANDS[lineIdx];
  const target = phase === "cmd" ? current.cmd : current.out;
  const prevLine =
    lineIdx > 0
      ? COMMANDS[(lineIdx - 1 + COMMANDS.length) % COMMANDS.length]
      : null;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "pause") {
      timer = setTimeout(() => {
        setLineIdx((i) => (i + 1) % COMMANDS.length);
        setCharIdx(0);
        setPhase("cmd");
      }, 1600);
    } else if (charIdx < target.length) {
      timer = setTimeout(
        () => setCharIdx((c) => c + 1),
        phase === "cmd" ? 36 : 20
      );
    } else if (phase === "cmd") {
      timer = setTimeout(() => {
        setPhase("out");
        setCharIdx(0);
      }, 250);
    } else {
      timer = setTimeout(() => setPhase("pause"), 120);
    }

    return () => clearTimeout(timer);
  }, [charIdx, phase, target]);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chat",
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden flex items-stretch">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes card-in { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes left-in { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes icon-float { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-7px) rotate(2deg)} }
        @keyframes icon-bounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-8px) scale(1.07)} 60%{transform:translateY(-5px) scale(1.03)} }
        @keyframes icon-spin-smile { 0%,100%{transform:rotate(-8deg) scale(1)} 50%{transform:rotate(8deg) scale(1.15)} }
        @keyframes icon-glow-gmail { 0%,100%{box-shadow:0 4px 16px rgba(234,67,53,0.25)} 50%{box-shadow:0 6px 28px rgba(234,67,53,0.5)} }
        @keyframes icon-glow-cal { 0%,100%{box-shadow:0 4px 16px rgba(26,115,232,0.25)} 50%{box-shadow:0 6px 28px rgba(26,115,232,0.5)} }
      `}</style>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Amber orb — top right */}
      <div
        className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-amber-500/[0.07] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-a 14s ease-in-out infinite" }}
      />

      {/* Teal orb — bottom left */}
      <div
        className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-teal-500/[0.05] blur-[130px] pointer-events-none z-0"
        style={{ animation: "float-b 11s ease-in-out infinite" }}
      />

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.07] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 12s linear infinite 3s" }}
      />

      {/* ── LEFT PANEL (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col justify-center w-1/2 px-16 xl:px-24 relative z-10"
        style={{ animation: "left-in 0.9s ease-out both" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-14">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ffbe1a] to-[#e61700] flex items-center justify-center text-white font-bold shadow-[0_4px_18px_rgba(249,115,22,0.4)] text-lg">
            ⚡
          </div>
          <span className="text-white font-bold tracking-tight text-base">Super-Power</span>
        </div>

        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 flex items-center gap-1.5 mb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
          <span>✦</span> AI EMAIL &amp; CALENDAR OS
        </div>

        <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
          Your inbox,
          <br />
          <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            supercharged.
          </span>
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-10 font-medium">
          Connect Gmail and Google Calendar. Let Super-Power handle replies,
          scheduling, and follow-ups — so you focus on what actually matters.
        </p>

        {/* Terminal */}
        <div className="w-full max-w-sm rounded-2xl bg-[#03060b] border border-white/[0.04] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.04]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[10px] font-mono text-slate-600 tracking-wide">
              super-power ~ agent
            </span>
          </div>

          {/* Content — bottom-aligned so new lines appear to scroll up */}
          <div className="px-4 py-4 font-mono text-xs flex flex-col justify-end h-[92px] overflow-hidden">
            {prevLine && (
              <div className="mb-2 opacity-20 space-y-0.5 leading-5">
                <div className="text-amber-400">{prevLine.cmd}</div>
                <div className={prevLine.outColor}>{prevLine.out}</div>
              </div>
            )}
            <div className="space-y-0.5 leading-5">
              <div className="text-amber-400">
                {phase === "cmd"
                  ? current.cmd.substring(0, charIdx)
                  : current.cmd}
                {phase === "cmd" && (
                  <span
                    className="inline-block w-[2px] h-[12px] bg-amber-400 ml-px align-middle"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                )}
              </div>
              {(phase === "out" || phase === "pause") && (
                <div className={current.outColor}>
                  {phase === "out"
                    ? current.out.substring(0, charIdx)
                    : current.out}
                  {phase === "out" && (
                    <span
                      className="inline-block w-[2px] h-[12px] bg-emerald-400 ml-px align-middle"
                      style={{ animation: "blink 1s step-end infinite" }}
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
            { value: "4.2h", label: "saved / week" },
            { value: "12k+", label: "happy teams" },
            { value: "99.9%", label: "uptime" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xl font-black text-white tracking-tight">{value}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-6 py-16 relative z-10 lg:border-l lg:border-white/[0.04]">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ffbe1a] to-[#e61700] flex items-center justify-center text-white font-bold shadow-[0_4px_18px_rgba(249,115,22,0.4)] text-lg">
            ⚡
          </div>
          <span className="text-white font-bold tracking-tight text-base">Super-Power</span>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm"
          style={{ animation: "card-in 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
        >
          <div className="relative p-8 rounded-3xl bg-[#090d16]/80 border border-white/[0.06] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.02)]">

            {/* Amber glow bleeding in from top of card */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.13) 0%, transparent 68%)",
              }}
            />

            <div className="relative z-10">
              {/* App icons */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {/* Gmail icon — floats up/down with red glow pulse */}
                <div
                  className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                  style={{ animation: "icon-float 3s ease-in-out infinite, icon-glow-gmail 3s ease-in-out infinite" }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M2 19V8.5L12 15l10-6.5V19a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
                    <path fill="#34A853" d="M2 8.5V19l4.5-5.25z"/>
                    <path fill="#FBBC05" d="M22 8.5V19l-4.5-5.25z"/>
                    <path fill="#EA4335" d="M3 4h18a1 1 0 011 1v3.5L12 15 2 8.5V5a1 1 0 011-1z"/>
                  </svg>
                </div>

                {/* Smiley connector — rocks side to side */}
                <span
                  className="text-2xl select-none leading-none"
                  style={{ display: "inline-block", animation: "icon-spin-smile 2.4s ease-in-out infinite" }}
                >
                  😊
                </span>

                {/* Google Calendar icon — bounces with blue glow pulse */}
                <div
                  className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                  style={{ animation: "icon-bounce 2.8s ease-in-out infinite 0.4s, icon-glow-cal 2.8s ease-in-out infinite 0.4s" }}
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

              <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/90 flex items-center gap-1.5 mb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                <span>✦</span> Sign in
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
                Welcome back.
              </h2>
              <p className="text-[13px] text-slate-500 font-medium mb-8 leading-relaxed">
                One click away from a calmer inbox.
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-[10px] text-slate-700 font-semibold tracking-widest uppercase">
                  continue with
                </span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              {/* Google button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="text-[13px] font-bold text-gray-800 tracking-wide">
                  {loading ? "Connecting..." : "Continue with Google"}
                </span>
              </button>

              <p className="text-center text-[11px] text-slate-700 mt-6 font-medium leading-relaxed">
                Free for 14 days · No credit card needed
                <br />
                <span className="text-slate-800">256-bit encrypted · Cancel any time</span>
              </p>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-800 mt-5 font-medium">
            By continuing you agree to our{" "}
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
