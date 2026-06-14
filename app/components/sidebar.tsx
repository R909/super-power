"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail, Bell, Plus, Inbox, Calendar, MessageSquare, Settings,
  Star, Clock, Send, FileText, AlertCircle, Archive, Trash2,
  Users, CheckCircle,
} from "lucide-react";

const MAIN_NAV = [
  { icon: Inbox,         label: "Inbox",    href: "/",          count: 71 },
  { icon: Calendar,      label: "Calendar", href: "/calendar"             },
  { icon: MessageSquare, label: "AI Agent", href: "/chat"                 },
  { icon: Settings,      label: "Settings", href: "/settings"             },
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
    <aside className="w-52 flex-shrink-0 flex flex-col bg-white/20 backdrop-blur-2xl border-r border-white/30 shadow-sm">
      <div className="px-5 py-5 flex items-center justify-between">
        <span className="flex items-center gap-2 font-extrabold text-lg text-pink-400">
          <Mail size={18} /> SuperPower
        </span>
        <Bell size={15} className="text-slate-500" />
      </div>

      <div className="px-4 mb-4">
        <button className="w-full flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
          <Plus size={15} />
          Compose
          <span className="ml-auto text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full">+1</span>
        </button>
      </div>

      <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {MAIN_NAV.map(({ icon: Icon, label, href, count }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors
                ${active ? "bg-pink-50/70 text-pink-500" : "text-slate-600 hover:bg-white/30"}`}>
              <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
              {count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${active ? "bg-pink-200 text-pink-600" : "bg-slate-200/70 text-slate-500"}`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mail</div>
        {MAIL_FOLDERS.map(({ icon: Icon, label, count }) => (
          <button key={label}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/30 transition-colors">
            <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
            {count !== undefined && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-500">{count}</span>
            )}
          </button>
        ))}

        <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</div>
        {VIEWS.map((v, i) => (
          <button key={v}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-white/30 font-medium flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i % 2 === 0 ? "bg-pink-300" : "bg-teal-300"}`} />
            {v}
          </button>
        ))}

        <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integrations</div>
        {["Gmail", "Google Calendar"].map((svc) => (
          <button key={svc}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-white/30 font-medium flex items-center gap-2">
            <CheckCircle size={13} className="text-teal-400" />
            {svc}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/30">
        <div className="flex items-center gap-3 bg-white/35 rounded-2xl px-3 py-2.5 border border-white/50">
          <div className="w-7 h-7 bg-pink-300 rounded-full flex items-center justify-center font-bold text-white text-[10px] flex-shrink-0">
            AM
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-800 truncate">Arjun Mehta</div>
            <div className="text-[10px] text-slate-400 truncate">arjun@example.co</div>
          </div>
          <Settings size={13} className="text-slate-400 ml-auto flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
