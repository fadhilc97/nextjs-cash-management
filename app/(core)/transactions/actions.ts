"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { monthFromDate } from "@/lib/month";
import { validationMessages } from "@/lib/validation";
import { validateTransactionForm } from "@/lib/validations/transaction.validation";
import {
  CategoryNotFoundError,
  createTransaction as createTransactionRecord,
} from "@/services/transactions.service";

import type {
  TransactionActionState,
  TransactionActionValues,
} from "@/utils/types/transaction.type";

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createTransaction(
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const user = await requireUser();
  const input: TransactionActionValues = {
    date: getFormString(formData, "date"),
    description: getFormString(formData, "description"),
    categoryId: getFormString(formData, "categoryId"),
    type: getFormString(formData, "type"),
    amount: getFormString(formData, "amount"),
  };

  const validation = validateTransactionForm(input);

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.errors,
      values: input,
    };
  }

  try {
    await createTransactionRecord(user.id, validation.data);
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return {
        status: "error",
        fieldErrors: { categoryId: error.message },
        values: input,
      };
    }

    console.error("Failed to create transaction", error);

    return {
      status: "error",
      formError: validationMessages.unexpected,
      values: input,
    };
  }

  revalidatePath("/");
  revalidatePath("/transactions");

  const month = monthFromDate(validation.data.date);
  redirect(`/transactions?month=${month}&status=created`);
}
