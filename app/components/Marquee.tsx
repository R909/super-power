const ITEMS = [
  "Zero inbox anxiety",
  "Smart scheduling",
  "Replies in your voice",
  "Thread memory",
  "Calendar OS",
  "Privacy-first AI",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((label, i) => (
          <div className="marquee-item" key={i}>
            <span className="marquee-dot" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
