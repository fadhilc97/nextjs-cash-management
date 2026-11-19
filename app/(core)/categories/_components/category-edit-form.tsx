"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/field";
import { Input } from "@/components/ui/input";

import type { CategoryActionState } from "@/utils/types/category.type";

import { initialCategoryActionState } from "../action-state";

interface CategoryEditFormProps {
  category: { id: number; name: string };
  action: (
    state: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;
}

export function CategoryEditForm({
  category,
  action,
}: CategoryEditFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialCategoryActionState,
  );
  const error = state.fieldErrors?.name;

  return (
    <form
      action={formAction}
      noValidate
      className="max-w-[640px] rounded-lg border border-border bg-card p-4 md:p-6"
    >
      {state.formError ? (
        <Alert
          role="alert"
          className="mb-4 border border-negative/25 bg-negative-soft"
        >
          <AlertDescription className="text-sm leading-5 text-negative">
            {state.formError}
          </AlertDescription>
        </Alert>
      ) : null}

      <input type="hidden" name="id" value={category.id} />

      <Field
        id="category-name"
        label="Nama Kategori"
        error={error}
        required
      >
        <Input
          name="name"
          type="text"
          autoComplete="off"
          placeholder="Contoh: Transportasi"
          defaultValue={state.values?.name ?? category.name}
        />
      </Field>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/categories">Batal</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
