import type { ReactNode } from "react";
import { connection } from "next/server";

import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function CoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const user = await requireUser();

  return <AppShell email={user.email}>{children}</AppShell>;
}
