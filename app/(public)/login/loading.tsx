export default function LoginLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#fce7f3" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)" }}
        >
          <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <span className="text-xs font-semibold" style={{ color: "#c084a0" }}>Loading…</span>
      </div>
    </div>
  );
}
