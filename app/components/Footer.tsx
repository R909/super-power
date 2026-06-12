const LINKS = ["Privacy", "Terms", "Security", "Blog"];

export default function Footer() {
  return (
    <footer className="sp-footer">
      <div className="footer-logo">⚡ Super-Power</div>
      <ul style={{ display: "flex", gap: 26, listStyle: "none" }}>
        {LINKS.map((link) => (
          <li key={link}>
            <a href="#" className="footer-link">
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div className="footer-copy">© 2025 Super-Power Inc.</div>
    </footer>
  );
}
