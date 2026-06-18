"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import {
  Mail, Plus, Inbox, Calendar, Send,
  Archive, Trash2, CheckCircle, Bot, Search,
  Zap, Sparkles, RefreshCw,
  ChevronRight, ArrowUpRight, LogOut, X, Loader2,
  Star, StarOff,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useInboxLoading } from "@/app/components/providers/inbox-loading-provider";

const T = {
  bg:       "#fce7f3",
  surface:  "#fff5f8",
  border:   "rgba(225,29,72,0.10)",
  accent:   "#e11d48",
  accentLt: "rgba(225,29,72,0.08)",
  pri:      "#1a0008",
  sec:      "#7f1d1d",
  muted:    "#c084a0",
  dim:      "#e9b8c8",
  gradient: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
  success:  "#0d9488",
  blue:     "#2563eb",
};

interface Thread {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  unread: boolean;
  starred: boolean;
  messageId: string;
  messageCount: number;
}

interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  isHtml: boolean;
  unread: boolean;
  starred: boolean;
}

interface CalEvent {
  id: string;
  summary: string;
  start: string;
  isAllDay: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseFrom(from: string): { name: string; initials: string } {
  const match = from.match(/^"?([^"<]+?)"?\s*(?:<[^>]+>)?$/);
  const name = match?.[1]?.trim() || from.split("@")[0] || from;
  return { name, initials: getInitials(name) };
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day.getTime() === today.getTime())
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (day.getTime() === yesterday.getTime()) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatEventTime(iso: string, isAllDay: boolean): string {
  if (isAllDay) return "All day";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

const FOLDER_LABELS: Record<string, string> = {
  "in:inbox":   "Inbox",
  "is:starred": "Starred",
  "is:snoozed": "Snoozed",
  "in:sent":    "Sent",
  "in:drafts":  "Drafts",
  "in:spam":    "Spam",
  "in:all":     "All Mail",
  "in:trash":   "Trash",
};

const GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-emerald-500",
  "from-amber-500 to-orange-500",
  "from-slate-500 to-slate-600",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
];

function gradientFor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderQ = searchParams.get("q") ?? "in:inbox";
  const { data: session, isPending } = authClient.useSession();
  const { setInboxLoading } = useInboxLoading();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [threadDetail, setThreadDetail] = useState<Record<string, ThreadMessage[]>>({});

  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubj, setComposeSubj] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeSent, setComposeSent] = useState(false);
  const [composeErr, setComposeErr] = useState("");
  const [quickText, setQuickText] = useState("");

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [session, isPending, router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadInbox = useCallback(async (q = "in:inbox") => {
    setLoadingThreads(true);
    setInboxLoading(true);
    try {
      const res = await fetch(`/api/gmail/inbox?q=${encodeURIComponent(q)}&maxResults=15`);
      if (!res.ok) return;
      const data = await res.json();
      setThreads(data.threads ?? []);
    } finally {
      setLoadingThreads(false);
      setInboxLoading(false);
    }
  }, [setInboxLoading]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/gmail/profile");
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {}
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/events?days=1");
      if (!res.ok) return;
      const data = await res.json();
      const mapped: CalEvent[] = (data.items ?? [])
        .map((item: any) => {
          const dateTime: string | undefined = item.start?.dateTime;
          const date: string | undefined = item.start?.date;
          if (!dateTime && !date) return null;
          return {
            id: item.id,
            summary: item.summary ?? "Untitled",
            start: dateTime ?? date!,
            isAllDay: !dateTime,
          };
        })
        .filter(Boolean) as CalEvent[];
      setEvents(mapped);
    } catch {}
  }, []);

  useEffect(() => {
    setSearch(folderQ !== "in:inbox" ? folderQ : "");
  }, [folderQ]);

  useEffect(() => {
    if (session) loadInbox(folderQ);
  }, [session, folderQ, loadInbox]);

  useEffect(() => {
    if (session) { loadStats(); loadEvents(); }
  }, [session, loadStats, loadEvents]);

  const handleThreadClick = useCallback(
    async (id: string) => {
      if (activeThread === id) {
        setActiveThread(null);
        return;
      }
      setActiveThread(id);
      if (threadDetail[id]) return;
      setLoadingDetail(id);
      try {
        const res = await fetch(`/api/gmail/thread/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setThreadDetail((prev) => ({ ...prev, [id]: data.messages ?? [] }));
        setThreads((prev) =>
          prev.map((t) => (t.id === id ? { ...t, unread: false } : t))
        );
      } finally {
        setLoadingDetail(null);
      }
    },
    [activeThread, threadDetail]
  );

  const handleAction = useCallback(
    async (action: string, messageId: string, threadId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setActionBusy(messageId);
      try {
        await fetch("/api/gmail/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, messageId }),
        });
        if (action === "archive" || action === "trash") {
          setThreads((prev) => prev.filter((t) => t.id !== threadId));
          if (activeThread === threadId) setActiveThread(null);
        } else if (action === "star") {
          setThreads((prev) =>
            prev.map((t) => (t.id === threadId ? { ...t, starred: true } : t))
          );
        } else if (action === "unstar") {
          setThreads((prev) =>
            prev.map((t) => (t.id === threadId ? { ...t, starred: false } : t))
          );
        }
      } finally {
        setActionBusy(null);
      }
    },
    [activeThread]
  );

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && search.trim()) loadInbox(search.trim());
    },
    [search, loadInbox]
  );

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  function openCompose(prefillSubject = "") {
    setComposeTo(""); setComposeSubj(prefillSubject); setComposeBody("");
    setComposeSent(false); setComposeErr("");
    setComposeOpen(true);
  }

  async function handleComposeSend() {
    if (!composeTo.trim() || !composeSubj.trim()) return;
    setComposeSending(true); setComposeErr("");
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: composeTo.trim(), subject: composeSubj.trim(), body: composeBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      setComposeSent(true);
      setQuickText("");
      setTimeout(() => { setComposeOpen(false); setComposeSent(false); }, 1500);
    } catch (err: any) {
      setComposeErr(err.message ?? "Failed to send");
    } finally {
      setComposeSending(false);
    }
  }

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: T.bg }}>
        <Loader2 size={24} className="animate-spin" style={{ color: T.accent }} />
      </div>
    );
  }
  if (!session) return null;

  const initials = getInitials(session.user.name ?? session.user.email ?? "?");
  const todayEvents = events.filter((ev) => ev.start);
  const unreadThreads = threads.filter((t) => t.unread).length;

  const STATS = [
    { label: "Unread",   value: unreadCount !== null ? String(unreadCount) : "–", sub: `${unreadThreads} in view`, color: T.accent },
    { label: "Today",    value: String(todayEvents.length), sub: "calendar events", color: "#7c3aed" },
    { label: "AI Agent", value: "On", sub: "Claude Sonnet 4.6", color: T.success },
    { label: "Inbox",    value: String(threads.length), sub: "threads loaded", color: T.accent },
  ];

  return (
    <>
      <div className="h-screen flex-1 flex overflow-hidden" style={{ background: T.bg }}>
        <div className="flex-1 flex flex-col overflow-hidden">

          <header className="flex items-center gap-3 px-6 py-3 bg-white" style={{ borderBottom: `1px solid ${T.border}` }}>
            <div className="flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl text-xs" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <Search size={13} style={{ color: T.muted, flexShrink: 0 }} />
              <input
                placeholder="Search emails…"
                className="bg-transparent outline-none text-xs w-full"
                style={{ color: T.pri }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            <button
              onClick={() => router.push("/integrations")}
              className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl ml-auto"
              style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}
            >
              <Plus size={13} /> Add Integration
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfile((p) => !p)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: T.gradient }}
              >
                {initials}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-10 w-64 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: T.border }}>
                  <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: T.gradient }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: T.pri }}>{session.user.name}</p>
                      <p className="text-xs truncate" style={{ color: T.muted }}>{session.user.email}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-rose-50" style={{ color: T.accent }}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            {STATS.map(({ label, value, sub, color }, i) => (
              <div key={label} className="px-6 py-4 bg-white" style={{ borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: T.muted }}>{label}</p>
                <p className="text-2xl font-black tracking-tight" style={{ color }}>{value}</p>
                <p className="text-[10px] mt-1" style={{ color: T.muted }}>{sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">

            <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-white overflow-x-hidden" style={{ borderRight: `1px solid ${T.border}` }}>
              <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2">
                  <Inbox size={13} style={{ color: T.muted }} />
                  <span className="text-sm font-bold" style={{ color: T.pri }}>
                    {FOLDER_LABELS[folderQ] ?? "Search Results"}
                  </span>
                  {!loadingThreads && unreadThreads > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: T.accentLt, color: T.accent }}>
                      {unreadThreads}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => loadInbox()}
                    className="text-[11px] flex items-center gap-1"
                    style={{ color: T.muted }}
                  >
                    <RefreshCw size={10} className={loadingThreads ? "animate-spin" : ""} /> Refresh
                  </button>
                  <Link href="/chat" className="text-[11px] flex items-center gap-0.5 font-semibold" style={{ color: T.accent }}>
                    AI Agent <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {loadingThreads ? (
                  <div className="divide-y" style={{ borderColor: T.border }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="px-6 py-4 flex items-start gap-3 animate-pulse">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" />
                        <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: "rgba(225,29,72,0.10)" }} />
                        <div className="flex-1 min-w-0 space-y-2 pt-0.5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="h-2.5 rounded-full w-28" style={{ background: "rgba(225,29,72,0.10)" }} />
                            <div className="h-2 rounded-full w-10 flex-shrink-0" style={{ background: "rgba(225,29,72,0.07)" }} />
                          </div>
                          <div className="h-2.5 rounded-full" style={{ background: "rgba(225,29,72,0.08)", width: `${60 + (i * 17) % 30}%` }} />
                          <div className="h-2 rounded-full" style={{ background: "rgba(225,29,72,0.06)", width: `${40 + (i * 13) % 25}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: T.muted }}>
                    <Mail size={24} style={{ opacity: 0.4 }} />
                    <p className="text-sm">No emails found</p>
                  </div>
                ) : (
                  threads.map((t) => {
                    const open = activeThread === t.id;
                    const { name, initials: fromInitials } = parseFrom(t.from);
                    const grad = gradientFor(t.from);
                    const detail = threadDetail[t.id];
                    const isLoadingThis = loadingDetail === t.id;

                    return (
                      <div
                        key={t.id}
                        onClick={() => handleThreadClick(t.id)}
                        className="px-6 py-4 cursor-pointer transition-all"
                        style={{
                          background: open ? "rgba(225,29,72,0.04)" : "transparent",
                          borderBottom: `1px solid ${T.border}`,
                          borderLeft: open ? `2px solid ${T.accent}` : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(225,29,72,0.02)"; }}
                        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-2 w-1.5 flex-shrink-0">
                            {t.unread && <span className="block w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />}
                          </div>

                          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                            {fromInitials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs" style={{ color: t.unread ? T.pri : T.muted, fontWeight: t.unread ? 700 : 500 }}>
                                  {name}
                                </span>
                                {t.starred && <Star size={9} fill="currentColor" style={{ color: "#f59e0b" }} />}
                                {t.messageCount > 1 && (
                                  <span className="text-[9px]" style={{ color: T.dim }}>({t.messageCount})</span>
                                )}
                              </div>
                              <span className="text-[10px] flex-shrink-0" style={{ color: T.muted }}>{formatDate(t.date)}</span>
                            </div>

                            <p className="text-xs truncate" style={{ color: t.unread ? T.sec : T.muted, fontWeight: t.unread ? 500 : 400 }}>
                              {t.subject}
                            </p>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: T.muted }}>{t.snippet}</p>

                            {open && (
                              <div className="mt-3 space-y-3">
                                {isLoadingThis ? (
                                  <div className="flex items-center gap-2" style={{ color: T.muted }}>
                                    <Loader2 size={11} className="animate-spin" />
                                    <span className="text-[11px]">Loading…</span>
                                  </div>
                                ) : detail ? (
                                  <div className="space-y-2">
                                    {detail.map((msg, idx) => (
                                      <div key={msg.id} className="rounded-xl p-3 min-w-0" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                                        <div className="flex items-center justify-between gap-2 mb-1 min-w-0">
                                          <span className="text-[10px] font-semibold truncate min-w-0" style={{ color: T.sec }}>{msg.from}</span>
                                          <span className="text-[9px] flex-shrink-0" style={{ color: T.dim }}>{formatDate(msg.date)}</span>
                                        </div>
                                        <p
                                          className="text-xs leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
                                          style={{
                                            color: T.pri,
                                            maxHeight: idx === detail.length - 1 ? "18rem" : "4rem",
                                            overflowY: idx === detail.length - 1 ? "auto" : "hidden",
                                          }}
                                        >
                                          {msg.body || msg.snippet}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openCompose(`Re: ${t.subject}`); }}
                                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all text-white"
                                    style={{ background: T.gradient, boxShadow: "0 2px 8px rgba(225,29,72,0.25)" }}
                                  >
                                    <Send size={10} /> Reply
                                  </button>
                                  <button
                                    onClick={(e) => handleAction("archive", t.messageId, t.id, e)}
                                    disabled={actionBusy === t.messageId}
                                    className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl transition-all"
                                    style={{ color: T.muted }}
                                  >
                                    {actionBusy === t.messageId ? <Loader2 size={10} className="animate-spin" /> : <Archive size={10} />} Archive
                                  </button>
                                  <button
                                    onClick={(e) => handleAction(t.starred ? "unstar" : "star", t.messageId, t.id, e)}
                                    disabled={actionBusy === t.messageId}
                                    className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl transition-all"
                                    style={{ color: t.starred ? "#f59e0b" : T.muted }}
                                  >
                                    {t.starred ? <StarOff size={10} /> : <Star size={10} />}
                                    {t.starred ? "Unstar" : "Star"}
                                  </button>
                                  <button
                                    onClick={(e) => handleAction("trash", t.messageId, t.id, e)}
                                    disabled={actionBusy === t.messageId}
                                    className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl transition-all ml-auto"
                                    style={{ color: "#dc2626" }}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="w-64 flex-shrink-0 flex flex-col overflow-y-auto bg-white" style={{ background: T.surface }}>

              <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: T.muted }} />
                    <span className="text-xs font-bold" style={{ color: T.pri }}>Today</span>
                    <span className="text-[10px]" style={{ color: T.muted }}>
                      {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <Link href="/calendar" className="text-[10px] flex items-center gap-0.5" style={{ color: T.muted }}>
                    View <ArrowUpRight size={10} />
                  </Link>
                </div>
                {todayEvents.length === 0 ? (
                  <p className="text-[11px]" style={{ color: T.dim }}>No events today</p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.slice(0, 5).map((ev, i) => {
                      const colors = ["#0d9488", "#7c3aed", "#d97706", "#2563eb", T.accent];
                      return (
                        <div key={ev.id} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono w-12 flex-shrink-0" style={{ color: T.muted }}>
                            {formatEventTime(ev.start, ev.isAllDay)}
                          </span>
                          <div className="w-0.5 h-8 rounded-full flex-shrink-0 opacity-60" style={{ background: colors[i % colors.length] }} />
                          <p className="text-xs truncate" style={{ color: T.pri }}>{ev.summary}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} style={{ color: T.accent }} />
                  <span className="text-xs font-bold" style={{ color: T.pri }}>AI Agent</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Summarize my inbox", icon: Bot },
                    { label: "What's on my calendar?", icon: Calendar },
                    { label: "Draft a reply", icon: Send },
                  ].map(({ label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={`/chat?q=${encodeURIComponent(label)}`}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-all hover:bg-rose-50 block"
                    >
                      <Icon size={12} style={{ color: T.accent, flexShrink: 0 }} />
                      <span className="text-xs leading-tight" style={{ color: T.muted }}>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} style={{ color: T.accent }} />
                  <span className="text-xs font-bold" style={{ color: T.pri }}>Quick compose</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#fff", border: `1px solid ${T.border}` }}>
                  <input
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: T.pri }}
                    placeholder="Subject or note…"
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") openCompose(quickText); }}
                  />
                  <button
                    onClick={() => openCompose(quickText)}
                    className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: T.gradient }}
                  >
                    <Send size={9} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setComposeOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col" style={{ border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}>
              <span className="text-sm font-bold" style={{ color: T.pri }}>New Message</span>
              <button onClick={() => setComposeOpen(false)} style={{ color: T.muted }}><X size={16} /></button>
            </div>
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>To</span>
              <input autoFocus type="email" className="flex-1 text-sm outline-none" style={{ color: T.pri }} placeholder="recipient@example.com" value={composeTo} onChange={(e) => setComposeTo(e.target.value)} />
            </div>
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>Subject</span>
              <input className="flex-1 text-sm outline-none" style={{ color: T.pri }} placeholder="Subject" value={composeSubj} onChange={(e) => setComposeSubj(e.target.value)} />
            </div>
            <textarea className="w-full px-5 py-4 text-sm outline-none resize-none" style={{ color: T.pri, minHeight: 200 }} placeholder="Write your message…" value={composeBody} onChange={(e) => setComposeBody(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleComposeSend(); }} />
            <div className="px-5 py-3 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}>
              <span className="text-xs flex-1" style={{ color: T.accent }}>{composeErr}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setComposeOpen(false)} className="text-xs px-4 py-2 rounded-xl font-medium" style={{ color: T.muted, border: `1px solid ${T.border}` }}>Discard</button>
                <button onClick={handleComposeSend} disabled={composeSending || composeSent || !composeTo.trim() || !composeSubj.trim()} className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all disabled:opacity-50" style={{ background: T.gradient }}>
                  {composeSent ? <><CheckCircle size={12} /> Sent!</> : composeSending ? "Sending…" : <><Send size={12} /> Send</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  );
}
