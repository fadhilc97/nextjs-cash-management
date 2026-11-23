import type { TransactionType } from "@/lib/currency";

export interface TransactionListItem {
  id: number;
  date: string;
  description: string;
  categoryId: number;
  categoryName: string;
  type: TransactionType;
  amount: number;
  createdAt: Date;
}

export interface TransactionDetail {
  id: number;
  date: string;
  description: string;
  categoryId: number;
  categoryName: string | null;
  type: TransactionType;
  amount: number;
  createdAt: Date;
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface CreateTransactionInput {
  date: string;
  description: string;
  categoryId: number;
  type: TransactionType;
  amount: number;
}

export interface TransactionActionValues {
  date: string;
  description: string;
  categoryId: string;
  type: string;
  amount: string;
}

export interface TransactionActionState {
  status: "idle" | "error";
  fieldErrors?: Partial<Record<keyof TransactionActionValues, string>>;
  formError?: string;
  values?: TransactionActionValues;
}
