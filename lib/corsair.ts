// lib/corsair.ts
// Single Corsair client shared across all API routes.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@corsair-dev/app";

if (!process.env.CORSAIR_KEK) {
  throw new Error("Missing env: CORSAIR_KEK");
}
if (!process.env.CORSAIR_INSTANCE_ID) {
  throw new Error("Missing env: CORSAIR_INSTANCE_ID");
}

console.log("Using Corsair instance:", process.env.CORSAIR_KEK);
export const corsair = createClient({
  apiKey: process.env.CORSAIR_KEK!,
});

/** Returns a scoped tenant handle for the given user / workspace id. */
export function getTenant(tenantId: string) {
  const inst = corsair.instance(process.env.CORSAIR_INSTANCE_ID!);
  return inst.tenant(tenantId);
}

/** Ensures a tenant exists; creates it if not. */
export async function ensureTenant(tenantId: string) {
  const inst = corsair.instance(process.env.CORSAIR_INSTANCE_ID!);
  try {
    return await inst.tenant(tenantId).get();
  } catch {
    return inst.tenants.create(tenantId);
  }
}