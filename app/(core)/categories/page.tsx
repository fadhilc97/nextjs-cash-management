import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { StatusBanner, type SearchParams } from "@/components/status-banner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { listCategories } from "@/services/categories.service";

import { createCategory } from "./actions";
import { CategoryActions } from "./_components/category-actions";
import { CategoryForm } from "./_components/category-form";

export const metadata: Metadata = {
  title: "Kategori — Cash Management",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const categories = await listCategories(user.id);

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

      <CategoryForm action={createCategory} />

      {categories.length === 0 ? (
        <EmptyState
          title="Belum ada kategori."
          description="Tambahkan kategori pertama Anda."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 px-4 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Nama
                  </TableHead>
                  <TableHead className="h-11 px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Jumlah transaksi
                  </TableHead>
                  <TableHead className="h-11 px-4 text-right text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="h-[52px] border-b border-divider last:border-0 hover:bg-muted"
                  >
                    <TableCell className="px-4 py-3 text-base leading-6 font-normal whitespace-normal [overflow-wrap:anywhere]">
                      {category.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-base leading-6 font-medium tabular-nums">
                      {category.transactionCount}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <CategoryActions category={category} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-base leading-6 font-semibold [overflow-wrap:anywhere]">
                  {category.name}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Jumlah transaksi:{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {category.transactionCount}
                  </span>
                </p>
                <div className="mt-3 border-t border-divider pt-3">
                  <CategoryActions category={category} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
