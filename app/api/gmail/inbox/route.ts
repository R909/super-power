import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

function getHeader(headers: any[], name: string): string {
  return headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "in:inbox";
    const maxResults = Math.min(parseInt(searchParams.get("maxResults") ?? "15", 10), 30);

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    const listResult = await tenant.gmail.api.threads.list({ q, maxResults });
    const threads: { id: string; snippet: string }[] = listResult.threads ?? [];

    if (threads.length === 0) {
      return NextResponse.json({ threads: [], resultSizeEstimate: 0 });
    }

    const enriched = await Promise.all(
      threads.map(async (t) => {
        try {
          const detail = await tenant.gmail.api.threads.get({ id: t.id });
          const messages: any[] = detail.messages ?? [];
          const lastMsg = messages[messages.length - 1];
          const headers: any[] = lastMsg?.payload?.headers ?? [];
          const labelIds: string[] = lastMsg?.labelIds ?? [];

          return {
            id: t.id,
            snippet: lastMsg?.snippet ?? t.snippet ?? "",
            subject: getHeader(headers, "Subject") || "(no subject)",
            from: getHeader(headers, "From"),
            date: getHeader(headers, "Date"),
            unread: labelIds.includes("UNREAD"),
            starred: labelIds.includes("STARRED"),
            messageId: lastMsg?.id ?? "",
            messageCount: messages.length,
          };
        } catch {
          return {
            id: t.id,
            snippet: t.snippet ?? "",
            subject: "(no subject)",
            from: "",
            date: "",
            unread: false,
            starred: false,
            messageId: "",
            messageCount: 1,
          };
        }
      })
    );

    return NextResponse.json({
      threads: enriched,
      resultSizeEstimate: listResult.resultSizeEstimate ?? enriched.length,
    });
  } catch (err: any) {
    console.error("[gmail/inbox]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
