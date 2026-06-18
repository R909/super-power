"use client";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot, Calendar, Clock, Mail,
  Send, Plus, Loader2, AlertTriangle,
} from "lucide-react";

const T = {
  bg:         "#fce7f3",
  surface:    "#fff5f8",
  card:       "#ffffff",
  border:     "rgba(225,29,72,0.10)",
  accent:     "#e11d48",
  accentLt:   "rgba(225,29,72,0.08)",
  gradient:   "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
  pri:        "#1a0008",
  sec:        "#7f1d1d",
  muted:      "#c084a0",
  dim:        "#e9b8c8",
};

interface Msg {
  id: number;
  role: "ai" | "user";
  text: string;
  error?: boolean;
}

const PROMPTS = [
  "Summarize my inbox",
  "What's on my calendar this week?",
  "Send an email to a colleague",
  "Schedule a 30-min call for tomorrow at 3pm",
];

function ChatInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "ai",
      text: "Hi! I can read your inbox, send emails, and manage your calendar. What would you like?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      inputRef.current?.focus();
    }
  }, [searchParams]);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || loading) return;
      setInput("");

      const userMsg: Msg = { id: Date.now(), role: "user", text: msg };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const history = [...messages, userMsg]
        .filter((m) => !(m.id === 1 && m.role === "ai"))
        .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as any).error ?? "Request failed");
        }

        setLoading(false);
        const aiId = Date.now() + 1;
        setMessages((prev) => [...prev, { id: aiId, role: "ai" as const, text: "" }]);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === aiId ? { ...m, text: fullText } : m))
          );
        }
        fullText += decoder.decode();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId ? { ...m, text: fullText || "Done." } : m
          )
        );
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "ai",
            text: err.message ?? "Something went wrong. Please try again.",
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  return (
    <div className="h-screen flex-1 flex overflow-hidden relative" style={{ background: T.bg }}>
      <style>{`
        @keyframes float-a  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes msg-in   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Ambient blobs */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(251,113,133,0.18)", filter: "blur(130px)", animation: "float-a 16s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(225,29,72,0.10)", filter: "blur(120px)", animation: "float-b 12s ease-in-out infinite" }}
      />
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-0"
        style={{
          background: "linear-gradient(to right, transparent, rgba(225,29,72,0.15), transparent)",
          animation: "scan-line 14s linear infinite 2s",
        }}
      />

      <div className="relative z-10 flex w-full h-full">
        {/* Quick Actions sidebar */}
        <aside
          className="w-44 flex-shrink-0 flex flex-col"
          style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}
        >
          <div className="px-4 pt-5 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: T.muted }}>
              Quick Actions
            </p>
            <div className="flex flex-col gap-1">
              {[
                { icon: Mail,     label: "Check inbox"     },
                { icon: Calendar, label: "View schedule"   },
                { icon: Clock,    label: "Upcoming events" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleSend(label)}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl text-xs font-medium transition-all text-left hover:bg-rose-50"
                  style={{ color: T.muted }}
                >
                  <Icon size={12} style={{ color: T.dim, flexShrink: 0 }} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 mt-auto">
            <button
              onClick={() =>
                setMessages([{
                  id: Date.now(),
                  role: "ai",
                  text: "Hi! I can read your inbox, send emails, and manage your calendar. What would you like?",
                }])
              }
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all hover:bg-rose-50"
              style={{ color: T.muted, border: `1px solid ${T.border}`, background: T.card }}
            >
              <Plus size={12} /> New chat
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0 backdrop-blur-md"
            style={{ background: "rgba(255,245,248,0.85)", borderBottom: `1px solid ${T.border}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: T.accentLt, border: `1px solid ${T.border}` }}
              >
                <Bot size={15} style={{ color: T.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: T.pri }}>AI Agent</span>
                  <span style={{ color: T.dim }}>·</span>
                  <span className="text-xs" style={{ color: T.muted }}>Gmail + Calendar</span>
                </div>
                <div className="text-[10px]" style={{ color: T.muted }}>Claude Opus 4.8</div>
              </div>
            </div>

            <div
              className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: T.accentLt, border: "1px solid rgba(225,29,72,0.20)", color: T.accent }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: T.accent, animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              Active
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div className="flex items-start gap-2.5" style={{ animation: "msg-in 0.25s ease-out both" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: T.accentLt, border: `1px solid ${T.border}` }}
                >
                  <Bot size={14} style={{ color: T.accent }} />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2"
                  style={{ background: T.card, border: `1px solid ${T.border}` }}
                >
                  <Loader2 size={13} className="animate-spin" style={{ color: T.accent }} />
                  <span className="text-sm" style={{ color: T.muted }}>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Prompt chips */}
          <div className="px-6 pt-3 flex gap-2 flex-wrap flex-shrink-0">
            {PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all disabled:opacity-40 hover:bg-rose-50"
                style={{ color: T.muted, background: T.card, border: `1px solid ${T.border}` }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-3 flex-shrink-0">
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <Bot size={14} style={{ color: T.dim, flexShrink: 0 }} />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: T.pri }}
                placeholder="Send an email, schedule a meeting, search your inbox…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 text-white disabled:opacity-40"
                style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.30)" }}
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2" style={{ animation: "msg-in 0.25s ease-out both" }}>
        <div className="max-w-sm">
          <div
            className="rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed text-white"
            style={{
              background: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
              boxShadow: "0 2px 10px rgba(225,29,72,0.25)",
            }}
          >
            {msg.text}
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5"
          style={{
            background: "linear-gradient(135deg,#fb7185,#e11d48)",
            boxShadow: "0 2px 8px rgba(225,29,72,0.30)",
          }}
        >
          ME
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5" style={{ animation: "msg-in 0.25s ease-out both" }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.15)" }}
      >
        <Bot size={14} style={{ color: "#e11d48" }} />
      </div>
      <div className="max-w-lg min-w-0">
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={
            msg.error
              ? { background: "#fff0f0", border: "1px solid rgba(220,38,38,0.20)", color: "#dc2626" }
              : { background: "#ffffff", border: "1px solid rgba(225,29,72,0.10)", color: "#1a0008" }
          }
        >
          {msg.error && (
            <span className="flex items-center gap-1.5 mb-1 text-xs font-semibold" style={{ color: "#dc2626" }}>
              <AlertTriangle size={11} /> Error
            </span>
          )}
          {msg.text}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex-1 flex items-center justify-center" style={{ background: "#fce7f3" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#e11d48" }} />
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
