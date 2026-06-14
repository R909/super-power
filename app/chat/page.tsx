"use client";
import { useState, useRef, useEffect } from "react";
import {
  Bot, Inbox, Calendar, MessageSquare, Clock, Mail,
  Send, Plus, CheckCircle, Video,
} from "lucide-react";

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [activeNav, setActiveNav] = useState<"inbox" | "calendar" | "agent">("agent");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: "Got it! Working on that for you…" },
      ]);
    }, 800);
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">

      <aside className="w-36 flex-shrink-0 flex flex-col"
        style={{ background: "linear-gradient(180deg, #c8f5e0 0%, #b2edd4 100%)" }}>

        <div className="px-4 pt-5 pb-4">
          <span className="font-extrabold text-base text-emerald-900 tracking-tight">Corsair</span>
        </div>

        <nav className="px-2 flex flex-col gap-0.5">
          {[
            { id: "inbox",    icon: Inbox,          label: "Inbox"    },
            { id: "calendar", icon: Calendar,        label: "Calendar" },
            { id: "agent",    icon: MessageSquare,   label: "AI Agent" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id}
              onClick={() => setActiveNav(id as typeof activeNav)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                ${activeNav === id
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-emerald-800 hover:bg-emerald-200/60"}`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-6 px-4">
          <div className="text-[11px] font-bold text-emerald-700/70 uppercase tracking-wider mb-2">History</div>
          <div className="flex flex-col gap-1">
            {HISTORY.map(({ id, icon: Icon, label }) => (
              <button key={id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-emerald-900 font-medium hover:bg-emerald-200/50 transition-colors text-left">
                <Icon size={13} className="text-emerald-700 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-3 pb-4">
          <button className="w-full flex items-center justify-center gap-1.5 bg-white/50 hover:bg-white/70 border border-emerald-300/50 text-emerald-800 text-xs font-semibold py-2 rounded-xl transition-colors">
            <Plus size={13} /> New chat
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-white overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-emerald-700" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">AI Agent</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">Corsair MCP</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Connected
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-6 pb-5 pt-3 border-t border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Bot size={15} className="text-slate-400 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
              placeholder="Ask me to send an email or schedule a meeting…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm flex-shrink-0">
              <Send size={13} />
            </button>
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
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-xs">
          <div className="bg-teal-100 text-teal-900 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
            {msg.text}
          </div>
        </div>
        <div className="w-7 h-7 bg-violet-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5">
          You
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={15} className="text-emerald-700" />
      </div>
      <div className="max-w-sm space-y-2">
        {!msg.invite && (
          <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
            {msg.text}
          </div>
        )}

        {msg.invite && (
          <div className="rounded-2xl rounded-tl-sm border border-violet-200 overflow-hidden shadow-sm"
            style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)" }}>
            <div className="px-5 pt-4 pb-3">
              <div className="font-bold text-slate-800 text-sm mb-2">{msg.text}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                <span className="font-semibold text-slate-700">{msg.invite.name}</span>
                <span>·</span>
                <span>{msg.invite.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Video size={11} className="text-violet-500" />
                <span>{msg.invite.extra}</span>
              </div>
            </div>
            <div className="flex gap-2 px-4 pb-4">
              {sent ? (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                  <CheckCircle size={14} /> Invite sent!
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setSent(true)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors shadow-sm">
                    Confirm & send
                  </button>
                  <button className="flex-1 bg-white/70 hover:bg-white border border-violet-200 text-slate-600 text-xs font-semibold py-2 rounded-xl transition-colors">
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
