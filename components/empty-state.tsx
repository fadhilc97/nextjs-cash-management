import type { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

function DefaultIcon() {
  return (
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
      <path d="M8 12.5A2.5 2.5 0 0 1 10.5 10h19a2.5 2.5 0 0 1 2.5 2.5v15a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 8 27.5v-15Z" />
      <path d="M8 15h24M13 21h8M13 25h5" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card px-6 py-10 text-center md:px-8 md:py-12">
      {icon ?? <DefaultIcon />}
      <h2 className="mt-4 text-base leading-6 font-semibold">{title}</h2>
      <p className="mt-1 max-w-[42ch] text-sm leading-5 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Button asChild variant="outline" className="mt-5">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
