// app/integrations/page.tsx
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Plus, CheckCircle, RefreshCw, Zap, AlertTriangle,
  ExternalLink, Trash2, Eye, EyeOff, ChevronRight, Activity,
  Mail, Calendar, Globe, BarChart2, Cloud, Layers,
  Plug, ArrowRight, X, Loader2, ShieldCheck, Lock,
} from "lucide-react";

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
    detail: "arjun@example.co",
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
    detail: "arjun@example.co",
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
    detail: "Key: ••••••••••abc123",
    accent: "text-amber-400",
    accentHex: "#fbbf24",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.14)",
  },
];

const CONNECTED_STATS: Record<string, { synced: string; stats: { label: string; value: string }[] }> = {
  gmail: {
    synced: "Just now",
    stats: [
      { label: "Emails synced", value: "2,341" },
      { label: "Sent by AI",    value: "47"    },
      { label: "Drafts saved",  value: "12"    },
    ],
  },
  googlecalendar: {
    synced: "Just now",
    stats: [
      { label: "Events synced", value: "183" },
      { label: "Created by AI", value: "9"   },
      { label: "Invites sent",  value: "21"  },
    ],
  },
  corsair: {
    synced: "Live",
    stats: [
      { label: "AI tasks today", value: "12"    },
      { label: "Avg latency",    value: "320ms" },
      { label: "Uptime",         value: "99.9%" },
    ],
  },
};

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
const SURFACE = "bg-[#080c14]";
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
function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-sm font-semibold ${
        type === "success"
          ? "bg-teal-500/10 border-teal-500/25 text-teal-300"
          : "bg-red-500/10 border-red-500/25 text-red-300"
      }`}
    >
      {type === "success" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
        <X size={13} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Disconnect Modal
// ─────────────────────────────────────────────────────────
function DisconnectModal({
  item,
  onClose,
  onConfirm,
}: {
  item: Integration;
  onClose: () => void;
  onConfirm: () => void;
}) {
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
      <div
        className={`relative w-[380px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)] ${MODAL}`}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-700 hover:text-slate-300 transition-colors"
        >
          <X size={15} />
        </button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}
            >
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
            <button
              onClick={onClose}
              className={`flex-1 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-all`}
            >
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
}: {
  item: Integration;
  onDisconnect: (i: Integration) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const Icon      = item.icon;
  const extraData = CONNECTED_STATS[item.id];

  return (
    <div
      className={`rounded-2xl ${CARD} overflow-hidden hover:border-white/[0.12] transition-all`}
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.03), inset 0 0 70px ${item.glow}` }}
    >
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}44, transparent)` }}
      />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}
            >
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
        <div className={`flex items-center justify-between mb-4 ${INNER} rounded-xl px-3 py-2.5`}>
          <span className="text-xs text-slate-500 font-mono truncate">
            {item.id === "corsair" && !showKey ? "Key: ••••••••••abc123" : item.detail}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.id === "corsair" && (
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-slate-700 hover:text-slate-400 transition-colors"
              >
                {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            )}
            <span className="text-[10px] text-slate-700 flex items-center gap-1">
              <RefreshCw size={9} /> {extraData?.synced ?? "–"}
            </span>
          </div>
        </div>

        {/* Stats */}
        {extraData?.stats && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {extraData.stats.map(({ label, value }) => (
              <div key={label} className={`${INNER} rounded-xl px-2 py-2.5 text-center`}>
                <div className={`text-base font-black ${item.accent} leading-none mb-1`}>{value}</div>
                <div className="text-[9px] text-slate-700 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1.5 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] hover:text-slate-300 px-3 py-2 rounded-xl transition-all`}
          >
            <Activity size={11} /> Logs
          </button>
          <button
            className={`flex items-center gap-1.5 text-xs font-semibold text-slate-500 ${INNER} hover:bg-white/[0.06] hover:text-slate-300 px-3 py-2 rounded-xl transition-all`}
          >
            <ExternalLink size={11} /> Manage
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
function ConnectCard({
  item,
  onConnect,
}: {
  item: Integration;
  onConnect: (i: Integration) => void;
}) {
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
      <div
        className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}33, transparent)` }}
      />
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity`}
            >
              <Icon size={18} className={item.accent} />
            </div>
            <div>
              <div className="font-bold text-sm text-white/60 group-hover:text-white transition-colors">
                {item.name}
              </div>
              <div className="text-[10px] text-slate-700 mt-0.5">{item.category}</div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <p className="text-xs text-slate-700 leading-relaxed mb-4">{item.desc}</p>

        <div className={`flex items-center gap-2 mb-4 ${INNER} rounded-xl px-3 py-2.5`}>
          <ShieldCheck size={11} className="text-slate-700" />
          <span className="text-[10px] text-slate-700">Permissions: </span>
          <span className={`text-[10px] font-semibold ${item.accent} opacity-60`}>
            {SCOPE_LABELS[item.id]}
          </span>
        </div>

        <button
          onClick={() => onConnect(item)}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(245,158,11,0.18)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.35)]"
        >
          <Plug size={12} />
          Connect {item.name}
          <ArrowRight size={12} />
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
    <div
      className={`rounded-2xl ${CARD} overflow-hidden`}
      style={{ boxShadow: `inset 0 0 50px ${item.glow}` }}
    >
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accentHex}33, transparent)` }}
      />
      <div className="p-5 flex flex-col items-center justify-center min-h-[220px] gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}
        >
          <Icon size={20} className={item.accent} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={18} className="text-amber-400 animate-spin" />
          <div className="text-sm font-semibold text-white">Opening Google…</div>
          <div className="text-[11px] text-slate-600 text-center">
            Complete the sign-in in the new tab
          </div>
        </div>
        <div className={`flex items-center gap-1.5 ${INNER} rounded-xl px-3 py-2`}>
          <Lock size={10} className="text-slate-700" />
          <span className="text-[10px] text-slate-700">Secured via Corsair MCP</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Available Card
// ─────────────────────────────────────────────────────────
function AvailableCard({ name, desc }: { id: string; name: string; desc: string }) {
  const [connecting, setConnecting] = useState(false);
  const [done, setDone]             = useState(false);

  function handleConnect() {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDone(true);
    }, 1400);
  }

  return (
    <div
      className={`flex items-center gap-4 ${CARD} rounded-2xl px-4 py-3.5 hover:border-white/[0.12] transition-all group`}
    >
      <div
        className={`w-8 h-8 rounded-xl ${INNER} flex items-center justify-center flex-shrink-0`}
      >
        <Globe size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
          {name}
        </div>
        <div className="text-[10px] text-slate-700 truncate mt-0.5">{desc}</div>
      </div>
      {done ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-400 flex-shrink-0">
          <CheckCircle size={11} /> Added
        </span>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center gap-1.5 text-[11px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-black px-3 py-1.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(245,158,11,0.18)] flex-shrink-0"
        >
          {connecting ? (
            <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={11} /> Connect
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Inner page — uses useSearchParams so must be inside Suspense
// ─────────────────────────────────────────────────────────
function IntegrationsInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const [statuses, setStatuses] = useState<Record<string, Status>>({
    gmail:          "disconnected",
    googlecalendar: "disconnected",
    corsair:        "connected",
  });

  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(null);
  const [toast, setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // ── Load real statuses on mount ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/integrations/status");
        if (!res.ok) throw new Error("Status fetch failed");
        const data: StatusResponse = await res.json();
        setStatuses((prev) => ({
          ...prev,
          gmail:          data.gmail.connected          ? "connected" : "disconnected",
          googlecalendar: data.googlecalendar.connected ? "connected" : "disconnected",
        }));
      } catch (e) {
        console.error("Status check failed:", e);
      } finally {
        setLoadingStatus(false);
      }
    })();
  }, []);

  // ── Handle OAuth callback redirect params ─────────────────────────────────
  useEffect(() => {
    const connected = searchParams.get("connected");
    const error     = searchParams.get("error");
    const plugin    = searchParams.get("plugin");

    if (connected) {
      setStatuses((prev) => ({ ...prev, [connected]: "connected" }));
      const name = INTEGRATION_CONFIG.find((c) => c.id === connected)?.name ?? connected;
      setToast({ message: `${name} connected successfully!`, type: "success" });
      window.history.replaceState({}, "", "/integrations");
    }

    if (error) {
      const name =
        INTEGRATION_CONFIG.find((c) => c.id === plugin)?.name ?? plugin ?? "Integration";
      setToast({ message: `Failed to connect ${name}: ${error}`, type: "error" });
      window.history.replaceState({}, "", "/integrations");
    }
  }, [searchParams]);

  // ── Start OAuth flow ──────────────────────────────────────────────────────
  const handleConnect = useCallback(async (item: Integration) => {
    setStatuses((prev) => ({ ...prev, [item.id]: "connecting" }));
    try {
      const res = await fetch(`/api/integrations/connect?plugin=${item.id}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      const { authorizeUrl } = await res.json();

      // Open Google consent in a new tab
      window.open(authorizeUrl, "_blank", "noopener,noreferrer");

      // Poll until the OAuth window completes
      const poll = setInterval(async () => {
        try {
          const sr   = await fetch("/api/integrations/status");
          const sd: StatusResponse = await sr.json();
          const key  = item.id as "gmail" | "googlecalendar";
          if (sd[key]?.connected) {
            clearInterval(poll);
            setStatuses((prev) => ({ ...prev, [item.id]: "connected" }));
            setToast({ message: `${item.name} connected!`, type: "success" });
          }
        } catch {}
      }, 3000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(poll);
        setStatuses((prev) => {
          if (prev[item.id] === "connecting")
            return { ...prev, [item.id]: "disconnected" };
          return prev;
        });
      }, 5 * 60 * 1000);
    } catch (e: any) {
      setStatuses((prev) => ({ ...prev, [item.id]: "error" }));
      setToast({ message: e.message ?? "Connection failed", type: "error" });
    }
  }, []);

  // ── Disconnect ────────────────────────────────────────────────────────────
  const handleDisconnectConfirm = useCallback(() => {
    if (!disconnectTarget) return;
    setStatuses((prev) => ({ ...prev, [disconnectTarget.id]: "disconnected" }));
    setToast({ message: `${disconnectTarget.name} disconnected`, type: "success" });
    setDisconnectTarget(null);
  }, [disconnectTarget]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const integrations: Integration[] = INTEGRATION_CONFIG.map((cfg) => ({
    ...cfg,
    status: statuses[cfg.id] ?? "disconnected",
  }));

  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  const filtered = AVAILABLE_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  const STATS_OVERVIEW = [
    {
      label: "Connected",
      value: String(connectedCount),
      sub:   "integrations active",
      accent: "text-teal-400",
      bar:    "bg-teal-400",
      barW:   `${Math.round((connectedCount / 3) * 100)}%`,
    },
    { label: "Events processed", value: "2.5k",  sub: "this month",      accent: "text-amber-400",  bar: "bg-amber-400",  barW: "75%" },
    { label: "AI actions",       value: "59",    sub: "sent or created", accent: "text-violet-400", bar: "bg-violet-400", barW: "45%" },
    { label: "Uptime",           value: "99.9%", sub: "last 30 days",    accent: "text-emerald-400",bar: "bg-emerald-400",barW: "99%" },
  ];

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#020508] relative">
      <style>{`
        @keyframes float-a  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line{ 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.0025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.0025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-amber-500/[0.04] blur-[180px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-[550px] h-[550px] rounded-full bg-teal-500/[0.03] blur-[160px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }}
      />
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.05] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }}
      />

      <div className="relative z-10 flex w-full h-full">

        {/* ── Sidebar ── */}
        <aside
          className={`w-[220px] flex-shrink-0 border-r border-white/[0.05] ${SURFACE} flex flex-col py-6 px-4 gap-1`}
        >
          <div className="flex items-center gap-2 px-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.4)]">
              <Zap size={14} className="text-black" />
            </div>
            <span className="font-black text-sm text-white tracking-tight">SuperPower</span>
          </div>
          {[
            { icon: Mail,      label: "Inbox"                       },
            { icon: Calendar,  label: "Calendar"                    },
            { icon: Plug,      label: "Integrations", active: true  },
            { icon: BarChart2, label: "Analytics"                   },
            { icon: Globe,     label: "Settings"                    },
          ].map(({ icon: SIcon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-600 hover:text-slate-300 hover:bg-white/[0.03]"
              }`}
            >
              <SIcon size={14} />
              {label}
            </div>
          ))}
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/70 flex items-center gap-1.5 mb-2">
                  <span>✦</span> Integrations
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Connected apps</h1>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  Manage everything SuperPower can access on your behalf.
                </p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(245,158,11,0.28)] transition-all">
                <Plus size={13} /> Add integration
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {STATS_OVERVIEW.map(({ label, value, sub, accent, bar, barW }) => (
                <div key={label} className={`${CARD} rounded-2xl p-4`}>
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-700 mb-3">
                    {label}
                  </div>
                  <div className={`text-2xl font-black tracking-tight mb-1 ${accent}`}>{value}</div>
                  <div className="text-[10px] text-slate-700 mb-3">{sub}</div>
                  <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bar} opacity-50 transition-all duration-700`}
                      style={{ width: barW }}
                    />
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
                {loadingStatus && (
                  <Loader2 size={11} className="text-slate-600 animate-spin" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {integrations.map((item) => {
                  if (item.status === "connected")
                    return (
                      <ConnectedCard key={item.id} item={item} onDisconnect={setDisconnectTarget} />
                    );
                  if (item.status === "connecting")
                    return <ConnectingCard key={item.id} item={item} />;
                  return (
                    <ConnectCard key={item.id} item={item} onConnect={handleConnect} />
                  );
                })}
              </div>
            </div>

            {/* Corsair banner */}
            <div
              className="relative rounded-2xl overflow-hidden border border-amber-500/[0.12]"
              style={{
                background:  "linear-gradient(135deg, #0f0800 0%, #080500 100%)",
                boxShadow:   "0 4px 40px rgba(0,0,0,0.6), inset 0 0 80px rgba(245,158,11,0.04)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 18% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)" }}
              />
              <div className="relative z-10 flex items-center gap-6 px-6 py-5">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-500/60 mb-1">
                    AI Infrastructure
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Corsair MCP is the backbone</div>
                  <div className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    All integrations route through Corsair&apos;s Model Context Protocol, giving your AI agent
                    a unified, secure interface to every connected app. No extra auth flows once it&apos;s set up.
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

            {/* Available integrations */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-slate-700" />
                  <span className="text-sm font-bold text-white">Available integrations</span>
                  <span className="text-[10px] bg-white/[0.04] text-slate-600 border border-white/[0.07] font-bold px-2 py-0.5 rounded-full">
                    {AVAILABLE_GROUPS.reduce((a, g) => a + g.items.length, 0)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 ${INNER} hover:border-amber-500/20 rounded-xl px-3 py-2 w-56 transition-colors`}
                >
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
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                          {category}
                        </span>
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

      {/* Disconnect modal */}
      {disconnectTarget && (
        <DisconnectModal
          item={disconnectTarget}
          onClose={() => setDisconnectTarget(null)}
          onConfirm={handleDisconnectConfirm}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
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