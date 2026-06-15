// app/api/integrations/status/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/integrations/status
//
// Returns which plugins the current user has connected.
// Called on page load so the UI reflects real state.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { corsair, ensureTenant } from "@/lib/corsair";
import type { StatusResponse, PluginId } from "@/types/integrations";

const PLUGINS: PluginId[] = ["gmail", "googlecalendar"];

export async function GET(req: NextRequest) {
  try {
    // Replace with your real auth / session lookup
    const userId = req.headers.get("x-user-id") ?? "demo-user";
    await ensureTenant(userId);

    const inst = corsair.instance(process.env.CORSAIR_INSTANCE_ID!);
    const t    = inst.tenant(userId);

    // Fetch plugin connection status for each plugin in parallel
    const results = await Promise.allSettled(
      PLUGINS.map(async (plugin) => {
        // Corsair exposes credential status — if tokens are stored the user
        // has completed OAuth for that plugin.
        const creds = await t.plugins.credentials.list(plugin);
        // credentials.list returns the stored field names; OAuth tokens are
        // stored as "access_token" by Corsair after the flow completes.
        const connected = Array.isArray(creds)
          ? creds.some((c: any) => c.key === "access_token")
          : false;
        return { plugin, connected };
      })
    );

    const status: StatusResponse = {
      gmail:          { connected: false },
      googlecalendar: { connected: false },
    };

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { plugin, connected } = result.value;
        status[plugin] = { connected };
      }
    }

    return NextResponse.json(status);
  } catch (err: any) {
    console.error("[status]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}