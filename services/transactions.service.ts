import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";

import { categories, transactions } from "@/db/schema";
import { monthFromDate, monthRange } from "@/lib/month";
import { db } from "@/services/drizzle.service";
import type {
  CategoryOption,
  CreateTransactionInput,
  TransactionDetail,
  TransactionListItem,
} from "@/utils/types/transaction.type";

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Kategori tidak ditemukan. Muat ulang halaman.");
    this.name = "CategoryNotFoundError";
  }
}

/**
 * Lists every transaction of the owner in the given month, ordered newest
 * transaction date first and newest creation time first within the same date.
 * The month interval is half-open so adjacent months never overlap.
 */
export async function listTransactionsByMonth(
  userId: string,
  month: string,
): Promise<TransactionListItem[]> {
  const { start, endExclusive } = monthRange(month);

  const rows = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      description: transactions.description,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      type: transactions.type,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, start),
        lt(transactions.date, endExclusive),
      ),
    )
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return rows;
}

/**
 * Reads one transaction scoped to its owner. Another user's id and a missing id
 * both resolve to null so callers can surface a 404 without leaking existence.
 * The category is joined only when it belongs to the same owner; an orphaned
 * category leaves `categoryName` null instead of failing the read.
 */
export async function getTransactionById(
  userId: string,
  transactionId: number,
): Promise<TransactionDetail | null> {
  const [transaction] = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      description: transactions.description,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      type: transactions.type,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .leftJoin(
      categories,
      and(
        eq(transactions.categoryId, categories.id),
        eq(categories.userId, userId),
      ),
    )
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId),
      ),
    )
    .limit(1);

  return transaction ?? null;
}

/**
 * Lists the owner's categories as select options, sorted case-insensitively
 * A-Z with a stable name/id tie-break.
 */
export async function listCategoryOptions(
  userId: string,
): Promise<CategoryOption[]> {
  return db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(
      sql`lower(${categories.name}) asc`,
      asc(categories.name),
      asc(categories.id),
    );
}

/**
 * Creates a transaction for the owner after verifying that the category exists
 * and belongs to the same user. `userId` always comes from the session, never
 * from the submitted form.
 */
export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
): Promise<TransactionListItem> {
  const [category] = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.userId, userId),
      ),
    )
    .limit(1);

  if (!category) {
    throw new CategoryNotFoundError();
  }

  const [created] = await db
    .insert(transactions)
    .values({
      userId,
      date: input.date,
      description: input.description,
      categoryId: category.id,
      type: input.type,
      amount: input.amount,
    })
    .returning();

  return {
    id: created.id,
    date: created.date,
    description: created.description,
    categoryId: created.categoryId,
    categoryName: category.name,
    type: created.type,
    amount: created.amount,
    createdAt: created.createdAt,
  };
}

/**
 * Updates one of the owner's transactions after verifying that the target
 * category also belongs to the same owner. Another user's transaction and a
 * missing transaction both resolve to null, while a foreign or missing
 * category is rejected with CategoryNotFoundError without touching the row.
 */
export async function updateTransaction(
  userId: string,
  transactionId: number,
  input: CreateTransactionInput,
): Promise<TransactionListItem | null> {
  const existing = await getTransactionById(userId, transactionId);

  if (!existing) {
    return null;
  }

  const [category] = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.userId, userId),
      ),
    )
    .limit(1);

  if (!category) {
    throw new CategoryNotFoundError();
  }

  const [updated] = await db
    .update(transactions)
    .set({
      date: input.date,
      description: input.description.trim(),
      categoryId: category.id,
      type: input.type,
      amount: input.amount,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId),
      ),
    )
    .returning();

  if (!updated) {
    return null;
  }

  return {
    id: updated.id,
    date: updated.date,
    description: updated.description,
    categoryId: updated.categoryId,
    categoryName: category.name,
    type: updated.type,
    amount: updated.amount,
    createdAt: updated.createdAt,
  };
}

/**
 * Hard-deletes one of the owner's transactions. Another user's id and a
 * missing id both resolve to null. The deleted row's month is returned so the
 * caller can redirect to the month it came from.
 */
export async function deleteTransaction(
  userId: string,
  transactionId: number,
): Promise<{ id: number; month: string } | null> {
  const [deleted] = await db
    .delete(transactions)
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId),
      ),
    )
    .returning({ id: transactions.id, date: transactions.date });

  if (!deleted) {
    return null;
  }

  return { id: deleted.id, month: monthFromDate(deleted.date) };
}
