# Super-Power — AI-Powered Email & Calendar

Super-Power is a Next.js SaaS that replaces Gmail's and Google Calendar's default UIs with a smarter, faster, fully customisable workspace. It uses **Corsair** as the integration layer (OAuth tokens, webhooks, search), **Postgres (Neon)** for persistence, **Better Auth** for session management, and (optionally) **Claude** for agent chat.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup](#step-by-step-setup)
   - [Step 1 — Clone & Install](#step-1--clone--install)
   - [Step 2 — Create a Neon Postgres Database](#step-2--create-a-neon-postgres-database)
   - [Step 3 — Set up Google OAuth Credentials](#step-3--set-up-google-oauth-credentials)
   - [Step 4 — Create a Corsair Account & App](#step-4--create-a-corsair-account--app)
   - [Step 5 — Wire up Gmail Integration in Corsair](#step-5--wire-up-gmail-integration-in-corsair)
   - [Step 6 — Wire up Google Calendar Integration in Corsair](#step-6--wire-up-google-calendar-integration-in-corsair)
   - [Step 7 — Configure Environment Variables](#step-7--configure-environment-variables)
   - [Step 8 — Run Database Migrations](#step-8--run-database-migrations)
   - [Step 9 — Implement Authentication (Better Auth + Google)](#step-9--implement-authentication-better-auth--google)
   - [Step 10 — Build the Settings / Connect Integrations page](#step-10--build-the-settings--connect-integrations-page)
   - [Step 11 — Build the Inbox (Gmail)](#step-11--build-the-inbox-gmail)
   - [Step 12 — Build the Calendar](#step-12--build-the-calendar)
   - [Step 13 — Build the AI Agent Chat (Corsair MCP)](#step-13--build-the-ai-agent-chat-corsair-mcp)
   - [Step 14 — Add Webhooks for Real-Time Updates](#step-14--add-webhooks-for-real-time-updates)
   - [Step 15 — Deploy](#step-15--deploy)
5. [Full User Flow (Login → End)](#full-user-flow-login--end)
6. [Bonus Features](#bonus-features)
7. [Folder Structure](#folder-structure)
8. [Environment Variable Reference](#environment-variable-reference)

---

## Tech Stack

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
| AI/Agent | Corsair MCP + Claude API |
| Data Fetching | TanStack React Query v5 |
| Icons | Lucide React + React Icons |

---

## Architecture Overview

```
Browser
  │
  ▼
Next.js App (App Router)
  │
  ├── Better Auth  ──── Google OAuth ──── stores sessions in Postgres
  │
  ├── Corsair SDK / REST  ──── Gmail API  (search, draft, send, receive)
  │                      └─── Google Calendar API (events, invites)
  │
  ├── Corsair Webhooks ─── push new emails & events in real-time
  │
  ├── Prisma ORM  ──── Neon Postgres  (users, sessions, cached emails)
  │
  └── Corsair MCP  ──── Claude  (AI agent chat)
```

---

## Prerequisites

- **Node.js 20+** and **npm 10+**
- A **Neon** account (free tier is fine) — [neon.tech](https://neon.tech)
- A **Google Cloud** account — [console.cloud.google.com](https://console.cloud.google.com)
- A **Corsair** account — sign up at their website and create an app
- (Optional for agent chat) An **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- (Optional for webhooks) **Ngrok** or a public URL — [ngrok.com](https://ngrok.com)

---

## Step-by-Step Setup

### Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd super-power
npm install
```

---

### Step 2 — Create a Neon Postgres Database

1. Go to [neon.tech](https://neon.tech) → **New Project**
2. Name it `super-power`, choose the closest region
3. Copy the **Connection string** (it looks like `postgresql://user:pass@host/db?sslmode=require`)
4. Save it — you'll add it to `.env` as `DATABASE_URL`

---

### Step 3 — Set up Google OAuth Credentials

You need a Google Cloud project with **Gmail API** and **Google Calendar API** enabled, plus OAuth 2.0 credentials.

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **New Project** → name it `Super-Power`
2. In the sidebar go to **APIs & Services → Library**
3. Search for and **Enable**:
   - `Gmail API`
   - `Google Calendar API`
4. Go to **APIs & Services → OAuth consent screen**
   - User type: **External**
   - Fill in App name (`Super-Power`), support email, developer email
   - Add scopes:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
     - `openid`, `email`, `profile`
   - Add your email as a **test user**
5. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Application type: **Web application**
   - Authorised redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://yourdomain.com/api/auth/callback/google` (prod)
6. Copy **Client ID** and **Client Secret**

---

### Step 4 — Create a Corsair Account & App

Corsair is the integration hub that handles OAuth tokens for Gmail and Calendar on your behalf.

1. Sign up at **Corsair's website**
2. Go to **Dashboard → Apps → New App**
3. Name it `Super-Power`
4. Copy your **Corsair API Key** and **App ID** — you'll add them to `.env`
5. In your Corsair App settings, set the **redirect URL** to your app's callback, e.g. `http://localhost:3000/api/corsair/callback`

---

### Step 5 — Wire up Gmail Integration in Corsair

1. Inside your Corsair App, go to **Integrations → Add Integration → Gmail**
2. Enter the **Google Client ID** and **Client Secret** from Step 3
3. Add the required OAuth scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
4. Save. Corsair will now proxy Gmail API calls for your users.
5. Note the **Integration ID** for Gmail — save it as `CORSAIR_GMAIL_INTEGRATION_ID`

---

### Step 6 — Wire up Google Calendar Integration in Corsair

1. In your Corsair App → **Integrations → Add Integration → Google Calendar**
2. Enter the same Google Client ID and Secret
3. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
4. Save. Note the **Integration ID** — save it as `CORSAIR_CALENDAR_INTEGRATION_ID`

---

### Step 7 — Configure Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="generate-a-random-32-char-string"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (for Better Auth login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Corsair
CORSAIR_API_KEY="your-corsair-api-key"
CORSAIR_APP_ID="your-corsair-app-id"
CORSAIR_GMAIL_INTEGRATION_ID="gmail-integration-id"
CORSAIR_CALENDAR_INTEGRATION_ID="calendar-integration-id"

# AI Agent (optional)
ANTHROPIC_API_KEY="sk-ant-..."

# App URL (change to your domain in production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 8 — Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates the `User`, `Session`, `Account`, and `Verification` tables in your Neon database.

To inspect the database visually:
```bash
npx prisma studio
```

---

### Step 9 — Implement Authentication (Better Auth + Google)

The project already has [lib/auth.ts](lib/auth.ts) and the schema. Here is what it should look like:

**lib/auth.ts**
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
});
```

**app/api/auth/[...all]/route.ts** — catch-all route for Better Auth:
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Sign in button** (add to Navbar or a dedicated login page):
```tsx
import { signIn } from "better-auth/client";

<button onClick={() => signIn.social({ provider: "google" })}>
  Sign in with Google
</button>
```

After sign-in, Better Auth stores the session in Postgres and sets a cookie. The Google access token is stored in the `Account` table — you'll use it to call Corsair.

---

### Step 10 — Build the Settings / Connect Integrations Page

The [app/settings/page.tsx](app/settings/page.tsx) page already has the UI. Now wire up the **Connect** buttons:

**Flow for connecting Gmail/Calendar:**

1. User clicks **Connect Gmail**
2. Your backend calls Corsair's "start OAuth" endpoint with the user's ID and the Gmail integration ID
3. Corsair returns an authorization URL
4. Redirect the user to that URL
5. After consent, Corsair calls your callback route (`/api/corsair/callback`)
6. Save the Corsair `connection_id` to the `Account` table linked to the user

**app/api/corsair/connect/route.ts**
```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const integration = req.nextUrl.searchParams.get("integration"); // "gmail" or "calendar"
  const integrationId = integration === "gmail"
    ? process.env.CORSAIR_GMAIL_INTEGRATION_ID
    : process.env.CORSAIR_CALENDAR_INTEGRATION_ID;

  const res = await fetch(`https://api.corsair.dev/v1/connections/start`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      integration_id: integrationId,
      user_id: session.user.id,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/corsair/callback`,
    }),
  });

  const { authorization_url } = await res.json();
  return NextResponse.redirect(authorization_url);
}
```

**app/api/corsair/callback/route.ts**
```ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // contains user_id from Corsair

  // Exchange code for connection
  const res = await fetch(`https://api.corsair.dev/v1/connections/complete`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, state }),
  });

  const connection = await res.json();

  // Save connection_id to DB
  await db.account.upsert({
    where: { /* unique on providerId + userId */ providerId_userId: {
      providerId: connection.integration_type, // "gmail" or "google_calendar"
      userId: connection.user_id,
    }},
    update: { accountId: connection.connection_id },
    create: {
      id: crypto.randomUUID(),
      accountId: connection.connection_id,
      providerId: connection.integration_type,
      userId: connection.user_id,
    },
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?connected=true`);
}
```

---

### Step 11 — Build the Inbox (Gmail)

Now that users have a Corsair Gmail connection, you can call Gmail via Corsair.

**app/api/gmail/messages/route.ts** — list inbox:
```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get Corsair connection_id for this user's Gmail
  const account = await db.account.findFirst({
    where: { userId: session.user.id, providerId: "gmail" },
  });
  if (!account) return NextResponse.json({ error: "Gmail not connected" }, { status: 400 });

  // Call Gmail via Corsair
  const res = await fetch(
    `https://api.corsair.dev/v1/connections/${account.accountId}/gmail/users/me/messages?maxResults=50`,
    { headers: { "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}` } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
```

**Key Gmail actions to implement:**

| Action | Corsair Endpoint |
|---|---|
| List messages | `GET /connections/{id}/gmail/users/me/messages` |
| Get message | `GET /connections/{id}/gmail/users/me/messages/{msgId}` |
| Search messages | `GET /connections/{id}/gmail/users/me/messages?q=from:boss@co.com` |
| Send email | `POST /connections/{id}/gmail/users/me/messages/send` |
| Draft email | `POST /connections/{id}/gmail/users/me/drafts` |
| Mark as read | `POST /connections/{id}/gmail/users/me/messages/{id}/modify` |
| Archive | `POST /connections/{id}/gmail/users/me/messages/{id}/modify` |

The [app/chat/page.tsx](app/chat/page.tsx) Inbox tab already has the UI — connect it to the `/api/gmail/messages` route using React Query:

```tsx
const { data: messages } = useQuery({
  queryKey: ["inbox"],
  queryFn: () => fetch("/api/gmail/messages").then(r => r.json()),
});
```

---

### Step 12 — Build the Calendar

**app/api/calendar/events/route.ts** — list events:
```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await db.account.findFirst({
    where: { userId: session.user.id, providerId: "google_calendar" },
  });
  if (!account) return NextResponse.json({ error: "Calendar not connected" }, { status: 400 });

  const timeMin = new Date().toISOString();
  const res = await fetch(
    `https://api.corsair.dev/v1/connections/${account.accountId}/calendar/calendars/primary/events?timeMin=${timeMin}&maxResults=50&orderBy=startTime&singleEvents=true`,
    { headers: { "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}` } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
```

**app/api/calendar/events/create/route.ts** — create event & send invite:
```ts
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const body = await req.json();

  const account = await db.account.findFirst({
    where: { userId: session!.user.id, providerId: "google_calendar" },
  });

  const res = await fetch(
    `https://api.corsair.dev/v1/connections/${account!.accountId}/calendar/calendars/primary/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: body.title,
        start: { dateTime: body.start },
        end: { dateTime: body.end },
        attendees: body.attendees.map((email: string) => ({ email })),
        description: body.description,
      }),
    }
  );

  const event = await res.json();
  return NextResponse.json(event);
}
```

Connect the [app/calendar/page.tsx](app/calendar/page.tsx) week grid to `/api/calendar/events`.

---

### Step 13 — Build the AI Agent Chat (Corsair MCP)

Corsair exposes an **MCP server** that has Gmail and Calendar tools built in. Point Claude at it and users can chat naturally.

**app/api/chat/route.ts**
```ts
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { messages } = await req.json();

  // Get user's Corsair connections
  const accounts = await db.account.findMany({
    where: { userId: session.user.id, providerId: { in: ["gmail", "google_calendar"] } },
  });

  // Build MCP server config with user's connection IDs
  const mcpServers = accounts.map(a => ({
    type: "url" as const,
    url: `https://mcp.corsair.dev/connections/${a.accountId}`,
    headers: { "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}` },
  }));

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: `You are Super-Power, an AI assistant that manages the user's email and calendar.
You can read emails, send emails, search the inbox, create calendar events, and send invites.
Always confirm before sending emails or creating events. Be concise and direct.`,
    messages,
    mcp_servers: mcpServers,
  });

  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

The [app/chat/page.tsx](app/chat/page.tsx) AI Agent tab already has the chat UI — wire up the message input to POST `/api/chat` and stream the response.

**Example agent prompts that will work:**
- *"Show me unread emails from today"*
- *"Reply to the last email from Sarah saying I'll be there at 3pm"*
- *"Create a meeting with friend@example.com tomorrow at 2pm and send him an email"*
- *"What's on my calendar this week?"*

---

### Step 14 — Add Webhooks for Real-Time Updates

Instead of polling, Corsair can push new emails and calendar changes to your app.

**Prerequisites:** A public HTTPS URL. Use Ngrok for local dev:
```bash
ngrok http 3000
# Copy the https://xxxx.ngrok.io URL
```

**Register a webhook in Corsair:**
```ts
// Run this once (e.g. in a setup script or admin route)
await fetch("https://api.corsair.dev/v1/webhooks", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.CORSAIR_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/corsair`,
    events: ["gmail.message.received", "calendar.event.created", "calendar.event.updated"],
  }),
});
```

**app/api/webhooks/corsair/route.ts**
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Verify the webhook signature from Corsair headers
  const signature = req.headers.get("x-corsair-signature");
  // TODO: verify HMAC signature using your CORSAIR_WEBHOOK_SECRET

  if (payload.event === "gmail.message.received") {
    // Cache email in DB, trigger UI update via Server-Sent Events or WebSocket
    console.log("New email:", payload.data.subject);
  }

  if (payload.event === "calendar.event.created") {
    console.log("New calendar event:", payload.data.summary);
  }

  return NextResponse.json({ received: true });
}
```

Add `CORSAIR_WEBHOOK_SECRET` to your `.env` for signature verification.

---

### Step 15 — Deploy

**Option A: Vercel (recommended)**
```bash
npm install -g vercel
vercel
# Follow prompts, add all env vars in the Vercel dashboard
```

**Option B: Any Node.js host**
```bash
npm run build
npm run start
```

**Checklist before deploying:**
- [ ] Update `BETTER_AUTH_URL` to your production domain
- [ ] Update Google OAuth redirect URI to production domain
- [ ] Update Corsair callback URL to production domain
- [ ] Update Corsair webhook URL to production domain
- [ ] Run `npx prisma migrate deploy` against production DB

---

## Full User Flow (Login → End)

```
1. LANDING PAGE  (/)
   User visits the homepage.
   Animated hero with features, pricing, and CTA.
   Clicks "Get Started" → redirected to /login (or sign-in modal).

2. SIGN IN  (/login or Navbar button)
   User clicks "Sign in with Google".
   Better Auth initiates Google OAuth flow.
   Google shows consent screen.
   User approves → redirected back to app.
   Better Auth creates User + Session + Account rows in Postgres.
   User lands on /chat (Inbox view).

3. CONNECT INTEGRATIONS  (/settings → Integrations tab)
   First time: user sees Gmail and Google Calendar as "Not connected".
   Clicks "Connect Gmail" → app calls /api/corsair/connect?integration=gmail
   → redirected to Corsair/Google consent page.
   User grants Gmail permissions.
   → Corsair calls /api/corsair/callback with connection_id.
   App saves connection_id to Account table.
   Same flow for "Connect Google Calendar".
   Settings page now shows both as "Connected".

4. INBOX  (/chat → Inbox tab)
   App calls /api/gmail/messages → Corsair → Gmail API.
   Shows real emails: sender, subject, snippet, time.
   User can:
     • Click an email to read the full body.
     • Click Reply → opens compose window → POST /api/gmail/send
     • Star / archive / mark read.
     • Use the search bar → /api/gmail/search?q=...

5. CALENDAR  (/calendar)
   App calls /api/calendar/events.
   Week view shows real events colour-coded by type.
   User can:
     • Click a slot → "Create Event" form.
     • Enter title, time, description, attendees.
     • Click Save → POST /api/calendar/events/create → Google Calendar creates event + emails invites to attendees.
     • Click existing event → see details, edit, delete, view attendees.

6. AI AGENT CHAT  (/chat → AI Agent tab)
   User types a natural language request.
   App streams request to /api/chat.
   Claude uses Corsair MCP tools to take action:
     → searches inbox, reads emails, sends emails, creates calendar events.
   Claude replies with a summary of what it did.
   Example: "Done! I've sent John an email and created a 1-hour meeting for Thursday at 9 AM."

7. SETTINGS  (/settings)
   Profile: update name, avatar, timezone.
   Integrations: connect/disconnect Gmail and Calendar.
   AI Agent: choose Claude model, toggle permissions, set response style.
   Notifications: toggle email/calendar/AI notifications.
   Shortcuts: view keyboard shortcuts.
   Security: change password, manage 2FA, view active sessions.

8. REAL-TIME UPDATES  (webhooks)
   New email arrives in Gmail.
   Corsair pushes event to /api/webhooks/corsair.
   App updates inbox without page refresh.
   User sees "1 new email" badge on the Inbox tab.
```

---

## Bonus Features

### A. Automatic Email Priority Filtering
Send each incoming email's subject + snippet through a cheap LLM call to classify as `urgent`, `normal`, or `low`. Show a coloured badge on each email in the inbox.

### B. Vector Search for Emails
Add `pgvector` extension to Neon:
```sql
CREATE EXTENSION vector;
```
Cache email bodies in Postgres with embeddings. Use cosine similarity search to find relevant emails in < 1 second without hitting Gmail API.

### C. Keyboard Shortcuts
Add a `useHotkeys` hook:
```ts
useHotkeys("c", () => openCompose());        // compose
useHotkeys("e", () => archiveSelected());    // archive
useHotkeys("r", () => replyToSelected());    // reply
useHotkeys("g i", () => goToInbox());        // go to inbox
useHotkeys("g c", () => goToCalendar());     // go to calendar
useHotkeys("/", () => focusSearch());        // search
```

### D. Better Gmail Search UI
Use Corsair's search API to expose Gmail advanced search operators in a structured UI (from, to, subject, date range, has:attachment) without making the user write raw query strings.

### E. Ngrok Webhooks for Local Dev
```bash
ngrok http 3000
# Set NEXT_PUBLIC_APP_URL to the ngrok URL in .env
# Re-register Corsair webhooks with the new URL
```

---

## Folder Structure

```
super-power/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts      ← Better Auth handler
│   │   ├── corsair/
│   │   │   ├── connect/route.ts        ← Start Corsair OAuth
│   │   │   └── callback/route.ts       ← Corsair OAuth callback
│   │   ├── gmail/
│   │   │   ├── messages/route.ts       ← List/search inbox
│   │   │   └── send/route.ts           ← Send email
│   │   ├── calendar/
│   │   │   └── events/
│   │   │       ├── route.ts            ← List events
│   │   │       └── create/route.ts     ← Create event + invite
│   │   ├── chat/route.ts               ← AI agent (Claude + Corsair MCP)
│   │   └── webhooks/
│   │       └── corsair/route.ts        ← Receive real-time pushes
│   ├── calendar/page.tsx               ← Calendar UI
│   ├── chat/page.tsx                   ← Inbox + AI Agent UI
│   ├── settings/page.tsx               ← Settings UI
│   ├── components/                     ← Shared UI components
│   ├── layout.tsx
│   ├── page.tsx                        ← Landing page
│   └── globals.css
├── lib/
│   ├── auth.ts                         ← Better Auth config
│   ├── db.ts                           ← Prisma client
│   └── generated/prisma/               ← Generated Prisma client
├── prisma/
│   ├── schema.prisma                   ← DB schema
│   └── migrations/                     ← SQL migrations
├── .env                                ← Environment variables (not committed)
├── .env-example                        ← Template for env vars
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Yes | Random 32-char secret for session signing |
| `BETTER_AUTH_URL` | Yes | Your app's base URL |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Client Secret |
| `CORSAIR_API_KEY` | Yes | Corsair API key from dashboard |
| `CORSAIR_APP_ID` | Yes | Corsair App ID |
| `CORSAIR_GMAIL_INTEGRATION_ID` | Yes | Corsair Gmail integration ID |
| `CORSAIR_CALENDAR_INTEGRATION_ID` | Yes | Corsair Google Calendar integration ID |
| `CORSAIR_WEBHOOK_SECRET` | Bonus | HMAC secret for verifying webhook payloads |
| `ANTHROPIC_API_KEY` | Bonus | Claude API key for AI agent chat |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of your app (for redirects) |

---

Built with Next.js, Prisma, Better Auth, and Corsair.
