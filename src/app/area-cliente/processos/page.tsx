import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { processStatusLabel, processStatusClass, formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function MeusProcessos() {
  const user = await requireUser();
  const processes = await safeQuery(
    () =>
      prisma.process.findMany({
        where: { clientId: user.sub },
        orderBy: { updatedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageTitle title="Meus processos" subtitle="Todos os seus processos e seus status." />
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Processo</th>
              <th className="px-5 py-3 font-semibold">Tribunal</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {processes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">
                  Nenhum processo cadastrado.
                </td>
              </tr>
            ) : (
              processes.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-5 py-4">
                    <Link href={`/area-cliente/processos/${p.id}`} className="font-medium text-navy-800 hover:text-petrol-600">
                      {p.title}
                    </Link>
                    <p className="font-mono text-xs text-muted">{p.number}</p>
                  </td>
                  <td className="px-5 py-4 text-muted">{p.court ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${processStatusClass[p.status]}`}>
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
