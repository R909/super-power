"use client";

import { useState } from "react";
import {
  Search, Plus, CheckCircle, RefreshCw, Zap, AlertTriangle,
  ExternalLink, Trash2, Eye, EyeOff, ChevronRight, Activity,
  Mail, Calendar, Globe,
  BarChart2, Cloud, Layers,
} from "lucide-react";
import Sidebar from "../components/sidebar";

// ── Types ────────────────────────────────────────────────────────────────────
type Status = "connected" | "error" | "disconnected";

interface Integration {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  category: string;
  status: Status;
  detail?: string;
  synced?: string;
  stats?: { label: string; value: string }[];
  accent: string;
  bg: string;
  border: string;
  glow: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const CONNECTED: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    desc: "Read, send, and manage emails on your behalf via the Gmail API.",
    icon: Mail,
    category: "Communication",
    status: "connected",
    detail: "arjun@example.co",
    synced: "2 min ago",
    stats: [
      { label: "Emails synced", value: "2,341" },
      { label: "Sent by AI",    value: "47"    },
      { label: "Drafts saved",  value: "12"    },
    ],
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.10)",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Create events, check availability and send invites via Calendar API.",
    icon: Calendar,
    category: "Productivity",
    status: "connected",
    detail: "arjun@example.co",
    synced: "5 min ago",
    stats: [
      { label: "Events synced",  value: "183"  },
      { label: "Created by AI",  value: "9"    },
      { label: "Invites sent",   value: "21"   },
    ],
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.10)",
  },
  {
    id: "corsair",
    name: "Corsair MCP",
    desc: "Model Context Protocol server that bridges your AI agent with all connected apps.",
    icon: Zap,
    category: "AI Infrastructure",
    status: "connected",
    detail: "Key: ••••••••••abc123",
    synced: "Live",
    stats: [
      { label: "AI tasks today", value: "12"   },
      { label: "Avg latency",    value: "320ms" },
      { label: "Uptime",         value: "99.9%" },
    ],
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.12)",
  },
];

const AVAILABLE: { category: string; icon: React.ElementType; color: string; items: { id: string; name: string; desc: string }[] }[] = [
  
  {
    category: "Productivity",
    icon: Layers,
    color: "text-teal-400",
    items: [
      { id: "notion",  name: "Notion",    desc: "Sync email summaries and meeting notes"            },
      { id: "linear",  name: "Linear",    desc: "Create issues from emails automatically"           },
      { id: "jira",    name: "Jira",      desc: "Link threads to tickets and update status"         },
      { id: "obsidian",name: "Obsidian",  desc: "Push AI summaries to your knowledge base"          },
    ],
  },
  {
    category: "CRM",
    icon: BarChart2,
    color: "text-pink-400",
    items: [
      { id: "hubspot",    name: "HubSpot",    desc: "Log emails and schedule follow-ups"            },
      { id: "salesforce", name: "Salesforce", desc: "Sync contacts and pipeline from your inbox"    },
      { id: "pipedrive",  name: "Pipedrive",  desc: "Auto-create deals from investor threads"       },
    ],
  },
  {
    category: "Storage & Files",
    icon: Cloud,
    color: "text-sky-400",
    items: [
      { id: "gdrive",   name: "Google Drive",  desc: "Attach and search Drive files in emails"      },
      { id: "dropbox",  name: "Dropbox",       desc: "Share links directly from the AI agent"       },
      { id: "onedrive", name: "OneDrive",      desc: "Access and attach Microsoft files"            },
    ],
  },
 
];

const STATS_OVERVIEW = [
  { label: "Connected",      value: "3",      sub: "integrations active",   accent: "text-teal-400",   bar: "bg-teal-400",   barW: "60%" },
  { label: "Events processed",value: "2.5k",  sub: "this month",            accent: "text-amber-400",  bar: "bg-amber-400",  barW: "75%" },
  { label: "AI actions",     value: "59",     sub: "sent or created",       accent: "text-violet-400", bar: "bg-violet-400", barW: "45%" },
  { label: "Uptime",         value: "99.9%",  sub: "last 30 days",          accent: "text-emerald-400",bar: "bg-emerald-400",barW: "99%" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === "connected") return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" /> Connected
    </span>
  );
  if (status === "error") return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
      <AlertTriangle size={9} /> Error
    </span>
  );
  return (
    <span className="text-[10px] font-bold bg-white/[0.05] text-slate-600 border border-white/[0.08] px-2.5 py-1 rounded-full">
      Not connected
    </span>
  );
}

function ConnectedCard({ item }: { item: Integration }) {
  const [showKey, setShowKey] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="rounded-2xl bg-[#090d16] border border-white/[0.06] overflow-hidden hover:border-white/[0.10] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), inset 0 0 60px ${item.glow}` }}
    >
      {/* Top gradient line */}
      <div className={`h-px w-full bg-gradient-to-r from-transparent ${item.accent.replace("text-", "via-")} to-transparent opacity-40`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={item.accent} />
            </div>
            <div>
              <div className="font-bold text-sm text-white">{item.name}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{item.category}</div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>

        {/* Detail row */}
        <div className="flex items-center justify-between mb-4 bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.05]">
          <span className="text-xs text-slate-500 font-mono">
            {item.id === "corsair" && !showKey ? "Key: ••••••••••abc123" : item.detail}
          </span>
          <div className="flex items-center gap-2">
            {item.id === "corsair" && (
              <button onClick={() => setShowKey(!showKey)}
                className="text-slate-700 hover:text-slate-400 transition-colors">
                {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            )}
            <span className="text-[10px] text-slate-700 flex items-center gap-1">
              <RefreshCw size={9} /> {item.synced}
            </span>
          </div>
        </div>

        {/* Stats */}
        {item.stats && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {item.stats.map(({ label, value }) => (
              <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2.5 text-center">
                <div className={`text-base font-black ${item.accent} leading-none mb-1`}>{value}</div>
                <div className="text-[9px] text-slate-700 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-3 py-2 rounded-xl transition-all">
            <Activity size={11} /> Logs
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-3 py-2 rounded-xl transition-all">
            <ExternalLink size={11} /> Manage
          </button>
          <button className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-red-400 bg-red-500/[0.08] hover:bg-red-500/15 border border-red-500/20 px-3 py-2 rounded-xl transition-all">
            <Trash2 size={11} /> Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

function AvailableCard({ id, name, desc }: { id: string; name: string; desc: string }) {
  const [connecting, setConnecting] = useState(false);
  const [done, setDone] = useState(false);

  function handleConnect() {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setDone(true); }, 1400);
  }

  return (
    <div className="flex items-center gap-4 bg-[#090d16] border border-white/[0.06] rounded-2xl px-4 py-3.5 hover:border-white/[0.10] transition-all group">
      {/* Generic icon placeholder */}
      <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
        <Globe size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{name}</div>
        <div className="text-[10px] text-slate-700 truncate mt-0.5">{desc}</div>
      </div>
      {done ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-400 flex-shrink-0">
          <CheckCircle size={11} /> Added
        </span>
      ) : (
        <button onClick={handleConnect} disabled={connecting}
          className="flex items-center gap-1.5 text-[11px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 text-black px-3 py-1.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(245,158,11,0.2)] flex-shrink-0">
          {connecting
            ? <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            : <><Plus size={11} /> Connect</>}
        </button>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [search, setSearch] = useState("");

  const filtered = AVAILABLE.map((group) => ({
    ...group,
    items: group.items.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-amber-500/[0.05] blur-[160px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[550px] h-[550px] rounded-full bg-teal-500/[0.04] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

            {/* Page header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/80 flex items-center gap-1.5 mb-2">
                  <span>✦</span> Integrations
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Connected apps</h1>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  Manage everything Super-Power can access on your behalf.
                </p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all">
                <Plus size={13} /> Add integration
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {STATS_OVERVIEW.map(({ label, value, sub, accent, bar, barW }) => (
                <div key={label}
                  className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-700 mb-3">{label}</div>
                  <div className={`text-2xl font-black tracking-tight mb-1 ${accent}`}>{value}</div>
                  <div className="text-[10px] text-slate-700 mb-3">{sub}</div>
                  <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bar} opacity-60`} style={{ width: barW }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Connected */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={13} className="text-teal-400" />
                <span className="text-sm font-bold text-white">Active integrations</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold px-2 py-0.5 rounded-full">3</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {CONNECTED.map((item) => (
                  <ConnectedCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Corsair banner */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/[0.15] shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
              style={{ background: "linear-gradient(135deg, #150b00 0%, #0a0600 100%)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.10) 0%, transparent 60%)" }} />
              <div className="relative z-10 flex items-center gap-6 px-6 py-5">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-500/70 mb-1">AI Infrastructure</div>
                  <div className="text-sm font-bold text-white mb-1">Corsair MCP is the backbone</div>
                  <div className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    All integrations route through Corsair's Model Context Protocol, giving your AI agent a unified, secure interface to every connected app. No extra auth flows once it's set up.
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl hover:bg-amber-500/20 transition-all flex-shrink-0">
                  View docs <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* Available */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-slate-600" />
                  <span className="text-sm font-bold text-white">Available integrations</span>
                  <span className="text-[10px] bg-white/[0.05] text-slate-600 border border-white/[0.08] font-bold px-2 py-0.5 rounded-full">
                    {AVAILABLE.reduce((a, g) => a + g.items.length, 0)}
                  </span>
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] hover:border-amber-500/20 rounded-xl px-3 py-2 w-56 transition-colors">
                  <Search size={12} className="text-slate-700 flex-shrink-0" />
                  <input
                    className="bg-transparent text-xs outline-none text-slate-400 placeholder:text-slate-700 w-full"
                    placeholder="Search integrations…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-700 text-sm font-medium">
                  No integrations match &ldquo;{search}&rdquo;
                </div>
              ) : (
                <div className="space-y-6">
                  {filtered.map(({ category, icon: CatIcon, color, items }) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <CatIcon size={12} className={color} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">{category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item) => (
                          <AvailableCard key={item.id} {...item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
