"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { mapAuthError, resolveSignUpOutcome } from "@/lib/auth/errors";
import {
  createAuthErrorState,
  createAuthSuccessState,
} from "@/lib/auth/state";
import type { AuthActionState, AuthField } from "@/utils/types/auth";
import { validateLogin, validateSignUp } from "@/lib/validations/auth.validation";
import { createClient } from "@/utils/supabase/server";

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toAuthFieldErrors(
  errors: Record<string, string>,
): Partial<Record<AuthField, string>> {
  return errors as Partial<Record<AuthField, string>>;
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");

  const validation = validateLogin({ email, password });
  if (!validation.success) {
    return createAuthErrorState({
      fieldErrors: toAuthFieldErrors(validation.errors),
      email: validation.values.email,
    });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword(validation.data);

  if (error) {
    return createAuthErrorState({
      formError: mapAuthError(error),
      email,
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const confirmPassword = getFormString(formData, "confirmPassword");

  const validation = validateSignUp({ email, password, confirmPassword });
  if (!validation.success) {
    return createAuthErrorState({
      fieldErrors: toAuthFieldErrors(validation.errors),
      email: validation.values.email,
    });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signUp(validation.data);

  if (error) {
    const message = mapAuthError(error);
    const isEmailError =
      error.code === "user_already_exists" || error.code === "email_exists";

    if (isEmailError) {
      return createAuthErrorState({
        fieldErrors: { email: message },
        email,
      });
    }

    if (error.code === "weak_password") {
      return createAuthErrorState({
        fieldErrors: { password: message },
        email,
      });
    }

    return createAuthErrorState({ formError: message, email });
  }

  const outcome = resolveSignUpOutcome(data);

  if (outcome === "success") {
    revalidatePath("/", "layout");
    redirect("/");
  }

  if (outcome === "email_exists") {
    return createAuthErrorState({
      fieldErrors: { email: "Email sudah terdaftar. Silakan masuk." },
      email,
    });
  }

  if (outcome === "confirmation_required") {
    return createAuthSuccessState({
      message:
        "Akun berhasil dibuat. Cek email Anda untuk mengonfirmasi, lalu masuk.",
      email,
    });
  }

  console.warn(
    "Supabase signUp returned neither a user nor a session. Check the Auth provider configuration.",
  );

  return createAuthErrorState({
    formError: "Pendaftaran belum dapat diselesaikan. Silakan coba lagi.",
    email,
  });
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.warn(`Supabase signOut failed with code: ${error.code ?? "unknown"}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
