import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") ?? "7", 10);
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    const result = await tenant.googlecalendar.api.events.getMany({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[calendar/events GET]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { summary, description, start, end, attendees, location } = await req.json();
    if (!summary || !start || !end) {
      return NextResponse.json({ error: "summary, start and end are required" }, { status: 400 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    const event = await tenant.googlecalendar.api.events.create({
      calendarId: "primary",
      event: {
        summary,
        description,
        location,
        start: { dateTime: new Date(start).toISOString(), timeZone: "UTC" },
        end:   { dateTime: new Date(end).toISOString(),   timeZone: "UTC" },
        attendees: attendees?.map((email: string) => ({ email })) ?? [],
      },
    });

    return NextResponse.json(event);
  } catch (err: any) {
    console.error("[calendar/events POST]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
