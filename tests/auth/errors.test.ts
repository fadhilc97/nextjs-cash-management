import { describe, expect, it } from "vitest";

import {
  mapAuthError,
  resolveSignUpOutcome,
} from "@/lib/auth/errors";
import type { AuthErrorLike } from "@/utils/types/auth.type";

describe("auth error mapping", () => {
  it.each<[AuthErrorLike, string]>([
    [
      { code: "invalid_credentials" },
      "Email atau password salah.",
    ],
    [
      { code: "user_already_exists" },
      "Email sudah terdaftar. Silakan masuk.",
    ],
    [
      { code: "email_exists" },
      "Email sudah terdaftar. Silakan masuk.",
    ],
    [
      { code: "weak_password" },
      "Password terlalu lemah. Gunakan password yang lebih kuat.",
    ],
    [
      { code: "email_not_confirmed" },
      "Email belum dikonfirmasi. Cek email Anda untuk tautan konfirmasi.",
    ],
    [
      { code: "signup_disabled" },
      "Pendaftaran akun sedang tidak tersedia. Silakan coba lagi nanti.",
    ],
    [
      { code: "over_request_rate_limit" },
      "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    ],
    [
      { code: "over_email_send_rate_limit" },
      "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    ],
    [
      { status: 429 },
      "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    ],
    [
      { status: "429" },
      "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    ],
    [
      { code: "unexpected", message: "raw supabase message" },
      "Terjadi kesalahan. Silakan coba lagi.",
    ],
  ])("maps %j to safe Indonesian copy", (error, expected) => {
    expect(mapAuthError(error)).toBe(expected);
  });
});

describe("signup outcome", () => {
  it("treats an active session as success", () => {
    expect(
      resolveSignUpOutcome({
        user: { identities: [{}] },
        session: { access_token: "token" },
      }),
    ).toBe("success");
  });

  it("treats an empty identities list as an existing email", () => {
    expect(
      resolveSignUpOutcome({
        user: { identities: [] },
        session: null,
      }),
    ).toBe("email_exists");
  });

  it("treats a created user without a session as requiring email confirmation", () => {
    expect(
      resolveSignUpOutcome({
        user: { identities: [{}] },
        session: null,
      }),
    ).toBe("confirmation_required");
  });

  it("treats a missing user and session as a configuration error", () => {
    expect(resolveSignUpOutcome({ user: null, session: null })).toBe(
      "configuration_error",
    );
  });
});
