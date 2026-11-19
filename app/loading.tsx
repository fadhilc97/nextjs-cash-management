import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-svh items-center justify-center px-4"
    >
      <span className="sr-only">Memuat data…</span>
      <div className="w-full max-w-[420px] space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
}
