import { describe, expect, it } from "vitest";

import { getBannerDismissSearch } from "@/lib/banner-url";

describe("banner dismiss URL", () => {
  it("keeps month while removing status and error", () => {
    expect(
      getBannerDismissSearch("?month=2026-11&status=created&error=x"),
    ).toBe("?month=2026-11");
  });

  it("returns an empty search when month is absent", () => {
    expect(getBannerDismissSearch("?status=created&error=x")).toBe("");
  });

  it("drops unknown query parameters", () => {
    expect(
      getBannerDismissSearch("?month=2026-11&status=deleted&utm=email"),
    ).toBe("?month=2026-11");
  });
});
