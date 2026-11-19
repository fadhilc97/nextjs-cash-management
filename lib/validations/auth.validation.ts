import { z } from "zod";

import {
  validationMessages,
  type ValidationResult,
} from "@/lib/validation";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, validationMessages.emailRequired)
  .regex(EMAIL_PATTERN, validationMessages.emailInvalid);

const passwordSchema = z.string().superRefine((password, context) => {
  if (password === "") {
    context.addIssue({
      code: "custom",
      message: validationMessages.passwordRequired,
    });
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    context.addIssue({
      code: "custom",
      message: validationMessages.passwordTooShort,
    });
  }
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = loginSchema
  .extend({ confirmPassword: z.string() })
  .superRefine((data, context) => {
    if (data.confirmPassword !== data.password) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: validationMessages.confirmPasswordMismatch,
      });
    }
  });

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

function normalizeEmail(email: string | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function validateLogin(input: LoginInput): ValidationResult<AuthData> {
  const result = loginSchema.safeParse({
    email: input.email ?? "",
    password: input.password ?? "",
  });

  if (!result.success) {
    return {
      success: false,
      errors: toFieldErrors(result.error),
      values: { email: normalizeEmail(input.email) },
    };
  }

  return {
    success: true,
    data: { email: result.data.email, password: result.data.password },
  };
}

export function validateSignUp(input: SignUpInput): ValidationResult<AuthData> {
  const result = signUpSchema.safeParse({
    email: input.email ?? "",
    password: input.password ?? "",
    confirmPassword: input.confirmPassword ?? "",
  });

  if (!result.success) {
    return {
      success: false,
      errors: toFieldErrors(result.error),
      values: { email: normalizeEmail(input.email) },
    };
  }

  return {
    success: true,
    data: { email: result.data.email, password: result.data.password },
  };
}
