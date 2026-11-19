import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function CoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return <AppShell email={user.email}>{children}</AppShell>;
}
