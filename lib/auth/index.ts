import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import type { AuthUser } from "@/utils/types/auth";

/**
 * Reads the authenticated user once per request. Authorization must use
 * getUser(), never getSession().
 */
export const getUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    return null;
  }

  return { id: user.id, email: user.email };
});

export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
