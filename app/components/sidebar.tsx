"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle, Archive, Bell, Calendar, CheckCircle, Clock,
  FileText, Inbox, LayoutDashboard, MessageSquare, Plug, Plus,
  Send, Settings, Star, Trash2, Users, X,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard"    },
  { icon: Inbox,           label: "Inbox",        href: "/dashboard"    },
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

const NO_SIDEBAR_ROUTES = ["/", "/login"];

export default function Sidebar() {
  const pathname = usePathname();

  const [composeOpen, setComposeOpen] = useState(false);
  const [to,          setTo]          = useState("");
  const [subject,     setSubject]     = useState("");
  const [body,        setBody]        = useState("");
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [sendError,   setSendError]   = useState("");

  if (NO_SIDEBAR_ROUTES.includes(pathname)) return null;

  function openCompose() {
    setTo(""); setSubject(""); setBody("");
    setSent(false); setSendError("");
    setComposeOpen(true);
  }

  function closeCompose() {
    setComposeOpen(false);
  }

  async function handleSend() {
    if (!to.trim() || !subject.trim()) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      setSent(true);
      setTimeout(() => {
        closeCompose();
        setSent(false);
      }, 1500);
    } catch (err: any) {
      setSendError(err.message ?? "Failed to send");
    } finally {
      setSending(false);
    }
  }

  const active = pathname;
  return (
    <>
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
            onClick={openCompose}
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

      {/* Compose modal */}
      {composeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeCompose(); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col"
            style={{ border: `1px solid ${T.border}` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}
            >
              <span className="text-sm font-bold" style={{ color: T.pri }}>New Message</span>
              <button onClick={closeCompose} style={{ color: T.muted }}>
                <X size={16} />
              </button>
            </div>

            {/* To */}
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>To</span>
              <input
                autoFocus
                type="email"
                className="flex-1 text-sm outline-none"
                style={{ color: T.pri }}
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            {/* Subject */}
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>Subject</span>
              <input
                className="flex-1 text-sm outline-none"
                style={{ color: T.pri }}
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Body */}
            <textarea
              className="w-full px-5 py-4 text-sm outline-none resize-none"
              style={{ color: T.pri, minHeight: 200 }}
              placeholder="Write your message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleSend(); }}
            />

            {/* Footer */}
            <div
              className="px-5 py-3 flex items-center justify-between gap-3"
              style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}
            >
              <span className="text-xs" style={{ color: "#e11d48", minWidth: 0, flex: 1 }}>
                {sendError}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={closeCompose}
                  className="text-xs px-4 py-2 rounded-xl font-medium transition-all"
                  style={{ color: T.muted, border: `1px solid ${T.border}` }}
                >
                  Discard
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || sent || !to.trim() || !subject.trim()}
                  className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all disabled:opacity-50"
                  style={{ background: T.gradient }}
                >
                  {sent
                    ? <><CheckCircle size={12} /> Sent!</>
                    : sending
                    ? "Sending…"
                    : <><Send size={12} /> Send</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
