"use client";
import { useState } from "react";
import {
  Search, Star, Clock, Reply, ReplyAll, Forward, Bot,
  ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle,
  BellOff, ExternalLink, Tag, RefreshCw, Minimize2,
  Archive, Trash2, Calendar,
} from "lucide-react";
import Background from "./components/background";
import Sidebar from "./components/sidebar";

// ─── Data ────────────────────────────────────────────────────────────────────

const EMAILS = [
  { id: 1, sender: "Alex Johnson",  email: "alex@company.com",      subject: "Project sync tomorrow?",        preview: "Hey Arjun, can we move our project sync...",     time: "10:42 AM",  initials: "AJ", color: "bg-violet-400", unread: true,  tag: "Work"   },
  { id: 2, sender: "Sarah Chen",    email: "sarah@company.com",     subject: "Q2 Roadmap Update",              preview: "Following up on last week's discussion ab...",   time: "Yesterday", initials: "SC", color: "bg-emerald-400",unread: false                },
  { id: 3, sender: "Robert Fox",    email: "rfox@design.co",        subject: "Design review feedback",         preview: "Hi team, great job with the designs...",          time: "Yesterday", initials: "RF", color: "bg-sky-400",   unread: false                },
  { id: 4, sender: "GitHub",        email: "noreply@github.com",    subject: "PR #4207 merged",                preview: "Your pull request has been merged...",            time: "Mon",       initials: "GH", color: "bg-slate-600", unread: false, tag: "Dev"    },
  { id: 5, sender: "Maria Garcia",  email: "mgarcia@co.com",        subject: "Design review feedback",         preview: "Sure, 4PM works for me. Thanks for checking!",   time: "Sun",       initials: "MG", color: "bg-pink-400",  unread: true                 },
  { id: 6, sender: "Patchwork",     email: "hello@patchwork.io",    subject: "Weekly smart activity report",   preview: "Your emails sent this week...",                   time: "Sun",       initials: "PW", color: "bg-amber-400", unread: false                },
  { id: 7, sender: "David Kim",     email: "dkim@corp.com",         subject: "Re: Meeting notes",              preview: "Hey David, thanks for sharing. A couple of...",   time: "Sat",       initials: "DK", color: "bg-teal-400",  unread: false                },
  { id: 8, sender: "LinkedIn",      email: "messages@linkedin.com", subject: "You have 5 new notifications",  preview: "Someone viewed your profile and more...",          time: "Sat",       initials: "LI", color: "bg-blue-500",  unread: false                },
];

const CAL_DAYS = ["S","M","T","W","T","F","S"];
const CAL_GRID = [
  [null,null,null,1,2,3,4],
  [5,6,7,8,9,10,11],
  [12,13,14,15,16,17,18],
  [19,20,21,22,23,24,25],
  [26,27,28,29,30,31,null],
];
const SCHEDULE = [
  { time: "9:00 – 9:50",   label: "Team Standup",               cls: "bg-pink-50   border-pink-200   text-pink-700"   },
  { time: "10:00 – 11:00", label: "Project Sync",               cls: "bg-pink-300  border-pink-300   text-white"      },
  { time: "11:30 – 12:30", label: "Quick Call",                 cls: "bg-teal-50   border-teal-200   text-teal-700"   },
  { time: "1:00 – 2:00",   label: "Lunch Time",                 cls: "bg-teal-50   border-teal-200   text-teal-700"   },
  { time: "3:00 – 3:30",   label: "Project Sync (Rescheduled)", cls: "bg-amber-50  border-amber-200  text-amber-700"  },
  { time: "5:00 – 6:00",   label: "Design Review",              cls: "bg-purple-50 border-purple-200 text-purple-700" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : size === "lg" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [selected, setSelected] = useState(EMAILS[0]);
  const [tab, setTab] = useState("Primary");
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <>
      <Background />
      <div className="h-screen w-screen overflow-hidden flex">
        <Sidebar />

        {/* ── Email List ──────────────────────────────────────────────── */}
        <section className="w-80 flex-shrink-0 flex flex-col bg-white/15 backdrop-blur-2xl border-r border-white/25">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2 bg-white/35 border border-white/50 rounded-xl px-3 py-2.5 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                placeholder="Search emails, people…" />
              <RefreshCw size={13} className="text-slate-400" />
            </div>
          </div>

          <div className="flex gap-1 px-4 mb-3">
            {["Primary", "Social", "Updates"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors
                  ${tab === t ? "bg-white/50 text-pink-500 shadow-sm border border-pink-100/60" : "text-slate-500 hover:bg-white/30"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
            {EMAILS.map((email) => (
              <button key={email.id} onClick={() => setSelected(email)}
                className={`w-full text-left p-3 rounded-2xl transition-all
                  ${selected.id === email.id ? "bg-white/45 shadow-sm border border-white/60" : "hover:bg-white/25"}`}>
                <div className="flex gap-3">
                  <Avatar initials={email.initials} color={email.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm truncate ${email.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                        {email.sender}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{email.time}</span>
                    </div>
                    <div className={`text-xs mb-1 truncate ${email.unread ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                      {email.subject}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 truncate flex-1">{email.preview}</span>
                      {email.tag && (
                        <span className="text-[10px] bg-pink-50/80 text-pink-400 border border-pink-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {email.tag}
                        </span>
                      )}
                      {email.unread && <span className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Reading Pane ────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col bg-white/10 backdrop-blur-2xl border-r border-white/25 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/40 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-lg hover:bg-white/40 text-slate-500"><ChevronLeft size={16} /></button>
              <h2 className="text-base font-bold text-slate-900">{selected.subject}</h2>
              <span className="text-xs bg-teal-50/80 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-md">Work</span>
            </div>
            <div className="flex items-center gap-1">
              {[Archive, BellOff, Trash2, MoreHorizontal, Minimize2].map((Icon, i) => (
                <button key={i} className="p-1.5 rounded-lg hover:bg-white/40 text-slate-500"><Icon size={15} /></button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Email body */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={selected.initials} color={selected.color} size="lg" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{selected.sender}</div>
                    <div className="text-xs text-slate-400">{selected.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{selected.time}</span>
                  <Star size={14} className="text-slate-300 hover:text-amber-400 cursor-pointer" />
                </div>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>Hi Arjun,</p>
                <p>Can we move our project sync tomorrow to <strong>4 PM</strong> instead of 2 PM? A few teammates have conflicts in the afternoon.</p>
                <p>Let me know what works best for you.</p>
                <div className="pt-2"><p>Thanks,</p><p className="font-medium">{selected.sender}</p></div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/50 flex items-center gap-2">
                {[{ I: Reply, l: "Reply" }, { I: ReplyAll, l: "Reply all" }, { I: Forward, l: "Forward" }].map(({ I, l }) => (
                  <button key={l} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white/40 rounded-lg transition-colors">
                    <I size={13} /> {l}
                  </button>
                ))}
                <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-500 bg-pink-50/70 hover:bg-pink-100/70 rounded-lg transition-colors border border-pink-100">
                  <Bot size={13} /> AI Reply
                </button>
              </div>
            </div>

            {/* AI suggested reply */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm overflow-hidden">
              <button onClick={() => setAiOpen(!aiOpen)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-pink-50/70 to-teal-50/70 border-b border-white/40">
                <span className="flex items-center gap-2 text-sm font-semibold text-pink-500">
                  <Bot size={14} /> AI Suggested Reply
                </span>
                <span className="text-xs bg-pink-100/80 text-pink-400 px-2 py-0.5 rounded-full">Preview</span>
              </button>
              {aiOpen && (
                <div className="px-5 py-4">
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">Sure, 4 PM works for me. Thanks for checking!</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-pink-400 text-white text-xs font-semibold py-2 rounded-xl hover:bg-pink-500 transition-colors">Send</button>
                    <button className="flex-1 border border-teal-200 text-teal-700 bg-teal-50/70 text-xs font-semibold py-2 rounded-xl hover:bg-teal-100/70 transition-colors">Edit</button>
                  </div>
                </div>
              )}
            </div>

            {/* Smart actions */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Smart Actions</div>
              <div className="flex flex-wrap gap-2">
                {[{ I: Calendar, l: "Convert to meeting", mint: true }, { I: Clock, l: "Find time", mint: false }, { I: BellOff, l: "Snooze", mint: false }].map(({ I, l, mint }) => (
                  <button key={l} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border
                    ${mint ? "bg-teal-50/70 border-teal-200 text-teal-700 hover:bg-teal-100/70" : "bg-white/40 border-white/50 text-slate-700 hover:bg-white/60"}`}>
                    <I size={13} className={mint ? "text-teal-500" : "text-pink-400"} />
                    {l}
                  </button>
                ))}
                <button className="flex items-center gap-1.5 px-3 py-2 bg-pink-50/70 hover:bg-pink-100/70 rounded-xl text-xs font-medium text-pink-500 transition-colors border border-pink-100">
                  <CheckCircle size={13} /> Mark done
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ── AI Assistant + Calendar ──────────────────────────────────── */}
        <aside className="w-80 flex-shrink-0 flex flex-col bg-white/10 backdrop-blur-2xl overflow-y-auto">
          {/* AI panel */}
          <div className="mx-3 mt-4 rounded-2xl border border-pink-100/50 p-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, rgba(255,209,230,0.5) 0%, rgba(204,251,241,0.5) 100%)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 font-bold text-sm text-slate-700">
                <Bot size={15} className="text-pink-400" /> AI Assistant
              </span>
              <Minimize2 size={13} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="mb-3">
              <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider mb-1">Summary</div>
              <p className="text-xs text-slate-600 leading-relaxed">Alex is asking to move the project sync from 2 PM to 4 PM tomorrow due to afternoon conflicts.</p>
            </div>
            <div>
              <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2">Suggested Actions</div>
              <div className="space-y-2">
                {[
                  { l: "Reply & confirm 4 PM", primary: true },
                  { l: "Propose new time",     primary: false },
                  { l: "Convert to meeting",   primary: false, mint: true },
                ].map(({ l, primary, mint }) => (
                  <button key={l} className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${primary ? "bg-pink-400 text-white hover:bg-pink-500 shadow-sm"
                    : mint ? "bg-teal-50/80 border border-teal-200 text-teal-700 hover:bg-teal-100/80"
                    : "bg-white/50 border border-white/60 text-slate-700 hover:bg-white/70"}`}>
                    <span>{l}</span>
                    <ChevronRight size={14} className={primary ? "text-pink-200" : mint ? "text-teal-400" : "text-slate-400"} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mx-3 mt-3 bg-white/35 backdrop-blur-md rounded-2xl border border-white/45 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-slate-800">Calendar</span>
              <button className="text-[11px] text-pink-400 font-semibold hover:underline flex items-center gap-1">
                View full <ExternalLink size={10} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3 bg-teal-50/80 border border-teal-200 rounded-xl px-3 py-1.5">
              <CheckCircle size={12} className="text-teal-500" />
              <span className="text-xs text-teal-700 font-medium">No conflicts at 4 PM</span>
            </div>
            {/* Mini calendar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">May 2024</span>
                <div className="flex gap-1">
                  <button className="p-1 rounded hover:bg-pink-50/60"><ChevronLeft size={12} className="text-slate-400" /></button>
                  <button className="p-1 rounded hover:bg-pink-50/60"><ChevronRight size={12} className="text-slate-400" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center mb-1">
                {CAL_DAYS.map((d, i) => <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>)}
              </div>
              {CAL_GRID.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 text-center">
                  {week.map((d, di) => (
                    <div key={di} className={`text-[11px] py-1 rounded-full mx-auto w-6 h-6 flex items-center justify-center cursor-pointer transition-colors
                      ${d === 15 ? "bg-pink-400 text-white font-bold" : d === 16 ? "ring-2 ring-teal-300 text-teal-700 font-semibold" : d ? "hover:bg-pink-50/60 text-slate-600" : ""}`}>
                      {d}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* Schedule */}
            <div className="border-t border-white/40 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Thu, May 16</span>
                <div className="flex gap-1">
                  {["Today","Day","Week"].map((v) => (
                    <button key={v} className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                      ${v === "Today" ? "bg-teal-400 text-white" : "text-slate-400 hover:bg-white/40"}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SCHEDULE.map((ev, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2 rounded-xl border text-xs ${ev.cls}`}>
                    <div className="flex-shrink-0 font-medium text-[10px] mt-0.5 w-20">{ev.time}</div>
                    <div className="font-semibold truncate">{ev.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related emails */}
          <div className="mx-3 mt-3 mb-4 bg-white/35 backdrop-blur-md rounded-2xl border border-white/45 p-4 shadow-sm">
            <div className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-2">
              <Tag size={12} className="text-teal-500" /> Related emails
            </div>
            <div className="space-y-2">
              {[{ l: "Project sync last week", d: "May 8", dot: "bg-pink-300" }, { l: "Project plan discussion", d: "Apr 27", dot: "bg-teal-300" }].map((r) => (
                <button key={r.l} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/50">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                  <span className="text-xs text-slate-700 flex-1 text-left truncate">{r.l}</span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{r.d}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
