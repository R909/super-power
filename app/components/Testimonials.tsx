const TESTIMONIALS = [
  {
    quote: '"I used to spend 90 minutes on email every morning. Now it\'s 15. Super-Power handles everything I\'d normally delay or forget."',
    name: "Arjun Rao",
    role: "Founder, Stealth SaaS",
    initials: "AR",
    avClass: "tav-1",
  },
  {
    quote: '"Scheduling alone is worth it. Said \'set up a kickoff with design\' and three invites went out before I finished my coffee."',
    name: "Maya Liu",
    role: "Senior PM, Series B",
    initials: "ML",
    avClass: "tav-2",
  },
  {
    quote: '"The reply drafts are frighteningly good. My team thought I hired a comms consultant — it just learned from my existing emails."',
    name: "Clara Kim",
    role: "COO, Fintech scale-up",
    initials: "CK",
    avClass: "tav-3",
  },
];

export default function Testimonials() {
  return (
    <section className="sec reveal">
      <div className="sec-label">✦ What people say</div>
      <h2 className="sec-heading">Loved by founders, PMs &amp; operators.</h2>
      <div className="testi-grid">
        {TESTIMONIALS.map(({ quote, name, role, initials, avClass }) => (
          <div key={name} className="testi-card">
            <div className="testi-stars">⭐⭐⭐⭐⭐</div>
            <p className="testi-quote">{quote}</p>
            <div className="testi-author">
              <div className={`tav ${avClass}`}>{initials}</div>
              <div>
                <div className="tname">{name}</div>
                <div className="trole">{role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
