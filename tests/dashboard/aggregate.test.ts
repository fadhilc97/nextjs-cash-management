import { describe, expect, it } from "vitest";

import { aggregateDashboard } from "@/lib/dashboard";
import type { DashboardTransaction } from "@/utils/types/dashboard.type";

function transaction(
  categoryId: number,
  categoryName: string,
  type: "income" | "expense",
  amount: number,
): DashboardTransaction {
  return { categoryId, categoryName, type, amount };
}

const lampiranA = [
  transaction(1, "Gaji", "income", 8_000_000),
  transaction(2, "Makan", "expense", 150_000),
  transaction(2, "Makan", "expense", 50_000),
  transaction(3, "Bonus", "income", 1_000_000),
];

describe("dashboard aggregation", () => {
  it("computes Lampiran A totals", () => {
    const summary = aggregateDashboard(lampiranA);

    expect(summary.totalIncome).toBe(9_000_000);
    expect(summary.totalExpense).toBe(200_000);
    expect(summary.balance).toBe(8_800_000);
  });

  it("builds Lampiran A category rows in activity order", () => {
    const summary = aggregateDashboard(lampiranA);

    expect(summary.categories).toEqual([
      {
        categoryId: 1,
        name: "Gaji",
        income: 8_000_000,
        expense: 0,
        net: 8_000_000,
        activity: 8_000_000,
      },
      {
        categoryId: 3,
        name: "Bonus",
        income: 1_000_000,
        expense: 0,
        net: 1_000_000,
        activity: 1_000_000,
      },
      {
        categoryId: 2,
        name: "Makan",
        income: 0,
        expense: 200_000,
        net: -200_000,
        activity: 200_000,
      },
    ]);
  });

  it("handles a category with both income and expense (refund)", () => {
    const summary = aggregateDashboard([
      ...lampiranA,
      transaction(2, "Makan", "income", 20_000),
    ]);

    expect(summary.totalIncome).toBe(9_020_000);
    expect(summary.totalExpense).toBe(200_000);
    expect(summary.balance).toBe(8_820_000);
    expect(summary.categories.find((row) => row.name === "Makan")).toMatchObject(
      {
        income: 20_000,
        expense: 200_000,
        net: -180_000,
        activity: 220_000,
      },
    );
  });

  it("sums both transaction types inside one category", () => {
    const summary = aggregateDashboard([
      transaction(10, "Freelance", "income", 500_000),
      transaction(10, "Freelance", "expense", 100_000),
    ]);

    expect(summary.categories).toEqual([
      {
        categoryId: 10,
        name: "Freelance",
        income: 500_000,
        expense: 100_000,
        net: 400_000,
        activity: 600_000,
      },
    ]);
  });

  it("sorts by activity desc then name A-Z case-insensitively", () => {
    const summary = aggregateDashboard([
      transaction(1, "zakat", "expense", 100_000),
      transaction(2, "Belanja", "expense", 100_000),
      transaction(3, "Gaji", "income", 500_000),
      transaction(4, "Makan", "expense", 50_000),
    ]);

    expect(summary.categories.map((row) => row.name)).toEqual([
      "Gaji",
      "Belanja",
      "zakat",
      "Makan",
    ]);
  });

  it("does not create zero rows for categories without transactions", () => {
    const summary = aggregateDashboard([
      transaction(1, "Gaji", "income", 1_000),
    ]);

    expect(summary.categories.map((row) => row.name)).toEqual(["Gaji"]);
  });

  it("returns zero totals and no rows for an empty month", () => {
    expect(aggregateDashboard([])).toEqual({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      categories: [],
    });
  });

  it("keeps a negative balance and category net correct", () => {
    const summary = aggregateDashboard([
      transaction(1, "Gaji", "income", 100_000),
      transaction(2, "Makan", "expense", 250_000),
    ]);

    expect(summary.balance).toBe(-150_000);
    expect(summary.categories.find((row) => row.name === "Makan")?.net).toBe(
      -250_000,
    );
  });

  it("keeps card totals equal to the sum of category rows", () => {
    const summary = aggregateDashboard(lampiranA);

    const rowIncome = summary.categories.reduce(
      (total, row) => total + row.income,
      0,
    );
    const rowExpense = summary.categories.reduce(
      (total, row) => total + row.expense,
      0,
    );
    const rowNet = summary.categories.reduce(
      (total, row) => total + row.net,
      0,
    );

    expect(rowIncome).toBe(summary.totalIncome);
    expect(rowExpense).toBe(summary.totalExpense);
    expect(rowNet).toBe(summary.balance);
  });
});
