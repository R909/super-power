"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail, Bell, Plus, Inbox, Calendar, MessageSquare, Settings,
  Star, Clock, Send, FileText, AlertCircle, Archive, Trash2,
  Users, CheckCircle, Bot, Search, ChevronRight, Zap,
  TrendingUp, MoreHorizontal, ArrowRight, Video, LayoutDashboard,
  Sparkles, RefreshCw,
} from "lucide-react";

// ── Sidebar ───────────────────────────────────────────────────────────────────
const MAIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Inbox,           label: "Inbox",     href: "/",          count: 71 },
  { icon: Calendar,        label: "Calendar",  href: "/calendar" },
  { icon: MessageSquare,   label: "AI Agent",  href: "/chat" },
  { icon: Settings,        label: "Settings",  href: "/settings" },
];

const MAIL_FOLDERS = [
  { icon: Star,        label: "Important" },
  { icon: Clock,       label: "Snoozed" },
  { icon: Send,        label: "Sent" },
  { icon: FileText,    label: "Drafts",  count: 3 },
  { icon: AlertCircle, label: "Spam" },
  { icon: Archive,     label: "All Mail" },
  { icon: Trash2,      label: "Trash" },
  { icon: Users,       label: "Team" },
];

const VIEWS = ["Client Communication", "Project Alpha", "Hiring", "Newsletters"];

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col border-r border-white/[0.05] bg-[#060810]">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <span className="flex items-center gap-2.5 font-extrabold text-base text-white tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ffbe1a] to-[#e61700] flex items-center justify-center text-white text-sm shadow-[0_2px_10px_rgba(249,115,22,0.4)]">
            ⚡
          </div>
          Super-Power
        </span>
        <button className="relative">
          <Bell size={14} className="text-slate-600" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </button>
      </div>

      {/* Compose */}
      <div className="px-4 mb-4">
        <button className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all">
          <Plus size={14} />
          Compose
          <span className="ml-auto bg-black/20 px-1.5 py-0.5 rounded-full text-[9px]">⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {MAIN_NAV.map(({ icon: Icon, label, href, count }) => {
          const isActive = href === active;
          return (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.15)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
              }`}>
              <span className="flex items-center gap-3">
                <Icon size={14} className={isActive ? "text-amber-400" : ""} />
                {label}
              </span>
              {count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.06] text-slate-500"
                }`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-4 mb-1 px-3 text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">Mail</div>
        {MAIL_FOLDERS.map(({ icon: Icon, label, count }) => (
          <button key={label}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] transition-all">
            <span className="flex items-center gap-3"><Icon size={13} />{label}</span>
            {count !== undefined && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-slate-500">{count}</span>
            )}
          </button>
        ))}

        <div className="mt-4 mb-1 px-3 text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">Views</div>
        {VIEWS.map((v, i) => (
          <button key={v}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] font-medium flex items-center gap-2 transition-all">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i % 2 === 0 ? "bg-amber-500/60" : "bg-teal-500/60"}`} />
            {v}
          </button>
        ))}

        <div className="mt-4 mb-1 px-3 text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">Integrations</div>
        {["Gmail", "Google Calendar"].map((svc) => (
          <button key={svc}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] font-medium flex items-center gap-2 transition-all">
            <CheckCircle size={12} className="text-teal-500/60" />
            {svc}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 bg-white/[0.04] rounded-2xl px-3 py-2.5 border border-white/[0.06]">
          <div className="w-7 h-7 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-[10px] flex-shrink-0">
            AM
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-300 truncate">Arjun Mehta</div>
            <div className="text-[10px] text-slate-600 truncate">arjun@example.co</div>
          </div>
          <Settings size={12} className="text-slate-700 ml-auto flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Unread Emails",
    value: "71",
    delta: "+12 since yesterday",
    icon: Mail,
    glow: "rgba(245,158,11,0.15)",
    accent: "text-amber-400",
    bar: "from-amber-500 to-orange-500",
    barW: "72%",
  },
  {
    label: "Meetings Today",
    value: "4",
    delta: "Next in 38 min",
    icon: Calendar,
    glow: "rgba(99,102,241,0.12)",
    accent: "text-violet-400",
    bar: "from-violet-500 to-indigo-500",
    barW: "40%",
  },
  {
    label: "AI Tasks Done",
    value: "12",
    delta: "3 pending review",
    icon: Bot,
    glow: "rgba(20,184,166,0.12)",
    accent: "text-teal-400",
    bar: "from-teal-500 to-emerald-500",
    barW: "85%",
  },
  {
    label: "Time Saved",
    value: "3.2h",
    delta: "This week · ↑ 18%",
    icon: TrendingUp,
    glow: "rgba(245,158,11,0.1)",
    accent: "text-amber-400",
    bar: "from-amber-400 to-yellow-400",
    barW: "60%",
  },
];

const THREADS = [
  {
    id: 1,
    from: "James K.",
    initials: "JK",
    avatarColor: "from-violet-500 to-indigo-500",
    subject: "Re: Term Sheet — final comments",
    preview: "Thanks for sending that over. I've left a few notes on clause 4…",
    aiSummary: "Investor feedback on term sheet clause 4. Action needed — reply today.",
    time: "9:14 AM",
    unread: true,
    tag: "Investor",
    tagCls: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  },
  {
    id: 2,
    from: "Priya V.",
    initials: "PV",
    avatarColor: "from-rose-500 to-pink-500",
    subject: "Demo date — can we move to Thursday?",
    preview: "Hi, just checking if Thursday at 2pm works better for your team…",
    aiSummary: "Requesting reschedule to Thu 2pm. Reply to confirm or suggest an alternative.",
    time: "8:47 AM",
    unread: true,
    tag: "Investor",
    tagCls: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  },
  {
    id: 3,
    from: "Design Team",
    initials: "DT",
    avatarColor: "from-teal-500 to-emerald-500",
    subject: "Q3 brand refresh — assets ready",
    preview: "The new logo variants and color tokens are in Figma. Let us know…",
    aiSummary: "Brand assets delivered in Figma. No urgent action required.",
    time: "Yesterday",
    unread: false,
    tag: "Internal",
    tagCls: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  },
  {
    id: 4,
    from: "Sequoia Intro",
    initials: "SQ",
    avatarColor: "from-amber-500 to-orange-500",
    subject: "Introduction: Ravi Shah → SuperPower",
    preview: "Ravi, meet the team at SuperPower — they're building something special…",
    aiSummary: "New investor introduction. Draft a warm reply to Ravi Shah to keep momentum.",
    time: "Yesterday",
    unread: true,
    tag: "New intro",
    tagCls: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  {
    id: 5,
    from: "Stripe",
    initials: "ST",
    avatarColor: "from-slate-500 to-slate-600",
    subject: "Your June invoice is ready",
    preview: "Your invoice #INV-0042 for $1,240 is available in the dashboard…",
    aiSummary: "Routine invoice. No reply needed.",
    time: "Jun 12",
    unread: false,
    tag: "Billing",
    tagCls: "bg-white/[0.05] text-slate-500 border border-white/[0.08]",
  },
];

const TODAY_EVENTS = [
  { time: "9:00",  label: "Standup · Engineering",    dur: "15 min", color: "from-teal-500 to-emerald-500",   meet: true  },
  { time: "10:30", label: "1:1 with Sarah (Design)",  dur: "30 min", color: "from-violet-500 to-indigo-500",  meet: true  },
  { time: "12:00", label: "Lunch · Sequoia team",     dur: "1 hr",   color: "from-amber-500 to-orange-500",   meet: false },
  { time: "15:00", label: "Investor call · James K.", dur: "30 min", color: "from-blue-500 to-cyan-500",      meet: true  },
  { time: "17:00", label: "Product review",           dur: "1 hr",   color: "from-rose-500 to-pink-500",      meet: true  },
];

const AI_SUGGESTIONS = [
  { icon: Send,     label: "Reply to James K. re term sheet",  accent: "text-amber-400",  bg: "bg-amber-500/10"  },
  { icon: Calendar, label: "Reschedule demo — Thu 2pm slot",   accent: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Mail,     label: "Draft intro reply for Ravi Shah",  accent: "text-teal-400",   bg: "bg-teal-500/10"   },
  { icon: Archive,  label: "Archive 14 newsletter threads",    accent: "text-slate-400",  bg: "bg-white/[0.05]"  },
];

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeThread, setActiveThread] = useState<number | null>(1);
  const [aiSent, setAiSent] = useState<Record<number, boolean>>({});

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
      `}</style>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Amber orb top-right */}
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-amber-500/[0.06] blur-[160px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }} />

      {/* Teal orb bottom-left */}
      <div className="absolute -bottom-40 -left-24 w-[550px] h-[550px] rounded-full bg-teal-500/[0.04] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }} />

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <Sidebar active="/dashboard" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-[#030712]/80 backdrop-blur-xl flex-shrink-0">
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/80 flex items-center gap-1.5 mb-1">
              <span>✦</span> Dashboard
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Good morning, Arjun</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 w-56 hover:border-amber-500/20 transition-colors">
              <Search size={13} className="text-slate-600 flex-shrink-0" />
              <input
                className="bg-transparent text-sm outline-none text-slate-400 placeholder:text-slate-700 w-full"
                placeholder="Search emails…"
              />
            </div>

            {/* AI status */}
            <div className="flex items-center gap-2 bg-amber-500/[0.08] border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" style={{ animation: "pulse-dot 1.8s ease-in-out infinite" }} />
              AI Active
            </div>

            {/* Bell */}
            <button className="relative w-9 h-9 bg-white/[0.04] border border-white/[0.07] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-white/[0.12] transition-all">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-xs flex-shrink-0 cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.3)] hover:shadow-[0_2px_18px_rgba(245,158,11,0.45)] transition-shadow">
              AM
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {STATS.map(({ label, value, delta, icon: Icon, glow, accent, bar, barW }) => (
              <div key={label}
                className="relative rounded-2xl bg-[#090d16]/80 border border-white/[0.06] backdrop-blur-sm p-5 overflow-hidden hover:border-white/[0.10] transition-all group shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), inset 0 0 40px ${glow}` }}>
                {/* Glow bleed */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 70%)` }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600">{label}</span>
                    <Icon size={14} className={accent} />
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight mb-3">{value}</div>
                  <div className="text-[11px] text-slate-600 mb-3 font-medium">{delta}</div>
                  <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-700`}
                      style={{ width: barW }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column */}
          <div className="grid grid-cols-[1fr_320px] gap-5">

            {/* Email threads */}
            <div className="rounded-2xl bg-[#090d16]/80 border border-white/[0.06] backdrop-blur-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Inbox size={14} className="text-amber-400" />
                  <span className="font-bold text-sm text-white">Priority Inbox</span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">71</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] text-slate-600 hover:text-slate-400 font-medium flex items-center gap-1 transition-colors">
                    <RefreshCw size={10} /> Refresh
                  </button>
                  <Link href="/" className="text-[11px] text-amber-400/80 hover:text-amber-400 font-semibold flex items-center gap-0.5 transition-colors">
                    View all <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-white/[0.03] overflow-y-auto">
                {THREADS.map((thread) => (
                  <div key={thread.id}
                    onClick={() => setActiveThread(thread.id === activeThread ? null : thread.id)}
                    className={`px-5 py-4 cursor-pointer transition-all ${
                      activeThread === thread.id
                        ? "bg-amber-500/[0.04] border-l-2 border-amber-500/40"
                        : "hover:bg-white/[0.02] border-l-2 border-transparent"
                    }`}>
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${thread.avatarColor} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5 shadow-sm`}>
                        {thread.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-${thread.unread ? "bold text-white" : "medium text-slate-400"}`}>
                              {thread.from}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${thread.tagCls}`}>
                              {thread.tag}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {thread.unread && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />}
                            <span className="text-[10px] text-slate-700">{thread.time}</span>
                          </div>
                        </div>

                        <p className={`text-xs ${thread.unread ? "font-semibold text-slate-300" : "text-slate-600"} truncate`}>
                          {thread.subject}
                        </p>
                        <p className="text-[11px] text-slate-700 truncate mt-0.5">{thread.preview}</p>

                        {/* Expanded */}
                        {activeThread === thread.id && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/[0.15] rounded-xl px-3 py-2.5">
                              <Sparkles size={11} className="text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-[11px] text-amber-200/80 font-medium leading-relaxed">
                                {thread.aiSummary}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setAiSent((p) => ({ ...p, [thread.id]: true })); }}
                                className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                                  aiSent[thread.id]
                                    ? "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                                    : "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_2px_10px_rgba(245,158,11,0.3)]"
                                }`}>
                                {aiSent[thread.id]
                                  ? <><CheckCircle size={10} /> Sent</>
                                  : <><Bot size={10} /> AI Reply</>}
                              </button>
                              <button onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 transition-all">
                                <Archive size={10} /> Archive
                              </button>
                              <button onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 transition-all">
                                <Clock size={10} /> Snooze
                              </button>
                              <button onClick={(e) => e.stopPropagation()}
                                className="ml-auto text-slate-700 hover:text-slate-500 transition-colors">
                                <MoreHorizontal size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">

              {/* Today's schedule */}
              <div className="rounded-2xl bg-[#090d16]/80 border border-white/[0.06] backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-violet-400" />
                    <span className="font-bold text-sm text-white">Today</span>
                    <span className="text-[9px] text-slate-600 font-medium">Jun 14</span>
                  </div>
                  <Link href="/calendar"
                    className="text-[11px] text-violet-400/80 hover:text-violet-400 font-semibold flex items-center gap-0.5 transition-colors">
                    Full view <ChevronRight size={11} />
                  </Link>
                </div>

                <div className="px-4 py-3 space-y-2.5">
                  {TODAY_EVENTS.map(({ time, label, dur, color, meet }) => (
                    <div key={time} className="flex items-center gap-3 group">
                      <span className="text-[10px] font-mono text-slate-700 w-9 flex-shrink-0">{time}</span>
                      <div className={`w-0.5 h-9 rounded-full flex-shrink-0 bg-gradient-to-b ${color} opacity-80`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-300 truncate group-hover:text-white transition-colors">{label}</p>
                        <p className="text-[10px] text-slate-700 flex items-center gap-1">
                          {dur}
                          {meet && <><span className="text-slate-800">·</span><Video size={8} className="text-slate-700" /><span>Meet</span></>}
                        </p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 hover:text-slate-400">
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI suggestions */}
              <div className="rounded-2xl bg-[#090d16]/80 border border-white/[0.06] backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Zap size={13} className="text-amber-400" />
                    <span className="font-bold text-sm text-white">AI Suggestions</span>
                  </div>
                  <Link href="/chat"
                    className="text-[11px] text-amber-400/80 hover:text-amber-400 font-semibold flex items-center gap-0.5 transition-colors">
                    Agent <ChevronRight size={11} />
                  </Link>
                </div>

                <div className="px-3 py-3 space-y-1">
                  {AI_SUGGESTIONS.map(({ icon: Icon, label, accent, bg }, i) => (
                    <button key={i}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] text-left transition-all group">
                      <div className={`w-7 h-7 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon size={12} className={accent} />
                      </div>
                      <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors flex-1 leading-tight">{label}</span>
                      <ArrowRight size={11} className="text-slate-800 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick compose */}
              <div className="rounded-2xl overflow-hidden relative shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ background: "linear-gradient(135deg, #1a0e00 0%, #0d0800 100%)", border: "1px solid rgba(245,158,11,0.15)" }}>
                {/* Inner glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.12) 0%, transparent 65%)" }} />

                <div className="relative z-10 p-4">
                  <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-amber-400/80 flex items-center gap-1.5 mb-2">
                    <Sparkles size={9} /> Quick compose
                  </div>
                  <p className="text-slate-500 text-[11px] mb-3 leading-relaxed">
                    Describe the email and AI will draft it in your voice.
                  </p>
                  <div className="bg-white/[0.04] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-amber-500/[0.12] hover:border-amber-500/25 transition-colors">
                    <input
                      className="flex-1 bg-transparent text-xs text-slate-400 placeholder:text-slate-700 outline-none"
                      placeholder="e.g. Follow up with James about the call…"
                    />
                    <button className="w-6 h-6 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
                      <Send size={10} className="text-black" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
