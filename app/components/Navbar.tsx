"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const getStarted = () => {
    router.push("/dashboard");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(252,231,243,0.80)",
        borderBottom: "1px solid rgba(225,29,72,0.12)",
        boxShadow: "0 1px 0 rgba(225,29,72,0.06), 0 8px 32px rgba(225,29,72,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
              boxShadow: "0 4px 14px rgba(225,29,72,0.35)",
            }}
          >
            ⚡
          </div>
          <span
            className="font-bold tracking-tight text-[15px]"
            style={{ color: "#1a0008" }}
          >
            Super-Power
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "#be123c" }}>
          <a
            href="#features"
            className="transition-colors duration-200"
            style={{ color: "#be123c" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#9f1239")}
            onMouseLeave={e => (e.currentTarget.style.color = "#be123c")}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors duration-200"
            style={{ color: "#be123c" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#9f1239")}
            onMouseLeave={e => (e.currentTarget.style.color = "#be123c")}
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="transition-colors duration-200"
            style={{ color: "#be123c" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#9f1239")}
            onMouseLeave={e => (e.currentTarget.style.color = "#be123c")}
          >
            Reviews
          </a>
        </nav>

        {/* CTA */}
        <button
          onClick={getStarted}
          className="text-[11px] font-black tracking-widest uppercase px-5 py-2 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-white"
          style={{
            background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
            boxShadow: "0 0 18px rgba(225,29,72,0.28)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #fda4af, #fb7185, #e11d48)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(225,29,72,0.4)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #fb7185, #e11d48, #be123c)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 18px rgba(225,29,72,0.28)";
          }}
        >
          Start Free →
        </button>
      </div>
    </header>
  );
}