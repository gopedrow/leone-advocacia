import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel lateral institucional */}
      <div className="relative hidden flex-col justify-between bg-navy-800 p-12 text-white lg:flex">
        <Logo tone="light" />
        <div>
          <h2 className="font-serif text-3xl font-semibold leading-tight">
            Acompanhe seu processo com transparência.
          </h2>
          <p className="mt-4 max-w-sm text-navy-100">
            Movimentações, documentos e mensagens em um só lugar, com segurança e sigilo.
          </p>
        </div>
        <p className="text-sm text-navy-300">Ambiente protegido • LGPD</p>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/" className="hover:text-petrol-600">
              ← Voltar ao site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
