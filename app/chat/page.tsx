"use client";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot, Calendar, Clock, Mail,
  Send, Plus, Loader2, AlertTriangle,
} from "lucide-react";

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

  // Pre-fill from ?q= param
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

      // Build history for the API (exclude the initial greeting from AI history)
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

        // Response headers are here — stop showing the spinner and add a placeholder bubble
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
        // Flush any remaining bytes from the decoder
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
    <div className="h-screen flex-1 flex overflow-hidden bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[140px] pointer-events-none z-0" style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none z-0" style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0" style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        {/* History panel */}
        <aside className="w-44 flex-shrink-0 flex flex-col bg-[#07090f] border-r border-white/[0.05]">
          <div className="px-4 pt-5 pb-4 border-b border-white/[0.05]">
            <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-3">Quick Actions</div>
            <div className="flex flex-col gap-1">
              {[
                { icon: Mail,     label: "Check inbox"      },
                { icon: Calendar, label: "View schedule"    },
                { icon: Clock,    label: "Upcoming events"  },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleSend(label)}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-slate-500 font-medium hover:text-slate-300 hover:bg-white/[0.04] transition-all text-left"
                >
                  <Icon size={12} className="text-slate-700 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 mt-auto">
            <button
              onClick={() => setMessages([{ id: Date.now(), role: "ai", text: "Hi! I can read your inbox, send emails, and manage your calendar. What would you like?" }])}
              className="w-full flex items-center justify-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-slate-500 hover:text-slate-300 text-xs font-semibold py-2 rounded-xl transition-all"
            >
              <Plus size={12} /> New chat
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] flex-shrink-0 bg-[#030712]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                <Bot size={15} className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">AI Agent</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-600">Gmail + Calendar</span>
                </div>
                <div className="text-[10px] text-slate-700">Claude Opus 4.8</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/[0.08] border border-teal-500/20 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
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
                <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-amber-400" />
                </div>
                <div className="bg-[#090d16] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-amber-400" />
                  <span className="text-slate-500 text-sm">Thinking…</span>
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
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white/[0.04] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/20 hover:text-amber-400 px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-3 bg-[#090d16] border border-white/[0.07] hover:border-amber-500/20 rounded-2xl px-4 py-3 transition-colors">
              <Bot size={14} className="text-slate-700 flex-shrink-0" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-sm outline-none text-slate-300 placeholder:text-slate-700"
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
                className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl flex items-center justify-center transition-all shadow-[0_2px_10px_rgba(245,158,11,0.3)] flex-shrink-0 disabled:opacity-40"
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
          <div className="bg-amber-500/15 border border-amber-500/20 text-amber-100 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
            {msg.text}
          </div>
        </div>
        <div className="w-7 h-7 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0 mb-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
          ME
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5" style={{ animation: "msg-in 0.25s ease-out both" }}>
      <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={14} className="text-amber-400" />
      </div>
      <div className="max-w-lg">
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            msg.error
              ? "bg-red-500/10 border border-red-500/20 text-red-300"
              : "bg-[#090d16] border border-white/[0.07] text-slate-300"
          }`}
        >
          {msg.error && (
            <span className="flex items-center gap-1.5 mb-1 text-red-400 text-xs font-semibold">
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
    <Suspense fallback={
      <div className="h-screen flex-1 flex items-center justify-center bg-[#030712]">
        <Loader2 size={24} className="animate-spin text-amber-400" />
      </div>
    }>
      <ChatInner />
    </Suspense>
  );
}
