import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { MonthPicker } from "@/components/month-picker";
import { StatusBanner, type SearchParams } from "@/components/status-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatSignedRupiah } from "@/lib/currency";
import { currentMonthInJakarta, formatDate } from "@/lib/date";
import { isValidMonth } from "@/lib/month";
import {
  listCategoryOptions,
  listTransactionsByMonth,
} from "@/services/transactions.service";

import { TransactionActions } from "./_components/transaction-actions";

export const metadata: Metadata = {
  title: "Transaksi — Cash Management",
};

const MIN_MONTH = "2000-01";

function readMonth(value: string | string[] | undefined): string | null {
  const month = Array.isArray(value) ? value[0] : value;
  return month ?? null;
}

function resolveActiveMonth(value: string | string[] | undefined): string {
  const currentMonth = currentMonthInJakarta();
  const requested = readMonth(value);

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

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const user = await requireUser();
  const params = await searchParams;
  const month = resolveActiveMonth(params.month);

  const [transactions, categories] = await Promise.all([
    listTransactionsByMonth(user.id, month),
    listCategoryOptions(user.id),
  ]);

  const hasTransactions = transactions.length > 0;
  const newTransactionHref = `/transactions/new?month=${month}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
            Transaksi
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            {hasTransactions
              ? `${transactions.length} transaksi di bulan ini.`
              : "Belum ada transaksi di bulan ini."}
          </p>
        </div>

        <Button asChild className="w-full md:w-auto">
          <Link href={newTransactionHref}>Tambah Transaksi</Link>
        </Button>
      </header>

      <StatusBanner
        scope="transactions"
        pathname="/transactions"
        searchParams={params}
      />

      <MonthPicker month={month} maxMonth={currentMonthInJakarta()} />

      {hasTransactions ? (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <Table className="table-fixed">
              <TableCaption className="sr-only">
                Daftar transaksi bulan ini
              </TableCaption>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 w-[110px] px-4 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Tanggal
                  </TableHead>
                  <TableHead className="h-11 px-4 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Uraian
                  </TableHead>
                  <TableHead className="h-11 w-[130px] px-4 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Kategori
                  </TableHead>
                  <TableHead className="h-11 w-[150px] px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Nominal
                  </TableHead>
                  <TableHead className="h-11 w-[150px] px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="h-[52px] border-b border-divider last:border-0 hover:bg-muted"
                  >
                    <TableCell className="px-4 py-3 text-base leading-6 font-normal whitespace-normal tabular-nums">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-base leading-6 font-normal whitespace-normal [overflow-wrap:anywhere]">
                      <span className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={
                            transaction.type === "income"
                              ? "bg-positive-soft text-positive"
                              : "bg-muted text-foreground"
                          }
                        >
                          {transaction.type === "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}
                        </Badge>
                        <span>{transaction.description}</span>
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-base leading-6 font-normal whitespace-normal [overflow-wrap:anywhere]">
                      {transaction.categoryName}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 text-right text-base leading-6 font-medium whitespace-normal tabular-nums ${
                        transaction.type === "income" ? "text-positive" : ""
                      }`}
                    >
                      {formatSignedRupiah(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <TransactionActions transaction={transaction} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm leading-5 text-muted-foreground tabular-nums">
                    {formatDate(transaction.date)}
                  </p>
                  <Badge
                    className={
                      transaction.type === "income"
                        ? "bg-positive-soft text-positive"
                        : "bg-muted text-foreground"
                    }
                  >
                    {transaction.type === "income"
                      ? "Pemasukan"
                      : "Pengeluaran"}
                  </Badge>
                </div>

                <p className="mt-2 text-base leading-6 font-semibold [overflow-wrap:anywhere]">
                  {transaction.description}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                  {transaction.categoryName}
                </p>
                <p
                  className={`mt-3 text-right text-base leading-6 font-medium tabular-nums ${
                    transaction.type === "income" ? "text-positive" : ""
                  }`}
                >
                  {formatSignedRupiah(transaction.amount, transaction.type)}
                </p>

                <TransactionActions
                  transaction={transaction}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
        </>
      ) : categories.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi di bulan ini."
          description="Buat kategori terlebih dahulu sebelum mencatat transaksi."
          actionLabel="Buat Kategori"
          actionHref="/categories"
        />
      ) : (
        <EmptyState
          title="Belum ada transaksi di bulan ini."
          description="Catat pemasukan atau pengeluaran pertama Anda."
          actionLabel="Tambah Transaksi"
          actionHref={newTransactionHref}
        />
      )}
    </div>
  );
}
