import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and fill in the database URL.',
  );
}

const createClient = () =>
  postgres(connectionString, {
    // Keep prepared statements off so the same client also works against the
    // transaction-mode pooler (port 6543), which does not support them.
    prepare: false,
    // Session-mode pooling holds one server connection per client, so keep the
    // local pool small, especially on serverless platforms.
    max: process.env.NODE_ENV === 'production' ? 5 : 1,
  });

type PostgresClient = ReturnType<typeof createClient>;

// Next.js re-evaluates modules on hot reload; reuse the pool so dev does not
// leak a new set of connections on every change.
const globalForDb = globalThis as unknown as { postgresClient?: PostgresClient };

const client = globalForDb.postgresClient ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client);
