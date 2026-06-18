
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const TOOLS = [
 {
   functionDeclarations: [
     {
       name: "list_emails",
       description:
         "List emails from Gmail. Use Gmail search syntax for the query (e.g. 'in:inbox', 'from:someone@example.com', 'subject:meeting is:unread').",
       parameters: {
         type: "OBJECT",
         properties: {
           query: {
             type: "STRING",
             description: "Gmail search query string",
           },
           max_results: {
             type: "NUMBER",
             description: "Max emails to return (1–20, default 10)",
           },
         },
         required: ["query"],
       },
     },
     {
       name: "get_email",
       description: "Get the full content of an email thread by thread ID.",
       parameters: {
         type: "OBJECT",
         properties: {
           thread_id: { type: "STRING", description: "Gmail thread ID" },
         },
         required: ["thread_id"],
       },
     },
     {
       name: "send_email",
       description: "Send an email via Gmail.",
       parameters: {
         type: "OBJECT",
         properties: {
           to: { type: "STRING", description: "Recipient email address" },
           subject: { type: "STRING", description: "Email subject" },
           body: { type: "STRING", description: "Email body (plain text)" },
         },
         required: ["to", "subject", "body"],
       },
     },
     {
       name: "list_events",
       description: "List upcoming Google Calendar events.",
       parameters: {
         type: "OBJECT",
         properties: {
           days_ahead: {
             type: "NUMBER",
             description: "How many days ahead to look (1–30, default 7)",
           },
         },
       },
     },
     {
       name: "create_event",
       description: "Create a new Google Calendar event and optionally send invites.",
       parameters: {
         type: "OBJECT",
         properties: {
           summary: { type: "STRING", description: "Event title" },
           start_datetime: {
             type: "STRING",
             description: "Start in ISO 8601 (e.g. 2026-06-20T14:00:00)",
           },
           end_datetime: {
             type: "STRING",
             description: "End in ISO 8601 (e.g. 2026-06-20T15:00:00)",
           },
           description: { type: "STRING", description: "Event description (optional)" },
           attendees: {
             type: "ARRAY",
             items: { type: "STRING" },
             description: "Attendee email addresses (optional)",
           },
           location: { type: "STRING", description: "Location or meeting link (optional)" },
         },
         required: ["summary", "start_datetime", "end_datetime"],
       },
     },
   ],
 },
];


function decodeBase64Url(encoded: string): string {
 try {
   return Buffer.from(
     encoded.replace(/-/g, "+").replace(/_/g, "/"),
     "base64"
   ).toString("utf-8");
 } catch {
   return "";
 }
}


function extractTextBody(payload: any): string {
 if (!payload) return "";
 if (payload.body?.data) return decodeBase64Url(payload.body.data);
 if (payload.parts) {
   for (const part of payload.parts) {
     if (part.mimeType === "text/plain" && part.body?.data) {
       return decodeBase64Url(part.body.data);
     }
   }
   for (const part of payload.parts) {
     const b = extractTextBody(part);
     if (b) return b;
   }
 }
 return "";
}


function getHeader(headers: any[], name: string): string {
 return (
   headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
     ?.value ?? ""
 );
}


function toBase64Url(str: string): string {
 return Buffer.from(str)
   .toString("base64")
   .replace(/\+/g, "-")
   .replace(/\//g, "_")
   .replace(/=+$/, "");
}

async function executeTool(
 toolName: string,
 input: Record<string, any>,
 tenant: any,
 userEmail: string
): Promise<string> {
 try {
   switch (toolName) {
     case "list_emails": {
       const listResult = await tenant.gmail.api.threads.list({
         q: input.query ?? "in:inbox",
         maxResults: Math.min(input.max_results ?? 10, 20),
       });
       const threads: any[] = listResult.threads ?? [];
       if (threads.length === 0) return "No emails found matching that query.";


       const enriched = await Promise.all(
         threads.slice(0, 10).map(async (t: any) => {
           try {
             const detail = await tenant.gmail.api.threads.get({ id: t.id });
             const msgs: any[] = detail.messages ?? [];
             const last = msgs[msgs.length - 1];
             const headers = last?.payload?.headers ?? [];
             const from = getHeader(headers, "From");
             const subject = getHeader(headers, "Subject") || "(no subject)";
             const date = getHeader(headers, "Date");
             const unread = last?.labelIds?.includes("UNREAD") ? "[UNREAD] " : "";
             return `ID: ${t.id} | ${unread}From: ${from} | Subject: ${subject} | Date: ${date}\nSnippet: ${last?.snippet ?? ""}`;
           } catch {
             return `ID: ${t.id} | Snippet: ${t.snippet ?? ""}`;
           }
         })
       );
       return enriched.join("\n\n---\n\n");
     }


     case "get_email": {
       const thread = await tenant.gmail.api.threads.get({ id: input.thread_id });
       const messages: any[] = thread.messages ?? [];
       if (!messages.length) return "Thread not found or empty.";
       return messages
         .map((msg: any) => {
           const headers = msg.payload?.headers ?? [];
           return `From: ${getHeader(headers, "From")}\nDate: ${getHeader(headers, "Date")}\nSubject: ${getHeader(headers, "Subject")}\n\n${(extractTextBody(msg.payload) || msg.snippet || "").slice(0, 3000)}`;
         })
         .join("\n\n===\n\n");
     }


     case "send_email": {
       const raw = toBase64Url(
         [
           "MIME-Version: 1.0",
           "Content-Type: text/plain; charset=utf-8",
           `From: ${userEmail}`,
           `To: ${input.to}`,
           `Subject: ${input.subject}`,
           "",
           input.body,
         ].join("\r\n")
       );
       await tenant.gmail.api.messages.send({ raw });
       return `Email sent successfully to ${input.to} with subject "${input.subject}".`;
     }


     case "list_events": {
       const days = Math.min(input.days_ahead ?? 7, 30);
       const now = new Date();
       const end = new Date();
       end.setDate(end.getDate() + days);
       const result = await tenant.googlecalendar.api.events.getMany({
         calendarId: "primary",
         timeMin: now.toISOString(),
         timeMax: end.toISOString(),
         maxResults: 20,
         singleEvents: true,
         orderBy: "startTime",
       });
       const items: any[] = result.items ?? [];
       if (!items.length) return "No upcoming events found.";
       return items
         .map((ev: any) => {
           const start = ev.start?.dateTime ?? ev.start?.date ?? "";
           const end = ev.end?.dateTime ?? ev.end?.date ?? "";
           const attendees =
             ev.attendees?.map((a: any) => a.email).join(", ") ?? "";
           return `ID: ${ev.id}\nTitle: ${ev.summary}\nStart: ${start} | End: ${end}${attendees ? `\nAttendees: ${attendees}` : ""}`;
         })
         .join("\n\n---\n\n");
     }


     case "create_event": {
       const event = await tenant.googlecalendar.api.events.create({
         calendarId: "primary",
         event: {
           summary: input.summary,
           description: input.description,
           location: input.location,
           start: {
             dateTime: new Date(input.start_datetime).toISOString(),
             timeZone: "UTC",
           },
           end: {
             dateTime: new Date(input.end_datetime).toISOString(),
             timeZone: "UTC",
           },
           attendees: (input.attendees ?? []).map((email: string) => ({ email })),
         },
       });
       const attendeeList =
         input.attendees?.length > 0
           ? ` Invites sent to: ${input.attendees.join(", ")}.`
           : "";
       return `Event "${event.summary}" created successfully for ${event.start?.dateTime ?? event.start?.date}.${attendeeList}`;
     }


     default:
       return `Unknown tool: ${toolName}`;
   }
 } catch (err: any) {
   return `Error running ${toolName}: ${err?.message ?? "Unknown error"}`;
 }
}


export async function POST(req: NextRequest) {
 try {
   const session = await auth.api.getSession({ headers: req.headers });
   if (!session?.user?.id) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }


   const body = await req.json();
   const clientMessages: { role: string; content: string }[] = body.messages;
   if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
     return NextResponse.json({ error: "messages array is required" }, { status: 400 });
   }


   await ensureReady();
   const tenant = corsair.withTenant(session.user.id);
   const userEmail = session.user.email ?? "";


   const today = new Date().toLocaleDateString("en-US", {
     weekday: "long",
     year: "numeric",
     month: "long",
     day: "numeric",
   });


   const systemPrompt = `You are an AI assistant with access to the user's Gmail and Google Calendar.
You can read emails, send emails, create calendar events, and send meeting invites.
Be concise and action-oriented. When you take an action (send email, create event), confirm what you did.
Today is ${today}. The user's email is ${userEmail}.
When scheduling events, convert natural language times to ISO 8601 datetimes correctly.`;


   let contents: any[] = clientMessages.map((m) => ({
     role: m.role === "assistant" ? "model" : "user",
     parts: [{ text: m.content }],
   }));


   const encoder = new TextEncoder();
   const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
   const writer = writable.getWriter();

   (async () => {
     try {
       let iterations = 0;


       while (iterations <= 5) {
         const stream = await ai.models.generateContentStream({
           model: GEMINI_MODEL,
           contents,
           config: {
             systemInstruction: systemPrompt,
             tools: TOOLS,
           },
         });


         const functionCalls: any[] = [];
         const modelTurnParts: any[] = [];


         for await (const chunk of stream) {
           const parts = chunk.candidates?.[0]?.content?.parts ?? [];
           for (const part of parts) {
             if (part.text) {
               await writer.write(encoder.encode(part.text));
               modelTurnParts.push({ text: part.text });
             } else if (part.functionCall) {
               functionCalls.push(part.functionCall);
               modelTurnParts.push({ functionCall: part.functionCall });
             }
           }
         }


         if (functionCalls.length === 0) break;


         const functionResponseParts = await Promise.all(
           functionCalls.map(async (fc) => ({
             functionResponse: {
               id: fc.id,
               name: fc.name,
               response: {
                 result: await executeTool(
                   fc.name,
                   fc.args ?? {},
                   tenant,
                   userEmail
                 ),
               },
             },
           }))
         );


         contents = [
           ...contents,
           { role: "model", parts: modelTurnParts },
           { role: "user", parts: functionResponseParts },
         ];


         iterations++;
       }
     } catch (err: any) {
       console.error("[chat stream]", err);
       try {
         await writer.write(
           encoder.encode("Sorry, something went wrong. Please try again.")
         );
       } catch {
         // writer may already be closed
       }
     } finally {
       await writer.close().catch(() => {});
     }
   })();


   return new Response(readable, {
     headers: {
       "Content-Type": "text/plain; charset=utf-8",
       "X-Content-Type-Options": "nosniff",
     },
   });
 } catch (err: any) {
   console.error("[chat]", err);
   return NextResponse.json(
     { error: err?.message ?? "Internal server error" },
     { status: 500 }
   );
 }
}
