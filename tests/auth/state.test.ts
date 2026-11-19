import { describe, expect, it } from "vitest";

import {
  createAuthErrorState,
  createAuthSuccessState,
  initialAuthState,
} from "@/lib/auth/state";

describe("auth action state", () => {
  it("starts idle", () => {
    expect(initialAuthState).toEqual({ status: "idle" });
  });

  it("keeps a normalized email but never includes passwords", () => {
    const state = createAuthErrorState({
      fieldErrors: { password: "Password minimal 8 karakter." },
      email: "  Rina@Example.COM ",
    });

    expect(state).toEqual({
      status: "error",
      fieldErrors: { password: "Password minimal 8 karakter." },
      values: { email: "rina@example.com" },
    });
    expect(JSON.stringify(state)).not.toContain("password:");
    expect(JSON.stringify(state)).not.toContain("secret");
  });

  it("reports a successful signup that still needs email confirmation", () => {
    const state = createAuthSuccessState({
      message:
        "Akun berhasil dibuat. Cek email Anda untuk mengonfirmasi, lalu masuk.",
      email: "  Rina@Example.COM ",
    });

    expect(state).toEqual({
      status: "success",
      formSuccess:
        "Akun berhasil dibuat. Cek email Anda untuk mengonfirmasi, lalu masuk.",
      values: { email: "rina@example.com" },
    });
    expect(JSON.stringify(state)).not.toContain("password:");
  });

  it("supports a form-level error", () => {
    expect(
      createAuthErrorState({
        formError: "Email atau password salah.",
        email: "user@example.com",
      }),
    ).toEqual({
      status: "error",
      formError: "Email atau password salah.",
      values: { email: "user@example.com" },
    });
  });
});
