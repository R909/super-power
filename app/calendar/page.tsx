"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Users, Clock,
  MapPin, CheckCircle, X, Loader2, Trash2, AlertTriangle,
} from "lucide-react";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const HOUR_H = 64;
const DAY_START = 8;

interface CalEvent {
  googleId: string;
  title: string;
  day: number;
  start: number;
  dur: number;
  cls: string;
  attendees?: string;
  location?: string;
  startIso: string;
  endIso: string;
}

const EVENT_COLORS = [
  "bg-amber-500/20  border-l-[3px] border-amber-400  text-amber-200",
  "bg-violet-500/20 border-l-[3px] border-violet-400 text-violet-200",
  "bg-teal-500/20   border-l-[3px] border-teal-400   text-teal-200",
  "bg-blue-500/20   border-l-[3px] border-blue-400   text-blue-200",
  "bg-emerald-500/20 border-l-[3px] border-emerald-400 text-emerald-200",
  "bg-sky-500/20    border-l-[3px] border-sky-400    text-sky-200",
  "bg-orange-500/20 border-l-[3px] border-orange-400 text-orange-200",
];

function getWeekMonday(): Date {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(): number[] {
  const mon = getWeekMonday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.getDate();
  });
}

function getTodayIndex(): number {
  const day = new Date().getDay();
  return (day + 6) % 7;
}

function formatMonth(): string {
  const mon = getWeekMonday();
  const dates = getWeekDates();
  return `${mon.toLocaleString("default", { month: "short" })} ${dates[0]} – ${dates[6]}, ${mon.getFullYear()}`;
}

function formatTime(h: number): string {
  const hr = Math.floor(h);
  const min = Math.round((h % 1) * 60);
  const ampm = hr < 12 ? "AM" : "PM";
  return `${hr > 12 ? hr - 12 : hr || 12}:${String(min).padStart(2, "0")} ${ampm}`;
}

const WEEK_DATES = getWeekDates();
const TODAY_IDX = getTodayIndex();

const CAL_DAYS_HDR = ["S", "M", "T", "W", "T", "F", "S"];
const CAL_MINI = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loadingEvts, setLoadingEvts] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [view, setView] = useState<"Day" | "Week" | "Month" | "Agenda">("Week");

  // Quick-add form
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [newTime, setNewTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");
  const [newAttendees, setNewAttendees] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [creating, setCreating] = useState(false);
  const [createDone, setCreateDone] = useState(false);
  const [createError, setCreateError] = useState("");

  // Delete state
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoadingEvts(true);
    try {
      const res = await fetch("/api/calendar/events?days=7");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load events");
      const weekMon = getWeekMonday();
      const mapped: CalEvent[] = (data.items ?? [])
        .filter((item: any) => item.start?.dateTime)
        .map((item: any, idx: number) => {
          const start = new Date(item.start.dateTime);
          const end = new Date(item.end?.dateTime ?? start.getTime() + 3600000);
          const dayIdx = Math.floor((start.getTime() - weekMon.getTime()) / 86400000);
          if (dayIdx < 0 || dayIdx > 6) return null;
          const startHr = start.getHours() + start.getMinutes() / 60;
          const dur = Math.max((end.getTime() - start.getTime()) / 3600000, 0.25);
          return {
            googleId: item.id,
            title: item.summary ?? "Untitled",
            day: dayIdx,
            start: startHr,
            dur,
            cls: EVENT_COLORS[idx % EVENT_COLORS.length],
            attendees: item.attendees?.map((a: any) => a.displayName ?? a.email).join(", "),
            location: item.location,
            startIso: item.start.dateTime,
            endIso: item.end?.dateTime ?? end.toISOString(),
          } satisfies CalEvent;
        })
        .filter(Boolean) as CalEvent[];
      setEvents(mapped);
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvts(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  async function handleCreateEvent() {
    if (!newTitle.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const startDt = new Date(`${newDate}T${newTime}`);
      const endDt = new Date(`${newDate}T${newEndTime}`);
      if (endDt <= startDt) {
        setCreateError("End time must be after start time");
        return;
      }
      const attendeeList = newAttendees
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: newTitle.trim(),
          start: startDt.toISOString(),
          end: endDt.toISOString(),
          attendees: attendeeList,
          location: newLocation.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create event");
      setCreateDone(true);
      setNewTitle(""); setNewAttendees(""); setNewLocation("");
      await loadEvents();
      setTimeout(() => setCreateDone(false), 2000);
    } catch (err: any) {
      setCreateError(err.message ?? "Failed to create event");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteEvent(ev: CalEvent) {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/calendar/events/${ev.googleId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      setSelectedEvent(null);
      await loadEvents();
    } catch (err: any) {
      setDeleteError(err.message ?? "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="h-screen flex-1 overflow-hidden flex bg-[#030712] relative">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
        @keyframes scan-line { 0%{top:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[140px] pointer-events-none z-0" style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none z-0" style={{ animation: "float-b 12s ease-in-out infinite" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/[0.06] to-transparent pointer-events-none z-0" style={{ animation: "scan-line 14s linear infinite 2s" }} />

      <div className="relative z-10 flex w-full h-full">
        {/* Mini calendar + upcoming */}
        <aside className="w-56 flex-shrink-0 flex flex-col bg-[#07090f] border-r border-white/[0.05] overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all mb-4"
            >
              <Plus size={14} /> New Event
            </button>

            {/* Mini calendar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">
                  {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
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
                      ${d === new Date().getDate() ? "bg-amber-500 text-black font-bold shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                        : d && d >= WEEK_DATES[0] && d <= WEEK_DATES[6] ? "bg-white/[0.07] text-slate-300 font-semibold hover:bg-amber-500/20 hover:text-amber-300"
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
              {loadingEvts && (
                <div className="flex items-center gap-2 text-slate-700 text-xs">
                  <Loader2 size={11} className="animate-spin" /> Loading…
                </div>
              )}
              {!loadingEvts && events.length === 0 && (
                <p className="text-[10px] text-slate-700">No events this week.</p>
              )}
              <div className="space-y-2.5">
                {events.slice(0, 6).map((ev, i) => {
                  const dotColors = ["bg-amber-400", "bg-violet-400", "bg-teal-400", "bg-blue-400", "bg-emerald-400", "bg-sky-400"];
                  return (
                    <div key={ev.googleId} className="flex items-start gap-2 group cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${dotColors[i % dotColors.length]}`} />
                      <div>
                        <div className="text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">{ev.title}</div>
                        <div className="text-[10px] text-slate-700">{WEEK_DAYS[ev.day]} · {formatTime(ev.start)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main calendar grid */}
        <main className="flex-1 flex flex-col bg-[#030712]/60 backdrop-blur-sm border-r border-white/[0.05] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0 bg-[#030712]/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronLeft size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-600 transition-colors"><ChevronRight size={15} /></button>
              </div>
              <h2 className="text-sm font-bold text-white">{formatMonth()}</h2>
              <button className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-lg font-bold hover:bg-amber-500/20 transition-colors">Today</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
                {(["Day", "Week", "Month", "Agenda"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${view === v ? "bg-amber-500 text-black shadow-sm" : "text-slate-600 hover:text-slate-300"}`}>
                    {v}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-4 py-2 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)]"
              >
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
                  <div className={`text-base font-black mx-auto w-8 h-8 flex items-center justify-center rounded-full mt-0.5 transition-all ${i === TODAY_IDX ? "bg-amber-500 text-black shadow-[0_2px_10px_rgba(245,158,11,0.4)]" : "text-slate-400"}`}>
                    {WEEK_DATES[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            {loadingEvts ? (
              <div className="flex items-center justify-center h-64 text-slate-600 gap-2 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading events…
              </div>
            ) : (
              <div className="grid relative" style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
                <div className="border-r border-white/[0.04]">
                  {HOURS.map((h) => (
                    <div key={h} className="text-[9px] text-slate-700 text-right pr-2 font-mono border-b border-white/[0.04]" style={{ height: HOUR_H, paddingTop: 4 }}>
                      {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
                    </div>
                  ))}
                </div>

                {WEEK_DAYS.map((_, di) => (
                  <div key={di} className={`relative border-r border-white/[0.04] last:border-r-0 ${di === TODAY_IDX ? "bg-amber-500/[0.02]" : ""}`} style={{ height: HOURS.length * HOUR_H }}>
                    {HOURS.map((_, hi) => (
                      <div key={hi} className="absolute w-full border-b border-white/[0.04]" style={{ top: hi * HOUR_H }} />
                    ))}
                    {HOURS.map((_, hi) => (
                      <div key={`h${hi}`} className="absolute w-full border-b border-white/[0.02] border-dashed" style={{ top: hi * HOUR_H + HOUR_H / 2 }} />
                    ))}

                    {events.filter((e) => e.day === di).map((ev) => (
                      <button key={ev.googleId} onClick={() => setSelectedEvent(ev)}
                        className={`absolute left-1 right-1 rounded-xl px-2 py-1.5 text-left overflow-hidden backdrop-blur-sm ${ev.cls} ${selectedEvent?.googleId === ev.googleId ? "ring-1 ring-amber-400/60 ring-offset-1 ring-offset-[#030712]" : "hover:brightness-125"} transition-all shadow-sm`}
                        style={{ top: Math.max((ev.start - DAY_START) * HOUR_H + 2, 2), height: Math.max(ev.dur * HOUR_H - 4, 20) }}>
                        <div className="text-[11px] font-bold truncate leading-tight">{ev.title}</div>
                        {ev.dur >= 0.6 && ev.attendees && (
                          <div className="text-[10px] opacity-60 truncate">{ev.attendees}</div>
                        )}
                      </button>
                    ))}

                    {di === TODAY_IDX && (
                      <div className="absolute w-full flex items-center pointer-events-none z-10"
                        style={{ top: (new Date().getHours() + new Date().getMinutes() / 60 - DAY_START) * HOUR_H }}>
                        <div className="w-2 h-2 bg-amber-400 rounded-full -ml-1 flex-shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                        <div className="h-px flex-1 bg-amber-400/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right panel: event detail or quick-add */}
        <aside className="w-68 flex-shrink-0 flex flex-col bg-[#07090f] overflow-y-auto" style={{ width: 272 }}>
          {selectedEvent ? (
            <div className="m-3 space-y-3">
              {/* Event card */}
              <div className={`rounded-2xl p-4 ${selectedEvent.cls} bg-opacity-80 backdrop-blur-sm border border-white/[0.08]`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-sm leading-tight pr-2">{selectedEvent.title}</h3>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg hover:bg-black/20 flex-shrink-0 transition-colors">
                    <X size={13} />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 opacity-80">
                    <Clock size={12} />
                    <span>{formatTime(selectedEvent.start)} – {formatTime(selectedEvent.start + selectedEvent.dur)}</span>
                  </div>
                  {selectedEvent.attendees && (
                    <div className="flex items-center gap-2 opacity-80"><Users size={12} /><span className="truncate">{selectedEvent.attendees}</span></div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 opacity-80"><MapPin size={12} /><span className="truncate">{selectedEvent.location}</span></div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4">
                <div className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mb-3">Actions</div>
                {deleteError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mb-3">
                    <AlertTriangle size={11} /> {deleteError}
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    disabled={deleting}
                    className="w-full flex items-center justify-center gap-2 text-left text-xs px-3 py-2.5 rounded-xl font-medium transition-all border text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    {deleting ? "Deleting…" : "Delete event"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="m-3">
              <div className="bg-[#090d16] border border-white/[0.06] rounded-2xl p-4">
                <div className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={14} className="text-amber-400" /> New Event
                </div>
                <div className="space-y-3">
                  <input
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-amber-500/30 transition-colors"
                    placeholder="Event title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                      <div className="text-[10px] text-slate-700 mb-0.5">Date</div>
                      <input type="date" className="bg-transparent outline-none text-slate-400 w-full text-[11px]" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                      <div className="text-[10px] text-slate-700 mb-0.5">Start</div>
                      <input type="time" className="bg-transparent outline-none text-slate-400 w-full text-[11px]" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                    <div className="text-[10px] text-slate-700 mb-0.5">End time</div>
                    <input type="time" className="bg-transparent outline-none text-slate-400 w-full text-[11px]" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <Users size={11} className="text-slate-700 flex-shrink-0" />
                    <input
                      className="bg-transparent outline-none text-slate-400 text-xs w-full placeholder:text-slate-700"
                      placeholder="Attendees: a@b.com, c@d.com"
                      value={newAttendees}
                      onChange={(e) => setNewAttendees(e.target.value)}
                    />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <MapPin size={11} className="text-slate-700 flex-shrink-0" />
                    <input
                      className="bg-transparent outline-none text-slate-400 text-xs w-full placeholder:text-slate-700"
                      placeholder="Location or meeting link"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                  </div>

                  {createError && <p className="text-[11px] text-red-400">{createError}</p>}

                  <button
                    onClick={handleCreateEvent}
                    disabled={creating || !newTitle.trim()}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createDone
                      ? <><CheckCircle size={12} /> Created!</>
                      : creating
                      ? <><Loader2 size={12} className="animate-spin" /> Creating…</>
                      : "Create Event"}
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
