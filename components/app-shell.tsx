import type { ReactNode } from "react";
import Link from "next/link";

import { signOut } from "@/app/(auth)/actions";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

import { LogoutButton } from "@/app/(core)/_components/logout-button";

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
      >
        Lewati ke konten
      </a>

      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none"
          >
            cash.
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <NavLinks variant="sidebar" />
        </div>

        <div className="mt-auto space-y-3 border-t border-sidebar-border p-4">
          <p
            title={email}
            className="truncate text-sm text-muted-foreground"
          >
            {email}
          </p>
          <div className="flex items-center gap-2">
            <form action={signOut} className="min-w-0 flex-1">
              <LogoutButton className="w-full" />
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4 md:hidden">
          <span className="min-w-0 truncate text-sm font-semibold tracking-tight">
            Cash Management
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <form action={signOut}>
              <LogoutButton />
            </form>
            <ThemeToggle />
          </div>
        </div>

        <div className="hidden h-16 items-center gap-3 px-6 md:flex">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            cash.
          </Link>
          <div className="min-w-0 flex-1">
            <NavLinks variant="tablet" />
          </div>
          <span
            title={email}
            className="block max-w-32 min-w-0 truncate text-sm text-muted-foreground"
          >
            {email}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <form action={signOut}>
              <LogoutButton />
            </form>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="pt-6 pb-[calc(88px_+_env(safe-area-inset-bottom))] focus:outline-none md:pt-8 md:pb-10 lg:pl-60"
      >
        <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="h-16">
          <NavLinks variant="mobile" />
        </div>
      </div>
    </div>
  );
}
