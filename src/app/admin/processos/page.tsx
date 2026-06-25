import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { processStatusLabel, processStatusClass, formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminProcessos() {
  await requireAdmin();
  const processes = await safeQuery(
    () =>
      prisma.process.findMany({
        orderBy: { updatedAt: "desc" },
        include: { client: { select: { name: true } }, _count: { select: { movements: true } } },
      }),
    []
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Gestão Processual" />
        <ButtonLink href="/admin/processos/novo" size="sm">
          Novo processo
        </ButtonLink>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Processo</th>
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Tribunal</th>
              <th className="px-5 py-3 font-semibold">Mov.</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {processes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  Nenhum processo cadastrado. Clique em “Novo processo” para começar.
                </td>
              </tr>
            ) : (
              processes.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-5 py-4">
                    <Link href={`/admin/processos/${p.id}`} className="font-medium text-navy-800 hover:text-petrol-600">
                      {p.title}
                    </Link>
                    <p className="font-mono text-xs text-muted">{p.number}</p>
                  </td>
                  <td className="px-5 py-4 text-muted">{p.client.name}</td>
                  <td className="px-5 py-4 text-muted">{p.court ?? "—"}</td>
                  <td className="px-5 py-4 text-muted">{p._count.movements}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${processStatusClass[p.status]}`}>
                      {processStatusLabel[p.status]}
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
