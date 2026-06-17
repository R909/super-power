import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    // Use messages.list to get unread estimate — threads.list won't give a count
    const unreadResult = await tenant.gmail.api.messages.list({
      q: "is:unread in:inbox",
      maxResults: 1,
    });

    return NextResponse.json({
      emailAddress: session.user.email,
      unreadCount: unreadResult.resultSizeEstimate ?? 0,
    });
  } catch (err: any) {
    console.error("[gmail/profile]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
