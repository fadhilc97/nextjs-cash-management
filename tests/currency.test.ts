import { describe, expect, it } from "vitest";

import {
  formatRupiah,
  formatSignedAmount,
  formatSignedRupiah,
  parseAmount,
} from "@/lib/currency";

function normalizeSpaces(value: string): string {
  return value.replace(/\u00a0/g, " ");
}

describe("currency helpers", () => {
  it("formats whole rupiah amounts with dot thousands separators", () => {
    expect(normalizeSpaces(formatRupiah(150000))).toBe("Rp 150.000");
    expect(normalizeSpaces(formatRupiah(0))).toBe("Rp 0");
    expect(normalizeSpaces(formatRupiah(-200000))).toBe("-Rp 200.000");
  });

  it("formats transaction signs by type", () => {
    expect(normalizeSpaces(formatSignedRupiah(8000000, "income"))).toBe(
      "+Rp 8.000.000",
    );
    expect(normalizeSpaces(formatSignedRupiah(150000, "expense"))).toBe(
      "-Rp 150.000",
    );
  });

  it("formats signed values by their numeric sign", () => {
    expect(normalizeSpaces(formatSignedAmount(8_800_000))).toBe(
      "+Rp 8.800.000",
    );
    expect(normalizeSpaces(formatSignedAmount(-180_000))).toBe("-Rp 180.000");
    expect(normalizeSpaces(formatSignedAmount(0))).toBe("+Rp 0");
  });

  it("parses digit-only amounts after trimming", () => {
    expect(parseAmount(" 150000 ")).toBe(150000);
    expect(parseAmount("0")).toBe(0);
    expect(parseAmount("2000000001")).toBe(2000000001);
  });

  it("rejects empty and non-digit-only amounts", () => {
    for (const raw of ["", "1e3", "10.5", "1.000", "1,000", "-1", "+1", "abc"]) {
      expect(parseAmount(raw)).toBeNull();
    }
  });
});
