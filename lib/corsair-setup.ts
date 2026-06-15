// lib/corsair-setup.ts
// ─────────────────────────────────────────────────────────────────────────────
// Run ONCE to:
//   1. Create a Corsair instance
//   2. Install gmail + googlecalendar plugins with your Google OAuth credentials
//   3. Print the CORSAIR_INSTANCE_ID to paste into .env.local
//
// Usage:
//   npx ts-node --project tsconfig.json lib/corsair-setup.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@corsair-dev/app";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log(" process.env.CORSAIR_KEK! ", process.env.CORSAIR_KEK! );

async function setup() {
  const corsair = createClient({ apiKey: process.env.CORSAIR_KEK! });

  // ── 1. Create instance (skip if CORSAIR_INSTANCE_ID already set) ────────────
  let instanceId = process.env.CORSAIR_INSTANCE_ID;

  if (!instanceId) {
    console.log("Creating Corsair instance…");
    const { id } = await corsair.instances.create({ name: "superhuman-app" });
    instanceId = id;
    console.log(`\n✅ Instance created: ${id}`);
    console.log(`👉 Add to .env.local: CORSAIR_INSTANCE_ID=${id}\n`);
  } else {
    console.log(`Using existing instance: ${instanceId}`);
  }

  const inst = corsair.instance(instanceId);

  // ── 2. Install Gmail plugin ─────────────────────────────────────────────────
  console.log("Installing gmail plugin…");
  await inst.plugins.upsert("gmail", { authType: "oauth_2" });

  await inst.plugins.credentials.setRoot("gmail", "client_id",     process.env.GOOGLE_CLIENT_ID!);
  await inst.plugins.credentials.setRoot("gmail", "client_secret", process.env.GOOGLE_CLIENT_SECRET!);

  console.log("✅ Gmail plugin installed");

  // ── 3. Install Google Calendar plugin ──────────────────────────────────────
  console.log("Installing googlecalendar plugin…");
  await inst.plugins.upsert("googlecalendar", { authType: "oauth_2" });

  await inst.plugins.credentials.setRoot("googlecalendar", "client_id",     process.env.GOOGLE_CLIENT_ID!);
  await inst.plugins.credentials.setRoot("googlecalendar", "client_secret", process.env.GOOGLE_CLIENT_SECRET!);

  console.log("✅ Google Calendar plugin installed");

  console.log("\n🎉 Setup complete. Both plugins are ready.");
  console.log("Users can now connect via the /integrations page.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});