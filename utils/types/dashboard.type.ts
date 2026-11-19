import type { TransactionType } from "@/lib/currency";

export interface DashboardTransaction {
  categoryId: number;
  categoryName: string;
  type: TransactionType;
  amount: number;
}

export interface DashboardCategoryRow {
  categoryId: number;
  name: string;
  income: number;
  expense: number;
  net: number;
  activity: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categories: DashboardCategoryRow[];
}
