import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { corsair, ensureReady } from "@/app/server/corsair";

// POST /api/gmail/action
// Body: { action: "archive"|"trash"|"star"|"unstar", messageId: string }
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, messageId } = await req.json();
    if (!action || !messageId) {
      return NextResponse.json({ error: "action and messageId are required" }, { status: 400 });
    }

    await ensureReady();
    const tenant = corsair.withTenant(session.user.id);

    switch (action) {
      case "archive":
        await tenant.gmail.api.messages.modify({
          id: messageId,
          removeLabelIds: ["INBOX"],
        });
        break;
      case "trash":
        await tenant.gmail.api.messages.trash({ id: messageId });
        break;
      case "star":
        await tenant.gmail.api.messages.modify({
          id: messageId,
          addLabelIds: ["STARRED"],
        });
        break;
      case "unstar":
        await tenant.gmail.api.messages.modify({
          id: messageId,
          removeLabelIds: ["STARRED"],
        });
        break;
      case "markRead":
        await tenant.gmail.api.messages.modify({
          id: messageId,
          removeLabelIds: ["UNREAD"],
        });
        break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[gmail/action]", err);
    return NextResponse.json({ error: err?.message ?? "Internal server error" }, { status: 500 });
  }
}
