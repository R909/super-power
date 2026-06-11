"use client";
import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Calendar, Users, Clock,
  MapPin, Video, MoreHorizontal, CheckCircle, X,
} from "lucide-react";
import Background from "../components/background";
import Sidebar from "../components/sidebar";

// ─── Data ────────────────────────────────────────────────────────────────────

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_DATES = [13, 14, 15, 16, 17, 18, 19];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const HOUR_H = 64; // px per hour
const DAY_START = 8;
const TODAY_IDX = 3; // Thursday

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
  { id: 1,  title: "Team Standup",             day: 0, start: 9,    dur: 0.83, cls: "bg-pink-100/90   border-l-[3px] border-pink-400   text-pink-900",   attendees: "5 people"              },
  { id: 2,  title: "Team Standup",             day: 1, start: 9,    dur: 0.83, cls: "bg-pink-100/90   border-l-[3px] border-pink-400   text-pink-900"                                        },
  { id: 3,  title: "Team Standup",             day: 2, start: 9,    dur: 0.83, cls: "bg-pink-100/90   border-l-[3px] border-pink-400   text-pink-900"                                        },
  { id: 4,  title: "Team Standup",             day: 3, start: 9,    dur: 0.83, cls: "bg-pink-100/90   border-l-[3px] border-pink-400   text-pink-900",   attendees: "5 people"              },
  { id: 5,  title: "Team Standup",             day: 4, start: 9,    dur: 0.83, cls: "bg-pink-100/90   border-l-[3px] border-pink-400   text-pink-900"                                        },
  { id: 6,  title: "Project Sync",             day: 0, start: 10,   dur: 1,    cls: "bg-violet-100/90 border-l-[3px] border-violet-400 text-violet-900", attendees: "Alex, Sarah",          location: "Google Meet" },
  { id: 7,  title: "Design Review",            day: 2, start: 14,   dur: 1.5,  cls: "bg-teal-100/90   border-l-[3px] border-teal-400   text-teal-900",   attendees: "Robert, Maria"         },
  { id: 8,  title: "Lunch",                    day: 3, start: 12.5, dur: 1,    cls: "bg-green-100/90  border-l-[3px] border-green-400  text-green-900"                                       },
  { id: 9,  title: "Project Sync (Reschedule)",day: 3, start: 15,   dur: 0.5,  cls: "bg-amber-100/90  border-l-[3px] border-amber-400  text-amber-900",  attendees: "Alex, Sarah"           },
  { id: 10, title: "Quick Call",               day: 4, start: 11.5, dur: 1,    cls: "bg-sky-100/90    border-l-[3px] border-sky-400    text-sky-900",    attendees: "David Kim"             },
  { id: 11, title: "Hiring Interview",         day: 1, start: 14,   dur: 1,    cls: "bg-purple-100/90 border-l-[3px] border-purple-400 text-purple-900", attendees: "HR Team"               },
];

const UPCOMING = [
  { title: "Team Standup",               when: "Today · 9:00 AM",        dot: "bg-pink-400"   },
  { title: "Project Sync",               when: "Today · 10:00 AM",       dot: "bg-violet-400" },
  { title: "Lunch",                      when: "Today · 12:30 PM",       dot: "bg-green-400"  },
  { title: "Project Sync (Rescheduled)", when: "Today · 3:00 PM",        dot: "bg-amber-400"  },
  { title: "Team Standup",               when: "Tomorrow · 9:00 AM",     dot: "bg-pink-400"   },
  { title: "Project Sync",               when: "Tomorrow · 4:00 PM",     dot: "bg-violet-400" },
];

const CAL_DAYS_HDR = ["S","M","T","W","T","F","S"];
const CAL_MINI = [
  [null,null,null,1,2,3,4],
  [5,6,7,8,9,10,11],
  [12,13,14,15,16,17,18],
  [19,20,21,22,23,24,25],
  [26,27,28,29,30,31,null],
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(EVENTS[6]);
  const [view, setView] = useState<"Day" | "Week" | "Month" | "Agenda">("Week");

  return (
    <>
      <Background />
      <div className="h-screen w-screen overflow-hidden flex">
        <Sidebar />

        {/* ── Left Panel: mini calendar + upcoming ────────────────────── */}
        <aside className="w-60 flex-shrink-0 flex flex-col bg-white/15 backdrop-blur-2xl border-r border-white/25 overflow-y-auto">
          <div className="p-4">
            {/* Create event */}
            <button className="w-full flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors mb-4">
              <Plus size={15} /> New Event
            </button>

            {/* Mini month calendar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">May 2024</span>
                <div className="flex gap-0.5">
                  <button className="p-1 rounded hover:bg-white/40"><ChevronLeft size={13} className="text-slate-400" /></button>
                  <button className="p-1 rounded hover:bg-white/40"><ChevronRight size={13} className="text-slate-400" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center mb-1">
                {CAL_DAYS_HDR.map((d, i) => <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>)}
              </div>
              {CAL_MINI.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 text-center">
                  {week.map((d, di) => (
                    <div key={di} className={`text-[11px] mx-auto w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-colors
                      ${d === 16 ? "bg-pink-400 text-white font-bold" : d && d >= 13 && d <= 19 ? "bg-white/40 text-slate-700 font-semibold hover:bg-pink-50/60"
                        : d ? "hover:bg-white/30 text-slate-500" : ""}`}>
                      {d}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Upcoming events */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</div>
              <div className="space-y-2">
                {UPCOMING.map((ev, i) => (
                  <div key={i} className="flex items-start gap-2 group cursor-pointer">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${ev.dot}`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-700 group-hover:text-pink-500 transition-colors">{ev.title}</div>
                      <div className="text-[10px] text-slate-400">{ev.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Calendar Grid ───────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col bg-white/10 backdrop-blur-2xl border-r border-white/25 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-white/40 text-slate-500"><ChevronLeft size={16} /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/40 text-slate-500"><ChevronRight size={16} /></button>
              </div>
              <h2 className="text-base font-bold text-slate-900">May 13 – 19, 2024</h2>
              <button className="text-xs bg-teal-400 text-white px-3 py-1 rounded-lg font-semibold hover:bg-teal-500 transition-colors">Today</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/30 rounded-xl p-1 border border-white/40">
                {["Day","Week","Month","Agenda"].map((v) => (
                  <button key={v} onClick={() => setView(v as typeof view)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                      ${view === v ? "bg-white/80 text-pink-500 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}>
                    {v}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-pink-400 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-pink-500 transition-colors shadow-sm">
                <Plus size={14} /> Add Event
              </button>
            </div>
          </div>

          {/* Week grid */}
          <div className="flex-1 overflow-auto">
            {/* Day headers */}
            <div className="grid sticky top-0 bg-white/30 backdrop-blur-sm border-b border-white/30 z-10"
              style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
              <div className="border-r border-white/30" />
              {WEEK_DAYS.map((day, i) => (
                <div key={i} className={`py-3 text-center border-r border-white/20 last:border-r-0
                  ${i === TODAY_IDX ? "bg-pink-50/40" : ""}`}>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{day}</div>
                  <div className={`text-lg font-bold mx-auto w-9 h-9 flex items-center justify-center rounded-full mt-0.5
                    ${i === TODAY_IDX ? "bg-pink-400 text-white" : "text-slate-800"}`}>
                    {WEEK_DATES[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="grid relative" style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
              {/* Time labels */}
              <div className="border-r border-white/20">
                {HOURS.map((h) => (
                  <div key={h} className="text-[10px] text-slate-400 text-right pr-2 font-medium border-b border-white/10"
                    style={{ height: HOUR_H, paddingTop: 4 }}>
                    {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {WEEK_DAYS.map((_, di) => (
                <div key={di} className={`relative border-r border-white/20 last:border-r-0
                  ${di === TODAY_IDX ? "bg-pink-50/20" : ""}`}
                  style={{ height: HOURS.length * HOUR_H }}>
                  {/* Hour lines */}
                  {HOURS.map((_, hi) => (
                    <div key={hi} className="absolute w-full border-b border-white/20"
                      style={{ top: hi * HOUR_H }} />
                  ))}
                  {/* Half-hour lines */}
                  {HOURS.map((_, hi) => (
                    <div key={`h${hi}`} className="absolute w-full border-b border-white/10 border-dashed"
                      style={{ top: hi * HOUR_H + HOUR_H / 2 }} />
                  ))}

                  {/* Events */}
                  {EVENTS.filter((e) => e.day === di).map((ev) => (
                    <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                      className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-left overflow-hidden ${ev.cls}
                        ${selectedEvent?.id === ev.id ? "ring-2 ring-pink-400 ring-offset-1" : "hover:brightness-95"}
                        transition-all shadow-sm`}
                      style={{
                        top: (ev.start - DAY_START) * HOUR_H + 2,
                        height: Math.max(ev.dur * HOUR_H - 4, 20),
                      }}>
                      <div className="text-[11px] font-bold truncate leading-tight">{ev.title}</div>
                      {ev.dur >= 0.6 && ev.attendees && (
                        <div className="text-[10px] opacity-70 truncate">{ev.attendees}</div>
                      )}
                    </button>
                  ))}

                  {/* Current time indicator (today only) */}
                  {di === TODAY_IDX && (
                    <div className="absolute w-full flex items-center pointer-events-none z-10"
                      style={{ top: (10.5 - DAY_START) * HOUR_H }}>
                      <div className="w-2.5 h-2.5 bg-pink-500 rounded-full -ml-1.5 flex-shrink-0 shadow" />
                      <div className="h-[2px] flex-1 bg-pink-500 opacity-80" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── Event Detail Panel ──────────────────────────────────────── */}
        <aside className="w-72 flex-shrink-0 flex flex-col bg-white/10 backdrop-blur-2xl overflow-y-auto">
          {selectedEvent ? (
            <div className="m-3">
              {/* Event card */}
              <div className={`rounded-2xl p-4 mb-3 shadow-sm ${selectedEvent.cls} bg-opacity-60`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-base leading-tight pr-2">{selectedEvent.title}</h3>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg hover:bg-black/10 flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 opacity-80">
                    <Clock size={13} />
                    <span>
                      {selectedEvent.start < 12 ? `${selectedEvent.start}:00 AM` : `${selectedEvent.start - 12 || 12}:00 PM`}
                      {" – "}
                      {(() => { const e = selectedEvent.start + selectedEvent.dur; return e < 12 ? `${e}:00 AM` : `${Math.floor(e - 12) || 12}:${String(Math.round((e % 1) * 60)).padStart(2, "0")} PM`; })()}
                    </span>
                  </div>
                  {selectedEvent.attendees && (
                    <div className="flex items-center gap-2 opacity-80">
                      <Users size={13} />
                      <span>{selectedEvent.attendees}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 opacity-80">
                      <Video size={13} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/35 backdrop-blur-md rounded-2xl border border-white/45 p-4 mb-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</div>
                <div className="space-y-2">
                  {["Edit event", "Send update to attendees", "Copy invite link", "Delete event"].map((a, i) => (
                    <button key={a} className={`w-full text-left text-xs px-3 py-2.5 rounded-xl font-medium transition-colors border
                      ${i === 3 ? "text-red-500 border-red-100 bg-red-50/50 hover:bg-red-100/50"
                        : "text-slate-700 border-white/50 bg-white/30 hover:bg-white/50"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendees */}
              {selectedEvent.attendees && (
                <div className="bg-white/35 backdrop-blur-md rounded-2xl border border-white/45 p-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Attendees</div>
                  <div className="space-y-2">
                    {["Arjun Mehta (organizer)", "Alex Johnson", "Sarah Chen"].map((name, i) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0
                          ${i === 0 ? "bg-pink-400" : i === 1 ? "bg-violet-400" : "bg-emerald-400"}`}>
                          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{name.replace(" (organizer)", "")}</div>
                          {i === 0 && <div className="text-[10px] text-slate-400">organizer</div>}
                        </div>
                        <CheckCircle size={13} className="ml-auto text-teal-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quick create form */
            <div className="m-3">
              <div className="bg-white/35 backdrop-blur-md rounded-2xl border border-white/45 p-4">
                <div className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Plus size={15} className="text-pink-400" /> Quick Add Event
                </div>
                <div className="space-y-3">
                  <input className="w-full bg-white/40 border border-white/60 rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 text-slate-800 focus:border-pink-300" placeholder="Event title" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/40 border border-white/60 rounded-xl px-3 py-2.5 text-xs text-slate-500">
                      <div className="text-[10px] text-slate-400 mb-0.5">Date</div>
                      Thu, May 16
                    </div>
                    <div className="bg-white/40 border border-white/60 rounded-xl px-3 py-2.5 text-xs text-slate-500">
                      <div className="text-[10px] text-slate-400 mb-0.5">Time</div>
                      4:00 PM
                    </div>
                  </div>
                  <div className="bg-white/40 border border-white/60 rounded-xl px-3 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                    <Users size={12} className="text-slate-400" />
                    Add attendees…
                  </div>
                  <div className="bg-white/40 border border-white/60 rounded-xl px-3 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                    <MapPin size={12} className="text-slate-400" />
                    Add location or link…
                  </div>
                  <button className="w-full bg-pink-400 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-pink-500 transition-colors shadow-sm">
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
