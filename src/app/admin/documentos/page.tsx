import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { petitionCategoryLabel, petitionStatusClass, petitionStatusLabel, formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminDocumentosPage() {
  await requireAdmin();
  const petitions = await safeQuery(
    () =>
      prisma.petition.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          client: { select: { name: true } },
          process: { select: { number: true } },
        },
      }),
    []
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Documentos e peças" subtitle="Petições, recursos e contratos elaborados no editor." />
        <ButtonLink href="/admin/documentos/novo" size="sm">
          Novo documento
        </ButtonLink>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Peça</th>
              <th className="px-5 py-3 font-semibold">Tipo</th>
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Processo</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {petitions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  Nenhum documento ainda. Clique em “Novo documento” para escolher um modelo.
                </td>
              </tr>
            ) : (
              petitions.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-5 py-4">
                    <Link href={`/admin/documentos/${p.id}`} className="font-medium text-navy-800 hover:text-petrol-600">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">{petitionCategoryLabel[p.category] ?? p.category}</td>
                  <td className="px-5 py-4 text-muted">{p.client?.name ?? "—"}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted">{p.process?.number ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${petitionStatusClass[p.status]}`}>
                      {petitionStatusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted">{formatDate(p.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
