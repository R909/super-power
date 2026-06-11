export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(145deg, #ffd6e8 0%, #c8f7e4 40%, #b3eff5 65%, #f9c6e0 100%)" }} />
      <div className="absolute -top-32 -right-32 w-[580px] h-[580px] rounded-full"
        style={{ background: "radial-gradient(circle, #f9a8d4 0%, transparent 65%)", opacity: 0.7 }} />
      <div className="absolute -bottom-40 -left-40 w-[680px] h-[680px] rounded-full"
        style={{ background: "radial-gradient(circle, #6ee7b7 0%, transparent 60%)", opacity: 0.65 }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
        style={{ background: "radial-gradient(ellipse, #f472b6 0%, transparent 60%)", opacity: 0.35 }} />
      <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, #34d399 0%, transparent 65%)", opacity: 0.25 }} />
      <div className="absolute top-1/3 -right-16 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 65%)", opacity: 0.35 }} />
      <div className="absolute bottom-0 left-0 right-0 h-56"
        style={{ background: "linear-gradient(to top, #5eead4 0%, transparent 100%)", opacity: 0.2 }} />
    </div>
  );
}
