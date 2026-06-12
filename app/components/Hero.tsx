export default function Hero() {
  return (
    <section
      className="hero-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: 56,
        padding: "80px 52px 72px",
        maxWidth: 1280,
        margin: "0 auto",
        minHeight: "90vh",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div className="eyebrow">
          <span className="eyebrow-pill">NEW</span>
          AI-Powered Email &amp; Calendar System
        </div>

        <h1 className="hero-headline">
          Give super-power to
          <span className="grad-pink">
            {" "}
            you'r Email and Calendar 
            <br />
            <span className="squiggle">which helps you</span>
          </span>
          <br />
          <span className="grad-mint">get things done.</span>
        </h1>

        <p style={{ fontSize: 17, color: "var(--text2)", maxWidth: 420, lineHeight: 1.75 }}>
          Connect Gmail and Google Calendar. Let Super-Power schedule meetings,
          triage your inbox, and draft replies — so you can focus on the work
          that matters.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <a href="#" className="btn-primary">
            Start for free 🎉
          </a>
          <a href="#" className="btn-ghost">
            ▶ Watch demo
          </a>
        </div>

        <div className="stat-strip">
          <div className="stat-item">
            <span className="stat-val">
              4.2<span>h</span>
            </span>
            <span className="stat-label">saved / week</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">
              12<span>k+</span>
            </span>
            <span className="stat-label">happy teams</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">
              99<span>%</span>
            </span>
            <span className="stat-label">uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Right — candy card */}
      <div className="hero-right" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="candy-card">
          <div className="card-top">
            <div className="card-dots">
              <div className="cd" style={{ background: "#fb7185" }} />
              <div className="cd" style={{ background: "#fbbf24" }} />
              <div className="cd" style={{ background: "#34d399" }} />
            </div>
            <div className="card-tag">✦ super-power</div>
          </div>

          <div className="cmd-bar">
            <div className="cmd-icon">⌘</div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text3)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Command
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>
                Schedule a meeting with Sarah next week
                <span className="cmd-cursor" />
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="chat-bubble me">
              <div className="av av-me">You</div>
              <div className="bbl bbl-me">
                Set up a Q3 launch sync with Sarah next week, please!
              </div>
            </div>
            <div className="chat-bubble">
              <div className="av av-sp">SP</div>
              <div className="bbl bbl-sp">
                On it! Checking calendars and finding the best slot… 🗓
              </div>
            </div>

            <div className="action-chips">
              <div className="chip chip-1">
                <span className="chip-icon">📅</span>
                Found 3 open slots for both of you
                <span className="chip-check">✓</span>
              </div>
              <div className="chip chip-2">
                <span className="chip-icon">🗓</span>
                Created &ldquo;Q3 Launch Sync&rdquo; — Wed 11 AM
                <span className="chip-check">✓</span>
              </div>
              <div className="chip chip-3">
                <span className="chip-icon">✉️</span>
                Invite sent to sarah@acme.com
                <span className="chip-check">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
