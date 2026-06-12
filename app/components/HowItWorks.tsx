export default function HowItWorks() {
  return (
    <div className="steps-bg">
      <div
        className="steps-inner reveal"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 52px" }}
      >
        <div
          className="sec-label"
          style={{
            background: "#fff",
            borderColor: "var(--lav-mid)",
            color: "var(--lav)",
          }}
        >
          ✦ How it works
        </div>
        <h2 className="sec-heading" style={{ marginBottom: 0 }}>
          Three steps and your inbox will never stress you out again.
        </h2>

        <div className="step-cards">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-num-badge sn-1">1</div>
            <div className="step-title">Connect your accounts</div>
            <p className="step-desc">
              Link Gmail and Google Calendar with one click. Super-Power reads
              your history to understand your style and contacts.
            </p>
            <div className="step-visual">
              <span className="mv-mint">✓</span> gmail connected
              <br />
              <span className="mv-mint">✓</span> calendar connected
              <br />
              <span className="mv-lav">…</span> learning your style
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-num-badge sn-2">2</div>
            <div className="step-title">Give it a task</div>
            <p className="step-desc">
              Type a natural-language command — or let Super-Power surface tasks
              proactively from what&apos;s already in your inbox.
            </p>
            <div className="step-visual">
              <span className="mv-pink">⌘</span> &ldquo;Follow up with investors&rdquo;
              <br />
              <br />
              <span className="mv-lav">→</span> drafting reply…
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-num-badge sn-3">3</div>
            <div className="step-title">Review &amp; send</div>
            <p className="step-desc">
              Every action shows what it did and why. Approve in one key, edit
              freely, or enable auto-send for trusted actions.
            </p>
            <div className="step-visual">
              <span className="mv-lav">draft ready ✦</span>
              <br />
              Re: Q3 Investor Update
              <br />
              <br />
              <span className="mv-mint">[Send]</span>{" "}
              <span className="mv-pink">[Edit]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
