import { signOut } from "@/app/(auth)/actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

import { LogoutButton } from "./_components/logout-button";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="flex min-h-14 items-center justify-between gap-4 border-b border-border px-4 py-2 sm:h-16 sm:px-6">
        <span className="text-sm font-semibold tracking-tight">
          Cash Management
        </span>
        <div className="flex min-w-0 items-center gap-3">
          <span
            title={user.email}
            className="hidden max-w-56 truncate text-sm text-muted-foreground sm:block"
          >
            {user.email}
          </span>
          <form action={signOut}>
            <LogoutButton />
          </form>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang di Cash Management.
          </p>
        </div>
        <Card className="mt-6 gap-0 rounded-xl border border-border py-0 ring-0">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Anda masuk sebagai
            </p>
            <p className="mt-1 break-all text-base font-semibold">
              {user.email}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
