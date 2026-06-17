// app/integrations/page.tsx
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Plus, CheckCircle, RefreshCw, Zap, AlertTriangle,
  ExternalLink, Trash2, Eye, EyeOff, ChevronRight, Activity,
  Mail, Calendar, Globe, BarChart2, Cloud, Layers,
  Plug, ArrowRight, X, Loader2, ShieldCheck, Lock,
  LayoutDashboard, Inbox, MessageSquare, Settings, Bell,
  LogOut, Send, PenLine,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
type Status = "connected" | "error" | "disconnected" | "connecting";
type PluginId = "gmail" | "googlecalendar" | "corsair";

interface Integration {
  id: PluginId;
  name: string;
  desc: string;
  icon: React.ElementType;
  category: string;
  detail: string;
  accent: string;
  accentHex: string;
  bg: string;
  border: string;
  glow: string;
  status: Status;
}

interface StatusResponse {
  gmail: { connected: boolean };
  googlecalendar: { connected: boolean };
}

interface GmailStats { unreadCount: number; emailAddress?: string }
interface CalStats   { eventCount: number }

// ─────────────────────────────────────────────────────────
// Static config
// ─────────────────────────────────────────────────────────
const INTEGRATION_CONFIG: Omit<Integration, "status">[] = [
  {
    id: "gmail",
    name: "Gmail",
    desc: "Read, send, and manage emails on your behalf via the Gmail API.",
    icon: Mail,
    category: "Communication",
    detail: "Connected via OAuth",
    accent: "text-rose-400",
    accentHex: "#fb7185",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.12)",
  },
  {
    id: "googlecalendar",
    name: "Google Calendar",
    desc: "Create events, check availability and send invites via Calendar API.",
    icon: Calendar,
    category: "Productivity",
    detail: "Connected via OAuth",
    accent: "text-blue-400",
    accentHex: "#60a5fa",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.12)",
  },
  {
    id: "corsair",
    name: "Corsair MCP",
    desc: "Model Context Protocol server that bridges your AI agent with all connected apps.",
    icon: Zap,
    category: "AI Infrastructure",
    detail: "Active",
    accent: "text-amber-400",
    accentHex: "#fbbf24",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.14)",
  },
];

const AVAILABLE_GROUPS = [
  {
    category: "Productivity",
    icon: Layers,
    color: "text-teal-400",
    items: [
      { id: "notion",   name: "Notion",   desc: "Sync email summaries and meeting notes"    },
      { id: "linear",   name: "Linear",   desc: "Create issues from emails automatically"    },
      { id: "jira",     name: "Jira",     desc: "Link threads to tickets and update status"  },
      { id: "obsidian", name: "Obsidian", desc: "Push AI summaries to your knowledge base"   },
    ],
  },
  {
    category: "CRM",
    icon: BarChart2,
    color: "text-pink-400",
    items: [
      { id: "hubspot",    name: "HubSpot",    desc: "Log emails and schedule follow-ups"          },
      { id: "salesforce", name: "Salesforce", desc: "Sync contacts and pipeline from your inbox"  },
      { id: "pipedrive",  name: "Pipedrive",  desc: "Auto-create deals from investor threads"     },
    ],
  },
  {
    category: "Storage & Files",
    icon: Cloud,
    color: "text-sky-400",
    items: [
      { id: "gdrive",   name: "Google Drive", desc: "Attach and search Drive files in emails"  },
      { id: "dropbox",  name: "Dropbox",      desc: "Share links directly from the AI agent"   },
      { id: "onedrive", name: "OneDrive",     desc: "Access and attach Microsoft files"         },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────
const CARD    = "bg-[#05080f] border border-white/[0.07]";
const MODAL   = "bg-[#040710]";
const INNER   = "bg-white/[0.03] border border-white/[0.06]";

// ─────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === "connected")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" /> Connected
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/25 px-2.5 py-1 rounded-full">
        <AlertTriangle size={9} /> Error
      </span>
    );
  if (status === "connecting")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full">
        <Loader2 size={9} className="animate-spin" /> Connecting…
      </span>
    );
  return (
    <span className="text-[10px] font-bold bg-white/[0.04] text-slate-500 border border-white/[0.08] px-2.5 py-1 rounded-full">
      Not connected
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-sm font-semibold ${type === "success" ? "bg-teal-500/10 border-teal-500/25 text-teal-300" : "bg-red-500/10 border-red-500/25 text-red-300"}`}>
      {type === "success" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-50 hover:opacity-100 transition-opacity"><X size={13} /></button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Compose Email Modal
// ─────────────────────────────────────────────────────────
function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [to, setTo]           = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), body: body.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Send failed");
      onSent();
    } catch (e: any) {
      setError(e.message ?? "Failed to send email");
      setLoading(false);
    }
  }

  const fieldCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-rose-500/40 focus:bg-white/[0.06] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[480px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)] ${MODAL}`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-700 hover:text-slate-300 transition-colors"><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <PenLine size={15} className="text-rose-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Compose Email</div>
              <div className="text-[10px] text-slate-600">Send via Gmail</div>
            </div>
          </div>

          <div className="space-y-3">
            <input className={fieldCls} placeholder="To: email@example.com" value={to} onChange={e => setTo(e.target.value)} />
            <input className={fieldCls} placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea
              className={`${fieldCls} resize-none h-32`}
              placeholder="Write your message…"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mt-3">
              <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />
              <span className="text-[11px] text-red-400">{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className={`flex-1 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-all`}>
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white bg-rose-500/80 hover:bg-rose-500 px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              {loading ? "Sending…" : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Create Event Modal
// ─────────────────────────────────────────────────────────
function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle]         = useState("");
  const [description, setDesc]    = useState("");
  const [start, setStart]         = useState("");
  const [end, setEnd]             = useState("");
  const [attendees, setAttendees] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleCreate() {
    if (!title.trim() || !start || !end) {
      setError("Title, start and end are required");
      return;
    }
    if (new Date(end) <= new Date(start)) {
      setError("End must be after start");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const emailList = attendees.split(",").map(e => e.trim()).filter(Boolean);
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: title.trim(),
          description: description.trim() || undefined,
          start,
          end,
          attendees: emailList,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Create failed");
      onCreated();
    } catch (e: any) {
      setError(e.message ?? "Failed to create event");
      setLoading(false);
    }
  }

  const fieldCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[480px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)] ${MODAL}`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-700 hover:text-slate-300 transition-colors"><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Calendar size={15} className="text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Create Event</div>
              <div className="text-[10px] text-slate-600">Add to Google Calendar</div>
            </div>
          </div>

          <div className="space-y-3">
            <input className={fieldCls} placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className={`${fieldCls} resize-none h-20`} placeholder="Description (optional)" value={description} onChange={e => setDesc(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-slate-700 font-bold tracking-wide uppercase mb-1 block">Start</label>
                <input type="datetime-local" className={fieldCls} value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div>
                <label className="text-[9px] text-slate-700 font-bold tracking-wide uppercase mb-1 block">End</label>
                <input type="datetime-local" className={fieldCls} value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>
            <input className={fieldCls} placeholder="Attendees: a@b.com, c@d.com" value={attendees} onChange={e => setAttendees(e.target.value)} />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mt-3">
              <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />
              <span className="text-[11px] text-red-400">{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className={`flex-1 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-all`}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white bg-blue-500/80 hover:bg-blue-500 px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              {loading ? "Creating…" : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Disconnect Modal
// ─────────────────────────────────────────────────────────
function DisconnectModal({ item, onClose, onConfirm }: { item: Integration; onClose: () => void; onConfirm: () => void }) {
  const Icon = item.icon;
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleDisconnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plugin: item.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      onConfirm();
    } catch (e: any) {
      setError(e.message ?? "Failed to disconnect");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[380px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)] ${MODAL}`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-700 hover:text-slate-300 transition-colors"><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}>
              <Icon size={18} className={item.accent} />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Disconnect {item.name}?</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Reconnect any time to restore access</div>
            </div>
          </div>
          <div className="bg-red-500/[0.07] border border-red-500/[0.15] rounded-xl px-4 py-3 mb-5">
            <div className="flex gap-2">
              <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Removing this will stop all AI actions relying on{" "}
                <span className="text-red-300 font-semibold">{item.name}</span>. Your data won&apos;t be deleted.
              </p>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
              <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />
              <span className="text-[11px] text-red-400">{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className={`flex-1 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-all`}>
              Keep connected
            </button>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              {loading ? "Disconnecting…" : "Disconnect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Connected Card
// ─────────────────────────────────────────────────────────
function ConnectedCard({
  item,
  onDisconnect,
  onAction,
  liveStats,
}: {
  item: Integration;
  onDisconnect: (i: Integration) => void;
  onAction?: () => void;
  liveStats?: { label: string; value: string }[];
}) {
  const Icon = item.icon;

  const actionLabel = item.id === "gmail" ? "Compose" : item.id === "googlecalendar" ? "Create Event" : null;
  const ActionIcon  = item.id === "gmail" ? PenLine : item.id === "googlecalendar" ? Plus : null;

  return (
    <div
      className={`rounded-2xl ${CARD} overflow-hidden hover:border-white/[0.12] transition-all`}
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.03), inset 0 0 70px ${item.glow}` }}
    >
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}44, transparent)` }} />
      <div className="p-5">
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

        <div className={`flex items-center justify-between mb-4 ${INNER} rounded-xl px-3 py-2.5`}>
          <span className="text-xs text-slate-500 font-mono truncate">{item.detail}</span>
          <span className="text-[10px] text-slate-700 flex items-center gap-1 flex-shrink-0">
            <RefreshCw size={9} /> Live
          </span>
        </div>

        {/* Live stats */}
        {liveStats && liveStats.length > 0 && (
          <div className={`grid grid-cols-${liveStats.length} gap-2 mb-4`}>
            {liveStats.map(({ label, value }) => (
              <div key={label} className={`${INNER} rounded-xl px-2 py-2.5 text-center`}>
                <div className={`text-base font-black ${item.accent} leading-none mb-1`}>{value}</div>
                <div className="text-[9px] text-slate-700 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {actionLabel && ActionIcon && onAction && (
            <button
              onClick={onAction}
              className={`flex items-center gap-1.5 text-xs font-semibold ${item.accent} ${item.bg} border ${item.border} hover:opacity-80 px-3 py-2 rounded-xl transition-all`}
            >
              <ActionIcon size={11} /> {actionLabel}
            </button>
          )}
          <button className={`flex items-center gap-1.5 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] hover:text-slate-300 px-3 py-2 rounded-xl transition-all`}>
            <Activity size={11} /> Logs
          </button>
          {item.id !== "corsair" && (
            <button
              onClick={() => onDisconnect(item)}
              className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-red-400 bg-red-500/[0.07] hover:bg-red-500/15 border border-red-500/20 px-3 py-2 rounded-xl transition-all"
            >
              <Trash2 size={11} /> Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Connect Card (not yet authorised)
// ─────────────────────────────────────────────────────────
function ConnectCard({ item, onConnect }: { item: Integration; onConnect: (i: Integration) => void }) {
  const Icon = item.icon;
  const SCOPE_LABELS: Record<string, string> = {
    gmail:          "Read · Send · Draft",
    googlecalendar: "View · Create · Invite",
    corsair:        "Route · Auth · Store",
  };
  return (
    <div
      className={`rounded-2xl ${CARD} border-dashed overflow-hidden hover:border-white/[0.14] transition-all group`}
      style={{ boxShadow: `inset 0 0 50px ${item.glow}` }}
    >
      <div className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}33, transparent)` }} />
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity`}>
              <Icon size={18} className={item.accent} />
            </div>
            <div>
              <div className="font-bold text-sm text-white/60 group-hover:text-white transition-colors">{item.name}</div>
              <div className="text-[10px] text-slate-700 mt-0.5">{item.category}</div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-4">{item.desc}</p>
        <div className={`flex items-center gap-2 mb-4 ${INNER} rounded-xl px-3 py-2.5`}>
          <ShieldCheck size={11} className="text-slate-700" />
          <span className="text-[10px] text-slate-700">Permissions: </span>
          <span className={`text-[10px] font-semibold ${item.accent} opacity-60`}>{SCOPE_LABELS[item.id]}</span>
        </div>
        <button
          onClick={() => onConnect(item)}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(245,158,11,0.18)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.35)]"
        >
          <Plug size={12} /> Connect {item.name} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Connecting Card (waiting for OAuth window)
// ─────────────────────────────────────────────────────────
function ConnectingCard({ item }: { item: Integration }) {
  const Icon = item.icon;
  return (
    <div className={`rounded-2xl ${CARD} overflow-hidden`} style={{ boxShadow: `inset 0 0 50px ${item.glow}` }}>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}33, transparent)` }} />
      <div className="p-5 flex flex-col items-center justify-center min-h-[220px] gap-4">
        <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}>
          <Icon size={20} className={item.accent} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={18} className="text-amber-400 animate-spin" />
          <div className="text-sm font-semibold text-white">Opening Google…</div>
          <div className="text-[11px] text-slate-600 text-center">Complete the sign-in in the new tab</div>
        </div>
        <div className={`flex items-center gap-1.5 ${INNER} rounded-xl px-3 py-2`}>
          <Lock size={10} className="text-slate-700" />
          <span className="text-[10px] text-slate-700">Secured via Corsair OAuth</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard"    },
  { icon: Inbox,           label: "Inbox",        href: "/"             },
  { icon: Calendar,        label: "Calendar",     href: "/calendar"     },
  { icon: MessageSquare,   label: "AI Agent",     href: "/chat"         },
  { icon: Zap,             label: "Integrations", href: "/integrations" },
  { icon: Settings,        label: "Settings",     href: "/settings"     },
];

const ST = {
  bg:       "#fce7f3",
  surface:  "#fff5f8",
  border:   "rgba(225,29,72,0.10)",
  accent:   "#e11d48",
  accentLt: "rgba(225,29,72,0.08)",
  pri:      "#1a0008",
  muted:    "#c084a0",
  gradient: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
};

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col z-20" style={{ background: ST.surface, borderRight: `1px solid ${ST.border}` }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${ST.border}` }}>
        <span className="flex items-center gap-2 font-extrabold text-sm tracking-tight" style={{ color: ST.pri }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white" style={{ background: ST.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.30)" }}>⚡</div>
          Super-Power
        </span>
        <Bell size={13} style={{ color: ST.muted }} />
      </div>
      <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto pt-4 pb-4">
        {NAV.map(({ icon: Icon, label, href }) => {
          const on = href === "/integrations";
          return (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: on ? ST.accentLt : "transparent", color: on ? ST.accent : ST.muted, borderRight: on ? `2px solid ${ST.accent}` : "2px solid transparent" }}>
              <Icon size={13} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4" style={{ borderTop: `1px solid ${ST.border}` }}>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium mt-3 transition-all hover:bg-rose-50" style={{ color: ST.accent }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────
// Inner page — uses useSearchParams so must be inside Suspense
// ─────────────────────────────────────────────────────────
function IntegrationsInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [session, isPending, router]);

  const handleLogout = useCallback(async () => {
    await authClient.signOut();
    router.replace("/login");
  }, [router]);

  const [statuses, setStatuses] = useState<Record<string, Status>>({
    gmail:          "disconnected",
    googlecalendar: "disconnected",
    corsair:        "connected",
  });
  const [gmailStats, setGmailStats]     = useState<GmailStats | null>(null);
  const [calStats,   setCalStats]       = useState<CalStats | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(null);
  const [toast,  setToast]  = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [composeOpen, setComposeOpen]         = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [loadingStatus, setLoadingStatus]     = useState(true);

  // Fetch real stats for a plugin once it's connected
  const fetchGmailStats = useCallback(async () => {
    try {
      const res = await fetch("/api/gmail/profile");
      if (!res.ok) return;
      const data = await res.json();
      setGmailStats(data);
    } catch {}
  }, []);

  const fetchCalStats = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/events?days=7");
      if (!res.ok) return;
      const data = await res.json();
      const count = Array.isArray(data?.items) ? data.items.length : 0;
      setCalStats({ eventCount: count });
    } catch {}
  }, []);

  // Load real statuses on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/integrations/status");
        if (!res.ok) throw new Error();
        const data: StatusResponse = await res.json();
        const gmailConnected = data.gmail.connected;
        const calConnected   = data.googlecalendar.connected;
        setStatuses(prev => ({
          ...prev,
          gmail:          gmailConnected ? "connected" : "disconnected",
          googlecalendar: calConnected   ? "connected" : "disconnected",
        }));
        if (gmailConnected) fetchGmailStats();
        if (calConnected)   fetchCalStats();
      } catch {
        /* non-fatal */
      } finally {
        setLoadingStatus(false);
      }
    })();
  }, [fetchGmailStats, fetchCalStats]);

  // Handle OAuth callback redirect params
  useEffect(() => {
    const connected = searchParams.get("connected");
    const error     = searchParams.get("error");
    const plugin    = searchParams.get("plugin");

    if (connected) {
      setStatuses(prev => ({ ...prev, [connected]: "connected" }));
      const name = INTEGRATION_CONFIG.find(c => c.id === connected)?.name ?? connected;
      setToast({ message: `${name} connected successfully!`, type: "success" });
      if (connected === "gmail")          fetchGmailStats();
      if (connected === "googlecalendar") fetchCalStats();
      window.history.replaceState({}, "", "/integrations");
    }
    if (error) {
      const name = INTEGRATION_CONFIG.find(c => c.id === plugin)?.name ?? plugin ?? "Integration";
      setToast({ message: `Failed to connect ${name}: ${error}`, type: "error" });
      window.history.replaceState({}, "", "/integrations");
    }
  }, [searchParams, fetchGmailStats, fetchCalStats]);

  // Start OAuth flow
  const handleConnect = useCallback(async (item: Integration) => {
    setStatuses(prev => ({ ...prev, [item.id]: "connecting" }));
    try {
      const res = await fetch(`/api/integrations/connect?plugin=${item.id}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      const { authorizeUrl } = await res.json();
      window.open(authorizeUrl, "_blank", "noopener,noreferrer");

      // Poll until connected
      const poll = setInterval(async () => {
        try {
          const sr = await fetch("/api/integrations/status");
          const sd: StatusResponse = await sr.json();
          const key = item.id as "gmail" | "googlecalendar";
          if (sd[key]?.connected) {
            clearInterval(poll);
            setStatuses(prev => ({ ...prev, [item.id]: "connected" }));
            setToast({ message: `${item.name} connected!`, type: "success" });
            if (key === "gmail")          fetchGmailStats();
            if (key === "googlecalendar") fetchCalStats();
          }
        } catch {}
      }, 3000);

      setTimeout(() => {
        clearInterval(poll);
        setStatuses(prev => prev[item.id] === "connecting" ? { ...prev, [item.id]: "disconnected" } : prev);
      }, 5 * 60 * 1000);
    } catch (e: any) {
      setStatuses(prev => ({ ...prev, [item.id]: "error" }));
      setToast({ message: e.message ?? "Connection failed", type: "error" });
    }
  }, [fetchGmailStats, fetchCalStats]);

  const handleDisconnectConfirm = useCallback(() => {
    if (!disconnectTarget) return;
    setStatuses(prev => ({ ...prev, [disconnectTarget.id]: "disconnected" }));
    if (disconnectTarget.id === "gmail")          setGmailStats(null);
    if (disconnectTarget.id === "googlecalendar") setCalStats(null);
    setToast({ message: `${disconnectTarget.name} disconnected`, type: "success" });
    setDisconnectTarget(null);
  }, [disconnectTarget]);

  const integrations: Integration[] = INTEGRATION_CONFIG.map(cfg => ({
    ...cfg,
    status: statuses[cfg.id] ?? "disconnected",
  }));

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  const filtered = AVAILABLE_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  const STATS_OVERVIEW = [
    { label: "Connected", value: String(connectedCount), sub: "integrations active", accent: "text-teal-400", bar: "bg-teal-400", barW: `${Math.round((connectedCount / 3) * 100)}%` },
    { label: "Unread emails", value: gmailStats ? String(gmailStats.unreadCount) : "–", sub: "in your inbox", accent: "text-rose-400", bar: "bg-rose-400", barW: gmailStats ? `${Math.min((gmailStats.unreadCount / 100) * 100, 100)}%` : "0%" },
    { label: "Events this week", value: calStats ? String(calStats.eventCount) : "–", sub: "upcoming 7 days", accent: "text-blue-400", bar: "bg-blue-400", barW: calStats ? `${Math.min((calStats.eventCount / 20) * 100, 100)}%` : "0%" },
    { label: "Uptime", value: "99.9%", sub: "last 30 days", accent: "text-emerald-400", bar: "bg-emerald-400", barW: "99%" },
  ];

  const getLiveStats = (id: string): { label: string; value: string }[] | undefined => {
    if (id === "gmail" && gmailStats) {
      return [
        { label: "Unread", value: String(gmailStats.unreadCount) },
        { label: "Email", value: gmailStats.emailAddress?.split("@")[0] ?? "–" },
      ];
    }
    if (id === "googlecalendar" && calStats) {
      return [
        { label: "This week", value: String(calStats.eventCount) },
        { label: "Events", value: calStats.eventCount === 1 ? "event" : "upcoming" },
      ];
    }
    return undefined;
  };

  if (isPending) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#020508]">
        <Loader2 size={24} className="text-amber-400 animate-spin" />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#020508] relative">
      <style>{`
        @keyframes float-a  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line{ 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.0025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.0025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-amber-500/[0.04] blur-[180px] pointer-events-none z-0" style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[550px] h-[550px] rounded-full bg-teal-500/[0.03] blur-[160px] pointer-events-none z-0" style={{ animation: "float-b 12s ease-in-out infinite" }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/70 flex items-center gap-1.5 mb-2">
                  <span>✦</span> Integrations
                </div>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  Manage everything SuperPower can access on your behalf.
                </p>
              </div>
              <div className="flex gap-2">
                {statuses.gmail === "connected" && (
                  <button
                    onClick={() => setComposeOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-500/20 transition-all"
                  >
                    <PenLine size={12} /> Compose
                  </button>
                )}
                {statuses.googlecalendar === "connected" && (
                  <button
                    onClick={() => setCreateEventOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl hover:bg-blue-500/20 transition-all"
                  >
                    <Plus size={12} /> New Event
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {STATS_OVERVIEW.map(({ label, value, sub, accent, bar, barW }) => (
                <div key={label} className={`${CARD} rounded-2xl p-4`}>
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-700 mb-3">{label}</div>
                  <div className={`text-2xl font-black tracking-tight mb-1 ${accent}`}>{value}</div>
                  <div className="text-[10px] text-slate-700 mb-3">{sub}</div>
                  <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bar} opacity-50 transition-all duration-700`} style={{ width: barW }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Core integrations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={13} className="text-teal-400" />
                <span className="text-sm font-bold text-white">Core integrations</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold px-2 py-0.5 rounded-full">
                  {connectedCount} / {integrations.length}
                </span>
                {loadingStatus && <Loader2 size={11} className="text-slate-600 animate-spin" />}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {integrations.map(item => {
                  if (item.status === "connected")
                    return (
                      <ConnectedCard
                        key={item.id}
                        item={item}
                        onDisconnect={setDisconnectTarget}
                        liveStats={getLiveStats(item.id)}
                        onAction={
                          item.id === "gmail"
                            ? () => setComposeOpen(true)
                            : item.id === "googlecalendar"
                            ? () => setCreateEventOpen(true)
                            : undefined
                        }
                      />
                    );
                  if (item.status === "connecting")
                    return <ConnectingCard key={item.id} item={item} />;
                  return <ConnectCard key={item.id} item={item} onConnect={handleConnect} />;
                })}
              </div>
            </div>

            {/* Available integrations search */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-slate-600" />
                  <span className="text-sm font-bold text-white">More integrations</span>
                  <span className="text-[10px] bg-white/[0.04] text-slate-600 border border-white/[0.06] font-bold px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                </div>
                <div className="relative">
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search…"
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2 text-xs text-slate-400 placeholder:text-slate-700 focus:outline-none focus:border-white/[0.12] w-40"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filtered.map(group => (
                  <div key={group.category}>
                    <div className={`flex items-center gap-2 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase ${group.color}`}>
                      <group.icon size={10} /> {group.category}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map(i => (
                        <div key={i.id} className={`${CARD} rounded-xl px-4 py-3 flex items-center justify-between group hover:border-white/[0.12] transition-all`}>
                          <div>
                            <div className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">{i.name}</div>
                            <div className="text-[10px] text-slate-700 mt-0.5">{i.desc}</div>
                          </div>
                          <button className="text-[10px] font-bold text-slate-700 hover:text-slate-400 flex items-center gap-1 flex-shrink-0 ml-3 transition-colors">
                            <Plus size={9} /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corsair banner */}
            <div
              className="relative rounded-2xl overflow-hidden border border-amber-500/[0.12]"
              style={{ background: "linear-gradient(135deg, #0f0800 0%, #080500 100%)", boxShadow: "0 4px 40px rgba(0,0,0,0.6), inset 0 0 80px rgba(245,158,11,0.04)" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 18% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)" }} />
              <div className="relative z-10 flex items-center gap-6 px-6 py-5">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-500/60 mb-1">AI Infrastructure</div>
                  <div className="text-sm font-bold text-white mb-1">Corsair powers every integration</div>
                  <div className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    OAuth tokens are stored encrypted in your own database via the local Corsair server.
                    All API calls route through Corsair — no tokens ever leave your infrastructure.
                  </div>
                </div>
                <a
                  href="https://docs.corsair.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl hover:bg-amber-500/20 transition-all flex-shrink-0 whitespace-nowrap"
                >
                  View docs <ChevronRight size={12} />
                </a>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      {disconnectTarget && (
        <DisconnectModal item={disconnectTarget} onClose={() => setDisconnectTarget(null)} onConfirm={handleDisconnectConfirm} />
      )}
      {composeOpen && (
        <ComposeModal
          onClose={() => setComposeOpen(false)}
          onSent={() => {
            setComposeOpen(false);
            setToast({ message: "Email sent!", type: "success" });
            fetchGmailStats();
          }}
        />
      )}
      {createEventOpen && (
        <CreateEventModal
          onClose={() => setCreateEventOpen(false)}
          onCreated={() => {
            setCreateEventOpen(false);
            setToast({ message: "Event created!", type: "success" });
            fetchCalStats();
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page export — wraps inner in Suspense (required for useSearchParams)
// ─────────────────────────────────────────────────────────
export default function IntegrationsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-[#020508]">
          <Loader2 size={24} className="text-amber-400 animate-spin" />
        </div>
      }
    >
      <IntegrationsInner />
    </Suspense>
  );
}
