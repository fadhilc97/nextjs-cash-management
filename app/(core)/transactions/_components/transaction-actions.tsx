"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { monthFromDate } from "@/lib/month";
import { cn } from "@/lib/utils";

import { deleteTransaction } from "../actions";

interface TransactionActionsProps {
  transaction: {
    id: number;
    description: string;
    date: string;
  };
  className?: string;
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Menghapus…" : "Hapus"}
    </Button>
  );
}

export function TransactionActions({
  transaction,
  className,
}: TransactionActionsProps) {
  const [open, setOpen] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      <Button asChild variant="ghost">
        <Link href={`/transactions/${transaction.id}/edit`}>Ubah</Link>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Hapus</Button>
        </DialogTrigger>

        <DialogContent
          aria-labelledby={titleId}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            initialFocusRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle id={titleId}>Hapus transaksi?</DialogTitle>
            <DialogDescription>
              Transaksi &quot;{transaction.description}&quot; akan dihapus
              permanen. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteTransaction}>
            <input type="hidden" name="id" value={transaction.id} />
            <input
              type="hidden"
              name="month"
              value={monthFromDate(transaction.date)}
            />
            <DialogFooter>
              <Button
                ref={initialFocusRef}
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <DeleteSubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
