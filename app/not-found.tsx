import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-10 text-muted-foreground"
        >
          <path d="M10 30 30 10M14 10h-4v4M26 30h4v-4" />
          <circle cx="20" cy="20" r="14" />
        </svg>
        <h1 className="mt-4 text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Halaman tidak ditemukan.
        </h1>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Halaman yang Anda cari tidak tersedia.
        </p>
        <Button asChild className="mt-5">
          <Link href="/">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
