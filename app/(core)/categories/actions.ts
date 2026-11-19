"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { validationMessages } from "@/lib/validation";
import { validateCategoryName } from "@/lib/validations/category.validation";
import {
  createCategory as createCategoryRecord,
  DuplicateCategoryNameError,
} from "@/services/categories.service";

import type { CategoryActionState } from "./action-state";

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const user = await requireUser();
  const rawName = getFormString(formData, "name");

  const validation = validateCategoryName(rawName);
  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: { name: validation.errors.name },
      values: { name: validation.values.name },
    };
  }

  try {
    await createCategoryRecord(user.id, validation.data.name);
  } catch (error) {
    if (error instanceof DuplicateCategoryNameError) {
      return {
        status: "error",
        fieldErrors: { name: validationMessages.categoryNameDuplicate },
        values: { name: rawName },
      };
    }

    console.error("Failed to create category", error);

    return {
      status: "error",
      formError: validationMessages.unexpected,
      values: { name: rawName },
    };
  }

  revalidatePath("/categories");
  revalidatePath("/");
  redirect("/categories?status=created");
}
