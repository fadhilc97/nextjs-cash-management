import { parseAmount, type TransactionType } from "@/lib/currency";
import { isValidDateString, todayInJakarta } from "@/lib/date";

export const validationMessages = {
  dateRequired: "Tanggal wajib diisi.",
  dateInvalid: "Tanggal tidak valid.",
  dateBeforeMinimum: "Tanggal tidak boleh sebelum 1 Januari 2000.",
  dateInFuture: "Tanggal tidak boleh di masa depan.",
  descriptionRequired: "Uraian wajib diisi.",
  descriptionTooLong: "Uraian maksimal 200 karakter.",
  categoryRequired: "Kategori wajib dipilih.",
  typeInvalid: "Jenis transaksi tidak valid.",
  amountRequired: "Nominal wajib diisi.",
  amountNotInteger: "Nominal harus berupa bilangan bulat.",
  amountNotPositive: "Nominal harus lebih dari 0.",
  amountTooLarge: "Nominal maksimal Rp 2.000.000.000.",
  categoryNameRequired: "Nama kategori wajib diisi.",
  categoryNameTooLong: "Nama kategori maksimal 50 karakter.",
  emailRequired: "Email wajib diisi.",
  emailInvalid: "Format email tidak valid.",
  passwordRequired: "Password wajib diisi.",
  passwordTooShort: "Password minimal 8 karakter.",
  confirmPasswordMismatch: "Konfirmasi password tidak cocok.",
} as const;

const MIN_DATE = "2000-01-01";
const MAX_AMOUNT = 2_000_000_000;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_CATEGORY_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  errors: Record<string, string>;
  values: Record<string, string>;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface TransactionInput {
  date: string;
  description: string;
  categoryId: string;
  type: string;
  amount: string;
}

export interface TransactionData {
  date: string;
  description: string;
  categoryId: number;
  type: TransactionType;
  amount: number;
}

export interface TransactionValidationOptions {
  /** Overrides "today" for deterministic tests. */
  today?: string;
  /** Instant used to derive "today" in Asia/Jakarta. */
  now?: Date;
}

export function validateTransaction(
  input: TransactionInput,
  options: TransactionValidationOptions = {},
): ValidationResult<TransactionData> {
  const values: Record<string, string> = {
    date: input.date ?? "",
    description: input.description ?? "",
    categoryId: input.categoryId ?? "",
    type: input.type ?? "",
    amount: input.amount ?? "",
  };
  const errors: Record<string, string> = {};

  const date = values.date.trim();
  const today = options.today ?? todayInJakarta(options.now);
  if (!date) {
    errors.date = validationMessages.dateRequired;
  } else if (!isValidDateString(date)) {
    errors.date = validationMessages.dateInvalid;
  } else if (date < MIN_DATE) {
    errors.date = validationMessages.dateBeforeMinimum;
  } else if (date > today) {
    errors.date = validationMessages.dateInFuture;
  }

  const description = values.description.trim();
  if (!description) {
    errors.description = validationMessages.descriptionRequired;
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = validationMessages.descriptionTooLong;
  }

  const categoryIdRaw = values.categoryId.trim();
  const categoryId = Number(categoryIdRaw);
  const validCategoryId =
    /^\d+$/.test(categoryIdRaw) &&
    Number.isSafeInteger(categoryId) &&
    categoryId > 0;
  if (!validCategoryId) {
    errors.categoryId = validationMessages.categoryRequired;
  }

  const type = values.type.trim();
  const validType = type === "income" || type === "expense";
  if (!validType) {
    errors.type = validationMessages.typeInvalid;
  }

  const amountRaw = values.amount.trim();
  const amount = amountRaw ? parseAmount(amountRaw) : null;
  if (!amountRaw) {
    errors.amount = validationMessages.amountRequired;
  } else if (amount === null) {
    errors.amount = validationMessages.amountNotInteger;
  } else if (amount <= 0) {
    errors.amount = validationMessages.amountNotPositive;
  } else if (amount > MAX_AMOUNT) {
    errors.amount = validationMessages.amountTooLarge;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values };
  }

  return {
    success: true,
    data: {
      date,
      description,
      categoryId,
      type: type as TransactionType,
      amount: amount as number,
    },
  };
}

export function normalizeCategoryName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateCategoryName(
  raw: string,
): ValidationResult<{ name: string }> {
  const name = normalizeCategoryName(raw ?? "");

  if (!name) {
    return {
      success: false,
      errors: { name: validationMessages.categoryNameRequired },
      values: { name: raw ?? "" },
    };
  }

  if (name.length > MAX_CATEGORY_NAME_LENGTH) {
    return {
      success: false,
      errors: { name: validationMessages.categoryNameTooLong },
      values: { name: raw ?? "" },
    };
  }

  return { success: true, data: { name } };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput extends LoginInput {
  confirmPassword: string;
}

interface AuthData {
  email: string;
  password: string;
}

function validateCredentials(input: LoginInput): {
  email: string;
  errors: Record<string, string>;
} {
  const email = (input.email ?? "").trim().toLowerCase();
  const password = input.password ?? "";
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = validationMessages.emailRequired;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = validationMessages.emailInvalid;
  }

  if (password === "") {
    errors.password = validationMessages.passwordRequired;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = validationMessages.passwordTooShort;
  }

  return { email, errors };
}

export function validateLogin(input: LoginInput): ValidationResult<AuthData> {
  const { email, errors } = validateCredentials(input);

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values: { email } };
  }

  return {
    success: true,
    data: { email, password: input.password },
  };
}

export function validateSignUp(input: SignUpInput): ValidationResult<AuthData> {
  const { email, errors } = validateCredentials(input);

  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = validationMessages.confirmPasswordMismatch;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values: { email } };
  }

  return {
    success: true,
    data: { email, password: input.password },
  };
}
