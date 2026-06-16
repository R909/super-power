"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const getStarted = () => {
    router.push("/dashboard");
  };

  return (
    <section className="relative w-full min-h-[90vh] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-14 px-6 md:px-12 pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden"
      style={{ backgroundColor: "#fce7f3" }}>

      {/* Rose grid */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,29,72,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%)",
        }}
      />

      {/* Top-left soft orb */}
      <div className="absolute top-1/4 left-10 w-[350px] h-[350px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(251,113,133,0.12)", filter: "blur(100px)" }} />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] pointer-events-none z-0"
        style={{
          aspectRatio: "3/1", borderRadius: "100%",
          background: "radial-gradient(ellipse at bottom, rgba(225,29,72,0.1) 0%, rgba(251,113,133,0.04) 45%, transparent 70%)",
          filter: "blur(12px)",
          borderTop: "1px solid rgba(225,29,72,0.08)",
        }}
      />

      {/* ── LEFT COLUMN ── */}
      <div className="relative flex flex-col gap-6 z-10 text-left">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
          style={{ color: "#9f1239" }}>
          <span className="text-white font-black text-[10px] px-2 py-0.5 rounded-md"
            style={{ background: "linear-gradient(135deg, #fb7185, #be123c)", boxShadow: "0 2px 8px rgba(225,29,72,0.25)" }}>
            NEW
          </span>
          AI-Powered Email &amp; Calendar System
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.15]"
          style={{ color: "#1a0008" }}>
          Give super-power to{" "}
          <br className="hidden sm:inline" />
          <span style={{
            background: "linear-gradient(90deg, #fb7185, #e11d48, #be123c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            your Email and Calendar
          </span>
          <br />
          <span className="font-medium text-3xl md:text-4xl tracking-normal"
            style={{ color: "#be123c" }}>
            which helps you
          </span>{" "}
          <span style={{
            background: "linear-gradient(90deg, #2dd4bf, #10b981)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            get things done.
          </span>
        </h1>

        {/* Body */}
        <p className="text-base md:text-[17px] max-w-md leading-relaxed"
          style={{ color: "#7f1d1d" }}>
          Connect Gmail and Google Calendar. Let Super-Power schedule meetings,
          triage your inbox, and draft replies — so you can focus on the work
          that matters.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-wrap mt-2">
          <button
            onClick={getStarted}
            className="hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm tracking-wide px-7 py-3.5 rounded-full text-white"
            style={{
              background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
              boxShadow: "0 6px 20px rgba(225,29,72,0.3)",
            }}>
            Start for free 🎉
          </button>
          <a href="#"
            className="active:scale-95 transition-all font-bold text-sm tracking-wide px-6 py-3.5 rounded-full"
            style={{
              background: "rgba(225,29,72,0.06)",
              border: "1px solid rgba(225,29,72,0.2)",
              color: "#9f1239",
            }}>
            ▶ Watch demo
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-8 mt-4"
          style={{ borderTop: "1px solid rgba(225,29,72,0.15)" }}>
          {[
            { val: "4.2", unit: "h",  label: "saved / week"  },
            { val: "12",  unit: "k+", label: "happy teams"   },
            { val: "99",  unit: "%",  label: "uptime SLA"    },
          ].map(({ val, unit, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-2xl md:text-3xl font-black tracking-tight"
                style={{ color: "#1a0008" }}>
                {val}
                <span className="text-lg font-bold ml-0.5" style={{ color: "#e11d48" }}>{unit}</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#be123c" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT COLUMN — AI card ── */}
      <div className="relative flex justify-center items-center z-10 w-full mt-10 lg:mt-0">

        {/* Card glow */}
        <div className="absolute w-[80%] aspect-square rounded-full pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(251,113,133,0.2), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Card */}
        <div className="relative w-full max-w-md rounded-2xl z-10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(225,29,72,0.15)",
            boxShadow: "0 25px 60px rgba(225,29,72,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
          }}>

          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(225,29,72,0.1)", background: "rgba(255,240,242,0.6)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1"
              style={{ color: "#be123c" }}>
              <span style={{ color: "#e11d48" }}>✦</span> super-power
            </div>
          </div>

          {/* Command bar */}
          <div className="flex items-start gap-3 p-4"
            style={{ background: "rgba(255,240,242,0.3)", borderBottom: "1px solid rgba(225,29,72,0.08)" }}>
            <div className="flex items-center justify-center w-5 h-5 rounded font-bold text-xs flex-shrink-0"
              style={{
                background: "rgba(225,29,72,0.08)",
                border: "1px solid rgba(225,29,72,0.2)",
                color: "#e11d48",
              }}>
              ⌘
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] font-extrabold tracking-widest uppercase"
                style={{ color: "#c084a0" }}>
                Command Input
              </span>
              <div className="text-xs md:text-sm font-medium flex items-center gap-1 flex-wrap"
                style={{ color: "#3d0a14" }}>
                Schedule a meeting with Sarah next week
                <span className="inline-block w-1 h-4 animate-pulse rounded-full"
                  style={{ background: "#e11d48" }} />
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col gap-4 p-4">

            {/* User bubble */}
            <div className="flex flex-col items-end gap-1.5 max-w-[85%] ml-auto">
              <div className="text-[10px] font-bold tracking-wide uppercase mr-1"
                style={{ color: "#c084a0" }}>You</div>
              <div className="text-xs md:text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-tr-sm"
                style={{
                  color: "#3d0a14",
                  background: "rgba(225,29,72,0.06)",
                  border: "1px solid rgba(225,29,72,0.12)",
                }}>
                Set up a Q3 launch sync with Sarah next week, please!
              </div>
            </div>

            {/* Assistant bubble */}
            <div className="flex flex-col items-start gap-1.5 max-w-[85%] mr-auto">
              <div className="text-[10px] font-black tracking-widest uppercase ml-1"
                style={{ color: "#e11d48" }}>SP Assistant</div>
              <div className="text-xs md:text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-tl-sm"
                style={{
                  color: "#7f1d1d",
                  background: "linear-gradient(135deg, rgba(225,29,72,0.08), rgba(251,113,133,0.04))",
                  border: "1px solid rgba(225,29,72,0.15)",
                }}>
                On it! Checking calendars and finding the best slot… 🗓
              </div>
            </div>

            {/* Action rows */}
            <div className="flex flex-col gap-2 mt-2 pt-3"
              style={{ borderTop: "1px solid rgba(225,29,72,0.1)" }}>
              {[
                { icon: "📅", text: 'Found 3 open slots for both of you' },
                { icon: "🗓", text: 'Created "Q3 Launch Sync" — Wed 11 AM' },
                { icon: "✉️", text: 'Invite sent to sarah@acme.com' },
              ].map(({ icon, text }) => (
                <div key={text}
                  className="flex items-center justify-between text-xs font-medium transition-all"
                  style={{
                    color: "#7f1d1d",
                    background: "rgba(255,240,242,0.6)",
                    border: "1px solid rgba(225,29,72,0.1)",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(225,29,72,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(225,29,72,0.1)")}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{icon}</span>
                    <span>{text}</span>
                  </div>
                  <span className="font-bold text-[10px] px-1.5 py-0.5 rounded"
                    style={{ color: "#166534", background: "rgba(134,239,172,0.25)" }}>
                    ✓ Done
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}