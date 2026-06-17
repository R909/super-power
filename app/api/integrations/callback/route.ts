import { NextRequest, NextResponse } from "next/server";
import { corsair, ensureReady } from "@/app/server/corsair";
import { processOAuthCallback } from "corsair/oauth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const dest = new URL("/integrations", req.url);

  if (error) {
    dest.searchParams.set("error", error);
    return NextResponse.redirect(dest);
  }

  if (!code || !state) {
    dest.searchParams.set("error", "missing_code_or_state");
    return NextResponse.redirect(dest);
  }

  try {
    await ensureReady();
    const redirectUri = `${process.env.BETTER_AUTH_URL}/api/integrations/callback`;
    const result = await processOAuthCallback(corsair, { code, state, redirectUri });
    dest.searchParams.set("connected", result.plugin);
    return NextResponse.redirect(dest);
  } catch (err: any) {
    console.error("[callback]", err);
    dest.searchParams.set("error", err?.message ?? "callback_failed");
    return NextResponse.redirect(dest);
  }
}
