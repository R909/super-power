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
  status: Status;
}

interface StatusResponse {
  gmail: { connected: boolean };
  googlecalendar: { connected: boolean };
}

interface GmailStats { unreadCount: number; emailAddress?: string }
interface CalStats   { eventCount: number }

// ─────────────────────────────────────────────────────────
// Design tokens — shared with dashboard/page.tsx
// ─────────────────────────────────────────────────────────
const T = {
  bg:        "#fce7f3",
  surface:   "#fff5f8",
  border:    "rgba(225,29,72,0.10)",
  borderHv:  "rgba(225,29,72,0.22)",
  accent:    "#e11d48",
  accentLt:  "rgba(225,29,72,0.08)",
  pri:       "#1a0008",
  sec:       "#7f1d1d",
  muted:     "#c084a0",
  dim:       "#e9b8c8",
  gradient:  "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
  success:   "#0d9488",
  successLt: "rgba(13,148,136,0.08)",
  danger:    "#dc2626",
  dangerLt:  "rgba(220,38,38,0.06)",
  warn:      "#d97706",
  warnLt:    "rgba(217,119,6,0.08)",
  blue:      "#2563eb",
  blueLt:    "rgba(37,99,235,0.07)",
};

const CARD  = "bg-white border";
const MODAL = "bg-white";
const INNER = "border";

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
    accent: "#e11d48",
    accentHex: "#e11d48",
    bg: "rgba(225,29,72,0.06)",
    border: "rgba(225,29,72,0.16)",
  },
  {
    id: "googlecalendar",
    name: "Google Calendar",
    desc: "Create events, check availability and send invites via Calendar API.",
    icon: Calendar,
    category: "Productivity",
    detail: "Connected via OAuth",
    accent: "#2563eb",
    accentHex: "#2563eb",
    bg: "rgba(37,99,235,0.06)",
    border: "rgba(37,99,235,0.16)",
  },
  {
    id: "corsair",
    name: "Corsair MCP",
    desc: "Model Context Protocol server that bridges your AI agent with all connected apps.",
    icon: Zap,
    category: "AI Infrastructure",
    detail: "Active",
    accent: "#d97706",
    accentHex: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.18)",
  },
];

const AVAILABLE_GROUPS = [
  {
    category: "Productivity",
    icon: Layers,
    color: "#0d9488",
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
    color: "#e11d48",
    items: [
      { id: "hubspot",    name: "HubSpot",    desc: "Log emails and schedule follow-ups"          },
      { id: "salesforce", name: "Salesforce", desc: "Sync contacts and pipeline from your inbox"  },
      { id: "pipedrive",  name: "Pipedrive",  desc: "Auto-create deals from investor threads"     },
    ],
  },
  {
    category: "Storage & Files",
    icon: Cloud,
    color: "#2563eb",
    items: [
      { id: "gdrive",   name: "Google Drive", desc: "Attach and search Drive files in emails"  },
      { id: "dropbox",  name: "Dropbox",      desc: "Share links directly from the AI agent"   },
      { id: "onedrive", name: "OneDrive",     desc: "Access and attach Microsoft files"         },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === "connected")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.25)` }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.success }} /> Connected
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: T.dangerLt, color: T.danger, border: `1px solid rgba(220,38,38,0.22)` }}>
        <AlertTriangle size={9} /> Error
      </span>
    );
  if (status === "connecting")
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: T.warnLt, color: T.warn, border: `1px solid rgba(217,119,6,0.22)` }}>
        <Loader2 size={9} className="animate-spin" /> Connecting…
      </span>
    );
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: T.accentLt, color: T.muted, border: `1px solid ${T.border}` }}>
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
  const ok = type === "success";
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold"
      style={{
        background: ok ? T.successLt : T.dangerLt,
        border: `1px solid ${ok ? "rgba(13,148,136,0.25)" : "rgba(220,38,38,0.22)"}`,
        color: ok ? T.success : T.danger,
      }}>
      {ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
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

  const fieldCls = "w-full bg-white border rounded-xl px-3 py-2.5 text-xs outline-none transition-all";
  const fieldStyle = { borderColor: T.border, color: T.pri } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[480px] rounded-2xl overflow-hidden shadow-2xl ${MODAL}`} style={{ border: `1px solid ${T.border}` }}>
        <div className="h-1" style={{ background: T.gradient }} />
        <button onClick={onClose} className="absolute top-4 right-4 transition-colors" style={{ color: T.dim }}><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.accentLt, border: `1px solid ${T.border}` }}>
              <PenLine size={15} style={{ color: T.accent }} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: T.pri }}>Compose Email</div>
              <div className="text-[10px]" style={{ color: T.muted }}>Send via Gmail</div>
            </div>
          </div>

          <div className="space-y-3">
            <input className={fieldCls} style={fieldStyle} placeholder="To: email@example.com" value={to} onChange={e => setTo(e.target.value)} />
            <input className={fieldCls} style={fieldStyle} placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea
              className={`${fieldCls} resize-none h-32`}
              style={fieldStyle}
              placeholder="Write your message…"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mt-3" style={{ background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}>
              <AlertTriangle size={11} style={{ color: T.danger }} className="flex-shrink-0" />
              <span className="text-[11px]" style={{ color: T.danger }}>{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all" style={{ color: T.muted, background: T.surface, border: `1px solid ${T.border}` }}>
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
              style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}
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

  const fieldCls = "w-full bg-white border rounded-xl px-3 py-2.5 text-xs outline-none transition-all";
  const fieldStyle = { borderColor: T.border, color: T.pri } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[480px] rounded-2xl overflow-hidden shadow-2xl ${MODAL}`} style={{ border: `1px solid ${T.border}` }}>
        <div className="h-1" style={{ background: "linear-gradient(135deg,#60a5fa,#2563eb)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 transition-colors" style={{ color: T.dim }}><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.blueLt, border: `1px solid rgba(37,99,235,0.18)` }}>
              <Calendar size={15} style={{ color: T.blue }} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: T.pri }}>Create Event</div>
              <div className="text-[10px]" style={{ color: T.muted }}>Add to Google Calendar</div>
            </div>
          </div>

          <div className="space-y-3">
            <input className={fieldCls} style={fieldStyle} placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className={`${fieldCls} resize-none h-20`} style={fieldStyle} placeholder="Description (optional)" value={description} onChange={e => setDesc(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold tracking-wide uppercase mb-1 block" style={{ color: T.dim }}>Start</label>
                <input type="datetime-local" className={fieldCls} style={fieldStyle} value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-wide uppercase mb-1 block" style={{ color: T.dim }}>End</label>
                <input type="datetime-local" className={fieldCls} style={fieldStyle} value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>
            <input className={fieldCls} style={fieldStyle} placeholder="Attendees: a@b.com, c@d.com" value={attendees} onChange={e => setAttendees(e.target.value)} />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mt-3" style={{ background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}>
              <AlertTriangle size={11} style={{ color: T.danger }} className="flex-shrink-0" />
              <span className="text-[11px]" style={{ color: T.danger }}>{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all" style={{ color: T.muted, background: T.surface, border: `1px solid ${T.border}` }}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#60a5fa,#2563eb)", boxShadow: "0 2px 10px rgba(37,99,235,0.25)" }}
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-[380px] rounded-2xl overflow-hidden shadow-2xl ${MODAL}`} style={{ border: `1px solid ${T.border}` }}>
        <div className="h-1" style={{ background: "linear-gradient(135deg,#f87171,#dc2626)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 transition-colors" style={{ color: T.dim }}><X size={15} /></button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <Icon size={18} style={{ color: item.accent }} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: T.pri }}>Disconnect {item.name}?</div>
              <div className="text-[10px] mt-0.5" style={{ color: T.muted }}>Reconnect any time to restore access</div>
            </div>
          </div>
          <div className="rounded-xl px-4 py-3 mb-5" style={{ background: T.dangerLt, border: `1px solid rgba(220,38,38,0.16)` }}>
            <div className="flex gap-2">
              <AlertTriangle size={13} style={{ color: T.danger }} className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed" style={{ color: T.sec }}>
                Removing this will stop all AI actions relying on{" "}
                <span className="font-semibold" style={{ color: T.danger }}>{item.name}</span>. Your data won&apos;t be deleted.
              </p>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4" style={{ background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}>
              <AlertTriangle size={11} style={{ color: T.danger }} className="flex-shrink-0" />
              <span className="text-[11px]" style={{ color: T.danger }}>{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all" style={{ color: T.muted, background: T.surface, border: `1px solid ${T.border}` }}>
              Keep connected
            </button>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
              style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}
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
    <div className={`rounded-2xl ${CARD} overflow-hidden transition-all hover:shadow-md`} style={{ borderColor: T.border }}>
      <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}66, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <Icon size={18} style={{ color: item.accent }} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: T.pri }}>{item.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: T.muted }}>{item.category}</div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <p className="text-xs leading-relaxed mb-4" style={{ color: T.sec }}>{item.desc}</p>

        <div className="flex items-center justify-between mb-4 rounded-xl px-3 py-2.5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <span className="text-xs font-mono truncate" style={{ color: T.muted }}>{item.detail}</span>
          <span className="text-[10px] flex items-center gap-1 flex-shrink-0" style={{ color: T.dim }}>
            <RefreshCw size={9} /> Live
          </span>
        </div>

        {/* Live stats */}
        {liveStats && liveStats.length > 0 && (
          <div className={`grid grid-cols-${liveStats.length} gap-2 mb-4`}>
            {liveStats.map(({ label, value }) => (
              <div key={label} className="rounded-xl px-2 py-2.5 text-center" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="text-base font-black leading-none mb-1" style={{ color: item.accent }}>{value}</div>
                <div className="text-[9px] leading-tight" style={{ color: T.muted }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {actionLabel && ActionIcon && onAction && (
            <button
              onClick={onAction}
              className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 px-3 py-2 rounded-xl transition-all"
              style={{ color: item.accent, background: item.bg, border: `1px solid ${item.border}` }}
            >
              <ActionIcon size={11} /> {actionLabel}
            </button>
          )}
          <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ color: T.muted, background: T.surface, border: `1px solid ${T.border}` }}>
            <Activity size={11} /> Logs
          </button>
          {item.id !== "corsair" && (
            <button
              onClick={() => onDisconnect(item)}
              className="flex items-center gap-1.5 ml-auto text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.18)` }}
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
    <div className={`rounded-2xl ${CARD} border-dashed overflow-hidden transition-all hover:shadow-md group`} style={{ borderColor: T.border }}>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <Icon size={18} style={{ color: item.accent }} />
            </div>
            <div>
              <div className="font-bold text-sm transition-colors" style={{ color: T.muted }}>{item.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: T.dim }}>{item.category}</div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-xs leading-relaxed mb-4" style={{ color: T.muted }}>{item.desc}</p>
        <div className="flex items-center gap-2 mb-4 rounded-xl px-3 py-2.5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <ShieldCheck size={11} style={{ color: T.dim }} />
          <span className="text-[10px]" style={{ color: T.dim }}>Permissions: </span>
          <span className="text-[10px] font-semibold opacity-80" style={{ color: item.accent }}>{SCOPE_LABELS[item.id]}</span>
        </div>
        <button
          onClick={() => onConnect(item)}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition-all"
          style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.22)" }}
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
    <div className={`rounded-2xl ${CARD} overflow-hidden`} style={{ borderColor: T.border }}>
      <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}55, transparent)` }} />
      <div className="p-5 flex flex-col items-center justify-center min-h-[220px] gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
          <Icon size={20} style={{ color: item.accent }} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={18} className="animate-spin" style={{ color: T.accent }} />
          <div className="text-sm font-semibold" style={{ color: T.pri }}>Opening Google…</div>
          <div className="text-[11px] text-center" style={{ color: T.muted }}>Complete the sign-in in the new tab</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <Lock size={10} style={{ color: T.dim }} />
          <span className="text-[10px]" style={{ color: T.dim }}>Secured via Corsair OAuth</span>
        </div>
      </div>
    </div>
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
      } finally {
        setLoadingStatus(false);
      }
    })();
  }, [fetchGmailStats, fetchCalStats]);

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

  const handleConnect = useCallback(async (item: Integration) => {
    setStatuses(prev => ({ ...prev, [item.id]: "connecting" }));
    try {
      const res = await fetch(`/api/integrations/connect?plugin=${item.id}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      const { authorizeUrl } = await res.json();
      window.open(authorizeUrl, "_blank", "noopener,noreferrer");

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
    { label: "Connected", value: String(connectedCount), sub: "integrations active", accent: T.success, bar: T.success, barW: `${Math.round((connectedCount / 3) * 100)}%` },
    { label: "Unread emails", value: gmailStats ? String(gmailStats.unreadCount) : "–", sub: "in your inbox", accent: T.accent, bar: T.accent, barW: gmailStats ? `${Math.min((gmailStats.unreadCount / 100) * 100, 100)}%` : "0%" },
    { label: "Events this week", value: calStats ? String(calStats.eventCount) : "–", sub: "upcoming 7 days", accent: T.blue, bar: T.blue, barW: calStats ? `${Math.min((calStats.eventCount / 20) * 100, 100)}%` : "0%" },
    { label: "Uptime", value: "99.9%", sub: "last 30 days", accent: T.success, bar: T.success, barW: "99%" },
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
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: T.bg }}>
        <Loader2 size={24} className="animate-spin" style={{ color: T.accent }} />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: T.bg }}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5 mb-2" style={{ color: T.accent }}>
                <span>✦</span> Integrations
              </div>
              <p className="text-sm mt-1 font-medium" style={{ color: T.sec }}>
                Manage everything SuperPower can access on your behalf.
              </p>
            </div>
            <div className="flex gap-2">
              {statuses.gmail === "connected" && (
                <button
                  onClick={() => setComposeOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ color: T.accent, background: T.accentLt, border: `1px solid ${T.border}` }}
                >
                  <PenLine size={12} /> Compose
                </button>
              )}
              {statuses.googlecalendar === "connected" && (
                <button
                  onClick={() => setCreateEventOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ color: T.blue, background: T.blueLt, border: `1px solid rgba(37,99,235,0.18)` }}
                >
                  <Plus size={12} /> New Event
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {STATS_OVERVIEW.map(({ label, value, sub, accent, bar, barW }) => (
              <div key={label} className={`${CARD} rounded-2xl p-4`} style={{ borderColor: T.border }}>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.dim }}>{label}</div>
                <div className="text-2xl font-black tracking-tight mb-1" style={{ color: accent }}>{value}</div>
                <div className="text-[10px] mb-3" style={{ color: T.muted }}>{sub}</div>
                <div className="h-0.5 rounded-full overflow-hidden" style={{ background: T.accentLt }}>
                  <div className="h-full rounded-full opacity-60 transition-all duration-700" style={{ width: barW, background: bar }} />
                </div>
              </div>
            ))}
          </div>

          {/* Core integrations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={13} style={{ color: T.success }} />
              <span className="text-sm font-bold" style={{ color: T.pri }}>Core integrations</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.2)` }}>
                {connectedCount} / {integrations.length}
              </span>
              {loadingStatus && <Loader2 size={14} className="animate-spin" style={{ color: T.dim }} />}
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
                <Globe size={13} style={{ color: T.muted }} />
                <span className="text-sm font-bold" style={{ color: T.pri }}>More integrations</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}>
                  Coming soon
                </span>
              </div>
              <div className="relative">
                <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.dim }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="rounded-xl pl-8 pr-3 py-2 text-xs outline-none w-40"
                  style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.pri }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map(group => (
                <div key={group.category}>
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: group.color }}>
                    <group.icon size={10} /> {group.category}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(i => (
                      <div key={i.id} className={`${CARD} rounded-xl px-4 py-3 flex items-center justify-between group transition-all hover:shadow-sm`} style={{ borderColor: T.border }}>
                        <div>
                          <div className="text-xs font-semibold transition-colors" style={{ color: T.sec }}>{i.name}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: T.muted }}>{i.desc}</div>
                        </div>
                        <button className="text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ml-3 transition-colors hover:opacity-70" style={{ color: T.dim }}>
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
          <div className="relative rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="relative z-10 flex items-center gap-6 px-6 py-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: T.warnLt, border: `1px solid rgba(217,119,6,0.2)` }}>
                <Zap size={20} style={{ color: T.warn }} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: T.warn }}>AI Infrastructure</div>
                <div className="text-sm font-bold mb-1" style={{ color: T.pri }}>Corsair powers every integration</div>
                <div className="text-xs leading-relaxed max-w-xl" style={{ color: T.muted }}>
                  OAuth tokens are stored encrypted in your own database via the local Corsair server.
                  All API calls route through Corsair — no tokens ever leave your infrastructure.
                </div>
              </div>
              <a
                href="https://docs.corsair.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex-shrink-0 whitespace-nowrap hover:opacity-80"
                style={{ color: T.warn, background: T.warnLt, border: `1px solid rgba(217,119,6,0.2)` }}
              >
                View docs <ChevronRight size={12} />
              </a>
            </div>
          </div>

       </div>
      </main>

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
        <div className="h-screen w-screen flex items-center justify-center" style={{ background: "#fce7f3" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#e11d48" }} />
        </div>
      }
    >
      <IntegrationsInner />
    </Suspense>
  );
}