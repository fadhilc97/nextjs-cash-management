import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { transactions } from "@/db/schema";
import {
  createCategory,
  DuplicateCategoryNameError,
  listCategories,
} from "@/services/categories.service";

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
  type?: "income" | "expense";
}) {
  const [created] = await context.db
    .insert(transactions)
    .values({
      userId: input.userId,
      categoryId: input.categoryId,
      date: input.date,
      type: input.type ?? "expense",
      amount: 10_000,
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

describe("categories service", () => {
  it("creates a category and lists it for its owner", async () => {
    const created = await createCategory(userA.userId, "Transportasi");

    expect(created.name).toBe("Transportasi");

    const list = await listCategories(userA.userId);

    expect(list).toEqual([
      {
        id: created.id,
        name: "Transportasi",
        transactionCount: 0,
      },
    ]);
  });

  it("normalizes surrounding and repeated whitespace", async () => {
    const created = await createCategory(userA.userId, "  Makan   siang  ");

    expect(created.name).toBe("Makan siang");
    expect(await listCategories(userA.userId)).toEqual([
      { id: created.id, name: "Makan siang", transactionCount: 0 },
    ]);
  });

  it("rejects case-insensitive duplicates within the same user", async () => {
    await createCategory(userA.userId, "Makan");

    await expect(
      createCategory(userA.userId, "makan"),
    ).rejects.toBeInstanceOf(DuplicateCategoryNameError);
    await expect(
      createCategory(userA.userId, "  MAKAN  "),
    ).rejects.toBeInstanceOf(DuplicateCategoryNameError);

    expect(await listCategories(userA.userId)).toHaveLength(1);
  });

  it("allows two users to own the same category name", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");
    const categoryB = await createCategory(userB.userId, "Makan");

    expect(categoryA.id).not.toBe(categoryB.id);
  });

  it("never lists another user's categories", async () => {
    await createCategory(userA.userId, "Makan");
    await createCategory(userB.userId, "Gaji");

    const list = await listCategories(userA.userId);

    expect(list.map((category) => category.name)).toEqual(["Makan"]);
  });

  it("sorts case-insensitively A-Z", async () => {
    await createCategory(userA.userId, "makan");
    await createCategory(userA.userId, "Belanja");
    await createCategory(userA.userId, "Gaji");

    const list = await listCategories(userA.userId);

    expect(list.map((category) => category.name)).toEqual([
      "Belanja",
      "Gaji",
      "makan",
    ]);
  });

  it("counts transactions across months and types", async () => {
    const used = await createCategory(userA.userId, "Makan");
    const unused = await createCategory(userA.userId, "Belanja");

    await insertTransaction({
      userId: userA.userId,
      categoryId: used.id,
      date: "2026-01-15",
      type: "expense",
    });
    await insertTransaction({
      userId: userA.userId,
      categoryId: used.id,
      date: "2026-02-20",
      type: "income",
    });

    const list = await listCategories(userA.userId);

    expect(
      list.find((category) => category.id === used.id)?.transactionCount,
    ).toBe(2);
    expect(
      list.find((category) => category.id === unused.id)?.transactionCount,
    ).toBe(0);
  });

  it("does not count another user's transactions for the owner's category", async () => {
    const categoryA = await createCategory(userA.userId, "Makan");

    await insertTransaction({
      userId: userB.userId,
      categoryId: categoryA.id,
      date: "2026-01-15",
    });

    const list = await listCategories(userA.userId);

    expect(list).toEqual([
      { id: categoryA.id, name: "Makan", transactionCount: 0 },
    ]);
  });

  it("returns an empty list when the user has no categories", async () => {
    await expect(listCategories(userA.userId)).resolves.toEqual([]);
  });
});
