const ITEMS = [
  "Zero inbox anxiety",
  "Smart scheduling",
  "Replies in your voice",
  "Thread memory",
  "Calendar OS",
  "Privacy-first AI",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <>
      <style>{`
        @keyframes marqueeSlide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-custom-marquee {
          animation: marqueeSlide 25s linear infinite;
        }
      `}</style>

      <div
        className="relative w-full py-8 overflow-hidden select-none"
        style={{
          backgroundColor: "#fce7f3",
          borderTop:    "1px solid rgba(225,29,72,0.12)",
          borderBottom: "1px solid rgba(225,29,72,0.12)",
        }}
      >
        {/* Left fade */}
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #fce7f3, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #fce7f3, transparent)" }}
        />

        <div className="flex w-full overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-custom-marquee py-2">
            {doubled.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm font-semibold tracking-wide transition-colors duration-200 cursor-default"
                style={{ color: "#be123c" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#9f1239")}
                onMouseLeave={e => (e.currentTarget.style.color = "#be123c")}
              >
                {/* Dot — rose glow */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #fb7185, #e11d48)",
                    boxShadow: "0 0 8px rgba(225,29,72,0.45)",
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}