import { describe, expect, it } from "vitest";

import { buildMonthUrl } from "@/lib/month-url";

describe("month url helper", () => {
  it("sets the month on the transactions path", () => {
    expect(buildMonthUrl("/transactions", "2026-10")).toBe(
      "/transactions?month=2026-10",
    );
  });

  it("sets the month on the dashboard path", () => {
    expect(buildMonthUrl("/", "2026-10")).toBe("/?month=2026-10");
  });

  it("replaces an existing month and drops status and error", () => {
    expect(
      buildMonthUrl(
        "/transactions?month=2026-09&status=created&error=category-in-use",
        "2026-10",
      ),
    ).toBe("/transactions?month=2026-10");
  });
});
