import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createCategory } from "@/services/categories.service";
import { getDashboardData } from "@/services/dashboard.service";
import { createTransaction } from "@/services/transactions.service";

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

describe("dashboard service", () => {
  it("returns only the active user's monthly data", async () => {
    const categoryA = await createCategory(userA.userId, "Gaji A");
    const categoryB = await createCategory(userB.userId, "Gaji B");

    await createTransaction(userA.userId, {
      date: "2026-11-10",
      description: "Gaji November",
      categoryId: categoryA.id,
      type: "income",
      amount: 8_000_000,
    });
    await createTransaction(userA.userId, {
      date: "2026-11-11",
      description: "Makan siang",
      categoryId: categoryA.id,
      type: "expense",
      amount: 150_000,
    });
    await createTransaction(userB.userId, {
      date: "2026-11-12",
      description: "Data user B",
      categoryId: categoryB.id,
      type: "income",
      amount: 99_000_000,
    });

    const data = await getDashboardData(userA.userId, "2026-11");

    expect(data.totalIncome).toBe(8_000_000);
    expect(data.totalExpense).toBe(150_000);
    expect(data.balance).toBe(7_850_000);
    expect(data.categories.map((row) => row.name)).toEqual(["Gaji A"]);
    expect(data.hasCategories).toBe(true);
  });
});
