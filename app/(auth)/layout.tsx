import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
      >
        Lewati ke konten
      </a>
      <header className="flex h-14 items-center justify-between border-b border-border px-4 sm:h-16 sm:px-6">
        <span className="text-sm font-semibold tracking-tight">
          Cash Management
        </span>
        <ThemeToggle />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-4 py-8 focus:outline-none sm:px-6 sm:py-12"
      >
        {children}
      </main>
    </div>
  );
}
