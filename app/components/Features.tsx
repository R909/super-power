const FEATURES = [
  { icon: "🧠", color: "ic-pink", title: "Smart Inbox Triage", desc: "Reads every thread, surfaces only what needs you, and quietly handles the rest. Your inbox becomes a curated to-do list." },
  { icon: "📅", color: "ic-lav",  title: "Autonomous Scheduling", desc: "Just say who and when. Super-Power finds availability, creates the event, and sends the invite — zero back-and-forth." },
  { icon: "✍️", color: "ic-mint", title: "Reply in Your Voice", desc: "Drafts responses that sound exactly like you, trained on your writing style. One click to send or tweak." },
  { icon: "🔗", color: "ic-pink", title: "Thread Memory", desc: "Remembers context across emails and calendar history. You'll never need to scroll back through old threads again." },
  { icon: "🔒", color: "ic-lav",  title: "Zero-Knowledge Privacy", desc: "Your email content never trains AI models. All processing is encrypted and completely isolated to your account." },
  { icon: "⚡", color: "ic-mint", title: "Command Anywhere", desc: "A global shortcut opens the command bar from anywhere on screen. Type in plain English, done in seconds." },
];

export default function Features() {
  return (
    <section className="sec reveal" id="features">
      <div className="sec-label">✦ What it does</div>
      <h2 className="sec-heading">Six superpowers for your inbox.</h2>
      <div className="feat-grid">
        {FEATURES.map(({ icon, color, title, desc }) => (
          <div key={title} className="feat-card">
            <div className={`feat-icon ${color}`}>{icon}</div>
            <div className="feat-title">{title}</div>
            <p className="feat-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
