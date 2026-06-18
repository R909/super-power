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

const T = {
  bg:       "#fce7f3",
  surface:  "#fff5f8",
  border:   "rgba(225,29,72,0.10)",
  accent:   "#e11d48",
  accentLt: "rgba(225,29,72,0.08)",
  pri:      "#1a0008",
  sec:      "#7f1d1d",
  muted:    "#c084a0",
  dim:      "#e9b8c8",
  gradient: "linear-gradient(135deg,#fb7185,#e11d48,#be123c)",
};

const EVENT_COLORS = [
  "bg-rose-500/20   border-l-[3px] border-rose-400   text-rose-700",
  "bg-pink-500/20   border-l-[3px] border-pink-400   text-pink-700",
  "bg-fuchsia-500/20 border-l-[3px] border-fuchsia-400 text-fuchsia-700",
  "bg-red-500/20    border-l-[3px] border-red-400    text-red-700",
  "bg-rose-400/20   border-l-[3px] border-rose-500   text-rose-800",
  "bg-pink-400/20   border-l-[3px] border-pink-500   text-pink-800",
  "bg-fuchsia-400/20 border-l-[3px] border-fuchsia-500 text-fuchsia-800",
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
    <div className="h-screen flex-1 overflow-hidden flex relative" style={{ background: T.bg }}>
      <style>{`
        @keyframes float-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.04)} }
        @keyframes float-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,22px) scale(0.97)} }
      `}</style>

      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0" style={{ background: "rgba(225,29,72,0.07)", filter: "blur(120px)", animation: "float-a 16s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none z-0" style={{ background: "rgba(251,113,133,0.06)", filter: "blur(110px)", animation: "float-b 12s ease-in-out infinite" }} />

      <div className="relative z-10 flex w-full h-full">
        {/* Mini calendar + upcoming */}
        <aside className="w-56 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
          <div className="p-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all mb-4 hover:opacity-90"
              style={{ background: T.gradient, boxShadow: "0 4px 14px rgba(225,29,72,0.25)" }}
            >
              <Plus size={14} /> New Event
            </button>

            {/* Mini calendar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold" style={{ color: T.pri }}>
                  {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <div className="flex gap-0.5">
                  <button className="p-1 rounded-lg transition-colors" style={{ color: T.muted }} onMouseEnter={e => (e.currentTarget.style.background = T.accentLt)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><ChevronLeft size={12} /></button>
                  <button className="p-1 rounded-lg transition-colors" style={{ color: T.muted }} onMouseEnter={e => (e.currentTarget.style.background = T.accentLt)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><ChevronRight size={12} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center mb-1">
                {CAL_DAYS_HDR.map((d, i) => <div key={i} className="text-[9px] font-bold py-1" style={{ color: T.dim }}>{d}</div>)}
              </div>
              {CAL_MINI.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 text-center">
                  {week.map((d, di) => (
                    <div key={di} className="text-[10px] mx-auto w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all"
                      style={
                        d === new Date().getDate()
                          ? { background: T.gradient, color: "#fff", fontWeight: 700, boxShadow: "0 2px 8px rgba(225,29,72,0.35)" }
                          : d && d >= WEEK_DATES[0] && d <= WEEK_DATES[6]
                          ? { background: T.accentLt, color: T.accent, fontWeight: 600 }
                          : { color: d ? T.muted : "transparent" }
                      }>
                      {d}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: T.dim }}>Upcoming</div>
              {loadingEvts && (
                <div className="flex items-center gap-2 text-xs" style={{ color: T.muted }}>
                  <Loader2 size={11} className="animate-spin" /> Loading…
                </div>
              )}
              {!loadingEvts && events.length === 0 && (
                <p className="text-[10px]" style={{ color: T.muted }}>No events this week.</p>
              )}
              <div className="space-y-2.5">
                {events.slice(0, 6).map((ev) => (
                  <div key={ev.googleId} className="flex items-start gap-2 group cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: T.accent }} />
                    <div>
                      <div className="text-xs font-semibold transition-colors" style={{ color: T.sec }}>{ev.title}</div>
                      <div className="text-[10px]" style={{ color: T.muted }}>{WEEK_DAYS[ev.day]} · {formatTime(ev.start)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main calendar grid */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ background: "rgba(252,231,243,0.6)", backdropFilter: "blur(4px)", borderRight: `1px solid ${T.border}` }}>
          <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: T.muted }} onMouseEnter={e => (e.currentTarget.style.background = T.accentLt)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><ChevronLeft size={15} /></button>
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: T.muted }} onMouseEnter={e => (e.currentTarget.style.background = T.accentLt)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><ChevronRight size={15} /></button>
              </div>
              <h2 className="text-sm font-bold" style={{ color: T.pri }}>{formatMonth()}</h2>
              <button className="text-[11px] font-bold px-3 py-1 rounded-lg transition-colors" style={{ background: T.accentLt, color: T.accent, border: `1px solid ${T.border}` }}>Today</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl p-1" style={{ background: T.accentLt, border: `1px solid ${T.border}` }}>
                {(["Day", "Week", "Month", "Agenda"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={view === v ? { background: T.gradient, color: "#fff", boxShadow: "0 2px 6px rgba(225,29,72,0.25)" } : { color: T.muted }}>
                    {v}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: T.gradient, boxShadow: "0 4px 14px rgba(225,29,72,0.25)" }}
              >
                <Plus size={13} /> Add Event
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Day headers */}
            <div className="grid sticky top-0 backdrop-blur-md z-10"
              style={{ gridTemplateColumns: `52px repeat(7, 1fr)`, background: T.surface, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ borderRight: `1px solid ${T.border}` }} />
              {WEEK_DAYS.map((day, i) => (
                <div key={i} className="py-3 text-center" style={{ borderRight: i < 6 ? `1px solid ${T.border}` : undefined, background: i === TODAY_IDX ? T.accentLt : undefined }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.dim }}>{day}</div>
                  <div className="text-base font-black mx-auto w-8 h-8 flex items-center justify-center rounded-full mt-0.5 transition-all"
                    style={i === TODAY_IDX
                      ? { background: T.gradient, color: "#fff", boxShadow: "0 2px 10px rgba(225,29,72,0.35)" }
                      : { color: T.sec }}>
                    {WEEK_DATES[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            {loadingEvts ? (
              <div className="flex items-center justify-center h-64 gap-2 text-sm" style={{ color: T.muted }}>
                <Loader2 size={16} className="animate-spin" /> Loading events…
              </div>
            ) : (
              <div className="grid relative" style={{ gridTemplateColumns: `52px repeat(7, 1fr)` }}>
                <div style={{ borderRight: `1px solid ${T.border}` }}>
                  {HOURS.map((h) => (
                    <div key={h} className="text-[9px] text-right pr-2 font-mono" style={{ height: HOUR_H, paddingTop: 4, color: T.dim, borderBottom: `1px solid ${T.border}` }}>
                      {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
                    </div>
                  ))}
                </div>

                {WEEK_DAYS.map((_, di) => (
                  <div key={di} className="relative" style={{ height: HOURS.length * HOUR_H, borderRight: di < 6 ? `1px solid ${T.border}` : undefined, background: di === TODAY_IDX ? T.accentLt : undefined }}>
                    {HOURS.map((_, hi) => (
                      <div key={hi} className="absolute w-full" style={{ top: hi * HOUR_H, borderBottom: `1px solid ${T.border}` }} />
                    ))}
                    {HOURS.map((_, hi) => (
                      <div key={`h${hi}`} className="absolute w-full border-dashed" style={{ top: hi * HOUR_H + HOUR_H / 2, borderBottom: `1px solid rgba(225,29,72,0.06)` }} />
                    ))}

                    {events.filter((e) => e.day === di).map((ev) => (
                      <button key={ev.googleId} onClick={() => setSelectedEvent(ev)}
                        className={`absolute left-1 right-1 rounded-xl px-2 py-1.5 text-left overflow-hidden ${ev.cls} transition-all shadow-sm`}
                        style={{
                          top: Math.max((ev.start - DAY_START) * HOUR_H + 2, 2),
                          height: Math.max(ev.dur * HOUR_H - 4, 20),
                          outline: selectedEvent?.googleId === ev.googleId ? `1.5px solid ${T.accent}` : undefined,
                        }}>
                        <div className="text-[11px] font-bold truncate leading-tight">{ev.title}</div>
                        {ev.dur >= 0.6 && ev.attendees && (
                          <div className="text-[10px] opacity-60 truncate">{ev.attendees}</div>
                        )}
                      </button>
                    ))}

                    {di === TODAY_IDX && (
                      <div className="absolute w-full flex items-center pointer-events-none z-10"
                        style={{ top: (new Date().getHours() + new Date().getMinutes() / 60 - DAY_START) * HOUR_H }}>
                        <div className="w-2 h-2 rounded-full -ml-1 flex-shrink-0" style={{ background: T.accent, boxShadow: `0 0 6px ${T.accent}` }} />
                        <div className="h-px flex-1" style={{ background: `${T.accent}99` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right panel: event detail or quick-add */}
        <aside className="w-68 flex-shrink-0 flex flex-col overflow-y-auto" style={{ width: 272, background: T.surface }}>
          {selectedEvent ? (
            <div className="m-3 space-y-3">
              {/* Event card */}
              <div className={`rounded-2xl p-4 ${selectedEvent.cls} backdrop-blur-sm`} style={{ border: `1px solid ${T.border}` }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-sm leading-tight pr-2">{selectedEvent.title}</h3>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg transition-colors hover:bg-black/10 flex-shrink-0">
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
              <div className="rounded-2xl p-4" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: T.dim }}>Actions</div>
                {deleteError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mb-3">
                    <AlertTriangle size={11} /> {deleteError}
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    disabled={deleting}
                    className="w-full flex items-center justify-center gap-2 text-left text-xs px-3 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100"
                  >
                    {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    {deleting ? "Deleting…" : "Delete event"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="m-3">
              <div className="rounded-2xl p-4" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                <div className="text-xs font-bold mb-4 flex items-center gap-2" style={{ color: T.pri }}>
                  <Plus size={14} style={{ color: T.accent }} /> New Event
                </div>
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
                    style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.pri }}
                    placeholder="Event title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = T.accent)}
                    onBlur={e => (e.currentTarget.style.borderColor = T.border)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl px-3 py-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                      <div className="text-[10px] mb-0.5" style={{ color: T.muted }}>Date</div>
                      <input type="date" className="bg-transparent outline-none w-full text-[11px]" style={{ color: T.sec }} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>
                    <div className="rounded-xl px-3 py-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                      <div className="text-[10px] mb-0.5" style={{ color: T.muted }}>Start</div>
                      <input type="time" className="bg-transparent outline-none w-full text-[11px]" style={{ color: T.sec }} value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                    <div className="text-[10px] mb-0.5" style={{ color: T.muted }}>End time</div>
                    <input type="time" className="bg-transparent outline-none w-full text-[11px]" style={{ color: T.sec }} value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
                  </div>
                  <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                    <Users size={11} className="flex-shrink-0" style={{ color: T.dim }} />
                    <input
                      className="bg-transparent outline-none text-xs w-full"
                      style={{ color: T.sec }}
                      placeholder="Attendees: a@b.com, c@d.com"
                      value={newAttendees}
                      onChange={(e) => setNewAttendees(e.target.value)}
                    />
                  </div>
                  <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                    <MapPin size={11} className="flex-shrink-0" style={{ color: T.dim }} />
                    <input
                      className="bg-transparent outline-none text-xs w-full"
                      style={{ color: T.sec }}
                      placeholder="Location or meeting link"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                  </div>

                  {createError && <p className="text-[11px] text-red-500">{createError}</p>}

                  <button
                    onClick={handleCreateEvent}
                    disabled={creating || !newTitle.trim()}
                    className="w-full text-white text-xs font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ background: T.gradient, boxShadow: "0 4px 14px rgba(225,29,72,0.25)" }}
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
