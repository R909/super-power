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