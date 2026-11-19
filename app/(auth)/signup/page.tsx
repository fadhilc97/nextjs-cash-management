import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";

import { AuthForm } from "../_components/auth-form";
import { signUp } from "../actions";

export const metadata: Metadata = {
  title: "Buat Akun — Cash Management",
};

export default async function SignUpPage() {
  const user = await getUser();
  if (user) {
    redirect("/");
  }

  return <AuthForm mode="signup" action={signUp} />;
}
