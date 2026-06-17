import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

function buildRfc2822(to: string, subject: string, body: string, from?: string): string {
  const headers = [
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    from ? `From: ${from}` : null,
    `To: ${to}`,
    `Subject: ${subject}`,
  ].filter((line): line is string => line !== null);
  return [...headers, "", body].join("\r\n");
}

function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, body } = await req.json();
    if (!to || !subject || body == null) {
      return NextResponse.json({ error: "to, subject and body are required" }, { status: 400 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    const raw = toBase64Url(
      buildRfc2822(to, subject, body, session.user.email ?? undefined)
    );
    const result = await tenant.gmail.api.messages.send({ raw });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[gmail/send]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
