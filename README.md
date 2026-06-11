📄 Product Requirements Document (PRD)
1. Product Name

Super-power (working name)

2. Vision

Build a next-generation email and calendar workspace that removes the constraints of traditional clients (like Gmail, Superhuman, Outlook) by using Corsair’s integration layer + MCP agent access.

Instead of adapting your workflow to an email app, the app adapts itself to your workflow.

3. Problem Statement

Email and calendar tools are powerful but fundamentally rigid:

Gmail/Outlook enforce a fixed UI and interaction model
Superhuman optimizes speed but still within email constraints
Users manage fragmented workflows across email + calendar + tasks
Automation exists but is limited and hard to unify
AI assistants lack deep system-level integration across apps
Core Problem

Users cannot fully customize how email + calendar workflows behave or interact with other tools.

4. Solution Overview

A fully programmable email + calendar workspace where:

Gmail + Google Calendar are integrated via Corsair building blocks
Users interact via:
UI (custom inbox + calendar views)
Command palette
AI agent chat (via MCP)
Workflows can be automated across apps (email → calendar → tasks → external tools)
5. Goals & Objectives
Primary Goals
Seamless Gmail integration (read, search, send, draft)
Full Google Calendar control (events, invites, updates)
Unified inbox + calendar interface
AI agent that can act on behalf of the user via MCP
Secondary Goals
Highly customizable UI (priority inbox, smart scheduling views)
Workflow automation across email/calendar/events
Extensible architecture for future integrations
6. Target Users
1. Founders & Executives
High email volume
Need fast triage + scheduling
2. Developers & Builders
Want automation & extensibility
Prefer command-based workflows
3. Operators / Assistants
Manage schedules, meetings, communication
7. Core Features
7.1 Gmail Integration (via Corsair + Gmail API)
Features:
Inbox sync (real-time or polling)
Advanced search (AI-enhanced)
Email drafting (AI-assisted)
Send email with templates or prompts
Thread summarization
Smart categorization:
Important
Follow-ups
Meetings
Notifications
UX Improvements:
“Intent-based inbox” instead of chronological inbox
One-click reply suggestions
Email → Calendar conversion
7.2 Google Calendar Integration
Features:
View calendar in multiple layouts:
Day / Week / Agenda / AI Timeline
Create / update / delete events
Invite management
Conflict detection
AI scheduling suggestions:
“Find next free slot”
“Reschedule conflicting meetings”
UX Improvements:
Calendar becomes interactive timeline
Drag-and-reschedule with AI suggestions
Email-based event creation (“Turn this email into meeting”)
7.3 Unified Workspace UI (Core Product Layer)
Layout:
Left: Inbox (smart filtered)
Center: Content (email / event / chat)
Right: AI assistant + context panel
Features:
Split view email + calendar context
Pin important threads/events
Smart filters (AI-generated views)
Keyboard-first navigation (Superhuman-like speed layer)
7.4 Corsair Integration Layer

Corsair acts as the integration backbone:

Responsibilities:
Manage OAuth connections (Google)
Provide API abstraction layer
Handle webhooks (optional ngrok support)
Normalize email/calendar data into unified schema
Benefits:
Swap or add integrations easily
Add Slack, Notion, etc. later without UI rewrite
7.5 MCP Agent Chat (BONUS HIGH VALUE FEATURE ⭐)

This is the most powerful part.

Features:

Users can chat with an AI agent:

Examples:

“Send an email to John saying I’ll join the meeting tomorrow”
“Schedule a 30 min call with Alex next week”
“Summarize unread emails from this morning”
“Reschedule all my meetings after 3 PM”
MCP Capabilities:
Read Gmail
Draft emails
Send emails
Create calendar events
Modify existing events
Cross-app workflows
Key Idea:

The agent is not a chatbot. It is a system controller

8. User Workflows
Workflow 1: Email → Meeting
User opens email
Click: “Convert to meeting”
AI extracts context
Calendar event is created automatically
Invite sent
Workflow 2: AI Scheduling

User:

“Schedule a call with Sarah next week for 1 hour”

System:

Checks calendar availability
Suggests slots
Sends invite once confirmed
Workflow 3: Inbox Zero Automation
AI categorizes emails
Auto-suggests:
archive
reply
schedule follow-up
One-click cleanup
9. Technical Architecture
9.1 Frontend
Next.js (App Router)
Tailwind CSS
React Query (sync state)
WebSocket (optional real-time updates)
9.2 Backend
Node.js API routes (Next.js or separate backend)
Postgres (core data storage)
Redis (optional caching for email sync)
OAuth handling (Google)
9.3 Integration Layer
Corsair SDK (core abstraction)
Gmail API
Google Calendar API
MCP server for agent execution
9.4 AI Layer
LLM-powered agent (tool calling enabled)
Context engine:
Email history
Calendar state
User preferences
Prompt orchestration layer for MCP actions
10. Data Model (Simplified)
Users
id
email
oauth_tokens
settings
Emails
id
thread_id
from
to
subject
body
labels
timestamp
Calendar Events
id
title
start_time
end_time
attendees
source_email_id (optional)
Integrations
provider (google)
access_token
refresh_token
11. Key Differentiators

12. MVP Scope
Must Have (MVP)
Gmail login + sync
Basic inbox UI
Send / reply email
Calendar view
Create event
Corsair integration layer
Should Have
Email search enhancement
Calendar scheduling assistant
Unified inbox + calendar view
Bonus (Phase 2)
MCP agent chat
Workflow automation builder
Smart inbox categories
Multi-integration support