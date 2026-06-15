"use client";
import { useState } from "react";
import {
  User, Link2, Bot, Bell, Keyboard, Shield, ChevronRight,
  CheckCircle, Plus, Zap, Mail, Calendar, Globe, Trash2,
  AlertTriangle, Sparkles, Eye, EyeOff,
} from "lucide-react";
import Sidebar from "../components/sidebar";

const SETTINGS_NAV = [
  { icon: User,      id: "profile",       label: "Profile"       },
  { icon: Link2,     id: "integrations",  label: "Integrations"  },
  { icon: Bot,       id: "ai",            label: "AI Agent"      },
  { icon: Bell,      id: "notifications", label: "Notifications" },
];

const INTEGRATIONS = [
  { id: "gmail",   name: "Gmail",           icon: Mail,     status: "connected",    detail: "arjun@example.co",           synced: "2 min ago", accent: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20"   },
  { id: "gcal",    name: "Google Calendar", icon: Calendar, status: "connected",    detail: "arjun@example.co",           synced: "5 min ago", accent: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  { id: "corsair", name: "Corsair MCP",     icon: Zap,      status: "connected",    detail: "API key: ••••••••••abc123",  synced: "Active",    accent: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { id: "notion",  name: "Notion",          icon: Globe,    status: "disconnected", detail: "Connect to sync notes",      synced: null,        accent: "text-slate-600",  bg: "bg-white/[0.04]",  border: "border-white/[0.07]"  },
  { id: "slack",   name: "Slack",           icon: Globe,    status: "disconnected", detail: "Connect to share updates",   synced: null,        accent: "text-slate-600",  bg: "bg-white/[0.04]",  border: "border-white/[0.07]"  },
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
    <div className={`bg-[#090d16] border border-white/[0.06] rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-4">{children}</div>;
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${on ? "bg-amber-500" : "bg-white/[0.08]"}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </div>
  );
}

function SectionHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/80 flex items-center gap-1.5 mb-2">
        <span>✦</span> {title}
      </div>
      <p className="text-xs text-slate-600 font-medium">{sub}</p>
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
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-black text-xl font-extrabold shadow-[0_4px_18px_rgba(245,158,11,0.35)]">AM</div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#090d16] border border-white/[0.10] rounded-full flex items-center justify-center text-slate-500 hover:text-amber-400 transition-colors">
              <Plus size={11} />
            </button>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Arjun Mehta</div>
            <div className="text-xs text-slate-600 mb-2">arjun@example.co</div>
            <button className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-500/20 transition-colors">Change photo</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["First name", "Arjun"], ["Last name", "Mehta"], ["Email", "arjun@example.co"], ["Role", "Product Manager"]].map(([l, v]) => (
            <div key={l}>
              <label className="text-[10px] font-bold text-slate-600 mb-1.5 block">{l}</label>
              <input defaultValue={v}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-amber-500/30 focus:bg-white/[0.06] transition-all" />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-[10px] font-bold text-slate-600 mb-1.5 block">Time zone</label>
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-amber-500/20 transition-colors">
            <span>Asia/Kolkata (UTC +5:30)</span>
            <ChevronRight size={12} className="text-slate-700" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)]">Save changes</button>
          <button className="bg-white/[0.04] border border-white/[0.07] text-slate-500 text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-white/[0.07] hover:text-slate-300 transition-all">Cancel</button>
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
          <div key={i.id} className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${i.bg} ${i.border}`}>
              <i.icon size={16} className={i.accent} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-slate-200">{i.name}</span>
                {i.status === "connected" && (
                  <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold">Connected</span>
                )}
              </div>
              <div className="text-[11px] text-slate-600">{i.detail}</div>
              {i.synced && <div className="text-[10px] text-slate-700 mt-0.5">Synced: {i.synced}</div>}
            </div>
            {i.status === "connected" ? (
              <div className="flex gap-2 flex-shrink-0">
                {i.id === "corsair" && (
                  <button onClick={() => setShowKey(!showKey)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-600 hover:text-slate-400 transition-colors">
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                )}
                <button className="text-[11px] bg-white/[0.04] border border-white/[0.07] text-slate-500 px-3 py-1.5 rounded-lg font-medium hover:bg-white/[0.07] hover:text-slate-300 transition-all">Manage</button>
                <button className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg font-medium hover:bg-red-500/20 transition-all">Disconnect</button>
              </div>
            ) : (
              <button className="flex items-center gap-1.5 text-[11px] bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-lg font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_2px_10px_rgba(245,158,11,0.2)] flex-shrink-0">
                <Plus size={12} /> Connect
              </button>
            )}
          </div>
        ))}
      </div>
      <Card>
        <div className="flex items-start gap-3">
          <Zap size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-200 mb-1">Corsair MCP Active</div>
            <div className="text-[11px] text-slate-600 leading-relaxed">Your AI agent has full access to Gmail and Google Calendar via Corsair. It can send emails, create events, and check availability on your behalf.</div>
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
            <div key={name} className={`p-3 rounded-xl border cursor-pointer transition-all ${
              sel ? "bg-amber-500/10 border-amber-500/25 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.08)]"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-amber-500/15"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${sel ? "text-amber-300" : "text-slate-400"}`}>{name}</span>
                {sel && <CheckCircle size={11} className="text-amber-400" />}
              </div>
              <span className={`text-[10px] font-medium ${sel ? "text-amber-500/80" : "text-slate-700"}`}>{badge}</span>
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
                <div className="text-xs font-semibold text-slate-300">{l}</div>
                <div className="text-[11px] text-slate-600">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Response Style</SectionLabel>
        <div className="flex gap-2">
          {["Concise", "Balanced", "Detailed"].map((s, i) => (
            <button key={s} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              i === 1
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-500 shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
                : "bg-white/[0.04] text-slate-500 border-white/[0.07] hover:border-amber-500/20 hover:text-slate-300"
            }`}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Sparkles size={13} className="text-amber-400" /> Agent Memory
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Remember context across conversations</div>
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
                  <div className="text-xs font-semibold text-slate-300">{l}</div>
                  <div className="text-[11px] text-slate-600">{desc}</div>
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
          <div key={action} className={`flex items-center justify-between px-5 py-3 ${i !== SHORTCUTS.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
            <span className="text-xs text-slate-400">{action}</span>
            <div className="flex gap-1">
              {keys.map((k) => (
                <kbd key={k} className="bg-white/[0.06] border border-white/[0.10] text-slate-400 text-[10px] font-mono font-bold px-2 py-1 rounded-lg">{k}</kbd>
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
          <div className="text-xs font-bold text-slate-200">Password</div>
          <div className="text-[11px] text-slate-600 mt-0.5">Last changed 3 months ago</div>
        </div>
        <button className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl hover:bg-amber-500/20 transition-colors">Change</button>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            Two-factor authentication
            <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold">Enabled</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Authenticator app · ••• •••• 4521</div>
        </div>
        <button className="text-xs font-semibold text-slate-500 bg-white/[0.04] border border-white/[0.07] px-4 py-2 rounded-xl hover:bg-white/[0.07] hover:text-slate-300 transition-all">Manage</button>
      </Card>

      <Card>
        <SectionLabel>Active Sessions</SectionLabel>
        {[
          { device: "MacBook Pro · Chrome", loc: "Mumbai, IN", time: "Now",    current: true  },
          { device: "iPhone 15 · Safari",   loc: "Mumbai, IN", time: "2h ago", current: false },
        ].map(({ device, loc, time, current }) => (
          <div key={device} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-b-0">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                {device}
                {current && <span className="text-[9px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded-full font-bold">This device</span>}
              </div>
              <div className="text-[10px] text-slate-700">{loc} · {time}</div>
            </div>
            {!current && <button className="text-[11px] text-red-400 hover:text-red-300 font-semibold transition-colors">Revoke</button>}
          </div>
        ))}
      </Card>

      <div className="bg-red-500/[0.06] border border-red-500/15 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-red-300">Danger Zone</div>
            <div className="text-[11px] text-red-500/70">These actions cannot be undone.</div>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/20 transition-all">
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
    <div className="h-screen w-screen overflow-hidden flex bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        {/* Settings nav */}
        <aside className="w-52 flex-shrink-0 flex flex-col bg-[#07090f] border-r border-white/[0.05] py-6 px-3">
          <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] px-3 mb-3">Settings</div>
          <nav className="space-y-0.5">
            {SETTINGS_NAV.map(({ icon: Icon, id, label }) => (
              <button key={id} onClick={() => setActive(id as Section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active === id
                    ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.15)]"
                    : "text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}>
                <Icon size={14} className={active === id ? "text-amber-400" : ""} />
                {label}
                {active === id && <ChevronRight size={12} className="ml-auto text-amber-500/50" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto px-3">
            <div className="text-[10px] text-slate-700 leading-relaxed">
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
    </div>
  );
}
