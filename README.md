# Super-Power — Product Requirements Document

**Version:** 1.0
**Date:** June 2026
**Author:** Ritu Sood
**Status:** In Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Scope](#5-scope)
6. [Feature Requirements](#6-feature-requirements)
   - [6.1 Landing Page](#61-landing-page)
   - [6.2 Authentication](#62-authentication)
   - [6.3 Dashboard — Email Inbox](#63-dashboard--email-inbox)
   - [6.4 Calendar](#64-calendar)
   - [6.5 AI Agent Chat](#65-ai-agent-chat)
   - [6.6 Integrations](#66-integrations)
   - [6.7 Settings](#67-settings)
   - [6.8 Navigation & Layout](#68-navigation--layout)
   - [6.9 Loading States](#69-loading-states)
7. [User Flows](#7-user-flows)
8. [Design System](#8-design-system)
9. [Technical Architecture](#9-technical-architecture)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Out of Scope (v1)](#11-out-of-scope-v1)
12. [Future Roadmap](#12-future-roadmap)
13. [Developer Setup](#13-developer-setup)

---

## 1. Executive Summary

**Super-Power** is an AI-powered email and calendar workspace built on Next.js. It replaces the default Gmail and Google Calendar UIs with a faster, smarter, fully customisable interface — and adds a Claude-powered AI agent that can take action (send emails, create events, search the inbox) directly from natural-language chat.

The integration layer is provided by **Corsair**, which handles OAuth token management and proxies Gmail and Google Calendar API calls. User identity and sessions are managed by **Better Auth** (Google OAuth). Data is persisted in **PostgreSQL via Neon**, with **Prisma** as the ORM.

---

## 2. Problem Statement

Standard email and calendar tools are built for the average user. Power users — founders, engineers, executives — constantly fight with:

- **Too many clicks** to do common actions (reply, archive, create a meeting).
- **No AI layer** — you have to read every email yourself and decide what to do.
- **Fragmented tools** — inbox and calendar live in separate apps, but actions constantly cross between them (email → schedule a meeting).
- **No keyboard-first workflows** — everything requires a mouse.
- **No composable UI** — you use what Google gives you, not what your workflow needs.

Super-Power solves this by giving users a single workspace where email, calendar, and an AI agent all live together — and where the user controls the layout, priority filters, and shortcuts.

---

## 3. Target Users

| Persona | Description | Pain Points Addressed |
|---|---|---|
| **Startup founder** | Manages a high-volume inbox alongside a packed calendar | Faster triage, AI drafts replies, cross-product actions in one place |
| **Engineer / developer** | Wants keyboard-first workflows, minimal UI noise | Clean dense UI, shortcut support, no ads or promotions tabs |
| **Operations manager** | Schedules meetings and follows up over email all day | Calendar + inbox in one view, AI auto-creates invites from email |
| **Cohort / course student** | Learning to build SaaS products with real integrations | Documented, well-structured codebase with clear architecture |

---

## 4. Goals & Success Metrics

### Product Goals

| Goal | Metric |
|---|---|
| Reduce time to triage inbox | User processes emails 2× faster than in Gmail |
| Reduce friction for calendar actions | Meeting created in < 30 seconds from chat |
| High AI task success rate | ≥ 90% of natural-language requests correctly executed by the agent |
| Fast, polished UI | Page loads < 1 s; skeleton loaders shown within 100 ms |
| Reliable integrations | < 1% of Gmail/Calendar API calls fail due to auth or connection errors |

### Business Goals (v1)

- Ship a fully functional MVP that demonstrates the Corsair integration pattern end-to-end.
- Cover all core workflows: login → connect integrations → read/send email → manage calendar → chat with AI agent.
- Codebase clean enough to serve as a reference implementation for Corsair-based apps.

---

## 5. Scope

### In Scope (v1)

- Landing page with marketing content
- Google OAuth sign-in via Better Auth
- Gmail inbox: list threads, read messages, compose, reply, send, search, folder navigation
- Google Calendar: weekly view, event creation, event detail, delete
- AI agent chat: streaming Claude responses, Corsair MCP tool use (email + calendar)
- Integrations page: connect/disconnect Gmail and Google Calendar via Corsair
- Settings page: profile, integrations, AI model, notifications, shortcuts, security
- Real-time email push via Corsair webhooks
- Skeleton loading states on all pages
- Rose/pink design system applied consistently

### Out of Scope (v1)

- Mobile app or mobile-optimised layout
- Non-Google email providers (Outlook, etc.)
- Non-Google calendar providers
- Multi-account support (more than one Gmail per user)
- Email threads with > 50 messages (pagination deferred)
- Push notifications to desktop/mobile OS
- Billing and subscription management

---

## 6. Feature Requirements

### 6.1 Landing Page

**Route:** `/`
**Layout:** Public (no sidebar)

| # | Requirement | Priority |
|---|---|---|
| LP-1 | Animated hero section with headline, sub-headline, and a prominent "Get Started" CTA button | P0 |
| LP-2 | Features section describing inbox, calendar, and AI agent capabilities | P0 |
| LP-3 | "How It Works" step-by-step section | P1 |
| LP-4 | Pricing section with tier cards | P1 |
| LP-5 | Testimonials / social proof section | P2 |
| LP-6 | Marquee / logo strip showing compatible integrations | P2 |
| LP-7 | Navbar with logo and sign-in link | P0 |
| LP-8 | Footer with links and copyright | P0 |
| LP-9 | GSAP ScrollReveal animations on scroll | P1 |
| LP-10 | Cursor glow interactive effect | P2 |

---

### 6.2 Authentication

**Route:** `/login`
**Layout:** Public (no sidebar)

| # | Requirement | Priority |
|---|---|---|
| AU-1 | "Sign in with Google" button that initiates Google OAuth via Better Auth | P0 |
| AU-2 | On successful sign-in, create User + Session + Account rows in Postgres | P0 |
| AU-3 | Redirect authenticated users to `/dashboard` | P0 |
| AU-4 | Redirect unauthenticated users away from protected routes to `/login` | P0 |
| AU-5 | Session persisted in a secure HTTP-only cookie | P0 |
| AU-6 | Sign-out clears session from DB and cookie | P0 |

---

### 6.3 Dashboard — Email Inbox

**Route:** `/dashboard`
**Layout:** Authenticated (sidebar visible)

| # | Requirement | Priority |
|---|---|---|
| DB-1 | Three-column layout: folder list (sidebar), thread list (centre), message detail (right) | P0 |
| DB-2 | Load email threads from `/api/gmail/threads` for the active folder | P0 |
| DB-3 | Folder navigation: Inbox, Starred, Snoozed, Sent, Drafts, Spam, All Mail, Trash | P0 |
| DB-4 | Show sender name, subject, snippet, and relative timestamp per thread | P0 |
| DB-5 | Click a thread to load full message body in the right panel | P0 |
| DB-6 | Compose new email via modal (To, Subject, Body, Send / Discard) | P0 |
| DB-7 | Reply to selected thread | P1 |
| DB-8 | Long email body capped at 18 rem (last message) / 4 rem (earlier messages) to prevent layout overflow | P0 |
| DB-9 | Search bar queries Gmail API and updates the thread list | P1 |
| DB-10 | Unread count badges on folders in sidebar | P1 |
| DB-11 | Right panel: Today's calendar events from Google Calendar | P1 |
| DB-12 | Right panel: AI quick-action buttons (Summarise, Draft Reply, Schedule) | P1 |
| DB-13 | Right panel: Quick compose widget | P1 |
| DB-14 | All-day calendar events displayed as "All day" (not a time) | P0 |
| DB-15 | Long email content does not push the right panel off-screen (`min-w-0`, `overflow-x-hidden`) | P0 |

---

### 6.4 Calendar

**Route:** `/calendar`
**Layout:** Authenticated (sidebar visible)

| # | Requirement | Priority |
|---|---|---|
| CA-1 | Weekly grid view (7-column, hourly rows) | P0 |
| CA-2 | Load events from `/api/calendar/events` for the displayed week | P0 |
| CA-3 | Events rendered in their correct time slot with colour coding by category | P0 |
| CA-4 | Navigate forward and backward by week | P0 |
| CA-5 | Click an empty slot to open "Create Event" form | P0 |
| CA-6 | Create event: title, date/time, description, attendees | P0 |
| CA-7 | Save event POSTs to `/api/calendar/events/create` → Google Calendar creates event and emails invites | P0 |
| CA-8 | Click existing event to open detail panel (title, time, attendees, description) | P1 |
| CA-9 | Delete event from detail panel | P1 |
| CA-10 | Mini calendar in the left sidebar for month navigation | P1 |
| CA-11 | "Upcoming events" list in the left sidebar | P1 |
| CA-12 | Today's date highlighted in the grid | P0 |

---

### 6.5 AI Agent Chat

**Route:** `/chat`
**Layout:** Authenticated (sidebar visible)

| # | Requirement | Priority |
|---|---|---|
| CH-1 | Chat interface with a scrollable message history | P0 |
| CH-2 | Text input + Send button at the bottom | P0 |
| CH-3 | Messages streamed from `/api/chat` as server-sent events | P0 |
| CH-4 | User messages appear in rose-gradient bubbles; AI replies in white cards | P0 |
| CH-5 | Claude uses Corsair MCP tools: read emails, send emails, search inbox, create calendar events | P0 |
| CH-6 | Agent confirms before sending emails or creating events | P1 |
| CH-7 | Prompt suggestion chips for common actions ("Summarise inbox", "What's on my calendar?", etc.) | P1 |
| CH-8 | New-conversation button to clear history | P1 |
| CH-9 | Conversations list in the left panel | P2 |
| CH-10 | Rose/pink theme matching the rest of the authenticated UI | P0 |

**Example agent prompts that must work:**

- *"Show me unread emails from today"*
- *"Reply to the last email from Sarah saying I'll be there at 3 pm"*
- *"Create a meeting with friend@example.com tomorrow at 2 pm and send them an email"*
- *"What's on my calendar this week?"*

---

### 6.6 Integrations

**Route:** `/integrations`
**Layout:** Authenticated (sidebar visible)

| # | Requirement | Priority |
|---|---|---|
| IN-1 | Display cards for Gmail and Google Calendar showing connection status | P0 |
| IN-2 | "Connect" button calls `/api/corsair/connect?integration=gmail` → Corsair OAuth → callback saves `connection_id` | P0 |
| IN-3 | Same OAuth flow for Google Calendar | P0 |
| IN-4 | "Disconnect" button revokes the Corsair connection and removes the DB record | P1 |
| IN-5 | Status polling after OAuth redirect to confirm connection success | P0 |
| IN-6 | Show last-synced timestamp per integration | P2 |

---

### 6.7 Settings

**Route:** `/settings`
**Layout:** Authenticated (sidebar visible)

| # | Requirement | Priority |
|---|---|---|
| SE-1 | Left nav with sections: Profile, Integrations, AI Agent, Notifications, Shortcuts, Security | P0 |
| SE-2 | **Profile** — edit display name, avatar URL, timezone | P1 |
| SE-3 | **Integrations** — same connect/disconnect UI as `/integrations` | P0 |
| SE-4 | **AI Agent** — choose Claude model, toggle permissions (send email, create events), set response style | P1 |
| SE-5 | **Notifications** — toggles for new email, calendar event, AI action notifications | P2 |
| SE-6 | **Shortcuts** — read-only list of keyboard shortcuts | P2 |
| SE-7 | **Security** — view active sessions, revoke session, placeholder for 2FA | P2 |

---

### 6.8 Navigation & Layout

| # | Requirement | Priority |
|---|---|---|
| NV-1 | Sidebar visible only on authenticated routes (`/dashboard`, `/calendar`, `/chat`, `/integrations`, `/settings`) | P0 |
| NV-2 | Sidebar NOT shown on `/` (landing) or `/login` | P0 |
| NV-3 | Sidebar shows active route highlight with rose accent | P0 |
| NV-4 | Sidebar "Mail" section shows live unread counts per folder | P1 |
| NV-5 | Sidebar "Connected" section shows real-time Gmail and Calendar connection status | P1 |
| NV-6 | Compose modal accessible from sidebar "Compose" button on any page | P1 |
| NV-7 | Next.js route groups `(public)` and `(app)` used for layout separation | P0 |

---

### 6.9 Loading States

| # | Requirement | Priority |
|---|---|---|
| LS-1 | Rose-themed skeleton loader shown on all authenticated pages while data loads (via `loading.tsx`) | P0 |
| LS-2 | Skeleton includes top-bar, stats cards, and row placeholders | P0 |
| LS-3 | Centred rose-gradient spinner overlay on skeleton | P0 |
| LS-4 | Chat page has its own loading screen (`chat/loading.tsx`) | P0 |
| LS-5 | Login page has a full-screen loading screen (`login/loading.tsx`) | P1 |
| LS-6 | Folder-switch in sidebar shows a per-folder spinner until inbox fetch completes | P1 |

---

## 7. User Flows

### Flow 1 — First-time user

```
/ (Landing page)
  → clicks "Get Started"
  → /login
  → "Sign in with Google" → Google OAuth consent
  → /dashboard (first visit — integrations not yet connected)
  → banner / prompt → /integrations
  → Connect Gmail → Corsair OAuth → callback
  → Connect Google Calendar → Corsair OAuth → callback
  → /dashboard (inbox now loads real emails)
```

### Flow 2 — Daily email triage

```
/dashboard
  → scan inbox thread list
  → click thread → read message in right panel
  → click "Reply" → compose modal → send
  → click "Archive" → thread removed from inbox
  → click folder "Starred" in sidebar → filtered thread list
```

### Flow 3 — Schedule a meeting via AI

```
/chat
  → type "Schedule a 30-min call with alice@example.com tomorrow at 10 AM and email her the invite"
  → Claude uses Corsair MCP:
      - creates Google Calendar event
      - sends email to alice@example.com
  → Claude replies: "Done! I've created the event and sent Alice an email."
```

### Flow 4 — Create a calendar event manually

```
/calendar
  → navigate to next week
  → click empty slot on Thursday 3 PM
  → fill in: Title, add attendee emails, add description
  → click Save
  → event appears in grid; attendees receive Google Calendar invites
```

---

## 8. Design System

The product uses a consistent **rose/pink** palette across all authenticated pages.

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| `bg` | `#fce7f3` | Page background |
| `surface` | `#fff5f8` | Card and sidebar background |
| `card` | `#ffffff` | Elevated card background |
| `border` | `rgba(225,29,72,0.10)` | Dividers and card borders |
| `accent` | `#e11d48` | Active states, icons, links |
| `accentLt` | `rgba(225,29,72,0.08)` | Hover and active backgrounds |
| `gradient` | `linear-gradient(135deg, #fb7185, #e11d48, #be123c)` | Buttons, logo, user chat bubbles |
| `pri` | `#1a0008` | Primary text |
| `sec` | `#7f1d1d` | Secondary / heading text |
| `muted` | `#c084a0` | Inactive labels, placeholders |
| `dim` | `#e9b8c8` | Divider labels, faint text |

### Typography

| Font | Variable | Usage |
|---|---|---|
| Nunito | `--font-nunito` | Body text, labels |
| Plus Jakarta Sans | `--font-jakarta` | Headings, hero |

### Component Principles

- All cards use `rounded-2xl` with a `1px solid border` and `surface` background.
- Active nav items use `accentLt` background and a `2px solid accent` right border.
- Primary action buttons use the rose gradient with `boxShadow: 0 2px 10px rgba(225,29,72,0.25)`.
- Icons from **Lucide React** at 12–16 px for UI chrome; larger for empty states.
- Spacing follows Tailwind's default scale; `gap-3`, `px-5 py-4` are common rhythm units.
- No dark theme in authenticated pages; the landing page may use a dark hero section.

---

## 9. Technical Architecture

```
Browser
  │
  ▼
Next.js 16 App Router (TypeScript)
  │
  ├── Route Groups
  │   ├── (public)/         → Landing page, Login (no sidebar)
  │   └── (app)/            → Dashboard, Calendar, Chat, Integrations, Settings (sidebar)
  │
  ├── Better Auth  ─────── Google OAuth ──── stores sessions in Neon Postgres
  │
  ├── Corsair SDK / REST
  │   ├── Gmail API proxy   (search, read, draft, send, modify)
  │   └── Google Calendar API proxy (list, create, delete events)
  │
  ├── Corsair Webhooks  ─── push new emails & calendar events in real-time
  │
  ├── Prisma ORM  ──────── Neon Postgres  (users, sessions, accounts, cached data)
  │
  └── Corsair MCP + Claude API  (AI agent — streaming, tool use)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP + Framer Motion |
| Auth | Better Auth 1.6 (Google OAuth) |
| ORM | Prisma 7 (pg adapter) |
| Database | PostgreSQL via Neon |
| Integrations | Corsair (Gmail + Google Calendar) |
| AI / Agent | Corsair MCP + Claude API (`claude-sonnet-4-6`) |
| Data Fetching | TanStack React Query v5 |
| Icons | Lucide React + React Icons |

### Key API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...all]` | GET/POST | Better Auth handler (sign in, sign out, session) |
| `/api/corsair/connect` | GET | Start Corsair OAuth for a given integration |
| `/api/corsair/callback` | GET | Corsair OAuth callback — saves `connection_id` to DB |
| `/api/integrations/status` | GET | Check which integrations are connected for the current user |
| `/api/gmail/threads` | GET | List email threads; supports `?q=` Gmail search query |
| `/api/gmail/messages/[id]` | GET | Fetch full message body |
| `/api/gmail/send` | POST | Send an email via Corsair + Gmail API |
| `/api/calendar/events` | GET | List Google Calendar events for the current week |
| `/api/calendar/events/create` | POST | Create an event and send invites |
| `/api/calendar/events/[id]` | DELETE | Delete a calendar event |
| `/api/chat` | POST | Streaming AI agent (Claude + Corsair MCP) |
| `/api/webhooks/corsair` | POST | Receive real-time email and calendar push events |

### Folder Structure

```
super-power/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              ← Public layout (ScrollReveal, no sidebar)
│   │   ├── page.tsx                ← Landing page
│   │   └── login/
│   │       ├── page.tsx            ← Login page
│   │       └── loading.tsx         ← Login loading state
│   ├── (app)/
│   │   ├── layout.tsx              ← Authenticated layout (Sidebar)
│   │   ├── loading.tsx             ← Shared skeleton loader
│   │   ├── dashboard/page.tsx      ← Email inbox
│   │   ├── calendar/page.tsx       ← Calendar week view
│   │   ├── chat/
│   │   │   ├── page.tsx            ← AI agent chat
│   │   │   └── loading.tsx         ← Chat loading state
│   │   ├── integrations/page.tsx   ← Connect/disconnect integrations
│   │   └── settings/page.tsx       ← User settings
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   ├── corsair/connect/route.ts
│   │   ├── corsair/callback/route.ts
│   │   ├── integrations/status/route.ts
│   │   ├── gmail/threads/route.ts
│   │   ├── gmail/messages/[id]/route.ts
│   │   ├── gmail/send/route.ts
│   │   ├── calendar/events/route.ts
│   │   ├── calendar/events/create/route.ts
│   │   ├── chat/route.ts
│   │   └── webhooks/corsair/route.ts
│   ├── components/
│   │   ├── sidebar.tsx             ← Authenticated sidebar
│   │   ├── providers/
│   │   │   ├── query-provider.tsx
│   │   │   └── inbox-loading-provider.tsx
│   │   └── [landing page components]
│   ├── layout.tsx                  ← Root layout (providers, fonts)
│   └── globals.css
├── lib/
│   ├── auth.ts                     ← Better Auth config
│   └── db.ts                       ← Prisma client
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
└── next.config.ts
```

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | First Contentful Paint < 1.5 s on broadband; skeleton shown within 100 ms of navigation |
| **Reliability** | Gmail and Calendar API calls must handle token expiry gracefully (Corsair refresh) |
| **Security** | Sessions stored as HTTP-only cookies; no Google tokens exposed to the client; Corsair webhook signature verified via HMAC |
| **Accessibility** | All interactive elements keyboard-reachable; `aria-label` on icon-only buttons |
| **Browser support** | Evergreen browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+) |
| **Scalability** | Stateless Next.js app; all state in Neon Postgres — horizontally scalable on Vercel |
| **Code quality** | TypeScript strict mode; no `any` types on API boundaries; no code comments (self-documenting naming) |

---

## 11. Out of Scope (v1)

- Mobile-responsive layout (desktop-first only)
- Outlook / Microsoft 365 or other email providers
- Multi-account Gmail (one Gmail per Super-Power account)
- Email thread pagination beyond 50 results
- Attachment previews / downloads
- Billing, subscriptions, or usage metering
- Desktop OS push notifications
- Dark mode in the authenticated app
- Shared calendars / team workspaces

---

## 12. Future Roadmap

### Phase 2 — Power Features

- **AI email prioritisation**: Run each incoming email's subject + snippet through a lightweight LLM call; classify as `urgent`, `normal`, or `low`; show a colour badge.
- **Vector search**: Add `pgvector` to Neon; embed and cache email bodies locally; deliver < 1 s full-text search without hitting Gmail API.
- **Keyboard shortcuts**: `c` compose, `e` archive, `r` reply, `gi` go to inbox, `gc` go to calendar, `/` focus search.
- **Advanced search UI**: Expose Gmail search operators (from, to, subject, date range, `has:attachment`) via a structured form rather than a raw query string.

### Phase 3 — Collaboration & Scale

- Team workspaces with shared inboxes
- Multi-account Gmail support
- Outlook / Microsoft 365 integration via Corsair
- Mobile-responsive layout
- Real-time collaborative calendar editing

---

## 13. Developer Setup

### Prerequisites

- Node.js 20+ / npm 10+
- [Neon](https://neon.tech) account (free tier)
- [Google Cloud](https://console.cloud.google.com) account
- [Corsair](https://corsair.dev) account
- Anthropic API key (for AI agent, optional)

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

BETTER_AUTH_SECRET="generate-a-random-32-char-string"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

CORSAIR_API_KEY="your-corsair-api-key"
CORSAIR_APP_ID="your-corsair-app-id"
CORSAIR_GMAIL_INTEGRATION_ID="gmail-integration-id"
CORSAIR_CALENDAR_INTEGRATION_ID="calendar-integration-id"
CORSAIR_WEBHOOK_SECRET="hmac-secret-for-webhook-verification"

ANTHROPIC_API_KEY="sk-ant-..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Quick Start

```bash
git clone <repo-url>
cd super-power
npm install
cp .env-example .env   # fill in the values above
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Google Cloud Setup

1. Create a project → enable **Gmail API** and **Google Calendar API**.
2. OAuth consent screen → add scopes: `gmail.readonly`, `gmail.send`, `gmail.modify`, `calendar`, `calendar.events`, `openid`, `email`, `profile`.
3. Create **OAuth 2.0 Client ID** (Web) → add redirect URI `http://localhost:3000/api/auth/callback/google`.
4. Copy Client ID and Secret → `.env`.

### Corsair Setup

1. Create an app in the Corsair dashboard.
2. Add a **Gmail integration** with the Google credentials and required scopes → copy the Integration ID.
3. Add a **Google Calendar integration** → copy the Integration ID.
4. Set the redirect URL to `http://localhost:3000/api/corsair/callback`.
5. (Optional) Register a webhook for `gmail.message.received` and `calendar.event.*` pointing to your public URL.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all env vars in the Vercel dashboard. Before going live:

- Update `BETTER_AUTH_URL` to your production domain
- Update Google OAuth redirect URI
- Update Corsair callback and webhook URLs
- Run `npx prisma migrate deploy` against the production DB

---

*Super-Power is built by Ritu Sood as part of Cohort 2026.*
