import { isValidDateString } from "@/lib/date";

export interface MonthBounds {
  min?: string;
  max?: string;
}

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

const displayMonthFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});

interface MonthParts {
  year: number;
  month: number;
}

function parseMonth(value: string): MonthParts | null {
  const match = MONTH_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  return { year: Number(match[1]), month: Number(match[2]) };
}

function formatMonthParts({ year, month }: MonthParts): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

export function isValidMonth(value: string): boolean {
  return MONTH_PATTERN.test(value);
}

/**
 * Returns a half-open date interval for the given month.
 */
export function monthRange(month: string): {
  start: string;
  endExclusive: string;
} {
  if (!isValidMonth(month)) {
    throw new RangeError(`Invalid month: ${month}`);
  }

  return {
    start: `${month}-01`,
    endExclusive: `${shiftMonth(month, 1)}-01`,
  };
}

/**
 * Shifts a month by an offset, crossing year boundaries. When bounds are
 * supplied the result is clamped so navigation cannot leave the allowed range.
 */
export function shiftMonth(
  month: string,
  offset: number,
  bounds: MonthBounds = {},
): string {
  const parts = parseMonth(month);
  if (!parts) {
    throw new RangeError(`Invalid month: ${month}`);
  }

  const totalMonths = parts.year * 12 + (parts.month - 1) + offset;
  let result = formatMonthParts({
    year: Math.floor(totalMonths / 12),
    month: (totalMonths % 12) + 1,
  });

  if (bounds.min && result < bounds.min) {
    result = bounds.min;
  }
  if (bounds.max && result > bounds.max) {
    result = bounds.max;
  }

  return result;
}

export function formatMonthLabel(month: string): string {
  const parts = parseMonth(month);
  if (!parts) {
    throw new RangeError(`Invalid month: ${month}`);
  }

  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(parts.year, parts.month - 1, 1);

  return displayMonthFormatter.format(date);
}

/**
 * Returns the `YYYY-MM` month that contains the given calendar date.
 */
export function monthFromDate(date: string): string {
  if (!isValidDateString(date)) {
    throw new RangeError(`Invalid date: ${date}`);
  }

  return date.slice(0, 7);
}
