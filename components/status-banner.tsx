import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getBannerDismissSearch } from "@/lib/banner-url";
import {
  getCategoryBanner,
  getTransactionBanner,
  type BannerMessage,
} from "@/lib/status-banner";
import { cn } from "@/lib/utils";

type SearchValue = string | string[] | undefined;
export type SearchParams = Record<string, SearchValue>;

interface StatusBannerProps {
  scope: "transactions" | "categories";
  pathname: string;
  searchParams: SearchParams;
}

function SuccessIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px] shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px] shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  );
}

function resolveMessage(
  scope: StatusBannerProps["scope"],
  searchParams: SearchParams,
): BannerMessage | null {
  return scope === "transactions"
    ? getTransactionBanner(searchParams)
    : getCategoryBanner(searchParams);
}

export function StatusBanner({
  scope,
  pathname,
  searchParams,
}: StatusBannerProps) {
  const message = resolveMessage(scope, searchParams);

  if (!message) {
    return null;
  }

  const isError = message.tone === "error";
  const dismissHref = `${pathname}${getBannerDismissSearch(searchParams)}`;

  return (
    <Alert
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm leading-5",
        isError
          ? "border-negative/25 bg-negative-soft text-negative"
          : "border-positive/25 bg-positive-soft text-positive",
      )}
    >
      {isError ? <ErrorIcon /> : <SuccessIcon />}
      <AlertDescription className="flex-1 text-sm leading-5 text-current">
        {message.message}
      </AlertDescription>
      <Button
        asChild
        variant="ghost"
        className="shrink-0 text-current hover:bg-transparent hover:opacity-80"
      >
        <Link href={dismissHref} aria-label="Tutup notifikasi">
          Tutup
        </Link>
      </Button>
    </Alert>
  );
}
