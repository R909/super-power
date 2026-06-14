const LINKS = ["Privacy", "Terms", "Security", "Blog"];

export default function Footer() {
  return (
    <footer className="bg-[#030712] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-bold text-slate-400 tracking-tight">Super-Power</span>
        </div>
        <ul className="flex items-center gap-8" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="text-[11px] text-slate-700 font-medium tracking-wide">
          © 2025 Super-Power Inc.
        </div>
      </div>
    </footer>
  );
}
