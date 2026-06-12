"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sp-nav">
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: 20,
          fontWeight: 900,
          color: "var(--text)",
          textDecoration: "none",
          letterSpacing: "-0.3px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--pink), var(--lav))",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            boxShadow: "0 4px 14px var(--shadow-pink)",
          }}
        >
          ⚡
        </div>
        Super-Power
      </Link>

      <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none" }}>
        {["Features", "Demo", "Pricing", "FAQ"].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          </li>
        ))}
      </ul>

      <a href="#" className="btn-nav">
        Start Free →
      </a>
    </nav>
  );
}
