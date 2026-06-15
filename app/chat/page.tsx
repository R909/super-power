"use client";
import { useState, useRef, useEffect } from "react";
import {
  Bot, Calendar, MessageSquare, Clock, Mail,
  Send, Plus, CheckCircle, Video, Sparkles,
} from "lucide-react";
import Sidebar from "../components/sidebar";

const HISTORY = [
  { id: 1, icon: Mail,     label: "Draft follow-ups"  },
  { id: 2, icon: Calendar, label: "Schedule sync"      },
  { id: 3, icon: Clock,    label: "Weekly summary"     },
];

type Role = "ai" | "user";

interface InviteCard {
  name: string;
  date: string;
  timeRange: string;
  extra: string;
}

interface Msg {
  id: number;
  role: Role;
  text: string;
  invite?: InviteCard;
}

const INITIAL_MESSAGES: Msg[] = [
  {
    id: 1,
    role: "ai",
    text: "Hi! I can read your inbox, send emails, and manage your calendar. What would you like?",
  },
  {
    id: 2,
    role: "user",
    text: "Summarize investor emails this week",
  },
  {
    id: 3,
    role: "ai",
    text: "Found 3 investor emails. James K. followed up on the term sheet. Priya V. asked about the demo date. One new intro from Sequoia…",
  },
  {
    id: 4,
    role: "user",
    text: "Schedule 30-min call with James, Tue 3pm",
  },
  {
    id: 5,
    role: "ai",
    text: "Ready to send invite",
    invite: {
      name: "James K.",
      date: "Tue Jun 17, 3:00–3:30 PM",
      timeRange: "30 min · Google Meet",
      extra: "Meet link added",
    },
  },
];

const PROMPTS = [
  "Summarize today's emails",
  "Schedule a team standup",
  "Draft a follow-up to James",
  "What's on my calendar?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: "Got it! Working on that for you…" },
      ]);
    }, 800);
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Bg effects */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        {/* History panel */}
        <aside className="w-44 flex-shrink-0 flex flex-col bg-[#07090f] border-r border-white/[0.05]">
          <div className="px-4 pt-5 pb-4 border-b border-white/[0.05]">
            <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-3">History</div>
            <div className="flex flex-col gap-1">
              {HISTORY.map(({ id, icon: Icon, label }) => (
                <button key={id}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-slate-500 font-medium hover:text-slate-300 hover:bg-white/[0.04] transition-all text-left">
                  <Icon size={12} className="text-slate-700 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 mt-auto">
            <button className="w-full flex items-center justify-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-slate-500 hover:text-slate-300 text-xs font-semibold py-2 rounded-xl transition-all">
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
                  <span className="text-xs text-slate-600">Corsair MCP</span>
                </div>
                <div className="text-[10px] text-slate-700">Claude Sonnet 4.6</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/[0.08] border border-teal-500/20 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              Connected
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Prompt chips */}
          <div className="px-6 pt-3 flex gap-2 flex-wrap flex-shrink-0">
            {PROMPTS.map((p) => (
              <button key={p} onClick={() => handleSend(p)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white/[0.04] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/20 hover:text-amber-400 px-3 py-1.5 rounded-full transition-all">
                <Sparkles size={10} />
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-3 bg-[#090d16] border border-white/[0.07] hover:border-amber-500/20 rounded-2xl px-4 py-3 transition-colors">
              <Bot size={14} className="text-slate-700 flex-shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm outline-none text-slate-300 placeholder:text-slate-700"
                placeholder="Ask me to send an email or schedule a meeting…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button onClick={() => handleSend()}
                className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl flex items-center justify-center transition-all shadow-[0_2px_10px_rgba(245,158,11,0.3)] flex-shrink-0">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const [sent, setSent] = useState(false);

  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2" style={{ animation: "msg-in 0.25s ease-out both" }}>
        <div className="max-w-xs">
          <div className="bg-amber-500/15 border border-amber-500/20 text-amber-100 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
            {msg.text}
          </div>
        </div>
        <div className="w-7 h-7 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0 mb-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
          AM
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5" style={{ animation: "msg-in 0.25s ease-out both" }}>
      <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={14} className="text-amber-400" />
      </div>
      <div className="max-w-sm space-y-2">
        {!msg.invite && (
          <div className="bg-[#090d16] border border-white/[0.07] text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
            {msg.text}
          </div>
        )}

        {msg.invite && (
          <div className="rounded-2xl rounded-tl-sm border border-violet-500/20 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(79,70,229,0.10) 100%)" }}>
            <div className="px-5 pt-4 pb-3">
              <div className="font-bold text-slate-200 text-sm mb-2">{msg.text}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                <span className="font-semibold text-slate-300">{msg.invite.name}</span>
                <span>·</span>
                <span>{msg.invite.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Video size={10} className="text-violet-400" />
                <span>{msg.invite.extra}</span>
              </div>
            </div>
            <div className="flex gap-2 px-4 pb-4">
              {sent ? (
                <div className="flex items-center gap-1.5 text-sm text-teal-400 font-semibold">
                  <CheckCircle size={13} /> Invite sent!
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setSent(true)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold py-2 rounded-xl transition-all shadow-[0_2px_10px_rgba(245,158,11,0.25)]">
                    Confirm & send
                  </button>
                  <button className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 text-xs font-semibold py-2 rounded-xl transition-all">
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
