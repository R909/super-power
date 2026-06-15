"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Plus, Inbox, Calendar, MessageSquare, Settings,
  Star, Clock, Send, FileText, AlertCircle, Archive, Trash2,
  Users, CheckCircle, LayoutDashboard, Link2,
} from "lucide-react";

const MAIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard"     },
  { icon: Inbox,           label: "Inbox",        href: "/",  count: 71  },
  { icon: Calendar,        label: "Calendar",     href: "/calendar"      },
  { icon: MessageSquare,   label: "AI Agent",     href: "/chat"          },
  { icon: Link2,           label: "Integrations", href: "/integrations"  },
  { icon: Settings,        label: "Settings",     href: "/settings"      },
];

const MAIL_FOLDERS = [
  { icon: Star,        label: "Important"           },
  { icon: Clock,       label: "Snoozed"             },
  { icon: Send,        label: "Sent"                },
  { icon: FileText,    label: "Drafts",   count: 3  },
  { icon: AlertCircle, label: "Spam"                },
  { icon: Archive,     label: "All Mail"            },
  { icon: Trash2,      label: "Trash"               },
  { icon: Users,       label: "Team"                },
];

const VIEWS = ["Client Communication", "Project Alpha", "Hiring", "Newsletters"];

export default function Sidebar() {
  const pathname = usePathname();

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
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.15)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
              }`}>
              <span className="flex items-center gap-3">
                <Icon size={14} className={active ? "text-amber-400" : ""} />
                {label}
              </span>
              {count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.06] text-slate-600"
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
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-slate-600">{count}</span>
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
