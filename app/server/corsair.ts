import { Pool } from 'pg';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const corsair = createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: true,
});

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS corsair_integrations (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name        TEXT NOT NULL UNIQUE,
  config      JSONB NOT NULL DEFAULT '{}',
  dek         TEXT
);

CREATE TABLE IF NOT EXISTS corsair_accounts (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id       TEXT NOT NULL,
  integration_id  TEXT NOT NULL REFERENCES corsair_integrations(id) ON DELETE CASCADE,
  config          JSONB NOT NULL DEFAULT '{}',
  dek             TEXT,
  UNIQUE(tenant_id, integration_id)
);

CREATE TABLE IF NOT EXISTS corsair_entities (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  account_id   TEXT NOT NULL REFERENCES corsair_accounts(id) ON DELETE CASCADE,
  entity_id    TEXT NOT NULL,
  entity_type  TEXT NOT NULL,
  version      TEXT NOT NULL,
  data         JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS corsair_events (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  account_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  status      TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS corsair_permissions (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  token       TEXT NOT NULL UNIQUE,
  plugin      TEXT NOT NULL,
  endpoint    TEXT NOT NULL,
  args        TEXT NOT NULL,
  tenant_id   TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
  expires_at  TEXT NOT NULL,
  error       TEXT
);
`;

const INTEGRATIONS = ['gmail', 'googlecalendar'] as const;

let readyPromise: Promise<void> | null = null;

async function doSetup(): Promise<void> {
    // 1. Create tables
    await pool.query(CREATE_TABLES_SQL);

    // 2. Ensure integration rows exist (one per plugin)
    for (const name of INTEGRATIONS) {
        await pool.query(
            `INSERT INTO corsair_integrations (id, name, config)
             VALUES (gen_random_uuid()::text, $1, '{}')
             ON CONFLICT (name) DO NOTHING`,
            [name]
        );
    }

    // 3. Reset DEK state — any DEK previously written with an absent or different KEK
    //    is unreadable. Wiping dek/config lets issue_new_dek() start fresh with the
    //    current CORSAIR_KEK. Tenant OAuth tokens (in corsair_accounts) are keyed off
    //    the integration DEK and are similarly re-obtained via the OAuth flow.
    await pool.query(
        `UPDATE corsair_integrations SET dek = NULL, config = '{}' WHERE name = ANY($1)`,
        [INTEGRATIONS as unknown as string[]]
    );

    // 4. Issue fresh DEKs encrypted with the current KEK
    await corsair.keys.gmail.issue_new_dek();
    await corsair.keys.googlecalendar.issue_new_dek();

    // 5. Set integration-level OAuth credentials
    const redirectUrl = `${process.env.BETTER_AUTH_URL}/api/integrations/callback`;

    await corsair.keys.gmail.set_client_id(process.env.GOOGLE_CLIENT_ID!);
    await corsair.keys.gmail.set_client_secret(process.env.GOOGLE_CLIENT_SECRET!);
    await corsair.keys.gmail.set_redirect_url(redirectUrl);

    await corsair.keys.googlecalendar.set_client_id(process.env.GOOGLE_CLIENT_ID!);
    await corsair.keys.googlecalendar.set_client_secret(process.env.GOOGLE_CLIENT_SECRET!);
    await corsair.keys.googlecalendar.set_redirect_url(redirectUrl);
}

export async function ensureReady(): Promise<void> {
    if (readyPromise) return readyPromise;
    readyPromise = doSetup().catch((err) => {
        // Reset so the next request can retry rather than returning a permanently-rejected promise
        readyPromise = null;
        throw err;
    });
    return readyPromise;
}
