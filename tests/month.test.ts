import { describe, expect, it } from "vitest";

import {
  formatMonthLabel,
  isValidMonth,
  monthRange,
  shiftMonth,
} from "@/lib/month";

describe("month helpers", () => {
  it("returns a half-open date range for a month", () => {
    expect(monthRange("2026-11")).toEqual({
      start: "2026-11-01",
      endExclusive: "2026-12-01",
    });
    expect(monthRange("2026-12")).toEqual({
      start: "2026-12-01",
      endExclusive: "2027-01-01",
    });
  });

  it("validates the YYYY-MM shape and month number", () => {
    expect(isValidMonth("2000-01")).toBe(true);
    expect(isValidMonth("2026-12")).toBe(true);
    expect(isValidMonth("2026-13")).toBe(false);
    expect(isValidMonth("2026-00")).toBe(false);
    expect(isValidMonth("2026-1")).toBe(false);
    expect(isValidMonth("abc")).toBe(false);
    expect(isValidMonth("")).toBe(false);
  });

  it("shifts months across a year boundary", () => {
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
  });

  it("clamps navigation to explicit month bounds", () => {
    const bounds = { min: "2000-01", max: "2026-11" };

    expect(shiftMonth("2000-01", -1, bounds)).toBe("2000-01");
    expect(shiftMonth("2026-11", 1, bounds)).toBe("2026-11");
    expect(shiftMonth("2026-10", 1, bounds)).toBe("2026-11");
  });

  it("formats a month label without depending on the server timezone", () => {
    expect(formatMonthLabel("2026-11")).toBe("November 2026");
  });
});
