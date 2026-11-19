import type {
  DashboardCategoryRow,
  DashboardSummary,
  DashboardTransaction,
} from "@/utils/types/dashboard.type";

/**
 * Aggregates one month's transactions into totals and per-category rows. The
 * caller is responsible for filtering by user and month; every number here is
 * derived from that single dataset.
 */
export function aggregateDashboard(
  transactions: DashboardTransaction[],
): DashboardSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  const byCategory = new Map<number, DashboardCategoryRow>();

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }

    let row = byCategory.get(transaction.categoryId);
    if (!row) {
      row = {
        categoryId: transaction.categoryId,
        name: transaction.categoryName,
        income: 0,
        expense: 0,
        net: 0,
        activity: 0,
      };
      byCategory.set(transaction.categoryId, row);
    }

    if (transaction.type === "income") {
      row.income += transaction.amount;
    } else {
      row.expense += transaction.amount;
    }
    row.net = row.income - row.expense;
    row.activity = row.income + row.expense;
  }

  const categories = [...byCategory.values()].sort(
    (a, b) =>
      b.activity - a.activity ||
      a.name.localeCompare(b.name, "id", { sensitivity: "base" }) ||
      a.categoryId - b.categoryId,
  );

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categories,
  };
}
