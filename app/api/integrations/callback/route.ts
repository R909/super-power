// app/api/integrations/callback/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/integrations/callback
//
// Corsair redirects here after the connectLink flow completes.
// Tokens are already stored by Corsair at this point.
// We just redirect the user back to the integrations page.
// The page polls /api/integrations/status to detect the new connection.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Corsair may pass ?plugin= or ?error= — forward them to the UI
  const { searchParams } = new URL(req.url);
  const plugin = searchParams.get("plugin");
  const error  = searchParams.get("error");

  const dest = new URL("/integrations", req.url);

  if (error) {
    dest.searchParams.set("error",  error);
    if (plugin) dest.searchParams.set("plugin", plugin);
  } else if (plugin) {
    dest.searchParams.set("connected", plugin);
  }
  // If neither param present, the page's status poll will pick up the change

  return NextResponse.redirect(dest);
}