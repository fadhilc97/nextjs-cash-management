import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { todayInJakarta } from "@/lib/date";
import { monthFromDate } from "@/lib/month";
import { validationMessages } from "@/lib/validation";
import { transactionIdSchema } from "@/lib/validations/transaction.validation";
import {
  getTransactionById,
  listCategoryOptions,
} from "@/services/transactions.service";

import { updateTransaction } from "../../actions";
import { TransactionForm } from "../../new/_components/transaction-form";

export const metadata: Metadata = {
  title: "Ubah Transaksi — Cash Management",
};

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const idResult = transactionIdSchema.safeParse(id);
  if (!idResult.success) {
    notFound();
  }

  const transaction = await getTransactionById(user.id, idResult.data);
  if (!transaction) {
    notFound();
  }

  const categories = await listCategoryOptions(user.id);
  const month = monthFromDate(transaction.date);
  const missingCategory = transaction.categoryName === null;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Ubah Transaksi
        </h1>
      </header>

      <TransactionForm
        action={updateTransaction.bind(null, String(transaction.id))}
        categories={categories}
        defaultDate={todayInJakarta()}
        cancelHref={`/transactions?month=${month}`}
        initialValues={{
          date: transaction.date,
          description: transaction.description,
          categoryId: String(transaction.categoryId),
          type: transaction.type,
          amount: String(transaction.amount),
        }}
        initialFormError={
          missingCategory ? validationMessages.categoryNotFound : undefined
        }
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
