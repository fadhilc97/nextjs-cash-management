import type {
  AuthErrorLike,
  SignUpDataLike,
  SignUpOutcome,
} from "@/utils/types/auth.type";

const RATE_LIMIT_CODES = new Set([
  "over_request_rate_limit",
  "over_email_send_rate_limit",
]);

/**
 * Maps Supabase auth errors to the exact Indonesian copy in PRD §7.10.5.
 * Raw provider messages are never returned to the UI.
 */
export function mapAuthError(error: AuthErrorLike): string {
  if (Number(error.status) === 429 || (error.code && RATE_LIMIT_CODES.has(error.code))) {
    return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
  }

  switch (error.code) {
    case "invalid_credentials":
      return "Email atau password salah.";
    case "user_already_exists":
    case "email_exists":
      return "Email sudah terdaftar. Silakan masuk.";
    case "weak_password":
      return "Password terlalu lemah. Gunakan password yang lebih kuat.";
    case "email_not_confirmed":
      return "Email belum dikonfirmasi. Cek email Anda untuk tautan konfirmasi.";
    case "signup_disabled":
      return "Pendaftaran akun sedang tidak tersedia. Silakan coba lagi nanti.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}

export function resolveSignUpOutcome({
  user,
  session,
}: SignUpDataLike): SignUpOutcome {
  if (session != null) {
    return "success";
  }

  if (Array.isArray(user?.identities) && user.identities.length === 0) {
    return "email_exists";
  }

  if (user != null) {
    return "confirmation_required";
  }

  return "configuration_error";
}
