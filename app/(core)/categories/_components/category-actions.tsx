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

import { deleteCategory } from "../actions";

interface CategoryActionsProps {
  category: {
    id: number;
    name: string;
    transactionCount: number;
  };
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Menghapus…" : "Hapus"}
    </Button>
  );
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [open, setOpen] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const inUse = category.transactionCount > 0;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost">
        <Link href={`/categories/${category.id}/edit`}>Ubah</Link>
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
          {inUse ? (
            <>
              <DialogHeader>
                <DialogTitle id={titleId}>
                  Kategori tidak dapat dihapus
                </DialogTitle>
                <DialogDescription>
                  Kategori ini masih digunakan oleh{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {category.transactionCount}
                  </span>{" "}
                  transaksi. Hapus atau ubah transaksi tersebut terlebih
                  dahulu.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  ref={initialFocusRef}
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Mengerti
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle id={titleId}>Hapus kategori?</DialogTitle>
                <DialogDescription>
                  Kategori &quot;{category.name}&quot; akan dihapus permanen.
                  Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
