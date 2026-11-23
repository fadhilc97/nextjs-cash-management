import { and, eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { transactions } from "@/db/schema";
import { createCategory, updateCategory } from "@/services/categories.service";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listCategoryOptions,
  listTransactionsByMonth,
  updateTransaction,
} from "@/services/transactions.service";

import {
  cleanTestData,
  createTestDatabase,
  ensureTestAccounts,
  type TestAccount,
} from "../db/harness";

let context!: ReturnType<typeof createTestDatabase>;
let userA!: TestAccount;
let userB!: TestAccount;
let userIds!: string[];

async function insertTransaction(input: {
  userId: string;
  categoryId: number;
  date: string;
  description?: string;
  type?: "income" | "expense";
  amount?: number;
  createdAt?: Date;
}) {
  const [created] = await context.db
    .insert(transactions)
    .values({
      userId: input.userId,
      categoryId: input.categoryId,
      date: input.date,
      type: input.type ?? "expense",
      amount: input.amount ?? 10_000,
      description: input.description ?? "Transaksi uji",
      ...(input.createdAt ? { createdAt: input.createdAt } : {}),
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

describe("transactions service", () => {
  it("only lists transactions inside the half-open month range", async () => {
    const category = await createCategory(userA.userId, "Makan");

    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-10-31",
      description: "Oktober",
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-01",
      description: "Awal November",
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-30",
      description: "Akhir November",
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-12-01",
      description: "Desember",
    });

    const list = await listTransactionsByMonth(userA.userId, "2026-11");

    expect(list.map((transaction) => transaction.description)).toEqual([
      "Akhir November",
      "Awal November",
    ]);
  });

  it("orders by date desc and created_at desc", async () => {
    const category = await createCategory(userA.userId, "Makan");

    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-10",
      description: "Tanggal lebih baru",
      createdAt: new Date("2026-11-10T01:00:00Z"),
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-05",
      description: "Dibuat lebih dulu",
      createdAt: new Date("2026-11-05T01:00:00Z"),
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-05",
      description: "Dibuat terakhir",
      createdAt: new Date("2026-11-05T02:00:00Z"),
    });

    const list = await listTransactionsByMonth(userA.userId, "2026-11");

    expect(list.map((transaction) => transaction.description)).toEqual([
      "Tanggal lebih baru",
      "Dibuat terakhir",
      "Dibuat lebih dulu",
    ]);
  });

  it("never lists another user's transactions", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");
    const categoryB = await createCategory(userB.userId, "Gaji");

    await insertTransaction({
      userId: userA.userId,
      categoryId: categoryA.id,
      date: "2026-11-10",
      description: "Milik A",
    });
    await insertTransaction({
      userId: userB.userId,
      categoryId: categoryB.id,
      date: "2026-11-11",
      description: "Milik B",
    });

    const list = await listTransactionsByMonth(userA.userId, "2026-11");

    expect(list.map((transaction) => transaction.description)).toEqual([
      "Milik A",
    ]);
  });

  it("lists category options for the owner only, sorted A-Z", async () => {
    await createCategory(userA.userId, "makan");
    await createCategory(userA.userId, "Belanja");
    await createCategory(userA.userId, "Gaji");
    await createCategory(userB.userId, "Zakat");

    const options = await listCategoryOptions(userA.userId);

    expect(options.map((option) => option.name)).toEqual([
      "Belanja",
      "Gaji",
      "makan",
    ]);
  });

  it("creates income and expense transactions for the given user", async () => {
    const category = await createCategory(userA.userId, "Gaji");

    const income = await createTransaction(userA.userId, {
      date: "2026-11-16",
      description: "Gaji November",
      categoryId: category.id,
      type: "income",
      amount: 8_000_000,
    });
    const expense = await createTransaction(userA.userId, {
      date: "2026-11-17",
      description: "Makan siang",
      categoryId: category.id,
      type: "expense",
      amount: 25_000,
    });

    expect(income).toMatchObject({
      type: "income",
      amount: 8_000_000,
      categoryName: "Gaji",
    });
    expect(expense).toMatchObject({
      type: "expense",
      amount: 25_000,
    });

    const [stored] = await context.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, income.id)));
    expect(stored.userId).toBe(userA.userId);
  });

  it("rejects another user's category or a missing category", async () => {
    const categoryB = await createCategory(userB.userId, "Gaji");

    await expect(
      createTransaction(userA.userId, {
        date: "2026-11-16",
        description: "Palsu",
        categoryId: categoryB.id,
        type: "expense",
        amount: 10_000,
      }),
    ).rejects.toThrow("Kategori tidak ditemukan. Muat ulang halaman.");

    await expect(
      createTransaction(userA.userId, {
        date: "2026-11-16",
        description: "Tidak ada",
        categoryId: 999_999_999,
        type: "expense",
        amount: 10_000,
      }),
    ).rejects.toThrow("Kategori tidak ditemukan. Muat ulang halaman.");

    const rows = await context.db
      .select()
      .from(transactions)
      .where(inArray(transactions.userId, userIds));
    expect(rows).toHaveLength(0);
  });

  it("returns the current category name from the relation", async () => {
    const category = await createCategory(userA.userId, "Makan");
    await createTransaction(userA.userId, {
      date: "2026-11-16",
      description: "Makan siang",
      categoryId: category.id,
      type: "expense",
      amount: 25_000,
    });

    await updateCategory(userA.userId, category.id, "Makan & Minum");

    const list = await listTransactionsByMonth(userA.userId, "2026-11");
    expect(list[0].categoryName).toBe("Makan & Minum");
  });

  it("reads one transaction by id within the owner's scope", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");
    const categoryB = await createCategory(userB.userId, "Gaji");

    const owned = await insertTransaction({
      userId: userA.userId,
      categoryId: categoryA.id,
      date: "2026-11-16",
      description: "Milik A",
      type: "expense",
      amount: 25_000,
    });
    const foreign = await insertTransaction({
      userId: userB.userId,
      categoryId: categoryB.id,
      date: "2026-11-17",
      description: "Milik B",
    });

    await expect(
      getTransactionById(userA.userId, owned.id),
    ).resolves.toMatchObject({
      id: owned.id,
      date: "2026-11-16",
      description: "Milik A",
      categoryId: categoryA.id,
      categoryName: "Makan",
      type: "expense",
      amount: 25_000,
    });

    await expect(
      getTransactionById(userA.userId, foreign.id),
    ).resolves.toBeNull();
    await expect(
      getTransactionById(userA.userId, 999_999_999),
    ).resolves.toBeNull();
  });

  it("updates every editable field of the owner's transaction", async () => {
    const oldCategory = await createCategory(userA.userId, "Makan");
    const newCategory = await createCategory(userA.userId, "Transportasi");
    const existing = await insertTransaction({
      userId: userA.userId,
      categoryId: oldCategory.id,
      date: "2026-11-16",
      description: "Makan siang",
      type: "expense",
      amount: 25_000,
    });

    const updated = await updateTransaction(userA.userId, existing.id, {
      date: "2026-10-02",
      description: "  Naik ojek  ",
      categoryId: newCategory.id,
      type: "income",
      amount: 50_000,
    });

    expect(updated).toMatchObject({
      id: existing.id,
      date: "2026-10-02",
      description: "Naik ojek",
      categoryId: newCategory.id,
      categoryName: "Transportasi",
      type: "income",
      amount: 50_000,
    });

    await expect(
      getTransactionById(userA.userId, existing.id),
    ).resolves.toMatchObject({
      date: "2026-10-02",
      description: "Naik ojek",
      categoryId: newCategory.id,
      type: "income",
      amount: 50_000,
    });
  });

  it("never updates another user's transaction", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");
    const categoryB = await createCategory(userB.userId, "Gaji");
    const foreign = await insertTransaction({
      userId: userB.userId,
      categoryId: categoryB.id,
      date: "2026-11-17",
      description: "Milik B",
      amount: 10_000,
    });

    await expect(
      updateTransaction(userA.userId, foreign.id, {
        date: "2026-11-18",
        description: "Diubah A",
        categoryId: categoryA.id,
        type: "income",
        amount: 20_000,
      }),
    ).resolves.toBeNull();

    await expect(
      getTransactionById(userB.userId, foreign.id),
    ).resolves.toMatchObject({
      date: "2026-11-17",
      description: "Milik B",
      categoryId: categoryB.id,
      amount: 10_000,
    });
  });

  it("rejects a foreign or missing category without changing the transaction", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");
    const categoryB = await createCategory(userB.userId, "Gaji");
    const existing = await insertTransaction({
      userId: userA.userId,
      categoryId: categoryA.id,
      date: "2026-11-16",
      description: "Makan siang",
      amount: 25_000,
    });

    await expect(
      updateTransaction(userA.userId, existing.id, {
        date: "2026-11-20",
        description: "Diubah",
        categoryId: categoryB.id,
        type: "expense",
        amount: 30_000,
      }),
    ).rejects.toThrow("Kategori tidak ditemukan. Muat ulang halaman.");

    await expect(
      updateTransaction(userA.userId, existing.id, {
        date: "2026-11-20",
        description: "Diubah",
        categoryId: 999_999_999,
        type: "expense",
        amount: 30_000,
      }),
    ).rejects.toThrow("Kategori tidak ditemukan. Muat ulang halaman.");

    await expect(
      getTransactionById(userA.userId, existing.id),
    ).resolves.toMatchObject({
      date: "2026-11-16",
      description: "Makan siang",
      categoryId: categoryA.id,
      amount: 25_000,
    });
  });

  it("deletes the owner's transaction and returns its source month", async () => {
    const category = await createCategory(userA.userId, "Makan");
    const existing = await insertTransaction({
      userId: userA.userId,
      categoryId: category.id,
      date: "2026-11-16",
    });

    await expect(
      deleteTransaction(userA.userId, existing.id),
    ).resolves.toEqual({ id: existing.id, month: "2026-11" });
    await expect(
      getTransactionById(userA.userId, existing.id),
    ).resolves.toBeNull();
  });

  it("never deletes another user's transaction", async () => {
    const categoryB = await createCategory(userB.userId, "Gaji");
    const foreign = await insertTransaction({
      userId: userB.userId,
      categoryId: categoryB.id,
      date: "2026-11-17",
    });

    await expect(
      deleteTransaction(userA.userId, foreign.id),
    ).resolves.toBeNull();
    await expect(
      getTransactionById(userB.userId, foreign.id),
    ).resolves.toMatchObject({ id: foreign.id });
  });

  it("returns null when deleting an id that no longer exists", async () => {
    await expect(
      deleteTransaction(userA.userId, 999_999_999),
    ).resolves.toBeNull();
  });

  it("returns an empty array for a month without transactions", async () => {
    const category = await createCategory(userA.userId, "Makan");
    await createTransaction(userA.userId, {
      date: "2026-11-16",
      description: "November",
      categoryId: category.id,
      type: "expense",
      amount: 25_000,
    });

    await expect(
      listTransactionsByMonth(userA.userId, "2026-12"),
    ).resolves.toEqual([]);
  });
});
