import { describe, expect, it } from "vitest";

import { resolveTheme } from "@/lib/theme";

describe("theme preference", () => {
  it("uses dark only when the stored value is dark", () => {
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("falls back to light for empty, missing, and unknown values", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme(null)).toBe("light");
    expect(resolveTheme(undefined)).toBe("light");
    expect(resolveTheme("system")).toBe("light");
    expect(resolveTheme("DARK")).toBe("light");
  });
});
