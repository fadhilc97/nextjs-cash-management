"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      disabled={pending}
      className="text-sm font-semibold"
    >
      {pending ? "Keluar…" : "Keluar"}
    </Button>
  );
}
