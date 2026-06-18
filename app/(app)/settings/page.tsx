"use client";
import { useState, useEffect, useCallback } from "react";
import {
  User, Link2, Bot, Bell, Keyboard, Shield, ChevronRight,
  CheckCircle, Plus, Zap, Mail, Calendar, Trash2,
  AlertTriangle, Sparkles, Eye, EyeOff, Loader2, X,
  RefreshCw, Plug, Lock,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:        "#fce7f3",
  surface:   "#fff5f8",
  border:    "rgba(225,29,72,0.10)",
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

const SETTINGS_NAV = [
  { icon: User,      id: "profile",       label: "Profile"       },
  { icon: Link2,     id: "integrations",  label: "Integrations"  },
  { icon: Bot,       id: "ai",            label: "AI Agent"      },
  { icon: Bell,      id: "notifications", label: "Notifications" },
  { icon: Keyboard,  id: "shortcuts",     label: "Shortcuts"     },
  { icon: Shield,    id: "security",      label: "Security"      },
];

const SHORTCUTS = [
  { action: "Compose new email",  keys: ["C"]           },
  { action: "Reply",              keys: ["R"]           },
  { action: "Reply all",          keys: ["A"]           },
  { action: "Forward",            keys: ["F"]           },
  { action: "Archive",            keys: ["E"]           },
  { action: "Delete",             keys: ["#"]           },
  { action: "Search",             keys: ["/"]           },
  { action: "Open AI agent",      keys: ["⌘", "K"]      },
  { action: "Go to Calendar",     keys: ["G", "C"]      },
  { action: "Mark as read",       keys: ["Shift", "I"]  },
];

type Section = "profile" | "integrations" | "ai" | "notifications" | "shortcuts" | "security";

// ── Primitives ────────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border rounded-2xl p-5 ${className}`} style={{ borderColor: T.border }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: T.dim }}>{children}</div>;
}

function Toggle({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0"
      style={{ background: on ? T.accent : T.accentLt }}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SectionHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5 mb-2" style={{ color: T.accent }}>
        <span>✦</span> {title}
      </div>
      <p className="text-xs font-medium" style={{ color: T.sec }}>{sub}</p>
    </div>
  );
}

function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  const ok = type === "success";
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold"
      style={{
        background: ok ? T.successLt : T.dangerLt,
        border: `1px solid ${ok ? "rgba(13,148,136,0.25)" : "rgba(220,38,38,0.22)"}`,
        color: ok ? T.success : T.danger,
      }}
    >
      {ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-50 hover:opacity-100 transition-opacity"><X size={13} /></button>
    </div>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────
function ProfileSection({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const { data: session, isPending, refetch } = authClient.useSession() as any;

  const splitName = (name: string) => {
    const parts = (name ?? "").trim().split(" ");
    return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
  };

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      const { first, last } = splitName(session.user.name);
      setFirstName(first);
      setLastName(last);
    }
  }, [session?.user?.name]);

  const email    = session?.user?.email ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || email.split("@")[0] || "ME";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "ME";

  const handleSave = async () => {
    setSaving(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const result = await authClient.updateUser({ name });
      if ((result as any).error) throw new Error((result as any).error.message ?? "Failed to save");
      if (typeof refetch === "function") refetch();
      onToast("Profile saved successfully!", "success");
    } catch (err: any) {
      onToast(err.message ?? "Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin" style={{ color: T.accent }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeading title="Profile" sub="Manage your account information." />
      <Card>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold"
              style={{ background: T.gradient, boxShadow: "0 4px 18px rgba(225,29,72,0.30)" }}
            >
              {initials}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: T.pri }}>{fullName}</div>
            <div className="text-xs mb-2" style={{ color: T.muted }}>{email}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            ["First name", firstName, setFirstName] as const,
            ["Last name",  lastName,  setLastName]  as const,
          ]).map(([label, value, setter]) => (
            <div key={label}>
              <label className="text-[10px] font-bold mb-1.5 block" style={{ color: T.muted }}>{label}</label>
              <input
                value={value}
                onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.pri }}
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-bold mb-1.5 block" style={{ color: T.muted }}>Email</label>
            <input
              value={email}
              readOnly
              className="w-full rounded-xl px-3 py-2.5 text-xs outline-none"
              style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted, cursor: "default" }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1.5 block" style={{ color: T.muted }}>Time zone</label>
            <div
              className="rounded-xl px-3 py-2.5 text-xs flex items-center justify-between"
              style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.sec }}
            >
              <span>Asia/Kolkata (UTC +5:30)</span>
              <ChevronRight size={12} style={{ color: T.dim }} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-60"
            style={{ background: T.gradient, boxShadow: "0 4px 14px rgba(225,29,72,0.25)" }}
          >
            {saving && <Loader2 size={12} className="animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            onClick={() => {
              if (session?.user?.name) {
                const { first, last } = splitName(session.user.name);
                setFirstName(first);
                setLastName(last);
              }
            }}
            className="text-xs font-semibold px-6 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── Integrations Section ──────────────────────────────────────────────────────
type IntStatus = "connected" | "disconnected" | "connecting";

const INT_CONFIG = [
  {
    id: "gmail" as const,
    name: "Gmail",
    icon: Mail,
    accent: T.accent,
    bg: "rgba(225,29,72,0.06)",
    border: "rgba(225,29,72,0.16)",
  },
  {
    id: "googlecalendar" as const,
    name: "Google Calendar",
    icon: Calendar,
    accent: T.blue,
    bg: "rgba(37,99,235,0.06)",
    border: "rgba(37,99,235,0.16)",
  },
];

function IntegrationsSection({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const [statuses, setStatuses] = useState<Record<string, IntStatus>>({
    gmail: "disconnected",
    googlecalendar: "disconnected",
  });
  const [loading,       setLoading]       = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/integrations/status");
      if (!res.ok) return;
      const data = await res.json();
      setStatuses({
        gmail:          data.gmail.connected          ? "connected" : "disconnected",
        googlecalendar: data.googlecalendar.connected ? "connected" : "disconnected",
      });
    } catch {
      // keep previous state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleConnect = useCallback(async (id: string, name: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "connecting" }));
    try {
      const res = await fetch(`/api/integrations/connect?plugin=${id}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      const { authorizeUrl } = await res.json();
      window.open(authorizeUrl, "_blank", "noopener,noreferrer");

      // Poll until connected or 5 min timeout
      const poll = setInterval(async () => {
        try {
          const sr = await fetch("/api/integrations/status");
          const sd = await sr.json();
          const connected = id === "gmail" ? sd.gmail?.connected : sd.googlecalendar?.connected;
          if (connected) {
            clearInterval(poll);
            setStatuses((prev) => ({ ...prev, [id]: "connected" }));
            onToast(`${name} connected successfully!`, "success");
          }
        } catch {}
      }, 3000);

      setTimeout(() => {
        clearInterval(poll);
        setStatuses((prev) =>
          prev[id] === "connecting" ? { ...prev, [id]: "disconnected" } : prev
        );
      }, 5 * 60 * 1000);
    } catch (e: any) {
      setStatuses((prev) => ({ ...prev, [id]: "disconnected" }));
      onToast(e.message ?? "Connection failed", "error");
    }
  }, [onToast]);

  const handleDisconnect = useCallback(async (id: string, name: string) => {
    setDisconnecting(id);
    try {
      const res = await fetch("/api/integrations/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plugin: id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      setStatuses((prev) => ({ ...prev, [id]: "disconnected" }));
      onToast(`${name} disconnected`, "success");
    } catch (e: any) {
      onToast(e.message ?? "Failed to disconnect", "error");
    } finally {
      setDisconnecting(null);
    }
  }, [onToast]);

  return (
    <div className="space-y-5">
      <SectionHeading title="Integrations" sub="Connect your apps via Corsair to power the AI agent." />

      <div className="space-y-3">
        {INT_CONFIG.map((cfg) => {
          const status = statuses[cfg.id];
          const isConnecting   = status === "connecting";
          const isConnected    = status === "connected";
          const isDisconnecting = disconnecting === cfg.id;

          return (
            <div key={cfg.id} className="bg-white border rounded-2xl p-4 flex items-center gap-4" style={{ borderColor: T.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: cfg.bg, borderColor: cfg.border }}>
                <cfg.icon size={16} style={{ color: cfg.accent }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold" style={{ color: T.pri }}>{cfg.name}</span>
                  {isConnected && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                      style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.2)` }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.success }} /> Connected
                    </span>
                  )}
                  {isConnecting && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                      style={{ background: T.warnLt, color: T.warn, border: `1px solid rgba(217,119,6,0.2)` }}>
                      <Loader2 size={9} className="animate-spin" /> Connecting…
                    </span>
                  )}
                </div>
                <div className="text-[11px]" style={{ color: T.muted }}>
                  {isConnected ? "Connected via OAuth" : isConnecting ? "Complete sign-in in the new tab" : `Connect to use ${cfg.name}`}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(cfg.id, cfg.name)}
                    disabled={isDisconnecting}
                    className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.18)` }}
                  >
                    {isDisconnecting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    {isDisconnecting ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : isConnecting ? (
                  <button
                    disabled
                    className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium opacity-50"
                    style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}
                  >
                    <Loader2 size={11} className="animate-spin" /> Waiting…
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(cfg.id, cfg.name)}
                    className="flex items-center gap-1.5 text-[11px] text-white px-4 py-2 rounded-lg font-bold transition-all"
                    style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.2)" }}
                  >
                    <Plug size={11} /> Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs" style={{ color: T.dim }}>
          <RefreshCw size={11} className="animate-spin" /> Checking connection status…
        </div>
      )}

      <Card>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: T.warnLt, border: `1px solid rgba(217,119,6,0.2)` }}>
            <Zap size={14} style={{ color: T.warn }} />
          </div>
          <div>
            <div className="text-xs font-bold mb-1" style={{ color: T.warn }}>Corsair MCP Active</div>
            <div className="text-[11px] leading-relaxed" style={{ color: T.muted }}>
              Your AI agent has access to Gmail and Google Calendar via Corsair. OAuth tokens are stored encrypted in your own database — no tokens leave your infrastructure.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── AI Section ────────────────────────────────────────────────────────────────
const MODELS = [
  { name: "Claude Opus 4.8",  badge: "Most capable" },
  { name: "Claude Sonnet 4.6", badge: "Balanced"    },
  { name: "Claude Haiku 4.5",  badge: "Fastest"     },
];

function AISection({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const [model,  setModel]  = useState("Claude Opus 4.8");
  const [style,  setStyle]  = useState("Balanced");
  const [memory, setMemory] = useState(true);
  const [perms, setPerms] = useState({
    sendEmails:     true,
    editCalendar:   true,
    readContacts:   true,
    archiveDelete:  false,
    attachments:    false,
  });

  const togglePerm = (key: keyof typeof perms) =>
    setPerms((p) => ({ ...p, [key]: !p[key] }));

  const PERM_LIST = [
    { key: "sendEmails"    as const, l: "Send emails on my behalf",      desc: "Agent can send emails without additional approval"  },
    { key: "editCalendar"  as const, l: "Create & edit calendar events", desc: "Agent can schedule meetings and send invites"        },
    { key: "readContacts"  as const, l: "Read contacts",                 desc: "Agent can look up names and emails"                  },
    { key: "archiveDelete" as const, l: "Archive & delete emails",       desc: "Require confirmation before archiving or deleting"   },
    { key: "attachments"   as const, l: "Access email attachments",      desc: "Allow agent to read and summarise attachments"       },
  ];

  return (
    <div className="space-y-5">
      <SectionHeading title="AI Agent" sub="Configure how your AI assistant behaves." />

      <Card>
        <SectionLabel>Model</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {MODELS.map(({ name, badge }) => {
            const sel = model === name;
            return (
              <button
                key={name}
                onClick={() => { setModel(name); onToast(`Switched to ${name}`, "success"); }}
                className="p-3 rounded-xl border text-left transition-all"
                style={sel
                  ? { background: T.accentLt, borderColor: "rgba(225,29,72,0.25)" }
                  : { background: T.surface, borderColor: T.border }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: sel ? T.accent : T.sec }}>{name}</span>
                  {sel && <CheckCircle size={11} style={{ color: T.accent }} />}
                </div>
                <span className="text-[10px] font-medium" style={{ color: sel ? T.accent : T.muted }}>{badge}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionLabel>Permissions</SectionLabel>
        <div className="space-y-4">
          {PERM_LIST.map(({ key, l, desc }) => (
            <div key={key} className="flex items-start gap-4">
              <Toggle on={perms[key]} onClick={() => togglePerm(key)} />
              <div className="min-w-0">
                <div className="text-xs font-semibold" style={{ color: T.sec }}>{l}</div>
                <div className="text-[11px]" style={{ color: T.muted }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold flex items-center gap-2" style={{ color: T.pri }}>
            <Sparkles size={13} style={{ color: T.accent }} /> Agent Memory
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>Remember context across conversations</div>
        </div>
        <Toggle on={memory} onClick={() => setMemory((m) => !m)} />
      </Card>
    </div>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────
type NotifKey =
  | "newEmail" | "importantEmails" | "aiSuggestions"
  | "eventReminders" | "inviteReceived" | "eventChanges"
  | "actionCompleted" | "needsApproval" | "weeklySummary";

function NotificationsSection() {
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    newEmail:        false,
    importantEmails: true,
    aiSuggestions:   true,
    eventReminders:  true,
    inviteReceived:  true,
    eventChanges:    true,
    actionCompleted: true,
    needsApproval:   true,
    weeklySummary:   false,
  });

  const toggle = (key: NotifKey) => setNotifs((n) => ({ ...n, [key]: !n[key] }));

  const GROUPS: { category: string; items: { key: NotifKey; l: string; desc: string }[] }[] = [
    { category: "Email", items: [
      { key: "newEmail",        l: "New email in inbox",   desc: "Get notified for every new email"         },
      { key: "importantEmails", l: "Important emails",     desc: "Only flagged or high-priority emails"     },
      { key: "aiSuggestions",   l: "AI reply suggestions", desc: "When AI drafts a reply for you"           },
    ]},
    { category: "Calendar", items: [
      { key: "eventReminders",  l: "Event reminders",      desc: "15 min before an event"                   },
      { key: "inviteReceived",  l: "Invite received",      desc: "When someone invites you to a meeting"    },
      { key: "eventChanges",    l: "Event changes",        desc: "When an event is updated or cancelled"    },
    ]},
    { category: "AI Agent", items: [
      { key: "actionCompleted", l: "Action completed",     desc: "Email sent or event created by agent"     },
      { key: "needsApproval",   l: "Needs your approval",  desc: "When agent wants to take a risky action"  },
      { key: "weeklySummary",   l: "Weekly summary",       desc: "What your agent did this week"            },
    ]},
  ];

  return (
    <div className="space-y-5">
      <SectionHeading title="Notifications" sub="Choose what you want to be notified about." />
      {GROUPS.map(({ category, items }) => (
        <Card key={category}>
          <SectionLabel>{category}</SectionLabel>
          <div className="space-y-4">
            {items.map(({ key, l, desc }) => (
              <div key={key} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: T.sec }}>{l}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>{desc}</div>
                </div>
                <Toggle on={notifs[key]} onClick={() => toggle(key)} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Shortcuts Section ─────────────────────────────────────────────────────────
function ShortcutsSection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="Shortcuts" sub="Speed up your workflow with keyboard shortcuts." />
      <Card className="!p-0 overflow-hidden">
        {SHORTCUTS.map(({ action, keys }, i) => (
          <div
            key={action}
            className="flex items-center justify-between px-5 py-3"
            style={i !== SHORTCUTS.length - 1 ? { borderBottom: `1px solid ${T.border}` } : undefined}
          >
            <span className="text-xs" style={{ color: T.sec }}>{action}</span>
            <div className="flex gap-1">
              {keys.map((k) => (
                <kbd
                  key={k}
                  className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
                  style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Security Section ──────────────────────────────────────────────────────────
function SecuritySection({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const [revoking, setRevoking] = useState<string | null>(null);
  const [sessions] = useState([
    { id: "s1", device: "MacBook Pro · Chrome", loc: "Mumbai, IN", time: "Now",    current: true  },
    { id: "s2", device: "iPhone 15 · Safari",   loc: "Mumbai, IN", time: "2h ago", current: false },
  ]);
  const [activeSessions, setActiveSessions] = useState(sessions);

  const handleRevoke = async (id: string, device: string) => {
    setRevoking(id);
    await new Promise((r) => setTimeout(r, 800)); // placeholder for real revoke API
    setActiveSessions((prev) => prev.filter((s) => s.id !== id));
    onToast(`Session revoked: ${device}`, "success");
    setRevoking(null);
  };

  return (
    <div className="space-y-5">
      <SectionHeading title="Security" sub="Manage your account security and privacy." />

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold" style={{ color: T.pri }}>Password</div>
          <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>Last changed 3 months ago</div>
        </div>
        <button
          onClick={() => onToast("Password change email sent!", "success")}
          className="text-xs font-bold px-4 py-2 rounded-xl transition-colors hover:opacity-80"
          style={{ color: T.accent, background: T.accentLt, border: `1px solid ${T.border}` }}
        >
          Change
        </button>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold flex items-center gap-2" style={{ color: T.pri }}>
            Two-factor authentication
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.2)` }}>Enabled</span>
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>Authenticator app · ••• •••• 4521</div>
        </div>
        <button
          className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}
        >
          Manage
        </button>
      </Card>

      <Card>
        <SectionLabel>Active Sessions</SectionLabel>
        {activeSessions.map(({ id, device, loc, time, current }, i, arr) => (
          <div
            key={id}
            className="flex items-center justify-between py-2.5"
            style={i !== arr.length - 1 ? { borderBottom: `1px solid ${T.border}` } : undefined}
          >
            <div>
              <div className="text-xs font-semibold flex items-center gap-2" style={{ color: T.sec }}>
                {device}
                {current && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: T.success, background: T.successLt, border: `1px solid rgba(13,148,136,0.2)` }}>
                    This device
                  </span>
                )}
              </div>
              <div className="text-[10px]" style={{ color: T.dim }}>{loc} · {time}</div>
            </div>
            {!current && (
              <button
                onClick={() => handleRevoke(id, device)}
                disabled={revoking === id}
                className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80 disabled:opacity-50"
                style={{ color: T.danger }}
              >
                {revoking === id && <Loader2 size={10} className="animate-spin" />}
                Revoke
              </button>
            )}
          </div>
        ))}
      </Card>

      <div className="rounded-2xl p-5" style={{ background: T.dangerLt, border: `1px solid rgba(220,38,38,0.16)` }}>
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={14} style={{ color: T.danger }} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold" style={{ color: T.danger }}>Danger Zone</div>
            <div className="text-[11px]" style={{ color: T.danger, opacity: 0.7 }}>These actions cannot be undone.</div>
          </div>
        </div>
        <button
          onClick={() => onToast("Please contact support to delete your account.", "error")}
          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-80"
          style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}
        >
          <Trash2 size={11} /> Delete account
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const sectionMap: Record<Section, React.ReactNode> = {
    profile:       <ProfileSection       onToast={showToast} />,
    integrations:  <IntegrationsSection  onToast={showToast} />,
    ai:            <AISection            onToast={showToast} />,
    notifications: <NotificationsSection />,
    shortcuts:     <ShortcutsSection />,
    security:      <SecuritySection      onToast={showToast} />,
  };

  return (
    <div className="h-screen flex-1 overflow-hidden flex" style={{ background: T.bg }}>
      {/* Settings nav */}
      <aside className="w-52 flex-shrink-0 flex flex-col py-6 px-3" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-3" style={{ color: T.dim }}>Settings</div>
        <nav className="space-y-0.5">
          {SETTINGS_NAV.map(({ icon: Icon, id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id as Section)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active === id
                ? { background: T.accentLt, color: T.accent }
                : { color: T.muted, background: "transparent" }}
            >
              <Icon size={14} style={{ color: active === id ? T.accent : T.muted }} />
              {label}
              {active === id && <ChevronRight size={12} className="ml-auto" style={{ color: T.accent, opacity: 0.6 }} />}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3">
          <div className="text-[10px] leading-relaxed" style={{ color: T.dim }}>
            SuperPower v0.1.0<br />
            Powered by Corsair MCP
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          {sectionMap[active]}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}
