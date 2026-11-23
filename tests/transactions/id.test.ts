import { describe, expect, it } from "vitest";

import { transactionIdSchema } from "@/lib/validations/transaction.validation";

describe("transaction id validation", () => {
  it("accepts a positive integer id", () => {
    const result = transactionIdSchema.safeParse("12");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(12);
    }
  });

  it.each(["abc", "0", "-1", "1.5", ""])(
    "rejects %j as an invalid id",
    (value) => {
      expect(transactionIdSchema.safeParse(value).success).toBe(false);
    },
  );
});
