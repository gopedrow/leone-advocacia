import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

export default function RecuperarSenhaPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-800">Recuperar senha</h1>
      <p className="mt-1 text-sm text-muted">
        Informe seu e-mail e enviaremos instruções para redefinir a senha.
      </p>

      {/* Estrutura pronta; a integração de e-mail (ex.: Resend/SMTP) será conectada na fase de backend. */}
      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-navy-800 focus-visible:border-petrol-400"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Enviar instruções
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-petrol-600 hover:text-petrol-700">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
