import type { AuthRedirect } from "@/utils/types/auth";

/**
 * Returns the optimistic redirect for a request. It is intentionally pure so
 * the proxy rule can be tested without the Next.js runtime.
 */
export function getAuthRedirect(
  pathname: string,
  hasUser: boolean,
): AuthRedirect {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const isAuthPage = normalized === "/login" || normalized === "/signup";

  if (hasUser && isAuthPage) {
    return "/";
  }

  if (!hasUser && !isAuthPage) {
    return "/login";
  }

  return null;
}
