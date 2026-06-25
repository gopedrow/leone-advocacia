"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";

const initial: AuthState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-navy-800 focus-visible:border-petrol-400";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-700">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-700">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
