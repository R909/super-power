"use client";
import { useState, useEffect, type ElementType } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useInboxLoading } from "@/app/components/providers/inbox-loading-provider";
import {
  AlertCircle, Archive, Calendar, CheckCircle, Clock,
  FileText, Inbox, LayoutDashboard, MessageSquare, Plug, Plus,
  Send, Settings, Star, Trash2, X, Loader2, WifiOff,
} from "lucide-react";

const NAV: { icon: ElementType; label: string; href: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard"    },
  { icon: Calendar,        label: "Calendar",     href: "/calendar"     },
  { icon: MessageSquare,   label: "AI Agent",     href: "/chat"         },
  { icon: Plug,            label: "Integrations", href: "/integrations" },
  { icon: Settings,        label: "Settings",     href: "/settings"     },
];

const FOLDERS: { icon: ElementType; label: string; query: string; countKey?: string }[] = [
  { icon: Inbox,       label: "Inbox",    query: "in:inbox",    countKey: "inbox"   },
  { icon: Star,        label: "Starred",  query: "is:starred",  countKey: "starred" },
  { icon: Clock,       label: "Snoozed",  query: "is:snoozed"                        },
  { icon: Send,        label: "Sent",     query: "in:sent"                           },
  { icon: FileText,    label: "Drafts",   query: "in:drafts",   countKey: "drafts"  },
  { icon: AlertCircle, label: "Spam",     query: "in:spam",     countKey: "spam"    },
  { icon: Archive,     label: "All Mail", query: "in:all"                            },
  { icon: Trash2,      label: "Trash",    query: "in:trash"                         },
];

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

const NO_SIDEBAR_ROUTES = ["/", "/login"];

interface FolderCounts {
  inbox?: number;
  starred?: number;
  drafts?: number;
  spam?: number;
}

interface ConnectionStatus {
  gmail: boolean;
  googlecalendar: boolean;
}

async function fetchCount(query: string): Promise<number> {
  try {
    const res = await fetch(
      `/api/gmail/threads?q=${encodeURIComponent(query)}&maxResults=1`,
      { cache: "no-store" }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.resultSizeEstimate ?? 0;
  } catch {
    return 0;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { inboxLoading } = useInboxLoading();

  const [composeOpen, setComposeOpen] = useState(false);
  const [to,          setTo]          = useState("");
  const [subject,     setSubject]     = useState("");
  const [body,        setBody]        = useState("");
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [sendError,   setSendError]   = useState("");

  const [counts,        setCounts]        = useState<FolderCounts>({});
  const [connected,     setConnected]     = useState<ConnectionStatus | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [pendingFolder, setPendingFolder] = useState<string | null>(null);

  const isMailRoute = !NO_SIDEBAR_ROUTES.includes(pathname);

  // Derive the active folder from live URL params (reactive)
  const currentFolder = pathname === "/dashboard" ? (searchParams.get("q") ?? "in:inbox") : null;

  useEffect(() => {
    if (!isMailRoute) return;

    async function loadSidebarData() {
      setLoadingCounts(true);
      try {
        const [statusRes, inboxCount, starredCount, draftsCount, spamCount] =
          await Promise.allSettled([
            fetch("/api/integrations/status").then((r) => r.json()),
            fetchCount("in:inbox is:unread"),
            fetchCount("is:starred"),
            fetchCount("in:drafts"),
            fetchCount("in:spam"),
          ]);

        if (statusRes.status === "fulfilled") {
          setConnected({
            gmail:          statusRes.value?.gmail?.connected ?? false,
            googlecalendar: statusRes.value?.googlecalendar?.connected ?? false,
          });
        }

        setCounts({
          inbox:   inboxCount.status   === "fulfilled" ? inboxCount.value   : 0,
          starred: starredCount.status === "fulfilled" ? starredCount.value : 0,
          drafts:  draftsCount.status  === "fulfilled" ? draftsCount.value  : 0,
          spam:    spamCount.status    === "fulfilled" ? spamCount.value    : 0,
        });
      } finally {
        setLoadingCounts(false);
      }
    }

    loadSidebarData();
  }, [isMailRoute]);

  // Clear the pending loader once the inbox fetch finishes
  useEffect(() => {
    if (!inboxLoading) setPendingFolder(null);
  }, [inboxLoading]);

  if (!isMailRoute) return null;

  function openCompose() {
    setTo(""); setSubject(""); setBody("");
    setSent(false); setSendError("");
    setComposeOpen(true);
  }

  function closeCompose() { setComposeOpen(false); }

  async function handleSend() {
    if (!to.trim() || !subject.trim()) return;
    setSending(true); setSendError("");
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      setSent(true);
      setTimeout(() => { closeCompose(); setSent(false); }, 1500);
    } catch (err: any) {
      setSendError(err.message ?? "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <aside
        className="w-52 flex-shrink-0 flex flex-col h-screen sticky top-0"
        style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <span className="flex items-center gap-2 font-extrabold text-sm tracking-tight" style={{ color: T.pri }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white" style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.30)" }}>
              ⚡
            </div>
            Super-Power
          </span>
        
        </div>

        {/* Compose */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <button
            onClick={openCompose}
            className="w-full flex items-center gap-2 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all hover:opacity-90"
            style={{ background: T.gradient, boxShadow: "0 2px 10px rgba(225,29,72,0.25)" }}
          >
            <Plus size={13} /> Compose
          </button>
        </div>

        {/* Scrollable nav area */}
        <nav className="px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto pb-4">
          {/* Main nav */}
          {NAV.map(({ icon: Icon, label, href }) => {
            const on = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background:  on ? T.accentLt : "transparent",
                  color:       on ? T.accent   : T.muted,
                  borderRight: on ? `2px solid ${T.accent}` : "2px solid transparent",
                }}
              >
                <Icon size={13} />{label}
              </Link>
            );
          })}

          {/* Mail folders — dynamic */}
          <div className="flex items-center justify-between mt-4 mb-1 px-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.dim }}>Mail</p>
            {loadingCounts && <Loader2 size={9} className="animate-spin" style={{ color: T.dim }} />}
          </div>

          {FOLDERS.map(({ icon: Icon, label, query, countKey }) => {
            const count = countKey ? (counts as any)[countKey] : undefined;
            const isActive = currentFolder === query;
            const isLoading = pendingFolder === query && inboxLoading;

            return (
              <Link
                key={label}
                href={`/dashboard?q=${encodeURIComponent(query)}`}
                onClick={() => setPendingFolder(query)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  color:       isActive ? T.accent : T.muted,
                  background:  isActive ? T.accentLt : "transparent",
                  borderRight: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = T.accentLt; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span className="flex items-center gap-2.5"><Icon size={12} />{label}</span>
                {isLoading ? (
                  <Loader2 size={10} className="animate-spin flex-shrink-0" style={{ color: T.accent }} />
                ) : count !== undefined && count > 0 ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(225,29,72,0.10)", color: T.accent }}>
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </Link>
            );
          })}

          {/* Connected services — real status */}
          <p className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.dim }}>Connected</p>
          {[
            { key: "gmail",          label: "Gmail"            },
            { key: "googlecalendar", label: "Google Calendar"  },
          ].map(({ key, label }) => {
            const isConnected = connected ? (connected as any)[key] : null;
            return (
              <div key={key} className="flex items-center gap-2 px-3 py-1.5 text-xs" style={{ color: T.muted }}>
                {isConnected === null ? (
                  <Loader2 size={11} className="animate-spin" style={{ color: T.dim }} />
                ) : isConnected ? (
                  <CheckCircle size={11} style={{ color: "#16a34a" }} />
                ) : (
                  <WifiOff size={11} style={{ color: "#dc2626" }} />
                )}
                <span style={{ color: isConnected === false ? "#dc2626" : T.muted }}>
                  {label}
                </span>
                {isConnected === false && (
                  <Link href="/integrations" className="text-[9px] font-bold ml-auto" style={{ color: T.accent }}>
                    Connect
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Compose modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) closeCompose(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col" style={{ border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}>
              <span className="text-sm font-bold" style={{ color: T.pri }}>New Message</span>
              <button onClick={closeCompose} style={{ color: T.muted }}><X size={16} /></button>
            </div>
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>To</span>
              <input autoFocus type="email" className="flex-1 text-sm outline-none" style={{ color: T.pri }} placeholder="recipient@example.com" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-xs font-semibold w-14 flex-shrink-0" style={{ color: T.muted }}>Subject</span>
              <input className="flex-1 text-sm outline-none" style={{ color: T.pri }} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <textarea className="w-full px-5 py-4 text-sm outline-none resize-none" style={{ color: T.pri, minHeight: 200 }} placeholder="Write your message…" value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleSend(); }} />
            <div className="px-5 py-3 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}>
              <span className="text-xs flex-1" style={{ color: "#e11d48" }}>{sendError}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={closeCompose} className="text-xs px-4 py-2 rounded-xl font-medium" style={{ color: T.muted, border: `1px solid ${T.border}` }}>Discard</button>
                <button onClick={handleSend} disabled={sending || sent || !to.trim() || !subject.trim()} className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all disabled:opacity-50" style={{ background: T.gradient }}>
                  {sent ? <><CheckCircle size={12} /> Sent!</> : sending ? "Sending…" : <><Send size={12} /> Send</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
