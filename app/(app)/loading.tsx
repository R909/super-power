export default function AppLoading() {
  return (
    <div
      className="flex-1 h-screen flex flex-col overflow-hidden"
      style={{ background: "#fce7f3" }}
    >
      {/* Top bar skeleton */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: "#fff5f8", borderColor: "rgba(225,29,72,0.10)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-56 rounded-xl animate-pulse" style={{ background: "rgba(225,29,72,0.08)" }} />
          <div className="h-8 w-32 rounded-xl animate-pulse" style={{ background: "rgba(225,29,72,0.06)" }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full animate-pulse" style={{ background: "rgba(225,29,72,0.08)" }} />
          <div className="h-8 w-8 rounded-full animate-pulse" style={{ background: "rgba(225,29,72,0.06)" }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-hidden flex gap-5 p-5">
        {/* Main column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 animate-pulse"
                style={{
                  background: "#fff5f8",
                  border: "1px solid rgba(225,29,72,0.10)",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="h-3 w-16 rounded-full mb-3" style={{ background: "rgba(225,29,72,0.08)" }} />
                <div className="h-6 w-10 rounded-lg" style={{ background: "rgba(225,29,72,0.10)" }} />
              </div>
            ))}
          </div>

          {/* Rows */}
          <div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ background: "#fff5f8", border: "1px solid rgba(225,29,72,0.10)" }}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b animate-pulse"
                style={{
                  borderColor: "rgba(225,29,72,0.07)",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "rgba(225,29,72,0.20)" }} />
                <div className="h-4 w-28 rounded-lg" style={{ background: "rgba(225,29,72,0.08)" }} />
                <div className="h-4 flex-1 rounded-lg" style={{ background: "rgba(225,29,72,0.06)" }} />
                <div className="h-4 w-14 rounded-lg flex-shrink-0" style={{ background: "rgba(225,29,72,0.05)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div
            className="rounded-2xl p-4 animate-pulse"
            style={{ background: "#fff5f8", border: "1px solid rgba(225,29,72,0.10)" }}
          >
            <div className="h-4 w-24 rounded-lg mb-4" style={{ background: "rgba(225,29,72,0.10)" }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(225,29,72,0.07)" }}>
                <div className="w-8 h-8 rounded-xl flex-shrink-0 animate-pulse" style={{ background: "rgba(225,29,72,0.08)", animationDelay: `${i * 70}ms` }} />
                <div className="flex-1">
                  <div className="h-3 w-full rounded mb-1.5" style={{ background: "rgba(225,29,72,0.08)" }} />
                  <div className="h-3 w-2/3 rounded" style={{ background: "rgba(225,29,72,0.05)" }} />
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-4 flex-1 animate-pulse"
            style={{ background: "#fff5f8", border: "1px solid rgba(225,29,72,0.10)" }}
          >
            <div className="h-4 w-20 rounded-lg mb-4" style={{ background: "rgba(225,29,72,0.10)" }} />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl mb-2 animate-pulse" style={{ background: "rgba(225,29,72,0.06)", animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Centered spinner overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
    </div>
  );
}
