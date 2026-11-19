import { Skeleton } from "@/components/ui/skeleton";

export default function CoreLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <span className="sr-only">Memuat data…</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
