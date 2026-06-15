export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <>
      <style>{`
        @keyframes marqueeSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-custom-marquee {
          animation: marqueeSlide 25s linear infinite;
        }
      `}</style>

      <div className="relative w-full bg-[#030712] py-8 overflow-hidden select-none border-t border-b border-white/[0.05]">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

        <div className="flex w-full overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-custom-marquee py-2">
            {doubled.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm font-semibold tracking-wide text-slate-400 hover:text-white transition-colors duration-200 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const ITEMS = [
  "Zero inbox anxiety",
  "Smart scheduling",
  "Replies in your voice",
  "Thread memory",
  "Calendar OS",
  "Privacy-first AI",
];
