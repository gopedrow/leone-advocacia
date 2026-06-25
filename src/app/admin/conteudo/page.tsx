import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminConteudo() {
  await requireAdmin();
  const [articles, juris] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          orderBy: { updatedAt: "desc" },
          include: { category: true },
        }),
      []
    ),
    safeQuery(() => prisma.jurisprudence.findMany({ orderBy: { createdAt: "desc" } }), []),
  ]);

  return (
    <>
      <PageTitle title="Gestão de Conteúdo" subtitle="Artigos e jurisprudência publicados." />

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-navy-800">Artigos</h2>
          <Button size="sm">Novo artigo</Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-line">
              {articles.length === 0 ? (
                <tr><td className="px-5 py-8 text-center text-muted">Nenhum artigo.</td></tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-surface">
                    <td className="px-5 py-3">
                      <Link href={`/conteudo/${a.slug}`} className="font-medium text-navy-800 hover:text-petrol-600">
                        {a.title}
                      </Link>
                      <p className="text-xs text-muted">{a.category?.name ?? "Sem categoria"}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {a.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                      </span>
                      <p className="mt-1 text-xs text-muted">{formatDate(a.updatedAt)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-navy-800">Jurisprudência</h2>
          <Button size="sm">Nova decisão</Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-line">
              {juris.length === 0 ? (
                <tr><td className="px-5 py-8 text-center text-muted">Nenhuma decisão publicada.</td></tr>
              ) : (
                juris.map((j) => (
                  <tr key={j.id} className="hover:bg-surface">
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy-800">{j.title}</p>
                      <p className="text-xs text-muted">{j.tribunal}{j.reference ? ` · ${j.reference}` : ""}</p>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-muted">{formatDate(j.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
