import { corsair, ensureReady } from "@/app/server/corsair";
import { toNextJsHandler } from "corsair";

const getHandler = toNextJsHandler(corsair, { basePath: "/api/corsair" });

export async function GET(req: Request) {
  await ensureReady();
  return getHandler.GET(req);
}

export async function POST(req: Request) {
  await ensureReady();
  return getHandler.POST(req);
}
