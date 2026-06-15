// app/api/integrations/disconnect/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/integrations/disconnect
// Body: { plugin: "gmail" | "googlecalendar" }
//
// Clears the stored OAuth tokens for that plugin on the tenant.
// The user will need to reconnect to use the integration again.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { corsair, ensureTenant } from "@/lib/corsair";
import type { PluginId } from "@/types/integrations";

const ALLOWED_PLUGINS: PluginId[] = ["gmail", "googlecalendar"];

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const plugin = body.plugin as PluginId;

    if (!plugin || !ALLOWED_PLUGINS.includes(plugin)) {
      return NextResponse.json(
        { error: `plugin must be one of: ${ALLOWED_PLUGINS.join(", ")}` },
        { status: 400 }
      );
    }

    // Replace with your real auth / session lookup
    const userId = req.headers.get("x-user-id") ?? "demo-user";
    await ensureTenant(userId);

    const inst = corsair.instance(process.env.CORSAIR_INSTANCE_ID!);
    const t    = inst.tenant(userId);

    // Clear OAuth tokens for the plugin.
    // Corsair stores "access_token" and "refresh_token" after OAuth.
    await t.plugins.credentials.clear(plugin, "access_token");
    await t.plugins.credentials.clear(plugin, "refresh_token");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[disconnect]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}