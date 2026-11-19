import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { StatusBanner, type SearchParams } from "@/components/status-banner";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kategori — Cash Management",
};

export default async function CategoriesPage({
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
          Kategori
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Kelola kategori untuk mengelompokkan transaksi.
        </p>
      </header>

      <StatusBanner
        scope="categories"
        pathname="/categories"
        searchParams={params}
      />

      <EmptyState
        title="Belum ada kategori."
        description="Tambahkan kategori pertama Anda."
      />
    </div>
  );
}
