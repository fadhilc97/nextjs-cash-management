import { describe, expect, it } from "vitest";

import {
  currentMonthInJakarta,
  formatDate,
  isValidDateString,
  todayInJakarta,
} from "@/lib/date";

describe("Jakarta date helpers", () => {
  it("uses the Asia/Jakarta day and month for an instant near midnight UTC", () => {
    const instant = new Date("2026-11-30T17:30:00Z");

    expect(todayInJakarta(instant)).toBe("2026-12-01");
    expect(currentMonthInJakarta(instant)).toBe("2026-12");
  });

  it("keeps the previous day before the Jakarta midnight boundary", () => {
    const instant = new Date("2026-11-30T16:59:59Z");

    expect(todayInJakarta(instant)).toBe("2026-11-30");
    expect(currentMonthInJakarta(instant)).toBe("2026-11");
  });

  it("checks that a date exists on the calendar", () => {
    expect(isValidDateString("2026-02-28")).toBe(true);
    expect(isValidDateString("2026-02-29")).toBe(false);
    expect(isValidDateString("2024-02-29")).toBe(true);
    expect(isValidDateString("2026-04-31")).toBe(false);
    expect(isValidDateString("2026-2-01")).toBe(false);
    expect(isValidDateString("abc")).toBe(false);
  });

  it("formats ISO dates without shifting the day with the server timezone", () => {
    expect(formatDate("2026-11-16")).toBe("16 Nov 2026");
    expect(formatDate("2027-01-01")).toBe("1 Jan 2027");
  });
});
