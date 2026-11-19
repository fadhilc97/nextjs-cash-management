import type { Metadata } from "next";

import { AuthForm } from "../_components/auth-form";
import { signUp } from "../actions";

export const metadata: Metadata = {
  title: "Buat Akun — Cash Management",
};

export default function SignUpPage() {
  return <AuthForm mode="signup" action={signUp} />;
}
