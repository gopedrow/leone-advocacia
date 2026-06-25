import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { StatCard, PageTitle } from "@/components/dashboard/StatCard";
import { formatDate, processStatusLabel, processStatusClass } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [clients, active, closed, deadlines, newLeads, recentProcesses, upcoming] =
    await Promise.all([
      safeQuery(() => prisma.user.count({ where: { role: "CLIENT" } }), 0),
      safeQuery(() => prisma.process.count({ where: { status: { not: "ENCERRADO" } } }), 0),
      safeQuery(() => prisma.process.count({ where: { status: "ENCERRADO" } }), 0),
      safeQuery(() => prisma.deadline.count({ where: { done: false } }), 0),
      safeQuery(() => prisma.lead.count({ where: { status: "NEW" } }), 0),
      safeQuery(
        () =>
          prisma.process.findMany({
            orderBy: { updatedAt: "desc" },
            take: 6,
            include: { client: { select: { name: true } } },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.deadline.findMany({
            where: { done: false },
            orderBy: { dueDate: "asc" },
            take: 6,
          }),
        []
      ),
    ]);

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Visão geral do escritório." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Clientes" value={clients} />
        <StatCard label="Processos ativos" value={active} />
        <StatCard label="Processos encerrados" value={closed} />
        <StatCard label="Prazos abertos" value={deadlines} />
        <StatCard label="Novos leads" value={newLeads} hint="Aguardando contato" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-800">Processos recentes</h2>
            <Link href="/admin/processos" className="text-sm text-petrol-600 hover:text-petrol-700">
              Ver todos
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-line">
                {recentProcesses.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-muted">Nenhum processo.</td>
                  </tr>
                ) : (
                  recentProcesses.map((p) => (
                    <tr key={p.id} className="hover:bg-surface">
                      <td className="px-5 py-3">
                        <p className="font-medium text-navy-800">{p.title}</p>
                        <p className="text-xs text-muted">{p.client.name} · {p.number}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${processStatusClass[p.status]}`}>
                          {processStatusLabel[p.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-navy-800">Próximos prazos</h2>
          {upcoming.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
              Nenhum prazo cadastrado.
            </p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((d) => (
                <li key={d.id} className="rounded-lg border border-line bg-white p-4">
                  <p className="text-sm font-medium text-navy-800">{d.title}</p>
                  <p className="mt-1 text-xs text-petrol-600">Vence em {formatDate(d.dueDate)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
