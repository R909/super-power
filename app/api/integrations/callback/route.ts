
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