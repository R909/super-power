import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

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

function extractBody(payload: any): { text: string; html: string } {
  if (!payload) return { text: "", html: "" };

  if (payload.body?.data) {
    const decoded = decodeBase64Url(payload.body.data);
    const isHtml = payload.mimeType?.includes("html");
    return isHtml ? { text: "", html: decoded } : { text: decoded, html: "" };
  }

  if (payload.parts) {
    let text = "";
    let html = "";
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        text = decodeBase64Url(part.body.data);
      } else if (part.mimeType === "text/html" && part.body?.data) {
        html = decodeBase64Url(part.body.data);
      } else if (part.mimeType?.startsWith("multipart/")) {
        const nested = extractBody(part);
        if (!text && nested.text) text = nested.text;
        if (!html && nested.html) html = nested.html;
      }
    }
    return { text, html };
  }

  return { text: "", html: "" };
}

function getHeader(headers: any[], name: string): string {
  return (
    headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
      ?.value ?? ""
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);
    const thread = await tenant.gmail.api.threads.get({ id });

    const messages = (thread.messages ?? []).map((msg: any) => {
      const headers: any[] = msg.payload?.headers ?? [];
      const labelIds: string[] = msg.labelIds ?? [];
      const { text, html } = extractBody(msg.payload);

      return {
        id: msg.id,
        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        subject: getHeader(headers, "Subject"),
        date: getHeader(headers, "Date"),
        snippet: msg.snippet ?? "",
        body: text.slice(0, 12000) || html.slice(0, 12000),
        isHtml: !text && !!html,
        unread: labelIds.includes("UNREAD"),
        starred: labelIds.includes("STARRED"),
        labelIds,
      };
    });

    return NextResponse.json({ id: thread.id, messages });
  } catch (err: any) {
    console.error("[gmail/thread/id]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
