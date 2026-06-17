import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "in:inbox";
    const maxResults = Math.min(parseInt(searchParams.get("maxResults") ?? "20", 10), 50);

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);
    const result = await tenant.gmail.api.threads.list({ q, maxResults });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[gmail/threads]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
