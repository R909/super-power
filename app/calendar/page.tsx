"use client";
import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Users, Clock,
  MapPin, Video, CheckCircle, X,
} from "lucide-react";
import Sidebar from "../components/sidebar";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_DATES = [13, 14, 15, 16, 17, 18, 19];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const HOUR_H = 64;
const DAY_START = 8;
const TODAY_IDX = 3;

interface CalEvent {
  id: number;
  title: string;
  day: number;
  start: number;
  dur: number;
  cls: string;
  attendees?: string;
  location?: string;
}

const EVENTS: CalEvent[] = [
  { id: 1,  title: "Team Standup",              day: 0, start: 9,    dur: 0.83, cls: "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200",  attendees: "5 people"     },
  { id: 2,  title: "Team Standup",              day: 1, start: 9,    dur: 0.83, cls: "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200"                             },
  { id: 3,  title: "Team Standup",              day: 2, start: 9,    dur: 0.83, cls: "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200"                             },
  { id: 4,  title: "Team Standup",              day: 3, start: 9,    dur: 0.83, cls: "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200",  attendees: "5 people"     },
  { id: 5,  title: "Team Standup",              day: 4, start: 9,    dur: 0.83, cls: "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200"                             },
  { id: 6,  title: "Project Sync",              day: 0, start: 10,   dur: 1,    cls: "bg-violet-500/20 border-l-[3px] border-violet-400 text-violet-200", attendees: "Alex, Sarah", location: "Google Meet" },
  { id: 7,  title: "Design Review",             day: 2, start: 14,   dur: 1.5,  cls: "bg-teal-500/20   border-l-[3px] border-teal-400   text-teal-200",   attendees: "Robert, Maria"},
  { id: 8,  title: "Lunch",                     day: 3, start: 12.5, dur: 1,    cls: "bg-emerald-500/20 border-l-[3px] border-emerald-400 text-emerald-200"                        },
  { id: 9,  title: "Project Sync (Reschedule)", day: 3, start: 15,   dur: 0.5,  cls: "bg-orange-500/20 border-l-[3px] border-orange-400 text-orange-200", attendees: "Alex, Sarah"  },
  { id: 10, title: "Quick Call",                day: 4, start: 11.5, dur: 1,    cls: "bg-sky-500/20    border-l-[3px] border-sky-400    text-sky-200",    attendees: "David Kim"    },
  { id: 11, title: "Hiring Interview",          day: 1, start: 14,   dur: 1,    cls: "bg-purple-500/20 border-l-[3px] border-purple-400 text-purple-200", attendees: "HR Team"      },
];

const UPCOMING = [
  { title: "Team Standup",               when: "Today · 9:00 AM",    dot: "bg-amber-400"   },
  { title: "Project Sync",               when: "Today · 10:00 AM",   dot: "bg-violet-400"  },
  { title: "Lunch",                      when: "Today · 12:30 PM",   dot: "bg-emerald-400" },
  { title: "Project Sync (Rescheduled)", when: "Today · 3:00 PM",    dot: "bg-orange-400"  },
  { title: "Team Standup",               when: "Tomorrow · 9:00 AM", dot: "bg-amber-400"   },
  { title: "Project Sync",               when: "Tomorrow · 4:00 PM", dot: "bg-violet-400"  },
];

const CAL_DAYS_HDR = ["S", "M", "T", "W", "T", "F", "S"];
const CAL_MINI = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(EVENTS[6]);
  const [view, setView] = useState<"Day" | "Week" | "Month" | "Agenda">("Week");

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[140px] pointer-events-none z-0"
        style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none z-0"
        style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0"
        style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        {/* Mini calendar + upcoming */}
        <aside className="w-56 flex-shrink-0 flex flex-col bg-[#07090f] border-r border-white/[0.05] overflow-y-auto">
          <div className="p-4">
            <button className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all mb-4">
              <Plus size={14} /> New Event
            </button>

            {/* Mini calendar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">June 2026</span>
                <div className="flex gap-0.5">
                  <button className="p-1 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronLeft size={12} /></button>
                  <button className="p-1 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronRight size={12} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center mb-1">
                {CAL_DAYS_HDR.map((d, i) => <div key={i} className="text-[9px] font-bold text-slate-700 py-1">{d}</div>)}
              </div>
              {CAL_MINI.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 text-center">
                  {week.map((d, di) => (
                    <div key={di} className={`text-[10px] mx-auto w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all
                      ${d === 14 ? "bg-amber-500 text-black font-bold shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                        : d && d >= 13 && d <= 19 ? "bg-white/[0.07] text-slate-300 font-semibold hover:bg-amber-500/20 hover:text-amber-300"
                        : d ? "hover:bg-white/[0.05] text-slate-600" : ""}`}>
                      {d}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <div>
              <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-2">Upcoming</div>
              <div className="space-y-2.5">
                {UPCOMING.map((ev, i) => (
                  <div key={i} className="flex items-start gap-2 group cursor-pointer">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${ev.dot}`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">{ev.title}</div>
                      <div className="text-[10px] text-slate-700">{ev.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main calendar grid */}
        <main className="flex-1 flex flex-col bg-[#030712]/60 backdrop-blur-sm border-r border-white/[0.05] overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0 bg-[#030712]/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronLeft size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronRight size={15} /></button>
              </div>
              <h2 className="text-sm font-bold text-white">Jun 13 – 19, 2026</h2>
              <button className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-lg font-bold hover:bg-amber-500/20 transition-colors">Today</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
                {["Day", "Week", "Month", "Agenda"].map((v) => (
                  <button key={v} onClick={() => setView(v as typeof view)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      view === v ? "bg-amber-500 text-black shadow-sm" : "text-slate-600 hover:text-slate-300"
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-4 py-2 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)]">
                <Plus size={13} /> Add Event
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Day headers */}
            <div className="grid sticky top-0 bg-[#030712]/90 backdrop-blur-md border-b border-white/[0.05] z-10"
              style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
              <div className="border-r border-white/[0.05]" />
              {WEEK_DAYS.map((day, i) => (
                <div key={i} className={`py-3 text-center border-r border-white/[0.04] last:border-r-0 ${i === TODAY_IDX ? "bg-amber-500/[0.04]" : ""}`}>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{day}</div>
                  <div className={`text-base font-black mx-auto w-8 h-8 flex items-center justify-center rounded-full mt-0.5 transition-all
                    ${i === TODAY_IDX ? "bg-amber-500 text-black shadow-[0_2px_10px_rgba(245,158,11,0.4)]" : "text-slate-400"}`}>
                    {WEEK_DATES[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="grid relative" style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
              <div className="border-r border-white/[0.04]">
                {HOURS.map((h) => (
                  <div key={h} className="text-[9px] text-slate-700 text-right pr-2 font-mono border-b border-white/[0.04]"
                    style={{ height: HOUR_H, paddingTop: 4 }}>
                    {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
                  </div>
                ))}
              </div>

              {WEEK_DAYS.map((_, di) => (
                <div key={di} className={`relative border-r border-white/[0.04] last:border-r-0 ${di === TODAY_IDX ? "bg-amber-500/[0.02]" : ""}`}
                  style={{ height: HOURS.length * HOUR_H }}>
                  {HOURS.map((_, hi) => (
                    <div key={hi} className="absolute w-full border-b border-white/[0.04]" style={{ top: hi * HOUR_H }} />
                  ))}
                  {HOURS.map((_, hi) => (
                    <div key={`h${hi}`} className="absolute w-full border-b border-white/[0.02] border-dashed" style={{ top: hi * HOUR_H + HOUR_H / 2 }} />
                  ))}

                  {EVENTS.filter((e) => e.day === di).map((ev) => (
                    <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                      className={`absolute left-1 right-1 rounded-xl px-2 py-1.5 text-left overflow-hidden backdrop-blur-sm ${ev.cls}
                        ${selectedEvent?.id === ev.id ? "ring-1 ring-amber-400/60 ring-offset-1 ring-offset-[#030712]" : "hover:brightness-125"}
                        transition-all shadow-sm`}
                      style={{ top: (ev.start - DAY_START) * HOUR_H + 2, height: Math.max(ev.dur * HOUR_H - 4, 20) }}>
                      <div className="text-[11px] font-bold truncate leading-tight">{ev.title}</div>
                      {ev.dur >= 0.6 && ev.attendees && (
                        <div className="text-[10px] opacity-60 truncate">{ev.attendees}</div>
                      )}
                    </button>
                  ))}

                  {di === TODAY_IDX && (
                    <div className="absolute w-full flex items-center pointer-events-none z-10"
                      style={{ top: (10.5 - DAY_START) * HOUR_H }}>
                      <div className="w-2 h-2 bg-amber-400 rounded-full -ml-1 flex-shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                      <div className="h-px flex-1 bg-amber-400/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Event detail panel */}
        <aside className="w-68 flex-shrink-0 flex flex-col bg-[#07090f] overflow-y-auto" style={{ width: 272 }}>
          {selectedEvent ? (
            <div className="m-3 space-y-3">
              {/* Event card */}
              <div className={`rounded-2xl p-4 ${selectedEvent.cls} bg-opacity-80 backdrop-blur-sm border border-white/[0.08]`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-sm leading-tight pr-2">{selectedEvent.title}</h3>
                  <button onClick={() => setSelectedEvent(null)}
                    className="p-1 rounded-lg hover:bg-black/20 flex-shrink-0 transition-colors">
                    <X size={13} />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 opacity-80">
                    <Clock size={12} />
                    <span>
                      {selectedEvent.start < 12 ? `${selectedEvent.start}:00 AM` : `${selectedEvent.start - 12 || 12}:00 PM`}
                      {" – "}
                      {(() => { const e = selectedEvent.start + selectedEvent.dur; return e < 12 ? `${e}:00 AM` : `${Math.floor(e - 12) || 12}:${String(Math.round((e % 1) * 60)).padStart(2, "0")} PM`; })()}
                    </span>
                  </div>
                  {selectedEvent.attendees && (
                    <div className="flex items-center gap-2 opacity-80"><Users size={12} /><span>{selectedEvent.attendees}</span></div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 opacity-80"><Video size={12} /><span>{selectedEvent.location}</span></div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4">
                <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-3">Actions</div>
                <div className="space-y-2">
                  {["Edit event", "Send update to attendees", "Copy invite link", "Delete event"].map((a, i) => (
                    <button key={a} className={`w-full text-left text-xs px-3 py-2.5 rounded-xl font-medium transition-all border ${
                      i === 3
                        ? "text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20"
                        : "text-slate-400 border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:text-slate-200"
                    }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendees */}
              {selectedEvent.attendees && (
                <div className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4">
                  <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-3">Attendees</div>
                  <div className="space-y-3">
                    {["Arjun Mehta (organizer)", "Alex Johnson", "Sarah Chen"].map((name, i) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0 ${
                          i === 0 ? "bg-gradient-to-tr from-amber-500 to-orange-500"
                            : i === 1 ? "bg-gradient-to-tr from-violet-500 to-indigo-500 text-white"
                            : "bg-gradient-to-tr from-teal-500 to-emerald-500 text-white"
                        }`}>
                          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-300">{name.replace(" (organizer)", "")}</div>
                          {i === 0 && <div className="text-[10px] text-slate-600">organizer</div>}
                        </div>
                        <CheckCircle size={12} className="ml-auto text-teal-400/60 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="m-3">
              <div className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4">
                <div className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={14} className="text-amber-400" /> Quick Add Event
                </div>
                <div className="space-y-3">
                  <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-amber-500/30 transition-colors" placeholder="Event title" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-600">
                      <div className="text-[10px] text-slate-700 mb-0.5">Date</div>
                      Thu, Jun 14
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-600">
                      <div className="text-[10px] text-slate-700 mb-0.5">Time</div>
                      4:00 PM
                    </div>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                    <Users size={11} className="text-slate-700" /> Add attendees…
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                    <MapPin size={11} className="text-slate-700" /> Add location or link…
                  </div>
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)]">
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
