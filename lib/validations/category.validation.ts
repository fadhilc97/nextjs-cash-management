import { z } from "zod";

import {
  validationMessages,
  type ValidationResult,
} from "@/lib/validation";

const MAX_CATEGORY_NAME_LENGTH = 50;

export function normalizeCategoryName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export const categoryNameSchema = z
  .string()
  .transform((value) => normalizeCategoryName(value ?? ""))
  .pipe(
    z
      .string()
      .min(1, validationMessages.categoryNameRequired)
      .max(MAX_CATEGORY_NAME_LENGTH, validationMessages.categoryNameTooLong),
  );

export const categoryIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/)
  .transform((value) => Number(value))
  .pipe(z.number().int().positive().max(2_147_483_647));

export function validateCategoryName(
  raw: string,
): ValidationResult<{ name: string }> {
  const value = raw ?? "";
  const result = categoryNameSchema.safeParse(value);

  if (!result.success) {
    return {
      success: false,
      errors: {
        name:
          result.error.issues[0]?.message ??
          validationMessages.categoryNameRequired,
      },
      values: { name: value },
    };
  }

  return { success: true, data: { name: result.data } };
}
