import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { MonthPicker } from "@/components/month-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { formatRupiah, formatSignedAmount } from "@/lib/currency";
import { currentMonthInJakarta } from "@/lib/date";
import { isValidMonth } from "@/lib/month";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/services/dashboard.service";

export const metadata: Metadata = {
  title: "Dashboard — Cash Management",
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

function readAmountRow(
  label: string,
  value: string,
  emphasis?: "negative" | "total",
) {
  return (
    <div key={label} className="flex items-center justify-between gap-3">
      <span
        className={cn(
          "text-sm leading-5 text-muted-foreground",
          emphasis === "total" && "font-semibold text-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-right text-base leading-6 font-medium tabular-nums",
          emphasis === "negative" && "text-negative",
          emphasis === "total" && "font-bold",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const month = resolveActiveMonth(params.month);
  const currentMonth = currentMonthInJakarta();
  const data = await getDashboardData(user.id, month);

  const hasTransactions = data.categories.length > 0;
  const newTransactionHref = `/transactions/new?month=${month}`;
  const transactionsHref = `/transactions?month=${month}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
            Dashboard
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            Ringkasan keuangan pribadi Anda.
          </p>
        </div>

        <Button asChild className="w-full md:w-auto">
          <Link href={newTransactionHref}>Tambah Transaksi</Link>
        </Button>
      </header>

      <MonthPicker month={month} maxMonth={currentMonth} />

      <section aria-label="Ringkasan bulan ini" className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <Card className="min-h-32 gap-3">
            <CardContent>
              <p className="text-sm leading-5 font-medium text-muted-foreground">
                Pemasukan
              </p>
              <p className="mt-3 text-2xl leading-8 font-bold tracking-[-0.02em] text-positive tabular-nums md:text-[28px] md:leading-9">
                {formatRupiah(data.totalIncome)}
              </p>
            </CardContent>
          </Card>

          <Card className="min-h-32 gap-3">
            <CardContent>
              <p className="text-sm leading-5 font-medium text-muted-foreground">
                Pengeluaran
              </p>
              <p className="mt-3 text-2xl leading-8 font-bold tracking-[-0.02em] tabular-nums md:text-[28px] md:leading-9">
                {formatRupiah(data.totalExpense)}
              </p>
            </CardContent>
          </Card>

          <div className="relative flex min-h-32 flex-col justify-center overflow-hidden rounded-lg border-t border-brand bg-feature px-4 py-4 text-feature-foreground md:px-6">
            <p className="text-sm leading-5 font-medium text-feature-muted">
              Saldo bulan ini
            </p>
            <p
              className={cn(
                "mt-3 text-2xl leading-8 font-bold tracking-[-0.02em] tabular-nums md:text-[28px] md:leading-9",
                data.balance < 0 && "text-feature-negative",
              )}
            >
              {data.balance < 0
                ? formatSignedAmount(data.balance)
                : formatRupiah(data.balance)}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="category-recap-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="category-recap-heading"
            className="text-xl leading-7 font-semibold tracking-[-0.01em]"
          >
            Rekap per Kategori
          </h2>
          <Link
            href={transactionsHref}
            className="text-sm leading-5 font-medium text-primary underline-offset-4 hover:underline"
          >
            Lihat semua transaksi
          </Link>
        </div>

        {!hasTransactions ? (
          data.hasCategories ? (
            <EmptyState
              title="Belum ada transaksi di bulan ini."
              description="Catat pemasukan atau pengeluaran pertama Anda."
              actionLabel="Tambah Transaksi"
              actionHref={newTransactionHref}
            />
          ) : (
            <EmptyState
              title="Belum ada kategori."
              description="Buat kategori terlebih dahulu untuk mulai mencatat transaksi."
              actionLabel="Buat Kategori"
              actionHref="/categories"
            />
          )
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
              <Table className="table-fixed">
                <TableCaption className="sr-only">
                  Rekap transaksi per kategori bulan ini
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                      Kategori
                    </TableHead>
                    <TableHead className="h-11 w-[160px] px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                      Pemasukan
                    </TableHead>
                    <TableHead className="h-11 w-[160px] px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                      Pengeluaran
                    </TableHead>
                    <TableHead className="h-11 w-[160px] px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                      Selisih
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.categories.map((row) => (
                    <TableRow
                      key={row.categoryId}
                      className="h-[52px] border-b border-divider last:border-0 hover:bg-muted"
                    >
                      <TableCell className="px-4 py-3 text-base leading-6 font-normal whitespace-normal [overflow-wrap:anywhere]">
                        {row.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-base leading-6 font-medium whitespace-normal tabular-nums">
                        {formatRupiah(row.income)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-base leading-6 font-medium whitespace-normal tabular-nums">
                        {formatRupiah(row.expense)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "px-4 py-3 text-right text-base leading-6 font-medium whitespace-normal tabular-nums",
                          row.net < 0 && "text-negative",
                        )}
                      >
                        {formatSignedAmount(row.net)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t! border-foreground! bg-transparent font-semibold hover:bg-transparent">
                    <TableCell className="px-4 py-3 text-base leading-6 font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-base leading-6 font-bold tabular-nums">
                      {formatRupiah(data.totalIncome)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-base leading-6 font-bold tabular-nums">
                      {formatRupiah(data.totalExpense)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-base leading-6 font-bold tabular-nums">
                      {formatSignedAmount(data.balance)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 md:hidden">
              {data.categories.map((row) => (
                <div
                  key={row.categoryId}
                  className="space-y-2 rounded-lg border border-border bg-card p-4"
                >
                  <p className="text-base leading-6 font-semibold [overflow-wrap:anywhere]">
                    {row.name}
                  </p>
                  {readAmountRow("Pemasukan", formatRupiah(row.income))}
                  {readAmountRow("Pengeluaran", formatRupiah(row.expense))}
                  {readAmountRow(
                    "Selisih",
                    formatSignedAmount(row.net),
                    row.net < 0 ? "negative" : undefined,
                  )}
                </div>
              ))}

              <div className="space-y-2 rounded-lg border border-foreground bg-card p-4">
                <p className="text-base leading-6 font-semibold">Total</p>
                {readAmountRow(
                  "Pemasukan",
                  formatRupiah(data.totalIncome),
                  "total",
                )}
                {readAmountRow(
                  "Pengeluaran",
                  formatRupiah(data.totalExpense),
                  "total",
                )}
                {readAmountRow(
                  "Selisih",
                  formatSignedAmount(data.balance),
                  "total",
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
