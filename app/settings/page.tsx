"use client";
import { useState } from "react";
import {
  User, Link2, Bot, Bell, Keyboard, Shield, ChevronRight,
  CheckCircle, Plus, Zap, Mail, Calendar, Globe, Trash2,
  AlertTriangle, Sparkles, Eye, EyeOff,
} from "lucide-react";
import Sidebar from "../components/sidebar";

// ─── Design tokens — shared with dashboard/integrations pages ────────────────
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
];

const INTEGRATIONS = [
  { id: "gmail",   name: "Gmail",           icon: Mail,     status: "connected",    detail: "arjun@example.co",          synced: "2 min ago", accent: T.accent, bg: "rgba(225,29,72,0.06)", border: "rgba(225,29,72,0.16)" },
  { id: "gcal",    name: "Google Calendar", icon: Calendar, status: "connected",    detail: "arjun@example.co",          synced: "5 min ago", accent: T.blue,   bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.16)" },
  { id: "corsair", name: "Corsair MCP",     icon: Zap,      status: "connected",    detail: "API key: ••••••••••abc123", synced: "Active",    accent: T.warn,   bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.18)" },
  { id: "notion",  name: "Notion",          icon: Globe,    status: "disconnected", detail: "Connect to sync notes",     synced: null,        accent: T.muted,  bg: T.surface,               border: T.border               },
  { id: "slack",   name: "Slack",           icon: Globe,    status: "disconnected", detail: "Connect to share updates",  synced: null,        accent: T.muted,  bg: T.surface,               border: T.border               },
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

// ── Shared primitives ────────────────────────────────────────────────────────
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

function Toggle({ on }: { on: boolean }) {
  return (
    <div className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0" style={{ background: on ? T.accent : T.accentLt }}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </div>
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

// ── Sections ─────────────────────────────────────────────────────────────────
function ProfileSection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="Profile" sub="Manage your account information." />
      <Card>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold" style={{ background: T.gradient, boxShadow: "0 4px 18px rgba(225,29,72,0.30)" }}>AM</div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border rounded-full flex items-center justify-center transition-colors hover:opacity-80" style={{ borderColor: T.border, color: T.muted }}>
              <Plus size={11} />
            </button>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: T.pri }}>Arjun Mehta</div>
            <div className="text-xs mb-2" style={{ color: T.muted }}>arjun@example.co</div>
            <button className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors hover:opacity-80" style={{ color: T.accent, background: T.accentLt, border: `1px solid ${T.border}` }}>Change photo</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["First name", "Arjun"], ["Last name", "Mehta"], ["Email", "arjun@example.co"], ["Role", "Product Manager"]].map(([l, v]) => (
            <div key={l}>
              <label className="text-[10px] font-bold mb-1.5 block" style={{ color: T.muted }}>{l}</label>
              <input defaultValue={v}
                className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.pri }} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-[10px] font-bold mb-1.5 block" style={{ color: T.muted }}>Time zone</label>
          <div className="rounded-xl px-3 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors hover:opacity-80"
            style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.sec }}>
            <span>Asia/Kolkata (UTC +5:30)</span>
            <ChevronRight size={12} style={{ color: T.dim }} />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all" style={{ background: T.gradient, boxShadow: "0 4px 14px rgba(225,29,72,0.25)" }}>Save changes</button>
          <button className="text-xs font-semibold px-6 py-2.5 rounded-xl transition-all hover:opacity-80" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>Cancel</button>
        </div>
      </Card>
    </div>
  );
}

function IntegrationsSection() {
  const [showKey, setShowKey] = useState(false);
  return (
    <div className="space-y-5">
      <SectionHeading title="Integrations" sub="Connect your apps via Corsair to power the AI agent." />
      <div className="space-y-3">
        {INTEGRATIONS.map((i) => (
          <div key={i.id} className="bg-white border rounded-2xl p-4 flex items-center gap-4" style={{ borderColor: T.border }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: i.bg, borderColor: i.border }}>
              <i.icon size={16} style={{ color: i.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold" style={{ color: T.pri }}>{i.name}</span>
                {i.status === "connected" && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.2)` }}>Connected</span>
                )}
              </div>
              <div className="text-[11px]" style={{ color: T.muted }}>{i.detail}</div>
              {i.synced && <div className="text-[10px] mt-0.5" style={{ color: T.dim }}>Synced: {i.synced}</div>}
            </div>
            {i.status === "connected" ? (
              <div className="flex gap-2 flex-shrink-0">
                {i.id === "corsair" && (
                  <button onClick={() => setShowKey(!showKey)}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-80" style={{ color: T.muted }}>
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                )}
                <button className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>Manage</button>
                <button className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80" style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.18)` }}>Disconnect</button>
              </div>
            ) : (
              <button className="flex items-center gap-1.5 text-[11px] text-white px-4 py-2 rounded-lg font-bold transition-all flex-shrink-0" style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.2)" }}>
                <Plus size={12} /> Connect
              </button>
            )}
          </div>
        ))}
      </div>
      <Card>
        <div className="flex items-start gap-3">
          <Zap size={15} style={{ color: T.warn }} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold mb-1" style={{ color: T.warn }}>Corsair MCP Active</div>
            <div className="text-[11px] leading-relaxed" style={{ color: T.muted }}>Your AI agent has full access to Gmail and Google Calendar via Corsair. It can send emails, create events, and check availability on your behalf.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AISection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="AI Agent" sub="Configure how your AI assistant behaves." />

      <Card>
        <SectionLabel>Model</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Claude Sonnet 4.6", badge: "Active",       sel: true  },
            { name: "Claude Opus 4.8",   badge: "More capable", sel: false },
            { name: "Claude Haiku 4.5",  badge: "Faster",       sel: false },
            { name: "Custom",            badge: "Configure",    sel: false },
          ].map(({ name, badge, sel }) => (
            <div key={name} className="p-3 rounded-xl border cursor-pointer transition-all"
              style={sel
                ? { background: T.accentLt, borderColor: "rgba(225,29,72,0.25)" }
                : { background: T.surface, borderColor: T.border }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: sel ? T.accent : T.sec }}>{name}</span>
                {sel && <CheckCircle size={11} style={{ color: T.accent }} />}
              </div>
              <span className="text-[10px] font-medium" style={{ color: sel ? T.accent : T.muted }}>{badge}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Permissions</SectionLabel>
        <div className="space-y-4">
          {[
            { l: "Send emails on my behalf",      on: true,  desc: "Agent can send emails without additional approval"  },
            { l: "Create & edit calendar events", on: true,  desc: "Agent can schedule meetings and send invites"        },
            { l: "Read contacts",                 on: true,  desc: "Agent can look up names and emails"                  },
            { l: "Archive & delete emails",       on: false, desc: "Require confirmation before archiving or deleting"   },
            { l: "Access email attachments",      on: false, desc: "Allow agent to read and summarise attachments"       },
          ].map(({ l, on, desc }) => (
            <div key={l} className="flex items-start gap-4">
              <Toggle on={on} />
              <div className="min-w-0">
                <div className="text-xs font-semibold" style={{ color: T.sec }}>{l}</div>
                <div className="text-[11px]" style={{ color: T.muted }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Response Style</SectionLabel>
        <div className="flex gap-2">
          {["Concise", "Balanced", "Detailed"].map((s, i) => (
            <button key={s} className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border"
              style={i === 1
                ? { background: T.gradient, color: "#fff", borderColor: "transparent", boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }
                : { background: T.surface, color: T.muted, borderColor: T.border }}>
              {s}
            </button>
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
        <Toggle on />
      </Card>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="Notifications" sub="Choose what you want to be notified about." />
      {[
        { category: "Email", items: [
          { l: "New email in inbox",   desc: "Get notified for every new email",      on: false },
          { l: "Important emails",     desc: "Only flagged or high-priority emails",   on: true  },
          { l: "AI reply suggestions", desc: "When AI drafts a reply for you",         on: true  },
        ]},
        { category: "Calendar", items: [
          { l: "Event reminders",      desc: "15 min before an event",                on: true  },
          { l: "Invite received",      desc: "When someone invites you to a meeting",  on: true  },
          { l: "Event changes",        desc: "When an event is updated or cancelled",  on: true  },
        ]},
        { category: "AI Agent", items: [
          { l: "Action completed",     desc: "Email sent or event created by agent",   on: true  },
          { l: "Needs your approval",  desc: "When agent wants to take a risky action",on: true  },
          { l: "Weekly summary",       desc: "What your agent did this week",          on: false },
        ]},
      ].map(({ category, items }) => (
        <Card key={category}>
          <SectionLabel>{category}</SectionLabel>
          <div className="space-y-4">
            {items.map(({ l, desc, on }) => (
              <div key={l} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: T.sec }}>{l}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>{desc}</div>
                </div>
                <Toggle on={on} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ShortcutsSection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="Shortcuts" sub="Speed up your workflow with keyboard shortcuts." />
      <Card className="!p-0 overflow-hidden">
        {SHORTCUTS.map(({ action, keys }, i) => (
          <div key={action} className="flex items-center justify-between px-5 py-3" style={i !== SHORTCUTS.length - 1 ? { borderBottom: `1px solid ${T.border}` } : undefined}>
            <span className="text-xs" style={{ color: T.sec }}>{action}</span>
            <div className="flex gap-1">
              {keys.map((k) => (
                <kbd key={k} className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>{k}</kbd>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-5">
      <SectionHeading title="Security" sub="Manage your account security and privacy." />

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold" style={{ color: T.pri }}>Password</div>
          <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>Last changed 3 months ago</div>
        </div>
        <button className="text-xs font-bold px-4 py-2 rounded-xl transition-colors hover:opacity-80" style={{ color: T.accent, background: T.accentLt, border: `1px solid ${T.border}` }}>Change</button>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold flex items-center gap-2" style={{ color: T.pri }}>
            Two-factor authentication
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: T.successLt, color: T.success, border: `1px solid rgba(13,148,136,0.2)` }}>Enabled</span>
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>Authenticator app · ••• •••• 4521</div>
        </div>
        <button className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>Manage</button>
      </Card>

      <Card>
        <SectionLabel>Active Sessions</SectionLabel>
        {[
          { device: "MacBook Pro · Chrome", loc: "Mumbai, IN", time: "Now",    current: true  },
          { device: "iPhone 15 · Safari",   loc: "Mumbai, IN", time: "2h ago", current: false },
        ].map(({ device, loc, time, current }, i, arr) => (
          <div key={device} className="flex items-center justify-between py-2.5" style={i !== arr.length - 1 ? { borderBottom: `1px solid ${T.border}` } : undefined}>
            <div>
              <div className="text-xs font-semibold flex items-center gap-2" style={{ color: T.sec }}>
                {device}
                {current && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: T.success, background: T.successLt, border: `1px solid rgba(13,148,136,0.2)` }}>This device</span>}
              </div>
              <div className="text-[10px]" style={{ color: T.dim }}>{loc} · {time}</div>
            </div>
            {!current && <button className="text-[11px] font-semibold transition-colors hover:opacity-80" style={{ color: T.danger }}>Revoke</button>}
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
        <button className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-80" style={{ color: T.danger, background: T.dangerLt, border: `1px solid rgba(220,38,38,0.2)` }}>
          <Trash2 size={11} /> Delete account
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  const sectionMap: Record<Section, React.ReactNode> = {
    profile:       <ProfileSection />,
    integrations:  <IntegrationsSection />,
    ai:            <AISection />,
    notifications: <NotificationsSection />,
    shortcuts:     <ShortcutsSection />,
    security:      <SecuritySection />,
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex" style={{ background: T.bg }}>
      <Sidebar />

      {/* Settings nav */}
      <aside className="w-52 flex-shrink-0 flex flex-col py-6 px-3" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-3" style={{ color: T.dim }}>Settings</div>
        <nav className="space-y-0.5">
          {SETTINGS_NAV.map(({ icon: Icon, id, label }) => (
            <button key={id} onClick={() => setActive(id as Section)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active === id
                ? { background: T.accentLt, color: T.accent }
                : { color: T.muted, background: "transparent" }}>
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
    </div>
  );
}