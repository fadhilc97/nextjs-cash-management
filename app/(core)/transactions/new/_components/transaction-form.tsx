"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Field } from "@/components/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type {
  CategoryOption,
  TransactionActionState,
  TransactionActionValues,
} from "@/utils/types/transaction.type";

import { initialTransactionActionState } from "../../action-state";

const MIN_DATE = "2000-01-01";

interface TransactionFormProps {
  action: (
    state: TransactionActionState,
    formData: FormData,
  ) => Promise<TransactionActionState>;
  categories: CategoryOption[];
  defaultDate: string;
  cancelHref: string;
  initialValues?: Partial<TransactionActionValues>;
  initialFieldErrors?: Partial<
    Record<keyof TransactionActionValues, string>
  >;
  initialFormError?: string;
  submitLabel?: string;
}

const selectClassName =
  "h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground transition-colors outline-none focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-negative aria-invalid:ring-negative/20";

const radioCardClassName =
  "flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-base font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background";

export function TransactionForm({
  action,
  categories,
  defaultDate,
  cancelHref,
  initialValues,
  initialFieldErrors,
  initialFormError,
  submitLabel = "Simpan Transaksi",
}: TransactionFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialTransactionActionState,
  );
  const fieldErrors = state.fieldErrors ?? initialFieldErrors ?? {};
  const values = state.values ?? initialValues;
  const formError = state.formError ?? initialFormError;
  const formKey = state.values ? JSON.stringify(state.values) : "initial";

  return (
    <form
      key={formKey}
      action={formAction}
      noValidate
      className="max-w-[640px] space-y-5"
    >
      {formError ? (
        <Alert
          role="alert"
          className="border border-negative/25 bg-negative-soft"
        >
          <AlertDescription className="text-sm leading-5 text-negative">
            {formError}
          </AlertDescription>
        </Alert>
      ) : null}

      <Field id="transaction-date" label="Tanggal" required error={fieldErrors.date}>
        <Input
          type="date"
          name="date"
          min={MIN_DATE}
          max={defaultDate}
          defaultValue={values?.date ?? defaultDate}
          disabled={pending}
        />
      </Field>

      <Field
        id="transaction-description"
        label="Uraian"
        required
        error={fieldErrors.description}
      >
        <Input
          type="text"
          name="description"
          maxLength={200}
          placeholder="Contoh: Makan siang"
          autoComplete="off"
          defaultValue={values?.description ?? ""}
          disabled={pending}
        />
      </Field>

      <div className="space-y-1.5">
        <Label htmlFor="transaction-category">
          Kategori
          <span aria-hidden="true" className="text-negative">
            *
          </span>
        </Label>
        <select
          id="transaction-category"
          name="categoryId"
          required
          defaultValue={values?.categoryId ?? ""}
          disabled={pending}
          aria-invalid={fieldErrors.categoryId ? true : undefined}
          aria-describedby={
            fieldErrors.categoryId ? "transaction-category-error" : undefined
          }
          className={cn(selectClassName)}
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        {fieldErrors.categoryId ? (
          <p
            id="transaction-category-error"
            className="text-[13px] leading-[18px] font-medium text-negative"
          >
            {fieldErrors.categoryId}
          </p>
        ) : null}
      </div>

      <fieldset
        className="space-y-1.5"
        aria-invalid={fieldErrors.type ? true : undefined}
        aria-describedby={fieldErrors.type ? "transaction-type-error" : undefined}
      >
        <legend className="text-sm leading-5 font-medium">
          Jenis transaksi
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className={radioCardClassName}>
            <input
              type="radio"
              name="type"
              value="expense"
              defaultChecked={(values?.type ?? "expense") === "expense"}
              disabled={pending}
              className="size-4 accent-primary"
            />
            Pengeluaran
          </label>
          <label className={radioCardClassName}>
            <input
              type="radio"
              name="type"
              value="income"
              defaultChecked={values?.type === "income"}
              disabled={pending}
              className="size-4 accent-primary"
            />
            Pemasukan
          </label>
        </div>
        {fieldErrors.type ? (
          <p
            id="transaction-type-error"
            className="text-[13px] leading-[18px] font-medium text-negative"
          >
            {fieldErrors.type}
          </p>
        ) : null}
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="transaction-amount">
          Nominal (Rp)
          <span aria-hidden="true" className="text-negative">
            *
          </span>
        </Label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base text-muted-foreground"
          >
            Rp
          </span>
          <Input
            id="transaction-amount"
            type="text"
            name="amount"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            defaultValue={values?.amount ?? ""}
            disabled={pending}
            aria-invalid={fieldErrors.amount ? true : undefined}
            aria-describedby={
              fieldErrors.amount
                ? "transaction-amount-error"
                : "transaction-amount-helper"
            }
            className="pl-10"
          />
        </div>
        {fieldErrors.amount ? (
          <p
            id="transaction-amount-error"
            className="text-[13px] leading-[18px] font-medium text-negative"
          >
            {fieldErrors.amount}
          </p>
        ) : (
          <p
            id="transaction-amount-helper"
            className="text-[13px] leading-[18px] text-muted-foreground"
          >
            Masukkan angka tanpa titik atau koma.
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 md:flex-row md:items-center md:justify-end">
        <Button asChild variant="ghost" className="w-full md:w-auto">
          <Link href={cancelHref}>Batal</Link>
        </Button>
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
          {pending ? "Menyimpan…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
