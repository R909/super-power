"use client";

import Link from "next/link";

export default function Navbar() {
  return (
         <header className="fixed top-0 left-0 w-full z-50 bg-[#030712]/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ffbe1a] to-[#e61700] flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              ⚡
            </div>
            <span className="text-white font-bold tracking-tight text-base">Super-Power</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <button className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full transition-all active:scale-95">
            Start Free →
          </button>
        </div>
      </header>
  );
}
