"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthState } from "@/lib/auth/state";
import type { AuthActionState } from "@/utils/types/auth.type";

interface AuthFormProps {
  mode: "login" | "signup";
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
}

const COPY = {
  login: {
    title: "Masuk",
    subtitle: "Masuk untuk melanjutkan ke buku kas Anda.",
    submit: "Masuk",
    pending: "Memproses…",
    passwordPlaceholder: "Masukkan password",
    passwordAutoComplete: "current-password",
    alternateText: "Belum punya akun?",
    alternateLink: "Daftar",
    alternateHref: "/signup",
  },
  signup: {
    title: "Buat Akun",
    subtitle: "Daftar untuk mulai mencatat keuangan pribadi Anda.",
    submit: "Buat Akun",
    pending: "Memproses…",
    passwordPlaceholder: "Minimal 8 karakter",
    passwordAutoComplete: "new-password",
    alternateText: "Sudah punya akun?",
    alternateLink: "Masuk",
    alternateHref: "/login",
  },
} as const;

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialAuthState,
  );
  const copy = COPY[mode];
  const fieldErrors = state.fieldErrors ?? {};
  const isSignup = mode === "signup";

  return (
    <Card className="w-full max-w-[420px] gap-4 rounded-lg border border-border py-0 ">
      <CardHeader className="gap-2 px-6 pt-6 sm:px-8 sm:pt-8">
        <h1 className="font-heading text-2xl leading-8 font-bold tracking-[-0.02em] sm:text-[30px] sm:leading-9">
          {copy.title}
        </h1>
        <CardDescription className="text-sm leading-5">
          {copy.subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
        <form action={formAction} noValidate className="space-y-5">
          {state.formSuccess ? (
            <Alert
              role="status"
              className="border border-positive/25 bg-positive-soft"
            >
              <AlertDescription className="text-sm leading-5 text-positive">
                {state.formSuccess}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              id={`${mode}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nama@email.com"
              defaultValue={state.values?.email ?? ""}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={
                fieldErrors.email ? `${mode}-email-error` : undefined
              }
              className="text-base"
            />
            {fieldErrors.email ? (
              <p
                id={`${mode}-email-error`}
                className="text-[13px] font-medium leading-[18px] text-negative"
              >
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <Input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={copy.passwordAutoComplete}
              placeholder={copy.passwordPlaceholder}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={
                fieldErrors.password ? `${mode}-password-error` : undefined
              }
              className="text-base"
            />
            {fieldErrors.password ? (
              <p
                id={`${mode}-password-error`}
                className="text-[13px] font-medium leading-[18px] text-negative"
              >
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">
                Konfirmasi Password
              </Label>
              <Input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password"
                aria-invalid={
                  fieldErrors.confirmPassword ? true : undefined
                }
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
                className="text-base"
              />
              {fieldErrors.confirmPassword ? (
                <p
                  id="signup-confirm-password-error"
                  className="text-[13px] font-medium leading-[18px] text-negative"
                >
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>
          ) : null}

          {state.formError ? (
            <Alert
              role="alert"
              variant="destructive"
              className="border border-negative/25 bg-negative-soft"
            >
              <AlertDescription className="text-sm leading-5 text-negative">
                {state.formError}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            disabled={pending}
            className="w-full text-sm font-semibold"
          >
            {pending ? copy.pending : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {copy.alternateText}{" "}
          <Link
            href={copy.alternateHref}
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {copy.alternateLink}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
