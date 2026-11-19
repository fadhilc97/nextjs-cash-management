"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          <circle cx="20" cy="20" r="14" />
          <path d="M20 13v8M20 26v.01" />
        </svg>
        <h1 className="mt-4 text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Terjadi kesalahan.
        </h1>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Silakan coba lagi.
        </p>
        <Button type="button" onClick={reset} className="mt-5">
          Coba lagi
        </Button>
      </div>
    </div>
  );
}
