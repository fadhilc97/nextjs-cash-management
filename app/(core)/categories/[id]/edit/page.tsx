import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { categoryIdSchema } from "@/lib/validations/category.validation";
import { getCategoryById } from "@/services/categories.service";

import { updateCategory } from "../../actions";
import { CategoryEditForm } from "../../_components/category-edit-form";

export const metadata: Metadata = {
  title: "Ubah Kategori — Cash Management",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const idResult = categoryIdSchema.safeParse(id);
  if (!idResult.success) {
    notFound();
  }

  const category = await getCategoryById(user.id, idResult.data);
  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Ubah Kategori
        </h1>
      </header>

      <CategoryEditForm category={category} action={updateCategory} />
    </div>
  );
}
