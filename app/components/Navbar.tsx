"use client";


export default function Navbar() {
  return (
         <header className="fixed top-0 left-0 w-full z-50 bg-[#030712]/70 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.03),_0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ffbe1a] to-[#e61700] flex items-center justify-center text-white font-bold shadow-[0_4px_14px_rgba(249,115,22,0.35)]">
              ⚡
            </div>
            <span className="text-white font-bold tracking-tight text-[15px]">Super-Power</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <a href="#features" className="hover:text-slate-200 transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-slate-200 transition-colors duration-200">How it works</a>
            <a href="#testimonials" className="hover:text-slate-200 transition-colors duration-200">Reviews</a>
          </nav>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-[11px] font-black tracking-widest uppercase px-5 py-2 rounded-full transition-all duration-200 active:scale-95 shadow-[0_0_18px_rgba(251,146,60,0.25)]">
            Start Free →
          </button>
        </div>
      </header>
  );
}
