"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail, Bell, Plus, Inbox, Calendar, MessageSquare, Settings,
  Star, Clock, Send, FileText, AlertCircle, Archive, Trash2,
  Users, CheckCircle, Bot, Search, Zap, MoreHorizontal,
  LayoutDashboard, Sparkles, RefreshCw, ChevronRight,
  ArrowUpRight, LogOut, Plug,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// ─── Design tokens ────────────────────────────────────────────────────────────
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
};

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { label: "Unread",     value: "71",   sub: "+12 today",       color: T.accent   },
  { label: "Meetings",   value: "4",    sub: "Next in 38 min",  color: "#7c3aed"  },
  { label: "AI tasks",   value: "12",   sub: "3 need review",   color: "#0d9488"  },
  { label: "Time saved", value: "3.2h", sub: "↑ 18% this week", color: T.accent   },
];

const THREADS = [
  { id: 1, from: "James K.",    initials: "JK", gradient: "from-violet-500 to-indigo-500",  subject: "Re: Term Sheet — final comments",      preview: "I've left a few notes on clause 4…",            summary: "Investor feedback on clause 4. Reply today.", time: "9:14 AM",   unread: true,  tag: "Investor", tagColor: "#7c3aed" },
  { id: 2, from: "Priya V.",    initials: "PV", gradient: "from-rose-500 to-pink-500",       subject: "Demo date — can we move to Thursday?",  preview: "Checking if Thursday 2pm works better…",        summary: "Requesting reschedule to Thu 2pm.",           time: "8:47 AM",   unread: true,  tag: "Investor", tagColor: "#7c3aed" },
  { id: 3, from: "Design Team", initials: "DT", gradient: "from-teal-500 to-emerald-500",   subject: "Q3 brand refresh — assets ready",        preview: "New logo variants and tokens are in Figma…",    summary: "Brand assets in Figma. No action needed.",   time: "Yesterday", unread: false, tag: "Internal", tagColor: "#0d9488" },
  { id: 4, from: "Sequoia",     initials: "SQ", gradient: "from-amber-500 to-orange-500",   subject: "Introduction: Ravi Shah → SuperPower",   preview: "Ravi, meet the team at SuperPower…",            summary: "New investor intro. Draft a warm reply.",    time: "Yesterday", unread: true,  tag: "Intro",    tagColor: "#d97706" },
  { id: 5, from: "Stripe",      initials: "ST", gradient: "from-slate-500 to-slate-600",    subject: "Your June invoice is ready",             preview: "Invoice #INV-0042 for $1,240 is ready…",        summary: "Routine billing. No reply needed.",          time: "Jun 12",    unread: false, tag: "Billing",  tagColor: "#64748b" },
];

const EVENTS = [
  { time: "9:00",  label: "Standup · Engineering",   dur: "15m", color: "#0d9488" },
  { time: "10:30", label: "1:1 with Sarah",           dur: "30m", color: "#7c3aed" },
  { time: "12:00", label: "Lunch · Sequoia",          dur: "1h",  color: "#d97706" },
  { time: "15:00", label: "Investor call · James K.", dur: "30m", color: "#2563eb" },
  { time: "17:00", label: "Product review",           dur: "1h",  color: T.accent  },
];

const AI_ACTIONS = [
  { label: "Reply to James K. re term sheet", icon: Send,    color: T.accent   },
  { label: "Reschedule demo — Thu 2pm",       icon: Calendar, color: "#7c3aed" },
  { label: "Draft intro reply for Ravi Shah", icon: Mail,    color: "#0d9488"  },
  { label: "Archive 14 newsletter threads",   icon: Archive, color: T.muted   },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard"    },
  { icon: Inbox,           label: "Inbox",        href: "/",             count: 71 },
  { icon: Calendar,        label: "Calendar",     href: "/calendar"     },
  { icon: MessageSquare,   label: "AI Agent",     href: "/chat"         },
  { icon: Plug,            label: "Integrations", href: "/integrations" },
  { icon: Settings,        label: "Settings",     href: "/settings"     },
];

const FOLDERS = [
  { icon: Star,        label: "Important" },
  { icon: Clock,       label: "Snoozed"   },
  { icon: Send,        label: "Sent"      },
  { icon: FileText,    label: "Drafts",   count: 3 },
  { icon: AlertCircle, label: "Spam"      },
  { icon: Archive,     label: "All Mail"  },
  { icon: Trash2,      label: "Trash"     },
  { icon: Users,       label: "Team"      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active }: { active: string }) {
  return (
    <aside
      className="w-52 flex-shrink-0 flex flex-col"
      style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <span className="flex items-center gap-2 font-extrabold text-sm tracking-tight" style={{ color: T.pri }}>
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white"
            style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.30)" }}
          >
            ⚡
          </div>
          Super-Power
        </span>
        <button className="relative">
          <Bell size={13} style={{ color: T.muted }} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
        </button>
      </div>

      {/* Compose */}
      <div className="px-4 pt-4 pb-2">
        <button
          className="w-full flex items-center gap-2 text-white text-xs font-bold px-3 py-2 rounded-xl"
          style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}
        >
          <Plus size={13} /> Compose
        </button>
      </div>

      {/* Main nav */}
      <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto pb-4">
        {NAV.map(({ icon: Icon, label, href, count }) => {
          const on = href === active;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background:   on ? T.accentLt : "transparent",
                color:        on ? T.accent   : T.muted,
                borderRight:  on ? `2px solid ${T.accent}` : "2px solid transparent",
              }}
            >
              <span className="flex items-center gap-2.5"><Icon size={13} />{label}</span>
              {count !== undefined && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: on ? "rgba(225,29,72,0.15)" : "rgba(225,29,72,0.06)", color: on ? T.accent : T.muted }}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        {/* Mail folders */}
        <p className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.dim }}>Mail</p>
        {FOLDERS.map(({ icon: Icon, label, count }) => (
          <button
            key={label}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all hover:text-rose-700"
            style={{ color: T.muted }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.accentLt; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <span className="flex items-center gap-2.5"><Icon size={12} />{label}</span>
            {count !== undefined && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(225,29,72,0.06)", color: T.muted }}>
                {count}
              </span>
            )}
          </button>
        ))}

        {/* Connected services */}
        <p className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.dim }}>Connected</p>
        {["Gmail", "Google Calendar"].map((svc) => (
          <div key={svc} className="flex items-center gap-2 px-3 py-1.5 text-xs" style={{ color: T.muted }}>
            <CheckCircle size={11} style={{ color: "#16a34a" }} /> {svc}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router                            = useRouter();
  const { data: session, isPending }      = authClient.useSession();
  const [activeThread, setActiveThread]   = useState<number | null>(1);
  const [sentThreads,  setSentThreads]    = useState<Record<number, boolean>>({});
  const [showProfile,  setShowProfile]    = useState(false);
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [session, isPending, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  // Loading / unauthenticated states
  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: T.bg }}>
        <div className="w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-600 animate-spin" />
      </div>
    );
  }
  if (!session) return null;

  const initials = getInitials(session.user.name);

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: T.bg }}>
      <Sidebar active="/dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header
          className="flex items-center gap-3 px-6 py-3 bg-white"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl text-xs"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <Search size={13} style={{ color: T.muted, flexShrink: 0 }} />
            <input
              placeholder="Search…"
              className="bg-transparent outline-none text-xs w-full"
              style={{ color: T.pri }}
            />
          </div>

          {/* Add integration */}
          <button
            onClick={() => router.push("/integrations")}
            className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl ml-auto"
            style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}
          >
            <Plus size={13} /> Add Integration
          </button>

          {/* User avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile((p) => !p)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: T.gradient }}
            >
              {initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-10 w-64 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden"
                style={{ borderColor: T.border }}>
                {/* Profile card */}
                <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: T.gradient }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: T.pri }}>{session.user.name}</p>
                    <p className="text-xs truncate" style={{ color: T.muted }}>{session.user.email}</p>
                  </div>
                </div>

                {/* Connected services */}
                <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.dim }}>Connected</p>
                  {["Gmail", "Google Calendar"].map((svc) => (
                    <div key={svc} className="flex items-center gap-2 py-1 text-xs" style={{ color: T.muted }}>
                      <CheckCircle size={11} style={{ color: "#16a34a" }} /> {svc}
                    </div>
                  ))}
                </div>

                {/* Sign out */}
                <div className="px-3 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-rose-50"
                    style={{ color: T.accent }}
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Stats strip */}
          <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            {STATS.map(({ label, value, sub, color }, i) => (
              <div
                key={label}
                className="px-6 py-4"
                style={{ borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}
              >
                <p className="text-[10px] font-medium mb-1" style={{ color: T.muted }}>{label}</p>
                <p className="text-2xl font-black tracking-tight" style={{ color }}>{value}</p>
                <p className="text-[10px] mt-1" style={{ color: T.muted }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Main columns */}
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* ── Inbox ───────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0" style={{ borderRight: `1px solid ${T.border}` }}>

              {/* Inbox toolbar */}
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{ borderBottom: `1px solid ${T.border}` }}
              >
                <div className="flex items-center gap-2">
                  <Inbox size={13} style={{ color: T.muted }} />
                  <span className="text-sm font-bold" style={{ color: T.pri }}>Priority inbox</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: T.accentLt, color: T.accent }}
                  >71</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] flex items-center gap-1" style={{ color: T.muted }}>
                    <RefreshCw size={10} /> Refresh
                  </button>
                  <Link
                    href="/"
                    className="text-[11px] flex items-center gap-0.5 font-semibold"
                    style={{ color: T.accent }}
                  >
                    All <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto">
                {THREADS.map((t) => {
                  const open = activeThread === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setActiveThread(open ? null : t.id)}
                      className="px-6 py-4 cursor-pointer transition-all"
                      style={{
                        background:  open ? "rgba(225,29,72,0.04)" : "transparent",
                        borderBottom: `1px solid ${T.border}`,
                        borderLeft:  open ? `2px solid ${T.accent}` : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(225,29,72,0.02)"; }}
                      onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread dot */}
                        <div className="mt-2 w-1.5 flex-shrink-0">
                          {t.unread && <span className="block w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />}
                        </div>

                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${t.gradient} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                          {t.initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs"
                                style={{ color: t.unread ? T.pri : T.muted, fontWeight: t.unread ? 700 : 500 }}
                              >{t.from}</span>
                              <span className="text-[9px] font-semibold" style={{ color: t.tagColor }}>{t.tag}</span>
                            </div>
                            <span className="text-[10px] flex-shrink-0" style={{ color: T.muted }}>{t.time}</span>
                          </div>

                          <p className="text-xs truncate" style={{ color: t.unread ? T.sec : T.muted, fontWeight: t.unread ? 500 : 400 }}>
                            {t.subject}
                          </p>
                          <p className="text-[11px] truncate mt-0.5" style={{ color: T.muted }}>{t.preview}</p>

                          {/* Expanded view */}
                          {open && (
                            <div className="mt-3 space-y-2">
                              {/* AI summary */}
                              <div
                                className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                                style={{ background: T.accentLt, border: `1px solid rgba(225,29,72,0.12)` }}
                              >
                                <Sparkles size={11} className="mt-0.5 flex-shrink-0" style={{ color: T.accent }} />
                                <p className="text-[11px] leading-relaxed" style={{ color: T.sec }}>{t.summary}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSentThreads((p) => ({ ...p, [t.id]: true }));
                                  }}
                                  className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                                  style={
                                    sentThreads[t.id]
                                      ? { background: "rgba(20,184,166,0.10)", border: "1px solid rgba(20,184,166,0.20)", color: "#0d9488" }
                                      : { background: T.gradient, color: "#fff", boxShadow: "0 2px 8px rgba(225,29,72,0.25)" }
                                  }
                                >
                                  {sentThreads[t.id]
                                    ? <><CheckCircle size={10} /> Sent</>
                                    : <><Bot size={10} /> AI Reply</>
                                  }
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl"
                                  style={{ color: T.muted }}
                                >
                                  <Archive size={10} /> Archive
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl"
                                  style={{ color: T.muted }}
                                >
                                  <Clock size={10} /> Snooze
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="ml-auto"
                                  style={{ color: T.dim }}
                                >
                                  <MoreHorizontal size={13} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right panel ─────────────────────────────────────────────── */}
            <div className="w-64 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: T.surface }}>

              {/* Today's schedule */}
              <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: T.muted }} />
                    <span className="text-xs font-bold" style={{ color: T.pri }}>Today</span>
                    <span className="text-[10px]" style={{ color: T.muted }}>Jun 14</span>
                  </div>
                  <Link href="/calendar" className="text-[10px] flex items-center gap-0.5" style={{ color: T.muted }}>
                    View <ArrowUpRight size={10} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {EVENTS.map(({ time, label, dur, color }) => (
                    <div key={time} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono w-8 flex-shrink-0" style={{ color: T.muted }}>{time}</span>
                      <div className="w-0.5 h-8 rounded-full flex-shrink-0 opacity-60" style={{ background: color }} />
                      <div className="min-w-0">
                        <p className="text-xs truncate" style={{ color: T.pri }}>{label}</p>
                        <p className="text-[10px]" style={{ color: T.muted }}>{dur}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI suggestions */}
              <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} style={{ color: T.accent }} />
                  <span className="text-xs font-bold" style={{ color: T.pri }}>AI suggestions</span>
                </div>
                <div className="space-y-1">
                  {AI_ACTIONS.map(({ label, icon: Icon, color }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-all"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.accentLt; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <Icon size={12} style={{ color, flexShrink: 0 }} />
                      <span className="text-xs leading-tight" style={{ color: T.muted }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick compose */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} style={{ color: T.accent }} />
                  <span className="text-xs font-bold" style={{ color: T.pri }}>Quick compose</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "#fff", border: `1px solid ${T.border}` }}
                >
                  <input
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: T.pri }}
                    placeholder="Describe email, AI drafts it…"
                  />
                  <button
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
    </div>
  );
}