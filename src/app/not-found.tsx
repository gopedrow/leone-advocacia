import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
      <div>
        <p className="font-serif text-6xl font-semibold text-petrol-500">404</p>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-navy-800">
          Página não encontrada
        </h1>
        <p className="mt-2 text-muted">A página que você procura não existe ou foi movida.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-navy-700 px-5 text-sm font-medium text-white hover:bg-navy-800"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
