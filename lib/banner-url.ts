type SearchInput =
  | string
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function readMonth(input: SearchInput): string | null {
  if (typeof input === "string") {
    return new URLSearchParams(input).get("month");
  }

  if (input instanceof URLSearchParams) {
    return input.get("month");
  }

  const value = input.month;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

/**
 * Builds the search string for dismissing a status banner. Only `month` is
 * preserved; `status`, `error`, and any unknown parameters are dropped.
 */
export function getBannerDismissSearch(input: SearchInput): string {
  const month = readMonth(input);

  if (!month) {
    return "";
  }

  return `?${new URLSearchParams({ month }).toString()}`;
}
