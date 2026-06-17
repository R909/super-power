import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";
import { generateOAuthUrl } from "corsair/oauth";

const ALLOWED_PLUGINS = ["gmail", "googlecalendar"] as const;
type PluginId = (typeof ALLOWED_PLUGINS)[number];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plugin = searchParams.get("plugin") as PluginId | null;

    if (!plugin || !ALLOWED_PLUGINS.includes(plugin as PluginId)) {
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

    const redirectUri = `${process.env.BETTER_AUTH_URL}/api/integrations/callback`;
    const { url } = await generateOAuthUrl(corsair, plugin, {
      tenantId: userId,
      redirectUri,
    });

    return NextResponse.json({ authorizeUrl: url });
  } catch (err: any) {
    console.error("[connect]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
