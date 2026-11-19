import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";

import { AuthForm } from "../_components/auth-form";
import { signIn } from "../actions";

export const metadata: Metadata = {
  title: "Masuk — Cash Management",
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    redirect("/");
  }

  return <AuthForm mode="login" action={signIn} />;
}
