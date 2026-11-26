import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { currentMonthInJakarta, todayInJakarta } from "@/lib/date";
import { isValidMonth } from "@/lib/month";
import { listCategoryOptions } from "@/services/transactions.service";

import { createTransaction } from "../actions";
import { TransactionForm } from "./_components/transaction-form";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Tambah Transaksi — Cash Management",
};

const MIN_MONTH = "2000-01";

function resolveActiveMonth(value: string | string[] | undefined): string {
  const currentMonth = currentMonthInJakarta();
  const requested = Array.isArray(value) ? value[0] : value;

  if (
    !requested ||
    !isValidMonth(requested) ||
    requested < MIN_MONTH ||
    requested > currentMonth
  ) {
    return currentMonth;
  }

  return requested;
}

export default async function NewTransactionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const user = await requireUser();
  const params = await searchParams;
  const activeMonth = resolveActiveMonth(params.month);
  const categories = await listCategoryOptions(user.id);
  const today = todayInJakarta();
  const cancelHref = `/transactions?month=${activeMonth}`;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Tambah Transaksi
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Catat pemasukan atau pengeluaran baru.
        </p>
      </header>

      {categories.length === 0 ? (
        <Alert className="max-w-[640px] border border-warning/25 bg-warning-soft px-4 py-4">
          <AlertDescription className="space-y-4 text-sm leading-5 text-warning">
            <p>
              Belum ada kategori. Buat kategori terlebih dahulu sebelum mencatat
              transaksi.
            </p>
            <Button asChild variant="outline">
              <Link href="/categories">Buat Kategori</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <TransactionForm
          action={createTransaction}
          categories={categories}
          defaultDate={today}
          cancelHref={cancelHref}
        />
      )}
    </div>
  );
}
