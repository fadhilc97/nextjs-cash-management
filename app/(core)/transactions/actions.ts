"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { currentMonthInJakarta } from "@/lib/date";
import { monthFromDate } from "@/lib/month";
import { validationMessages } from "@/lib/validation";
import {
  transactionIdSchema,
  transactionMonthSchema,
  validateTransactionForm,
} from "@/lib/validations/transaction.validation";
import {
  CategoryNotFoundError,
  createTransaction as createTransactionRecord,
  deleteTransaction as deleteTransactionRecord,
  updateTransaction as updateTransactionRecord,
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

export async function updateTransaction(
  transactionId: string,
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const user = await requireUser();

  const idResult = transactionIdSchema.safeParse(transactionId);
  if (!idResult.success) {
    notFound();
  }

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

  let updated: Awaited<ReturnType<typeof updateTransactionRecord>>;

  try {
    updated = await updateTransactionRecord(
      user.id,
      idResult.data,
      validation.data,
    );
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return {
        status: "error",
        fieldErrors: { categoryId: error.message },
        values: input,
      };
    }

    console.error("Failed to update transaction", error);

    return {
      status: "error",
      formError: validationMessages.unexpected,
      values: input,
    };
  }

  if (!updated) {
    notFound();
  }

  revalidatePath("/");
  revalidatePath("/transactions");

  const month = monthFromDate(validation.data.date);
  redirect(`/transactions?month=${month}&status=updated`);
}

export async function deleteTransaction(formData: FormData): Promise<void> {
  const user = await requireUser();

  const idResult = transactionIdSchema.safeParse(getFormString(formData, "id"));
  if (!idResult.success) {
    notFound();
  }

  const monthResult = transactionMonthSchema.safeParse(
    getFormString(formData, "month"),
  );
  const fallbackMonth = monthResult.success
    ? monthResult.data
    : currentMonthInJakarta();

  let deleted: Awaited<ReturnType<typeof deleteTransactionRecord>>;

  try {
    deleted = await deleteTransactionRecord(user.id, idResult.data);
  } catch (error) {
    console.error("Failed to delete transaction", error);
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/transactions");

  const month = deleted?.month ?? fallbackMonth;
  redirect(`/transactions?month=${month}&status=deleted`);
}
