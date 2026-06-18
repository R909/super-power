import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await ensureReady();
    const tenant = corsair.withTenant(userId);

    const [gmailToken, calToken] = await Promise.allSettled([
      tenant.gmail.keys.get_access_token(),
      tenant.googlecalendar.keys.get_access_token(),
    ]);

    return NextResponse.json({
      gmail:          { connected: gmailToken.status === "fulfilled" && !!gmailToken.value },
      googlecalendar: { connected: calToken.status === "fulfilled"   && !!calToken.value },
    });
  } catch (err: any) {
    console.error("[status]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
