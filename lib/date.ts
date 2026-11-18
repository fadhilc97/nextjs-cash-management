const JAKARTA_TIME_ZONE = "Asia/Jakarta";

const jakartaDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: JAKARTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const displayDateFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function parseDateString(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function toUtcDate({ year, month, day }: DateParts): Date {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

export function isValidDateString(value: string): boolean {
  const parts = parseDateString(value);
  if (!parts || parts.month < 1 || parts.month > 12 || parts.day < 1) {
    return false;
  }

  const date = toUtcDate(parts);
  return (
    date.getUTCFullYear() === parts.year &&
    date.getUTCMonth() === parts.month - 1 &&
    date.getUTCDate() === parts.day
  );
}

/**
 * Returns the current calendar date in Asia/Jakarta. The optional instant makes
 * the helper deterministic in tests; production callers should omit it.
 */
export function todayInJakarta(now: Date = new Date()): string {
  const parts = jakartaDateFormatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function currentMonthInJakarta(now: Date = new Date()): string {
  return todayInJakarta(now).slice(0, 7);
}

/**
 * Formats a database date as e.g. "16 Nov 2026". Dates are parsed as calendar
 * values in UTC and formatted in UTC, so the server timezone cannot shift them.
 */
export function formatDate(value: string): string {
  const parts = parseDateString(value);
  if (!parts || !isValidDateString(value)) {
    throw new RangeError(`Invalid date: ${value}`);
  }

  return displayDateFormatter.format(toUtcDate(parts));
}
