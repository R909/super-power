import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    await tenant.googlecalendar.api.events.delete({
      calendarId: "primary",
      eventId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[calendar/events/id DELETE]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    const event = await tenant.googlecalendar.api.events.patch({
      calendarId: "primary",
      eventId: id,
      event: body,
    });

    return NextResponse.json(event);
  } catch (err: any) {
    console.error("[calendar/events/id PATCH]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
