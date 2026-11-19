import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { StatusBanner, type SearchParams } from "@/components/status-banner";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Transaksi — Cash Management",
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Transaksi
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Catat dan tinjau pemasukan serta pengeluaran Anda.
        </p>
      </header>

      <StatusBanner
        scope="transactions"
        pathname="/transactions"
        searchParams={params}
      />

      <EmptyState
        title="Belum ada transaksi di bulan ini."
        description="Catat pemasukan atau pengeluaran pertama Anda."
      />
    </div>
  );
}
