export type TransactionType = "income" | "expense";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number): string {
  return rupiahFormatter.format(amount);
}

export function formatSignedRupiah(
  amount: number,
  type: TransactionType,
): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${rupiahFormatter.format(Math.abs(amount))}`;
}

/**
 * Formats a computed value (for example a net or balance) with an explicit
 * numeric sign. Zero is rendered as `+Rp 0` so the Selisih column always has a
 * visible sign.
 */
export function formatSignedAmount(amount: number): string {
  const sign = amount >= 0 ? "+" : "-";
  return `${sign}${rupiahFormatter.format(Math.abs(amount))}`;
}

/**
 * Parses a digit-only amount. Invalid input returns null; range limits are the
 * responsibility of validation.
 */
export function parseAmount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  return Number(trimmed);
}
