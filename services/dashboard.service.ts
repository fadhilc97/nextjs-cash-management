import { aggregateDashboard } from "@/lib/dashboard";
import {
  listCategoryOptions,
  listTransactionsByMonth,
} from "@/services/transactions.service";
import type { DashboardSummary } from "@/utils/types/dashboard.type";

export interface DashboardData extends DashboardSummary {
  /** Whether the user owns any category at all, independent of the month. */
  hasCategories: boolean;
}

/**
 * Loads one month of the owner's transactions and derives every dashboard
 * number from that same dataset. The transaction query is the single main
 * query; the category lookup only powers the conditional empty state.
 */
export async function getDashboardData(
  userId: string,
  month: string,
): Promise<DashboardData> {
  const [transactions, categories] = await Promise.all([
    listTransactionsByMonth(userId, month),
    listCategoryOptions(userId),
  ]);

  return {
    ...aggregateDashboard(transactions),
    hasCategories: categories.length > 0,
  };
}
