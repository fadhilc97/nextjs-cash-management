import { z } from "zod";

import { parseAmount } from "@/lib/currency";
import { isValidDateString, todayInJakarta } from "@/lib/date";
import {
  normalizeAmountInput,
  normalizeCategoryIdInput,
  normalizeTransactionDate,
  normalizeTransactionDescription,
  normalizeTransactionType,
  validationMessages,
  type TransactionData,
  type TransactionInput,
  type ValidationResult,
} from "@/lib/validation";

const MIN_DATE = "2000-01-01";
const MAX_AMOUNT = 2_000_000_000;
const MAX_DESCRIPTION_LENGTH = 200;

export interface TransactionSchemaOptions {
  /** Overrides "today" for deterministic tests. */
  today?: string;
  /** Instant used to derive "today" in Asia/Jakarta. */
  now?: Date;
}

export function createTransactionSchema(
  options: TransactionSchemaOptions = {},
) {
  const today = options.today ?? todayInJakarta(options.now);

  const dateSchema = z
    .string()
    .transform((value) => normalizeTransactionDate(value ?? ""))
    .superRefine((value, context) => {
      if (!value) {
        context.addIssue({
          code: "custom",
          message: validationMessages.dateRequired,
        });
      } else if (!isValidDateString(value)) {
        context.addIssue({
          code: "custom",
          message: validationMessages.dateInvalid,
        });
      } else if (value < MIN_DATE) {
        context.addIssue({
          code: "custom",
          message: validationMessages.dateBeforeMinimum,
        });
      } else if (value > today) {
        context.addIssue({
          code: "custom",
          message: validationMessages.dateInFuture,
        });
      }
    });

  const descriptionSchema = z
    .string()
    .transform((value) => normalizeTransactionDescription(value ?? ""))
    .pipe(
      z
        .string()
        .min(1, validationMessages.descriptionRequired)
        .max(MAX_DESCRIPTION_LENGTH, validationMessages.descriptionTooLong),
    );

  const categoryIdSchema = z
    .string()
    .transform((value) => normalizeCategoryIdInput(value ?? ""))
    .pipe(
      z
        .string()
        .min(1, validationMessages.categoryRequired)
        .regex(/^\d+$/, validationMessages.categoryRequired),
    )
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .max(2_147_483_647, validationMessages.categoryRequired),
    );

  const typeSchema = z
    .string()
    .transform((value) => normalizeTransactionType(value ?? ""))
    .pipe(z.enum(["income", "expense"], validationMessages.typeInvalid));

  const amountSchema = z
    .string()
    .transform((value) => normalizeAmountInput(value ?? ""))
    .superRefine((value, context) => {
      if (!value) {
        context.addIssue({
          code: "custom",
          message: validationMessages.amountRequired,
        });
        return;
      }

      const amount = parseAmount(value);
      if (amount === null) {
        context.addIssue({
          code: "custom",
          message: validationMessages.amountNotInteger,
        });
      } else if (amount <= 0) {
        context.addIssue({
          code: "custom",
          message: validationMessages.amountNotPositive,
        });
      } else if (amount > MAX_AMOUNT) {
        context.addIssue({
          code: "custom",
          message: validationMessages.amountTooLarge,
        });
      }
    })
    .transform((value) => parseAmount(value) as number);

  return z.object({
    date: dateSchema,
    description: descriptionSchema,
    categoryId: categoryIdSchema,
    type: typeSchema,
    amount: amountSchema,
  });
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

/**
 * Validates the raw transaction form with Zod while keeping the exact values
 * needed to repopulate the form after a failure.
 */
export function validateTransactionForm(
  input: TransactionInput,
  options: TransactionSchemaOptions = {},
): ValidationResult<TransactionData> {
  const values: Record<string, string> = {
    date: input.date ?? "",
    description: input.description ?? "",
    categoryId: input.categoryId ?? "",
    type: input.type ?? "",
    amount: input.amount ?? "",
  };

  const result = createTransactionSchema(options).safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: toFieldErrors(result.error),
      values,
    };
  }

  return { success: true, data: result.data };
}
