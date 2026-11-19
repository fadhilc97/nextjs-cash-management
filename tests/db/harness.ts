import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";

export type TestAccount = {
  email: string;
  userId: string;
};

export function createTestDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL tidak diset. Isi database development di .env sebelum menjalankan test:db.",
    );
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  return {
    client,
    db: drizzle(client, { schema }),
  };
}

async function ensureTestAccount(
  label: string,
  email: string,
  password: string,
): Promise<TestAccount> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY tidak diset.",
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const signIn = await supabase.auth.signInWithPassword({ email, password });

  if (!signIn.error && signIn.data.user) {
    return { email, userId: signIn.data.user.id };
  }

  const signUp = await supabase.auth.signUp({ email, password });

  if (signUp.error) {
    throw new Error(
      `Gagal menyiapkan akun uji ${label} (kode: ${signUp.error.code ?? "tidak diketahui"}). Pastikan kredensial env benar dan confirm email nonaktif.`,
    );
  }

  if (!signUp.data.user || !signUp.data.session) {
    throw new Error(
      `Akun uji ${label} tidak mendapat sesi. Pastikan confirm email nonaktif di Supabase Auth.`,
    );
  }

  return { email, userId: signUp.data.user.id };
}

function requireCredential(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} tidak diset. Salin placeholder akun uji dari .env.example ke .env.`,
    );
  }

  return value;
}

export async function ensureTestAccounts(): Promise<{
  userA: TestAccount;
  userB: TestAccount;
}> {
  // Create accounts one at a time so Supabase Auth rate limiting is not hit by
  // parallel signup/login requests.
  const userA = await ensureTestAccount(
    "A",
    requireCredential("TEST_USER_A_EMAIL"),
    requireCredential("TEST_USER_A_PASSWORD"),
  );
  const userB = await ensureTestAccount(
    "B",
    requireCredential("TEST_USER_B_EMAIL"),
    requireCredential("TEST_USER_B_PASSWORD"),
  );

  return { userA, userB };
}

export async function cleanTestData(
  db: ReturnType<typeof createTestDatabase>["db"],
  userIds: string[],
) {
  await db
    .delete(schema.transactions)
    .where(inArray(schema.transactions.userId, userIds));
  await db
    .delete(schema.categories)
    .where(inArray(schema.categories.userId, userIds));
}

export async function expectDatabaseErrorCode(
  operation: Promise<unknown>,
  code: string,
) {
  await expectErrorCode(operation, code);
}

async function expectErrorCode(operation: Promise<unknown>, code: string) {
  try {
    await operation;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === code
    ) {
      return;
    }

    throw error;
  }

  throw new Error(`Operasi berhasil, padahal harus gagal dengan kode ${code}.`);
}
