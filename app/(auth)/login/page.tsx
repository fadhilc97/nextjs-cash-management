import type { Metadata } from "next";

import { AuthForm } from "../_components/auth-form";
import { signIn } from "../actions";

export const metadata: Metadata = {
  title: "Masuk — Cash Management",
};

export default function LoginPage() {
  return <AuthForm mode="login" action={signIn} />;
}
