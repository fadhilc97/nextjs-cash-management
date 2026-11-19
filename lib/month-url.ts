/**
 * Builds the URL for a given month on the current page. The month query is the
 * single source of truth, so `status` and `error` feedback parameters are
 * dropped whenever the month changes.
 */
export function buildMonthUrl(pathname: string, month: string): string {
  const url = new URL(pathname, "http://localhost");
  url.searchParams.delete("status");
  url.searchParams.delete("error");
  url.searchParams.set("month", month);

  return `${url.pathname}${url.search}`;
}
