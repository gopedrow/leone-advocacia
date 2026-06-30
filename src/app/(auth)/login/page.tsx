import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Área do Cliente — Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/area-cliente");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-800">Área do Cliente</h1>
      <p className="mt-1 text-sm text-muted">Entre para acompanhar seu processo.</p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <div className="mt-4 text-center text-sm">
        <Link href="/recuperar-senha" className="text-petrol-600 hover:text-petrol-700">
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
