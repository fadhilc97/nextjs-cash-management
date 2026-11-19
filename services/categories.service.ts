import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/services/drizzle.service";
import { categories, transactions } from "@/db/schema";
import { normalizeCategoryName } from "@/lib/validations/category.validation";

export interface CategorySummary {
  id: number;
  name: string;
  transactionCount: number;
}

export class DuplicateCategoryNameError extends Error {
  constructor() {
    super("Nama kategori sudah digunakan.");
    this.name = "DuplicateCategoryNameError";
  }
}

export class CategoryInUseError extends Error {
  readonly transactionCount: number;

  constructor(transactionCount: number) {
    super("Kategori masih digunakan oleh transaksi.");
    this.name = "CategoryInUseError";
    this.transactionCount = transactionCount;
  }
}

function hasDatabaseCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function isUniqueViolation(error: unknown): boolean {
  return hasDatabaseCode(error, "23505");
}

/**
 * Lists the owner's categories A-Z (case-insensitive) together with the number
 * of transactions that use each category across every month and type. The
 * transactions join is scoped to the same user so another user's row can never
 * inflate the count, even if it references this user's category directly.
 */
export async function listCategories(
  userId: string,
): Promise<CategorySummary[]> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      transactionCount: sql<number>`count(${transactions.id})::int`,
    })
    .from(categories)
    .leftJoin(
      transactions,
      and(
        eq(transactions.categoryId, categories.id),
        eq(transactions.userId, userId),
      ),
    )
    .where(eq(categories.userId, userId))
    .groupBy(categories.id, categories.name)
    .orderBy(
      sql`lower(${categories.name}) asc`,
      asc(categories.name),
      asc(categories.id),
    );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    transactionCount: Number(row.transactionCount),
  }));
}

/**
 * Reads one category scoped to its owner. Another user's id and a missing id
 * both resolve to null so callers can surface a 404 without leaking existence.
 */
export async function getCategoryById(
  userId: string,
  categoryId: number,
): Promise<{ id: number; name: string } | null> {
  const [category] = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(
      and(eq(categories.id, categoryId), eq(categories.userId, userId)),
    )
    .limit(1);

  return category ?? null;
}

/**
 * Counts the owner's transactions that use a category. Returns null when the
 * category does not belong to the owner, and never counts rows owned by another
 * user even if they reference this category directly.
 */
export async function getCategoryUsage(
  userId: string,
  categoryId: number,
): Promise<number | null> {
  if (!(await getCategoryById(userId, categoryId))) {
    return null;
  }

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(transactions)
    .where(
      and(
        eq(transactions.categoryId, categoryId),
        eq(transactions.userId, userId),
      ),
    );

  return Number(row?.count ?? 0);
}

/**
 * Hard-deletes an unused category owned by the user. Another user's category
 * and a missing category resolve to null. A category that is still referenced
 * by the owner's transactions is rejected with CategoryInUseError so the
 * caller can report the exact usage count. The foreign key violation (23503)
 * is treated the same way to cover a transaction inserted after the check.
 */
export async function deleteCategory(
  userId: string,
  categoryId: number,
): Promise<{ id: number } | null> {
  const usage = await getCategoryUsage(userId, categoryId);

  if (usage === null) {
    return null;
  }

  if (usage > 0) {
    throw new CategoryInUseError(usage);
  }

  try {
    const [deleted] = await db
      .delete(categories)
      .where(
        and(eq(categories.id, categoryId), eq(categories.userId, userId)),
      )
      .returning({ id: categories.id });

    return deleted ?? null;
  } catch (error) {
    if (hasDatabaseCode(error, "23503")) {
      const currentUsage = await getCategoryUsage(userId, categoryId);
      throw new CategoryInUseError(currentUsage ?? 1);
    }

    throw error;
  }
}

async function findCategoryByName(
  userId: string,
  name: string,
  excludeId?: number,
): Promise<{ id: number } | undefined> {
  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(
        eq(categories.userId, userId),
        sql`lower(${categories.name}) = lower(${name})`,
        excludeId === undefined ? undefined : sql`${categories.id} <> ${excludeId}`,
      ),
    )
    .limit(1);

  return existing;
}

/**
 * Renames one of the owner's categories. Another user's category and a missing
 * category both resolve to null. Duplicate names are checked case-insensitively
 * while excluding the category being renamed, so changing only capitalization
 * of its own name stays valid.
 */
export async function updateCategory(
  userId: string,
  categoryId: number,
  rawName: string,
): Promise<{ id: number; name: string } | null> {
  if (!(await getCategoryById(userId, categoryId))) {
    return null;
  }

  const name = normalizeCategoryName(rawName);

  if (await findCategoryByName(userId, name, categoryId)) {
    throw new DuplicateCategoryNameError();
  }

  try {
    const [updated] = await db
      .update(categories)
      .set({ name, updatedAt: new Date() })
      .where(
        and(eq(categories.id, categoryId), eq(categories.userId, userId)),
      )
      .returning({ id: categories.id, name: categories.name });

    return updated ?? null;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateCategoryNameError();
    }

    throw error;
  }
}

/**
 * Creates a category for the owner. The name is trimmed and internal whitespace
 * is collapsed before insert. Duplicates are rejected case-insensitively within
 * the owner's scope, including the database unique violation (23505) race.
 */
export async function createCategory(
  userId: string,
  rawName: string,
): Promise<{ id: number; name: string }> {
  const name = normalizeCategoryName(rawName);

  if (await findCategoryByName(userId, name)) {
    throw new DuplicateCategoryNameError();
  }

  try {
    const [created] = await db
      .insert(categories)
      .values({ userId, name })
      .returning({ id: categories.id, name: categories.name });

    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateCategoryNameError();
    }

    throw error;
  }
}
