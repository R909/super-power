// app/api/integrations/connect/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/integrations/connect?plugin=gmail|googlecalendar
//
// Uses Corsair's connectLink — the correct hosted OAuth flow.
// Corsair generates a URL on app.corsair.dev that handles:
//   1. Redirecting to Google with the correct registered redirect URI
//   2. Token exchange + storage
//   3. Redirecting back to YOUR app when done
//
// This avoids redirect_uri_mismatch because Corsair's own domain
// (app.corsair.dev/oauth/callback) is what gets sent to Google.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { corsair, ensureTenant } from "@/lib/corsair";

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

    // Replace with your real session/auth — e.g. getServerSession()
    const userId = req.headers.get("x-user-id") ?? "demo-user";

    await ensureTenant(userId);

    const inst = corsair.instance(process.env.CORSAIR_INSTANCE_ID!);
    const t    = inst.tenant(userId);

    // ── Use connectLink — Corsair's hosted OAuth UI ───────────────────────────
    // This generates a URL on app.corsair.dev that:
    //   • Shows only the requested plugin
    //   • Uses Corsair's own registered redirect URI (no mismatch)
    //   • Stores tokens on completion
    //   • Redirects back to your app when done
    const { url } = await t.connectLink.create({
      plugins: [plugin],
      ttlMs:   30 * 60 * 1000, // 30 minutes
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