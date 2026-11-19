import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex h-14 items-center border-b border-border px-4 sm:h-16 sm:px-6">
        <span className="text-sm font-semibold tracking-tight">
          Cash Management
        </span>
      </header>
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12"
      >
        {children}
      </main>
    </div>
  );
}
