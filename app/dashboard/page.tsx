"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail, Bell, Plus, Inbox, Calendar, MessageSquare, Settings,
  Star, Clock, Send, FileText, AlertCircle, Archive, Trash2,
  Users, CheckCircle, Bot, Search, Zap, MoreHorizontal, LayoutDashboard, Sparkles, RefreshCw, ChevronRight, ArrowUpRight,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


// ─── Rose pink design tokens ──────────────────────────────────────────────────
const BG        = "#fce7f3";
const SURFACE   = "#fff5f8";
const BORDER    = "rgba(225,29,72,0.10)";
const ACCENT    = "#e11d48";
const ACCENT_LT = "rgba(225,29,72,0.08)";
const TEXT_PRI  = "#1a0008";
const TEXT_SEC  = "#7f1d1d";
const TEXT_MUT  = "#c084a0";
const TEXT_DIM  = "#e9b8c8";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
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
  { icon: FileText,    label: "Drafts",   count: 3 },
  { icon: AlertCircle, label: "Spam" },
  { icon: Archive,     label: "All Mail" },
  { icon: Trash2,      label: "Trash" },
  { icon: Users,       label: "Team" },
];

function Sidebar({ active }: { active: string }) {
  const { data: session } = authClient.useSession();


  return (
    <aside className="w-52 flex-shrink-0 flex flex-col" style={{ background: SURFACE, borderRight: `1px solid ${BORDER}` }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <span className="flex items-center gap-2 font-extrabold text-sm tracking-tight" style={{ color: TEXT_PRI }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white"
            style={{ background: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)", boxShadow: "0 2px 10px rgba(225,29,72,0.30)" }}>
            ⚡
          </div>
          Super-Power
        </span>
        <button className="relative">
          <Bell size={13} style={{ color: TEXT_MUT }} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
        </button>
      </div>

      {/* Compose */}
      <div className="px-4 mb-3 mt-4">
        <button className="w-full flex items-center gap-2 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
          style={{ background: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)", boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}>
          <Plus size={13} /> Compose
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {MAIN_NAV.map(({ icon: Icon, label, href, count }) => {
          const isActive = href === active;
          return (
            <Link key={href} href={href}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: isActive ? ACCENT_LT : "transparent",
                color: isActive ? ACCENT : TEXT_MUT,
                borderRight: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
              }}>
              <span className="flex items-center gap-2.5">
                <Icon size={13} />
                {label}
              </span>
              {count !== undefined && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: isActive ? "rgba(225,29,72,0.15)" : "rgba(225,29,72,0.06)", color: isActive ? ACCENT : TEXT_MUT }}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: TEXT_DIM }}>Mail</div>
        {MAIL_FOLDERS.map(({ icon: Icon, label, count }) => (
          <button key={label}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ color: TEXT_MUT }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT_SEC; (e.currentTarget as HTMLElement).style.background = ACCENT_LT; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUT; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <span className="flex items-center gap-2.5"><Icon size={12} />{label}</span>
            {count !== undefined && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(225,29,72,0.06)", color: TEXT_MUT }}>{count}</span>
            )}
          </button>
        ))}

        <div className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: TEXT_DIM }}>Connected</div>
        {["Gmail", "Google Calendar"].map((svc) => (
          <div key={svc} className="flex items-center gap-2 px-3 py-1.5 text-xs" style={{ color: TEXT_MUT }}>
            <CheckCircle size={11} style={{ color: "#16a34a" }} />{svc}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="absolute bottom-14 left-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg p-3 z-50">
          <div className="mb-3">
            <p className="text-sm font-semibold">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.name}</p>
          </div>

          
        </div>
    </aside>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Unread",     value: "71",   sub: "+12 today",       accent: ACCENT,    dot: ACCENT    },
  { label: "Meetings",   value: "4",    sub: "Next in 38 min",  accent: "#7c3aed", dot: "#7c3aed" },
  { label: "AI tasks",   value: "12",   sub: "3 need review",   accent: "#0d9488", dot: "#0d9488" },
  { label: "Time saved", value: "3.2h", sub: "↑ 18% this week", accent: ACCENT,    dot: ACCENT    },
];

const THREADS = [
  { id:1, from:"James K.",    initials:"JK", color:"from-violet-500 to-indigo-500",  subject:"Re: Term Sheet — final comments",          preview:"I've left a few notes on clause 4…",                     aiSummary:"Investor feedback on clause 4. Action needed — reply today.", time:"9:14 AM",  unread:true,  tag:"Investor", tagColor:"#7c3aed" },
  { id:2, from:"Priya V.",    initials:"PV", color:"from-rose-500 to-pink-500",       subject:"Demo date — can we move to Thursday?",     preview:"Checking if Thursday 2pm works better…",                 aiSummary:"Requesting reschedule to Thu 2pm. Reply to confirm.",         time:"8:47 AM",  unread:true,  tag:"Investor", tagColor:"#7c3aed" },
  { id:3, from:"Design Team", initials:"DT", color:"from-teal-500 to-emerald-500",   subject:"Q3 brand refresh — assets ready",           preview:"New logo variants and tokens are in Figma…",             aiSummary:"Brand assets in Figma. No action required.",                  time:"Yesterday",unread:false, tag:"Internal", tagColor:"#0d9488" },
  { id:4, from:"Sequoia",     initials:"SQ", color:"from-amber-500 to-orange-500",   subject:"Introduction: Ravi Shah → SuperPower",     preview:"Ravi, meet the team at SuperPower…",                     aiSummary:"New investor intro. Draft a warm reply to Ravi.",             time:"Yesterday",unread:true,  tag:"Intro",    tagColor:"#d97706" },
  { id:5, from:"Stripe",      initials:"ST", color:"from-slate-500 to-slate-600",    subject:"Your June invoice is ready",                preview:"Invoice #INV-0042 for $1,240 is ready…",                 aiSummary:"Routine billing. No reply needed.",                           time:"Jun 12",   unread:false, tag:"Billing",  tagColor:"#64748b" },
];

const EVENTS = [
  { time:"9:00",  label:"Standup · Engineering",   dur:"15m", color:"#0d9488" },
  { time:"10:30", label:"1:1 with Sarah",           dur:"30m", color:"#7c3aed" },
  { time:"12:00", label:"Lunch · Sequoia",          dur:"1h",  color:"#d97706" },
  { time:"15:00", label:"Investor call · James K.", dur:"30m", color:"#2563eb" },
  { time:"17:00", label:"Product review",           dur:"1h",  color:ACCENT    },
];

const AI_ACTIONS = [
  { label:"Reply to James K. re term sheet", icon:Send,    accent:ACCENT    },
  { label:"Reschedule demo — Thu 2pm",       icon:Calendar,accent:"#7c3aed" },
  { label:"Draft intro reply for Ravi Shah", icon:Mail,    accent:"#0d9488" },
  { label:"Archive 14 newsletter threads",   icon:Archive, accent:TEXT_MUT  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeThread, setActiveThread] = useState<number | null>(1);
  const [aiSent, setAiSent]             = useState<Record<number, boolean>>({});

   const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();

    router.replace("/login");
  };

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: BG }}>
      <Sidebar active="/dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center  border rounded-xl px-3 py-2">
            <Search size={16} />

            <input
              placeholder="Search..."
              className="outline-none text-sm"
            />
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() =>
                setShowProfile((prev) => !prev)
              }
              className="w-10 h-10 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center"
            >
              {initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-72 bg-white border rounded-2xl shadow-xl p-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {session.user.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>


            )}
          </div>

            <div className="px-4 mb-3 mt-4">
        <button onClick={()=>{router.push("/integrations")}} className="w-full flex items-center gap-2 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
          style={{ background: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)", boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}>
          <Plus size={13} /> Add Integration
        </button>
      </div>
        </div>
      </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Stats strip */}
          <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            {STATS.map(({ label, value, sub, accent, dot }, i) => (
              <div key={label} className="px-6 py-4 flex items-center gap-4"
                style={{ borderRight: i < 3 ? `1px solid ${BORDER}` : "none" }}>
                <div>
                  <p className="text-[10px] font-medium mb-1" style={{ color: TEXT_MUT }}>{label}</p>
                  <p className="text-2xl font-black tracking-tight" style={{ color: accent }}>{value}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="w-1.5 h-1.5 rounded-full ml-auto mb-2 opacity-60" style={{ background: dot }} />
                  <p className="text-[10px]" style={{ color: TEXT_MUT }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-full">

            {/* Inbox */}
            <div className="flex-1 flex flex-col min-h-0" style={{ borderRight: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between px-6 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2">
                  <Inbox size={13} style={{ color: TEXT_MUT }} />
                  <span className="text-sm font-bold" style={{ color: TEXT_PRI }}>Priority inbox</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: ACCENT_LT, color: ACCENT }}>71</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] flex items-center gap-1 transition-colors"
                    style={{ color: TEXT_MUT }}>
                    <RefreshCw size={10} /> Refresh
                  </button>
                  <Link href="/" className="text-[11px] flex items-center gap-0.5 font-semibold transition-colors"
                    style={{ color: ACCENT }}>
                    All <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {THREADS.map((t) => (
                  <div key={t.id}
                    onClick={() => setActiveThread(t.id === activeThread ? null : t.id)}
                    className="px-6 py-4 cursor-pointer transition-all"
                    style={{
                      background: activeThread === t.id ? "rgba(225,29,72,0.04)" : "transparent",
                      borderBottom: `1px solid ${BORDER}`,
                      borderLeft: activeThread === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
                    }}
                    onMouseEnter={e => { if (activeThread !== t.id) (e.currentTarget as HTMLElement).style.background = "rgba(225,29,72,0.02)"; }}
                    onMouseLeave={e => { if (activeThread !== t.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-2 w-1.5 flex-shrink-0">
                        {t.unread && <span className="block w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />}
                      </div>
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${t.color} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                        {t.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium" style={{ color: t.unread ? TEXT_PRI : TEXT_MUT, fontWeight: t.unread ? 700 : 500 }}>
                              {t.from}
                            </span>
                            <span className="text-[9px] font-semibold" style={{ color: t.tagColor }}>{t.tag}</span>
                          </div>
                          <span className="text-[10px] flex-shrink-0" style={{ color: TEXT_MUT }}>{t.time}</span>
                        </div>
                        <p className="text-xs truncate" style={{ color: t.unread ? TEXT_SEC : TEXT_MUT, fontWeight: t.unread ? 500 : 400 }}>
                          {t.subject}
                        </p>
                        <p className="text-[11px] truncate mt-0.5" style={{ color: TEXT_MUT }}>{t.preview}</p>

                        {activeThread === t.id && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                              style={{ background: ACCENT_LT, border: `1px solid rgba(225,29,72,0.12)` }}>
                              <Sparkles size={11} className="mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
                              <p className="text-[11px] leading-relaxed" style={{ color: TEXT_SEC }}>{t.aiSummary}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setAiSent((p) => ({ ...p, [t.id]: true })); }}
                                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                                style={aiSent[t.id]
                                  ? { background:"rgba(20,184,166,0.10)", border:"1px solid rgba(20,184,166,0.20)", color:"#0d9488" }
                                  : { background: "linear-gradient(135deg,#fb7185,#e11d48)", color:"#fff", boxShadow:"0 2px 8px rgba(225,29,72,0.25)" }}>
                                {aiSent[t.id] ? <><CheckCircle size={10} /> Sent</> : <><Bot size={10} /> AI Reply</>}
                              </button>
                              <button onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl transition-all"
                                style={{ color: TEXT_MUT }}>
                                <Archive size={10} /> Archive
                              </button>
                              <button onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-xl transition-all"
                                style={{ color: TEXT_MUT }}>
                                <Clock size={10} /> Snooze
                              </button>
                              <button onClick={(e) => e.stopPropagation()} className="ml-auto" style={{ color: TEXT_DIM }}>
                                <MoreHorizontal size={13} />
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

            {/* Right panel */}
            <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: SURFACE }}>

              {/* Schedule */}
              <div className="p-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: TEXT_MUT }} />
                    <span className="text-xs font-bold" style={{ color: TEXT_PRI }}>Today</span>
                    <span className="text-[10px]" style={{ color: TEXT_MUT }}>Jun 14</span>
                  </div>
                  <Link href="/calendar" className="text-[10px] flex items-center gap-0.5 transition-colors" style={{ color: TEXT_MUT }}>
                    View <ArrowUpRight size={10} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {EVENTS.map(({ time, label, dur, color }) => (
                    <div key={time} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono w-8 flex-shrink-0" style={{ color: TEXT_MUT }}>{time}</span>
                      <div className="w-0.5 h-8 rounded-full flex-shrink-0 opacity-60" style={{ background: color }} />
                      <div className="min-w-0">
                        <p className="text-xs truncate" style={{ color: TEXT_PRI }}>{label}</p>
                        <p className="text-[10px]" style={{ color: TEXT_MUT }}>{dur}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI suggestions */}
              <div className="p-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={12} style={{ color: ACCENT }} />
                  <span className="text-xs font-bold" style={{ color: TEXT_PRI }}>AI suggestions</span>
                </div>
                <div className="space-y-1">
                  {AI_ACTIONS.map(({ label, icon: Icon, accent }, i) => (
                    <button key={i}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-all group"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = ACCENT_LT}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <Icon size={12} style={{ color: accent, flexShrink: 0 }} />
                      <span className="text-xs flex-1 leading-tight transition-colors" style={{ color: TEXT_MUT }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick compose */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} style={{ color: ACCENT }} />
                  <span className="text-xs font-bold" style={{ color: TEXT_PRI }}>Quick compose</span>
                </div>
                <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 transition-colors"
                  style={{ background: "#fff", border: `1px solid ${BORDER}` }}>
                  <input
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: TEXT_PRI }}
                    placeholder="Describe email, AI drafts it…"
                  />
                  <button className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "linear-gradient(135deg,#fb7185,#e11d48)" }}>
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