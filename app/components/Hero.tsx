export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-14 px-6 md:px-12 pt-20 md:pt-24 pb-20 md:pb-28 bg-[#030712] overflow-hidden">

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,_black_40%,_transparent_90%)] z-0" />

      <div className="absolute top-1/4 left-10 w-[350px] h-[350px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none z-0" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] aspect-[3/1] rounded-[100%] bg-[radial-gradient(ellipse_at_bottom,_rgba(251,146,60,0.14)_0%,_rgba(251,146,60,0.03)_45%,_transparent_70%)] pointer-events-none z-0 filter blur-md border-t border-orange-500/5" />

      <div className="relative flex flex-col gap-6 z-10 text-left">

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-300 uppercase">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm shadow-orange-500/10">
            NEW
          </span>
          AI-Powered Email &amp; Calendar System
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15]">
          Give super-power to <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            your Email and Calendar
          </span>
          <br />
          <span className="text-slate-400 font-medium text-3xl md:text-4xl tracking-normal">which helps you</span>{" "}
          <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
            get things done.
          </span>
        </h1>

        <p className="text-base md:text-[17px] text-slate-400 max-w-md leading-relaxed">
          Connect Gmail and Google Calendar. Let Super-Power schedule meetings,
          triage your inbox, and draft replies — so you can focus on the work
          that matters.
        </p>

        <div className="flex items-center gap-4 flex-wrap mt-2">
          <a href="#" className="bg-gradient-to-r from-[#ffbe1a] via-[#ff7300] to-[#e61700] hover:scale-[1.02] text-white font-bold text-sm tracking-wide px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/10 transition-all active:scale-95">
            Start for free 🎉
          </a>
          <a href="#" className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-sm tracking-wide px-6 py-3.5 rounded-full transition-all active:scale-95">
            ▶ Watch demo
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 mt-4 border-t border-white/5">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              4.2<span className="text-orange-400 text-lg font-bold ml-0.5">h</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">saved / week</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              12<span className="text-orange-400 text-lg font-bold ml-0.5">k+</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">happy teams</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              99<span className="text-orange-400 text-lg font-bold ml-0.5">%</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">uptime SLA</span>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center items-center z-10 w-full mt-10 lg:mt-0">

        <div className="absolute w-[80%] aspect-square rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl pointer-events-none z-0" />

        <div className="relative w-full max-w-md rounded-2xl bg-[#0b0f19]/80 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl z-10 overflow-hidden">

          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <span className="text-orange-400">✦</span> super-power
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/[0.01] border-b border-white/5">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              ⌘
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                Command Input
              </span>
              <div className="text-xs md:text-sm text-slate-200 font-medium flex items-center gap-1 flex-wrap">
                Schedule a meeting with Sarah next week
                <span className="inline-block w-1 h-4 bg-orange-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4">

            <div className="flex flex-col items-end gap-1.5 max-w-[85%] ml-auto">
              <div className="text-[10px] font-bold tracking-wide text-slate-500 uppercase mr-1">You</div>
              <div className="text-xs md:text-sm text-slate-100 bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm leading-relaxed">
                Set up a Q3 launch sync with Sarah next week, please!
              </div>
            </div>

            <div className="flex flex-col items-start gap-1.5 max-w-[85%] mr-auto">
              <div className="text-[10px] font-black tracking-widest text-orange-400 uppercase ml-1">SP Assistant</div>
              <div className="text-xs md:text-sm text-amber-100 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-inner leading-relaxed">
                On it! Checking calendars and finding the best slot… 🗓
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">

              <div className="flex items-center justify-between text-xs font-medium text-slate-300 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="text-base filter drop-shadow-sm">📅</span>
                  <span>Found 3 open slots for both of you</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">✓ Done</span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-300 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="text-base filter drop-shadow-sm">🗓</span>
                  <span>Created &ldquo;Q3 Launch Sync&rdquo; — Wed 11 AM</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">✓ Done</span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-300 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2.5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="text-base filter drop-shadow-sm">✉️</span>
                  <span>Invite sent to sarah@acme.com</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">✓ Done</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
