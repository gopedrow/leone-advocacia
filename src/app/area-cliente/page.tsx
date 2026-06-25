import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { StatCard, PageTitle } from "@/components/dashboard/StatCard";
import { processStatusLabel, processStatusClass, formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function ClienteDashboard() {
  const user = await requireUser();

  const [processes, notifications, docCount, unreadMsgs] = await Promise.all([
    safeQuery(
      () =>
        prisma.process.findMany({
          where: { clientId: user.sub },
          orderBy: { updatedAt: "desc" },
          include: { movements: { orderBy: { date: "desc" }, take: 1 } },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.notification.findMany({
          where: { userId: user.sub },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeQuery(() => prisma.document.count({ where: { ownerId: user.sub } }), 0),
    safeQuery(
      () => prisma.message.count({ where: { recipientId: user.sub, read: false } }),
      0
    ),
  ]);

  const active = processes.filter((p) => p.status !== "ENCERRADO").length;

  return (
    <>
      <PageTitle title={`Olá, ${user.name.split(" ")[0]}`} subtitle="Acompanhe seus processos e mensagens." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Processos ativos" value={active} />
        <StatCard label="Total de processos" value={processes.length} />
        <StatCard label="Documentos" value={docCount} />
        <StatCard label="Mensagens não lidas" value={unreadMsgs} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-4 font-semibold text-navy-800">Meus processos</h2>
          {processes.length === 0 ? (
            <EmptyCard text="Nenhum processo cadastrado ainda. Assim que sua ação for protocolada, ela aparecerá aqui." />
          ) : (
            <ul className="space-y-4">
              {processes.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/area-cliente/processos/${p.id}`}
                    className="block rounded-xl border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-navy-800">{p.title}</p>
                        <p className="mt-1 font-mono text-xs text-muted">{p.number}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${processStatusClass[p.status]}`}>
                        {processStatusLabel[p.status]}
                      </span>
                    </div>
                    {p.movements[0] && (
                      <p className="mt-3 text-sm text-muted">
                        Última movimentação: {p.movements[0].title} · {formatDate(p.movements[0].date)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-navy-800">Notificações</h2>
          {notifications.length === 0 ? (
            <EmptyCard text="Sem notificações no momento." />
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-lg border border-line bg-white p-4">
                  <p className="text-sm font-medium text-navy-800">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-muted">{n.body}</p>}
                  <p className="mt-2 text-xs text-muted">{formatDate(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
      {text}
    </div>
  );
}
