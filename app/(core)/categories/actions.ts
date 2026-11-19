"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { validationMessages } from "@/lib/validation";
import {
  categoryIdSchema,
  validateCategoryName,
} from "@/lib/validations/category.validation";
import {
  CategoryInUseError,
  createCategory as createCategoryRecord,
  deleteCategory as deleteCategoryRecord,
  DuplicateCategoryNameError,
  updateCategory as updateCategoryRecord,
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

export async function updateCategory(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const user = await requireUser();

  const idResult = categoryIdSchema.safeParse(getFormString(formData, "id"));
  if (!idResult.success) {
    notFound();
  }

  const rawName = getFormString(formData, "name");

  const validation = validateCategoryName(rawName);
  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: { name: validation.errors.name },
      values: { name: validation.values.name },
    };
  }

  let updated: { id: number; name: string } | null;

  try {
    updated = await updateCategoryRecord(
      user.id,
      idResult.data,
      validation.data.name,
    );
  } catch (error) {
    if (error instanceof DuplicateCategoryNameError) {
      return {
        status: "error",
        fieldErrors: { name: validationMessages.categoryNameDuplicate },
        values: { name: rawName },
      };
    }

    console.error("Failed to update category", error);

    return {
      status: "error",
      formError: validationMessages.unexpected,
      values: { name: rawName },
    };
  }

  if (!updated) {
    notFound();
  }

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/transactions");
  redirect("/categories?status=updated");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const user = await requireUser();

  const idResult = categoryIdSchema.safeParse(getFormString(formData, "id"));
  if (!idResult.success) {
    notFound();
  }

  let deleted: { id: number } | null;

  try {
    deleted = await deleteCategoryRecord(user.id, idResult.data);
  } catch (error) {
    if (error instanceof CategoryInUseError) {
      revalidatePath("/categories");
      redirect("/categories?error=category-in-use");
    }

    console.error("Failed to delete category", error);
    throw error;
  }

  if (!deleted) {
    notFound();
  }

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/transactions");
  redirect("/categories?status=deleted");
}
