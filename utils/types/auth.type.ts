export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthErrorLike {
  code?: string | null;
  status?: number | string | null;
  message?: string | null;
}

export type SignUpOutcome =
  | "success"
  | "email_exists"
  | "confirmation_required"
  | "configuration_error";

export interface SignUpDataLike {
  user: { identities?: unknown[] | null } | null;
  session: unknown | null;
}

export type AuthField = "email" | "password" | "confirmPassword";

export interface AuthActionState {
  status: "idle" | "error" | "success";
  fieldErrors?: Partial<Record<AuthField, string>>;
  formError?: string;
  formSuccess?: string;
  /** Passwords never belong in action state. */
  values?: { email?: string };
}

export type AuthRedirect = "/" | "/login" | null;
