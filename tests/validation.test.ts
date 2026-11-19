import { describe, expect, it } from "vitest";

import {
  validateLogin,
  validateSignUp,
} from "@/lib/validations/auth.validation";
import {
  normalizeCategoryName,
  validateCategoryName,
} from "@/lib/validations/category.validation";
import {
  validateTransaction,
  type TransactionInput,
} from "@/lib/validation";

const today = { today: "2026-11-18" };

const validTransaction: TransactionInput = {
  date: "2026-11-16",
  description: "  Makan siang  ",
  categoryId: "3",
  type: "income",
  amount: " 150000 ",
};

function transactionError(
  overrides: Partial<TransactionInput>,
  field: keyof TransactionInput,
  message: string,
) {
  const result = validateTransaction({ ...validTransaction, ...overrides }, today);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.errors[field]).toBe(message);
  }
}

describe("transaction validation", () => {
  it("returns normalized values for valid input", () => {
    const result = validateTransaction(validTransaction, today);

    expect(result).toEqual({
      success: true,
      data: {
        date: "2026-11-16",
        description: "Makan siang",
        categoryId: 3,
        type: "income",
        amount: 150000,
      },
    });
  });

  it("requires a date", () => {
    transactionError({ date: "   " }, "date", "Tanggal wajib diisi.");
  });

  it("rejects malformed and impossible dates", () => {
    for (const date of ["16-11-2026", "2026-2-01", "2026-02-30", "2026-04-31"]) {
      transactionError({ date }, "date", "Tanggal tidak valid.");
    }
  });

  it("rejects dates before 2000-01-01", () => {
    transactionError(
      { date: "1999-12-31" },
      "date",
      "Tanggal tidak boleh sebelum 1 Januari 2000.",
    );
  });

  it("rejects dates after today in Asia/Jakarta", () => {
    transactionError(
      { date: "2026-11-19" },
      "date",
      "Tanggal tidak boleh di masa depan.",
    );
  });

  it("accepts today in Asia/Jakarta", () => {
    expect(
      validateTransaction({ ...validTransaction, date: "2026-11-18" }, today)
        .success,
    ).toBe(true);
  });

  it("requires a non-whitespace description", () => {
    transactionError(
      { description: "   " },
      "description",
      "Uraian wajib diisi.",
    );
  });

  it("limits the trimmed description to 200 characters", () => {
    transactionError(
      { description: `  ${"a".repeat(201)}  ` },
      "description",
      "Uraian maksimal 200 karakter.",
    );
    expect(
      validateTransaction(
        { ...validTransaction, description: "a".repeat(200) },
        today,
      ).success,
    ).toBe(true);
  });

  it("requires a positive integer category id", () => {
    for (const categoryId of ["", "0", "-1", "1.5", "abc"]) {
      transactionError({ categoryId }, "categoryId", "Kategori wajib dipilih.");
    }
  });

  it("allows only income and expense types", () => {
    transactionError(
      { type: "transfer" },
      "type",
      "Jenis transaksi tidak valid.",
    );
  });

  it("requires an amount", () => {
    transactionError({ amount: "   " }, "amount", "Nominal wajib diisi.");
  });

  it("requires a digit-only integer amount", () => {
    for (const amount of ["1e3", "10.5", "1.000", "1,000", "-1", "+1", "abc"]) {
      transactionError(
        { amount },
        "amount",
        "Nominal harus berupa bilangan bulat.",
      );
    }
  });

  it("requires an amount greater than zero", () => {
    for (const amount of ["0", "000"]) {
      transactionError({ amount }, "amount", "Nominal harus lebih dari 0.");
    }
  });

  it("caps the amount at two billion rupiah", () => {
    transactionError(
      { amount: "2000000001" },
      "amount",
      "Nominal maksimal Rp 2.000.000.000.",
    );
    expect(
      validateTransaction({ ...validTransaction, amount: "2000000000" }, today)
        .success,
    ).toBe(true);
  });

  it("reports every invalid field in one pass", () => {
    const result = validateTransaction(
      { date: "", description: "", categoryId: "", type: "x", amount: "" },
      today,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["amount", "categoryId", "date", "description", "type"].sort(),
      );
    }
  });

  it("preserves raw form values when validation fails", () => {
    const result = validateTransaction(
      { ...validTransaction, description: "   " },
      today,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.values).toEqual({
        date: "2026-11-16",
        description: "   ",
        categoryId: "3",
        type: "income",
        amount: " 150000 ",
      });
    }
  });
});

describe("category validation", () => {
  it("normalizes whitespace in a category name", () => {
    expect(normalizeCategoryName("  Makan   siang  ")).toBe("Makan siang");
    expect(normalizeCategoryName("Makan\t\n  siang")).toBe("Makan siang");
    expect(normalizeCategoryName("   ")).toBe("");
  });

  it("returns the normalized name for valid input", () => {
    expect(validateCategoryName("  Makan   siang  ")).toEqual({
      success: true,
      data: { name: "Makan siang" },
    });
  });

  it("requires a non-empty category name", () => {
    const result = validateCategoryName("   ");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBe("Nama kategori wajib diisi.");
      expect(result.values.name).toBe("   ");
    }
  });

  it("limits the normalized category name to 50 characters", () => {
    const result = validateCategoryName("a".repeat(51));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBe("Nama kategori maksimal 50 karakter.");
    }
    expect(validateCategoryName("a".repeat(50)).success).toBe(true);
  });
});

describe("auth validation", () => {
  it("normalizes email with trim and lowercase", () => {
    expect(
      validateLogin({ email: "  User@Example.COM ", password: " password " }),
    ).toEqual({
      success: true,
      data: { email: "user@example.com", password: " password " },
    });
  });

  it("requires an email", () => {
    const result = validateLogin({ email: "   ", password: "password" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toBe("Email wajib diisi.");
    }
  });

  it("rejects an invalid email and keeps the normalized value", () => {
    const result = validateLogin({ email: "  ABC ", password: "password" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toBe("Format email tidak valid.");
      expect(result.values.email).toBe("abc");
    }
  });

  it("requires a password without trimming it", () => {
    const result = validateLogin({ email: "user@example.com", password: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.password).toBe("Password wajib diisi.");
    }
  });

  it("requires at least 8 password characters before trimming", () => {
    const result = validateLogin({
      email: "user@example.com",
      password: "1234567",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.password).toBe("Password minimal 8 karakter.");
    }
    expect(
      validateLogin({ email: "user@example.com", password: "        " }).success,
    ).toBe(true);
  });

  it("requires matching confirmation on signup", () => {
    const result = validateSignUp({
      email: "user@example.com",
      password: "password",
      confirmPassword: "password2",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.confirmPassword).toBe(
        "Konfirmasi password tidak cocok.",
      );
      expect(result.values.email).toBe("user@example.com");
    }
  });

  it("returns normalized data for a valid signup", () => {
    expect(
      validateSignUp({
        email: "  User@Example.com ",
        password: "password",
        confirmPassword: "password",
      }),
    ).toEqual({
      success: true,
      data: { email: "user@example.com", password: "password" },
    });
  });
});
