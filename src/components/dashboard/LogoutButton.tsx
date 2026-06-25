"use client";

import { logoutAction } from "@/app/(auth)/actions";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={className}>
        Sair
      </button>
    </form>
  );
}
