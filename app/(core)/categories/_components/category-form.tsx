"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CategoryActionState } from "@/utils/types/category.type";

import { initialCategoryActionState } from "../action-state";

interface CategoryFormProps {
  action: (
    state: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;
}

export function CategoryForm({ action }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialCategoryActionState,
  );
  const error = state.fieldErrors?.name;

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-lg border border-border bg-card p-4 md:p-6"
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

      <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 md:grid-cols-[minmax(0,1fr)_auto]">
        <Label
          htmlFor="category-name"
          className="md:col-start-1 md:row-start-1"
        >
          Nama Kategori
          <span aria-hidden="true" className="text-negative">
            *
          </span>
        </Label>

        <Input
          id="category-name"
          name="name"
          type="text"
          autoComplete="off"
          placeholder="Contoh: Transportasi"
          defaultValue={state.values?.name ?? ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "category-name-error" : undefined}
          className="md:col-start-1 md:row-start-2"
        />

        {error ? (
          <p
            id="category-name-error"
            className="text-[13px] leading-[18px] font-medium text-negative md:col-start-1 md:row-start-3"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="mt-3 w-full md:col-start-2 md:row-start-2 md:mt-0 md:w-auto md:self-start"
        >
          {pending ? "Menyimpan…" : "Tambah Kategori"}
        </Button>
      </div>
    </form>
  );
}
