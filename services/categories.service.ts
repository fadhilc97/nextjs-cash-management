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

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
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

async function findCategoryByName(
  userId: string,
  name: string,
): Promise<{ id: number } | undefined> {
  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(
        eq(categories.userId, userId),
        sql`lower(${categories.name}) = lower(${name})`,
      ),
    )
    .limit(1);

  return existing;
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
