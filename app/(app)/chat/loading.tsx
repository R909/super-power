import { Loader2 } from "lucide-react";

export default function ChatLoading() {
  return (
    <div className="flex-1 h-screen flex items-center justify-center" style={{ background: "#fce7f3" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.15)" }}
        >
          <Loader2 size={18} className="animate-spin" style={{ color: "#e11d48" }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: "#c084a0" }}>Loading…</span>
      </div>
    </div>
  );
}
