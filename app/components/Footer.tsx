const LINKS = ["Privacy", "Terms", "Security", "Blog"];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#fce7f3", borderTop: "1px solid rgba(225,29,72,0.12)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white"
            style={{
              background: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
              boxShadow: "0 2px 8px rgba(225,29,72,0.25)",
            }}
          >
            ⚡
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "#9f1239" }}>
            Super-Power
          </span>
        </div>

        {/* Nav links */}
        <ul className="flex items-center gap-8" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200"
                style={{ color: "#c084a0" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#9f1239")}
                onMouseLeave={e => (e.currentTarget.style.color = "#c084a0")}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <div className="text-[11px] font-medium tracking-wide" style={{ color: "#c084a0" }}>
          © 2025 Super-Power Inc.
        </div>
      </div>
    </footer>
  );
}