import type { AuthActionState, AuthField } from "@/utils/types/auth";

export const initialAuthState: AuthActionState = { status: "idle" };

interface AuthSuccessStateInput {
  message: string;
  email?: string;
}

interface AuthErrorStateInput {
  fieldErrors?: Partial<Record<AuthField, string>>;
  formError?: string;
  email?: string;
}

export function createAuthSuccessState({
  message,
  email,
}: AuthSuccessStateInput): AuthActionState {
  return {
    status: "success",
    formSuccess: message,
    ...(email !== undefined
      ? { values: { email: email.trim().toLowerCase() } }
      : {}),
  };
}

export function createAuthErrorState({
  fieldErrors,
  formError,
  email,
}: AuthErrorStateInput): AuthActionState {
  return {
    status: "error",
    ...(fieldErrors ? { fieldErrors } : {}),
    ...(formError ? { formError } : {}),
    ...(email !== undefined
      ? { values: { email: email.trim().toLowerCase() } }
      : {}),
  };
}
