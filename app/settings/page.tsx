"use client";
import { useState } from "react";
import {
  User, Link2, Bot, Bell, Keyboard, Shield, ChevronRight,
  CheckCircle, Plus, Zap, Mail, Calendar, Globe, Trash2,
  AlertTriangle, Sparkles, Eye, EyeOff,
} from "lucide-react";
import Background from "../components/Background";
import Sidebar from "../components/sidebar";

const SETTINGS_NAV = [
  { icon: User,     id: "profile",      label: "Profile"          },
  { icon: Link2,    id: "integrations", label: "Integrations"     },
  { icon: Bot,      id: "ai",           label: "AI Agent"         },
  { icon: Bell,     id: "notifications",label: "Notifications"    },
  { icon: Keyboard, id: "shortcuts",    label: "Shortcuts"        },
  { icon: Shield,   id: "security",     label: "Security"         },
];

const INTEGRATIONS = [
  {
    id: "gmail",     name: "Gmail",           icon: Mail,
    status: "connected", detail: "arjun@example.co",
    synced: "2 min ago", color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    id: "gcal",      name: "Google Calendar", icon: Calendar,
    status: "connected", detail: "arjun@example.co",
    synced: "5 min ago", color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "corsair",   name: "Corsair",         icon: Zap,
    status: "connected", detail: "API key: ••••••••••abc123",
    synced: "Active",    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    id: "notion",    name: "Notion",          icon: Globe,
    status: "disconnected", detail: "Connect to sync notes",
    synced: null,    color: "bg-slate-50 text-slate-400 border-slate-100",
  },
  {
    id: "slack",     name: "Slack",           icon: Globe,
    status: "disconnected", detail: "Connect to share updates",
    synced: null,    color: "bg-slate-50 text-slate-400 border-slate-100",
  },
];

const SHORTCUTS = [
  { action: "Compose new email",    keys: ["C"]           },
  { action: "Reply",                keys: ["R"]           },
  { action: "Reply all",            keys: ["A"]           },
  { action: "Forward",              keys: ["F"]           },
  { action: "Archive",              keys: ["E"]           },
  { action: "Delete",               keys: ["#"]           },
  { action: "Search",               keys: ["/"]           },
  { action: "Open AI agent",        keys: ["⌘", "K"]      },
  { action: "Go to Calendar",       keys: ["G", "C"]      },
  { action: "Mark as read",         keys: ["Shift", "I"]  },
];

type Section = "profile" | "integrations" | "ai" | "notifications" | "shortcuts" | "security";

function ProfileSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Profile</h2>
        <p className="text-sm text-slate-500">Manage your account information.</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-400 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md">AM</div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm text-slate-500 hover:text-pink-500 transition-colors">
            <Plus size={12} />
          </button>
        </div>
        <div>
          <div className="text-base font-bold text-slate-800">Arjun Mehta</div>
          <div className="text-sm text-slate-500 mb-2">arjun@example.co</div>
          <button className="text-xs bg-pink-50 text-pink-500 border border-pink-100 px-3 py-1.5 rounded-lg font-semibold hover:bg-pink-100 transition-colors">Change photo</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[["First name", "Arjun"], ["Last name", "Mehta"], ["Email", "arjun@example.co"], ["Role", "Product Manager"]].map(([l, v]) => (
          <div key={l}>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{l}</label>
            <input defaultValue={v} className="w-full bg-white/50 border border-white/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-pink-300 focus:bg-white/70 transition-colors" />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Time zone</label>
        <div className="bg-white/50 border border-white/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 flex items-center justify-between cursor-pointer hover:border-pink-300 transition-colors">
          <span>Asia/Kolkata (UTC +5:30)</span>
          <ChevronRight size={14} className="text-slate-400" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button className="bg-pink-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-pink-500 transition-colors shadow-sm">Save changes</button>
        <button className="bg-white/40 border border-white/60 text-slate-600 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-white/60 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const [showKey, setShowKey] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Integrations</h2>
        <p className="text-sm text-slate-500">Connect your apps via Corsair to power the AI agent.</p>
      </div>
      <div className="space-y-3">
        {INTEGRATIONS.map((i) => (
          <div key={i.id} className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${i.color}`}>
              <i.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-slate-800">{i.name}</span>
                {i.status === "connected" && (
                  <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">Connected</span>
                )}
              </div>
              <div className="text-xs text-slate-500">{i.detail}</div>
              {i.synced && <div className="text-[10px] text-slate-400 mt-0.5">Last synced: {i.synced}</div>}
            </div>
            {i.status === "connected" ? (
              <div className="flex gap-2 flex-shrink-0">
                {i.id === "corsair" && (
                  <button onClick={() => setShowKey(!showKey)} className="p-2 rounded-lg hover:bg-white/60 text-slate-500 transition-colors">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
                <button className="text-xs bg-white/50 border border-white/60 text-slate-600 px-3 py-1.5 rounded-lg font-medium hover:bg-white/70 transition-colors">Manage</button>
                <button className="text-xs text-red-500 bg-red-50/50 border border-red-100 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100/50 transition-colors">Disconnect</button>
              </div>
            ) : (
              <button className="flex items-center gap-1.5 text-xs bg-pink-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-500 transition-colors shadow-sm flex-shrink-0">
                <Plus size={13} /> Connect
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Zap size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-teal-800 mb-1">Corsair MCP Active</div>
            <div className="text-xs text-teal-700 leading-relaxed">Your AI agent has full access to Gmail and Google Calendar via Corsair. It can send emails, create events, and check availability on your behalf.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AISection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">AI Agent</h2>
        <p className="text-sm text-slate-500">Configure how your AI assistant behaves.</p>
      </div>

      <div className="bg-white/40 rounded-2xl border border-white/60 p-4">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Model</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Claude Sonnet 4.6",  badge: "Active",      sel: true  },
            { name: "Claude Opus 4.8",    badge: "More capable",sel: false },
            { name: "Claude Haiku 4.5",   badge: "Faster",      sel: false },
            { name: "Custom",             badge: "Configure",   sel: false },
          ].map(({ name, badge, sel }) => (
            <div key={name} className={`p-3 rounded-xl border cursor-pointer transition-all
              ${sel ? "bg-pink-50/80 border-pink-300 shadow-sm" : "bg-white/30 border-white/50 hover:border-pink-200"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${sel ? "text-pink-700" : "text-slate-700"}`}>{name}</span>
                {sel && <CheckCircle size={12} className="text-pink-500" />}
              </div>
              <span className={`text-[10px] font-medium ${sel ? "text-pink-500" : "text-slate-400"}`}>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/40 rounded-2xl border border-white/60 p-4">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Permissions</div>
        <div className="space-y-3">
          {[
            { l: "Send emails on my behalf",     on: true,  desc: "Agent can send emails without additional approval"            },
            { l: "Create & edit calendar events", on: true,  desc: "Agent can schedule meetings and send invites"                 },
            { l: "Read contacts",                 on: true,  desc: "Agent can look up names and emails"                           },
            { l: "Archive & delete emails",       on: false, desc: "Require confirmation before archiving or deleting"            },
            { l: "Access email attachments",      on: false, desc: "Allow agent to read and summarise attachments"                },
          ].map(({ l, on, desc }) => (
            <div key={l} className="flex items-start gap-4">
              <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 mt-0.5 ${on ? "bg-teal-400" : "bg-slate-200"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{l}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/40 rounded-2xl border border-white/60 p-4">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Response Style</div>
        <div className="flex gap-2">
          {["Concise", "Balanced", "Detailed"].map((s, i) => (
            <button key={s} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border
              ${i === 1 ? "bg-pink-400 text-white border-pink-400 shadow-sm" : "bg-white/40 text-slate-600 border-white/60 hover:border-pink-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/40 rounded-2xl border border-white/60 p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={14} className="text-violet-500" /> Agent Memory
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Remember context across conversations</div>
        </div>
        <div className="w-10 h-5 rounded-full bg-teal-400 flex items-center px-0.5">
          <div className="w-4 h-4 rounded-full bg-white shadow-sm translate-x-5" />
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Notifications</h2>
        <p className="text-sm text-slate-500">Choose what you want to be notified about.</p>
      </div>
      {[
        {
          category: "Email", items: [
            { l: "New email in inbox",  desc: "Get notified for every new email",     on: false },
            { l: "Important emails",    desc: "Only flagged or high-priority emails",  on: true  },
            { l: "AI reply suggestions",desc: "When AI drafts a reply for you",        on: true  },
          ]
        },
        {
          category: "Calendar", items: [
            { l: "Event reminders",     desc: "15 min before an event",               on: true  },
            { l: "Invite received",     desc: "When someone invites you to a meeting", on: true  },
            { l: "Event changes",       desc: "When an event is updated or cancelled", on: true  },
          ]
        },
        {
          category: "AI Agent", items: [
            { l: "Action completed",    desc: "Email sent or event created by agent",  on: true  },
            { l: "Needs your approval", desc: "When agent wants to take a risky action",on: true  },
            { l: "Weekly summary",      desc: "What your agent did this week",          on: false },
          ]
        },
      ].map(({ category, items }) => (
        <div key={category} className="bg-white/40 rounded-2xl border border-white/60 p-4">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">{category}</div>
          <div className="space-y-4">
            {items.map(({ l, desc, on }) => (
              <div key={l} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{l}</div>
                  <div className="text-xs text-slate-500">{desc}</div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center px-0.5 flex-shrink-0 ${on ? "bg-teal-400" : "bg-slate-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShortcutsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Keyboard Shortcuts</h2>
        <p className="text-sm text-slate-500">Speed up your workflow with keyboard shortcuts.</p>
      </div>
      <div className="bg-white/40 rounded-2xl border border-white/60 overflow-hidden">
        {SHORTCUTS.map(({ action, keys }, i) => (
          <div key={action} className={`flex items-center justify-between px-4 py-3 ${i !== SHORTCUTS.length - 1 ? "border-b border-white/40" : ""}`}>
            <span className="text-sm text-slate-700">{action}</span>
            <div className="flex gap-1">
              {keys.map((k) => (
                <kbd key={k} className="bg-white/70 border border-slate-200/80 text-slate-700 text-xs font-mono font-bold px-2 py-1 rounded-lg shadow-sm">{k}</kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Security</h2>
        <p className="text-sm text-slate-500">Manage your account security and privacy.</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white/40 rounded-2xl border border-white/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-800">Password</div>
              <div className="text-xs text-slate-500 mt-0.5">Last changed 3 months ago</div>
            </div>
            <button className="text-sm font-semibold text-pink-500 bg-pink-50/70 border border-pink-100 px-4 py-2 rounded-xl hover:bg-pink-100/70 transition-colors">Change</button>
          </div>
        </div>
        <div className="bg-white/40 rounded-2xl border border-white/60 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Two-factor authentication
              <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">Enabled</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Authenticator app · ••• •••• 4521</div>
          </div>
          <button className="text-sm font-semibold text-slate-600 bg-white/40 border border-white/60 px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">Manage</button>
        </div>
        <div className="bg-white/40 rounded-2xl border border-white/60 p-4">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Active Sessions</div>
          {[
            { device: "MacBook Pro · Chrome", loc: "Mumbai, IN", time: "Now", current: true },
            { device: "iPhone 15 · Safari",   loc: "Mumbai, IN", time: "2h ago",current: false },
          ].map(({ device, loc, time, current }) => (
            <div key={device} className="flex items-center justify-between py-2 border-b border-white/30 last:border-b-0">
              <div>
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  {device}
                  {current && <span className="text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full">This device</span>}
                </div>
                <div className="text-[10px] text-slate-400">{loc} · {time}</div>
              </div>
              {!current && <button className="text-xs text-red-500 hover:underline font-medium">Revoke</button>}
            </div>
          ))}
        </div>
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-red-700">Danger Zone</div>
              <div className="text-xs text-red-600">These actions cannot be undone.</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-xs text-red-500 bg-white/60 border border-red-200 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors">
              <Trash2 size={12} /> Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  const sectionMap: Record<Section, React.ReactNode> = {
    profile: <ProfileSection />,
    integrations: <IntegrationsSection />,
    ai: <AISection />,
    notifications: <NotificationsSection />,
    shortcuts: <ShortcutsSection />,
    security: <SecuritySection />,
  };

  return (
    <>
      <Background />
      <div className="h-screen w-screen overflow-hidden flex">
        <Sidebar />

        <aside className="w-56 flex-shrink-0 flex flex-col bg-white/15 backdrop-blur-2xl border-r border-white/25 py-6 px-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Settings</div>
          <nav className="space-y-0.5">
            {SETTINGS_NAV.map(({ icon: Icon, id, label }) => (
              <button key={id} onClick={() => setActive(id as Section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${active === id ? "bg-pink-50/70 text-pink-500" : "text-slate-600 hover:bg-white/30"}`}>
                <Icon size={15} />
                {label}
                {active === id && <ChevronRight size={13} className="ml-auto text-pink-300" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto px-3">
            <div className="text-[10px] text-slate-400 leading-relaxed">
              SuperPower v0.1.0<br />
              Powered by Corsair MCP
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white/10 backdrop-blur-2xl overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8">
            {sectionMap[active]}
          </div>
        </main>
      </div>
    </>
  );
}
