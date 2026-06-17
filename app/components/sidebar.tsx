"use client";
import Link from "next/link";
import { AlertCircle, Archive, Bell, Calendar, CheckCircle, Clock, FileText, Inbox, LayoutDashboard, MessageSquare, Plug, Plus, Send, Settings, Star, Trash2, Users } from "lucide-react";

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


// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ active }: { active: string }) {
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