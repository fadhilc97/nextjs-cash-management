import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { categories, transactions } from "@/db/schema";

import {
  cleanTestData,
  createTestDatabase,
  ensureTestAccounts,
  expectDatabaseErrorCode,
  type TestAccount,
} from "./harness";

type ForeignKeyRow = {
  conname: string;
  delete_action: string;
  referenced_schema: string;
  referenced_table: string;
};

type PolicyRow = {
  tablename: string;
  policyname: string;
  cmd: string;
  qual: string | null;
  with_check: string | null;
  roles: string[];
};

let context!: ReturnType<typeof createTestDatabase>;
let userA!: TestAccount;
let userB!: TestAccount;
let userIds!: string[];

async function insertCategory(userId: string, name: string) {
  const [created] = await context.db
    .insert(categories)
    .values({ userId, name })
    .returning();

  return created;
}

async function insertTransaction(input: {
  userId: string;
  categoryId: number;
  amount: number;
  type?: "income" | "expense";
}) {
  const [created] = await context.db
    .insert(transactions)
    .values({
      userId: input.userId,
      categoryId: input.categoryId,
      amount: input.amount,
      type: input.type ?? "expense",
      date: "2026-01-15",
      description: "Transaksi uji",
    })
    .returning();

  return created;
}

beforeAll(async () => {
  const accounts = await ensureTestAccounts();
  userA = accounts.userA;
  userB = accounts.userB;
  userIds = [userA.userId, userB.userId];

  context = createTestDatabase();
  await cleanTestData(context.db, userIds);
});

beforeEach(async () => {
  await cleanTestData(context.db, userIds);
});

afterAll(async () => {
  if (context && userIds) {
    await cleanTestData(context.db, userIds);
    await context.client.end({ timeout: 5 });
  }
});

describe("kontrak database kategori dan transaksi", () => {
  it("mengizinkan user berbeda memakai nama kategori yang sama", async () => {
    const categoryA = await insertCategory(userA.userId, "Makan");
    const categoryB = await insertCategory(userB.userId, "Makan");

    expect(categoryA.id).not.toBe(categoryB.id);
    expect(categoryA.name).toBe(categoryB.name);
  });

  it("menolak duplikat nama kategori per user tanpa membedakan kapitalisasi", async () => {
    await insertCategory(userA.userId, "Makan");

    await expectDatabaseErrorCode(
      insertCategory(userA.userId, "makan"),
      "23505",
    );
  });

  it("menolak amount di luar batas dan menerima batas yang valid", async () => {
    const category = await insertCategory(userA.userId, "Gaji");

    await expectDatabaseErrorCode(
      insertTransaction({ userId: userA.userId, categoryId: category.id, amount: 0 }),
      "23514",
    );
    await expectDatabaseErrorCode(
      insertTransaction({
        userId: userA.userId,
        categoryId: category.id,
        amount: 2_000_000_001,
      }),
      "23514",
    );

    const minimum = await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      amount: 1,
      type: "income",
    });
    const maximum = await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      amount: 2_000_000_000,
      type: "income",
    });

    expect(minimum.amount).toBe(1);
    expect(maximum.amount).toBe(2_000_000_000);
  });

  it("menolak penghapusan kategori yang masih dipakai transaksi", async () => {
    const category = await insertCategory(userA.userId, "Transportasi");
    const transaction = await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      amount: 25_000,
    });

    await expectDatabaseErrorCode(
      context.db.delete(categories).where(eq(categories.id, category.id)),
      "23503",
    );

    await context.db
      .delete(transactions)
      .where(eq(transactions.id, transaction.id));

    const deleted = await context.db
      .delete(categories)
      .where(eq(categories.id, category.id))
      .returning({ id: categories.id });

    expect(deleted).toEqual([{ id: category.id }]);
  });

  it("mewajibkan user_id pada kategori dan transaksi", async () => {
    await expectDatabaseErrorCode(
      context.db.execute(sql`
        insert into public.categories (name) values ('Tanpa Pemilik')
      `),
      "23502",
    );

    const category = await insertCategory(userA.userId, "Kebutuhan");

    await expectDatabaseErrorCode(
      context.db.execute(sql`
        insert into public.transactions
          (date, description, category_id, type, amount)
        values
          ('2026-01-15', 'Tanpa Pemilik', ${category.id}, 'expense', 1000)
      `),
      "23502",
    );
  });

  it("memakai auth.users sebagai induk user_id dengan cascade", async () => {
    const foreignKeys = await context.client<ForeignKeyRow[]>`
      select
        con.conname,
        case con.confdeltype
          when 'a' then 'NO ACTION'
          when 'r' then 'RESTRICT'
          when 'c' then 'CASCADE'
          when 'n' then 'SET NULL'
          when 'd' then 'SET DEFAULT'
        end as delete_action,
        ref_ns.nspname as referenced_schema,
        ref.relname as referenced_table
      from pg_constraint con
      join pg_class tbl on tbl.oid = con.conrelid
      join pg_namespace ns on ns.oid = tbl.relnamespace
      join pg_class ref on ref.oid = con.confrelid
      join pg_namespace ref_ns on ref_ns.oid = ref.relnamespace
      where con.contype = 'f'
        and ns.nspname = 'public'
        and tbl.relname in ('categories', 'transactions')
    `;

    const categoriesUser = foreignKeys.find(
      (row) => row.conname === "categories_user_id_fkey",
    );
    const transactionsUser = foreignKeys.find(
      (row) => row.conname === "transactions_user_id_fkey",
    );
    const transactionsCategory = foreignKeys.find(
      (row) =>
        row.referenced_schema === "public" &&
        row.referenced_table === "categories",
    );

    expect(categoriesUser).toMatchObject({
      delete_action: "CASCADE",
      referenced_schema: "auth",
      referenced_table: "users",
    });
    expect(transactionsUser).toMatchObject({
      delete_action: "CASCADE",
      referenced_schema: "auth",
      referenced_table: "users",
    });
    expect(transactionsCategory).toMatchObject({
      delete_action: "NO ACTION",
      referenced_schema: "public",
      referenced_table: "categories",
    });
    expect(
      foreignKeys.some(
        (row) =>
          row.referenced_schema === "public" &&
          row.referenced_table === "users",
      ),
    ).toBe(false);
  });

  it("mengaktifkan RLS dan satu policy owner pada kedua tabel", async () => {
    const rlsRows = await context.client<
      { tablename: string; relrowsecurity: boolean }[]
    >`
      select c.relname as tablename, c.relrowsecurity
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname in ('categories', 'transactions')
    `;

    expect(rlsRows).toHaveLength(2);
    for (const table of ["categories", "transactions"]) {
      expect(
        rlsRows.find((row) => row.tablename === table)?.relrowsecurity,
      ).toBe(true);
    }

    const policies = await context.client<PolicyRow[]>`
      select tablename, policyname, cmd, qual, with_check, roles
      from pg_policies
      where schemaname = 'public'
        and tablename in ('categories', 'transactions')
    `;

    expect(policies).toHaveLength(2);
    for (const table of ["categories", "transactions"]) {
      const tablePolicies = policies.filter(
        (policy) => policy.tablename === table,
      );

      expect(tablePolicies).toHaveLength(1);
      expect(tablePolicies[0]?.cmd).toBe("ALL");
      expect(tablePolicies[0]?.roles).toContain("authenticated");
      expect(tablePolicies[0]?.qual).toContain("auth.uid() = user_id");
      expect(tablePolicies[0]?.with_check).toContain("auth.uid() = user_id");
    }
  });

  it("menyediakan index dan check constraint sesuai kontrak", async () => {
    const indexes = await context.client<
      { indexname: string; indexdef: string }[]
    >`
      select indexname, indexdef
      from pg_indexes
      where schemaname = 'public'
        and tablename in ('categories', 'transactions')
    `;

    const categoryNameIndex = indexes.find(
      (row) => row.indexname === "categories_user_name_lower_idx",
    );
    const categoryUserIndex = indexes.find(
      (row) => row.indexname === "categories_user_id_idx",
    );
    const transactionDateIndex = indexes.find(
      (row) => row.indexname === "transactions_user_date_created_idx",
    );
    const transactionCategoryIndex = indexes.find(
      (row) => row.indexname === "transactions_user_category_id_idx",
    );

    expect(categoryNameIndex?.indexdef).toMatch(
      /unique index categories_user_name_lower_idx .*\(user_id, lower\(/i,
    );
    expect(categoryUserIndex?.indexdef).toContain("(user_id)");
    expect(transactionDateIndex?.indexdef).toMatch(
      /\(user_id, "?date"?, created_at\)/,
    );
    expect(transactionCategoryIndex?.indexdef).toContain(
      "(user_id, category_id)",
    );

    const amountChecks = await context.client<
      { conname: string; definition: string }[]
    >`
      select con.conname, pg_get_constraintdef(con.oid) as definition
      from pg_constraint con
      join pg_class tbl on tbl.oid = con.conrelid
      join pg_namespace ns on ns.oid = tbl.relnamespace
      where ns.nspname = 'public'
        and tbl.relname = 'transactions'
        and con.contype = 'c'
        and con.conname = 'transactions_amount_check'
    `;

    expect(amountChecks).toHaveLength(1);
    expect(amountChecks[0]?.definition).toMatch(/amount > 0/);
    expect(amountChecks[0]?.definition).toMatch(/amount <= 2000000000/);
  });
});
