import { describe, expect, it } from "vitest";

import { getActiveNav } from "@/lib/nav";

describe("active navigation", () => {
  it("activates Dashboard only for the root path", () => {
    expect(getActiveNav("/")).toBe("dashboard");
  });

  it("activates Transaksi for transactions and its descendants", () => {
    expect(getActiveNav("/transactions")).toBe("transactions");
    expect(getActiveNav("/transactions/new")).toBe("transactions");
    expect(getActiveNav("/transactions/12/edit")).toBe("transactions");
  });

  it("activates Kategori for categories and its descendants", () => {
    expect(getActiveNav("/categories")).toBe("categories");
    expect(getActiveNav("/categories/3/edit")).toBe("categories");
  });

  it("returns no active item for other paths", () => {
    expect(getActiveNav("/settings")).toBeNull();
    expect(getActiveNav("/transaction")).toBeNull();
  });
});
