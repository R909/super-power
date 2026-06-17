import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

const ALLOWED_PLUGINS = ["gmail", "googlecalendar"] as const;
type PluginId = (typeof ALLOWED_PLUGINS)[number];

export async function POST(req: NextRequest) {
  try {
    const { plugin } = await req.json();
    if (!plugin || !ALLOWED_PLUGINS.includes(plugin)) {
      return NextResponse.json(
        { error: `plugin must be one of: ${ALLOWED_PLUGINS.join(", ")}` },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await ensureReady();
    const tenant = corsair.withTenant(userId);
    const p = plugin as PluginId;

    await tenant[p].keys.set_access_token(null);
    await tenant[p].keys.set_refresh_token(null);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[disconnect]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
