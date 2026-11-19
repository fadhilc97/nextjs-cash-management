import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  integer,
  uuid,
  varchar,
  date,
  timestamp,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("categories_user_name_lower_idx").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
    index("categories_user_id_idx").on(table.userId),
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    date: date("date").notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "no action" }),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("transactions_user_date_created_idx").on(
      table.userId,
      table.date,
      table.createdAt,
    ),
    index("transactions_user_category_id_idx").on(
      table.userId,
      table.categoryId,
    ),
    check(
      "transactions_amount_check",
      sql`${table.amount} > 0 and ${table.amount} <= 2000000000`,
    ),
  ],
);
