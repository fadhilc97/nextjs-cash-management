export type NavKey = "dashboard" | "transactions" | "categories";

/**
 * Returns which primary navigation item should be marked active. Dashboard is
 * only active on the exact root path; the other items own their subtrees.
 */
export function getActiveNav(pathname: string): NavKey | null {
  const normalized =
    pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;

  if (normalized === "/") {
    return "dashboard";
  }

  if (
    normalized === "/transactions" ||
    normalized.startsWith("/transactions/")
  ) {
    return "transactions";
  }

  if (normalized === "/categories" || normalized.startsWith("/categories/")) {
    return "categories";
  }

  return null;
}
