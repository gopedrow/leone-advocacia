import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { ProcessForm } from "@/components/admin/ProcessForm";
import { MovementForm } from "@/components/admin/MovementForm";
import { MovementDeadline } from "@/components/admin/MovementDeadline";
import { DocIconButton } from "@/components/admin/DocIconButton";
import { deleteProcess, updateProcess } from "../actions";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };
const isoDate = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function EditarProcessoPage({ params }: Params) {
  await requireAdmin();
  const { id } = await params;

  const [proc, clients] = await Promise.all([
    safeQuery(
      () =>
        prisma.process.findUnique({
          where: { id },
          include: {
            movements: { orderBy: { date: "desc" }, include: { deadline: true } },
            client: { select: { name: true } },
          },
        }),
      null
    ),
    safeQuery(
      () => prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
  ]);

  if (!proc) notFound();

  return (
    <>
      <Link href="/admin/processos" className="text-sm text-petrol-600 hover:text-petrol-700">
        ← Voltar aos processos
      </Link>
      <div className="mt-3">
        <PageTitle title={proc.title} subtitle={`${proc.number} · ${proc.client.name}`} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        {/* Edição dos dados */}
        <div>
          <h2 className="mb-4 font-semibold text-navy-800">Dados do processo</h2>
          <ProcessForm
            action={updateProcess}
            mode="edit"
            clients={clients}
            initial={{
              id: proc.id,
              number: proc.number,
              title: proc.title,
              clientId: proc.clientId,
              court: proc.court,
              jurisdiction: proc.jurisdiction,
              className: proc.className,
              subject: proc.subject,
              status: proc.status,
              distributedAt: isoDate(proc.distributedAt),
            }}
          />

          <form action={deleteProcess} className="mt-6 border-t border-line pt-6">
            <input type="hidden" name="id" value={proc.id} />
            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700">
              Excluir processo
            </button>
          </form>
        </div>

        {/* Movimentações */}
        <div className="space-y-6">
          <MovementForm processId={proc.id} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-navy-800">Linha do tempo</h2>
              <DocIconButton
                href={`/admin/documentos/novo?processId=${proc.id}&clientId=${proc.clientId}`}
                title="Gerar petição para este processo"
                size="sm"
              />
            </div>
            {proc.movements.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
                Nenhuma movimentação ainda.
              </p>
            ) : (
              <ol className="relative space-y-6 border-l-2 border-line pl-6">
                {proc.movements.map((m) => (
                  <li key={m.id} className="relative">
                    <span className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-petrol-500 ring-4 ring-surface" />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted">{formatDate(m.date)}</p>
                        <p className="font-medium text-navy-800">{m.title}</p>
                        {m.description && <p className="mt-1 text-sm text-muted">{m.description}</p>}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <DocIconButton
                          href={`/admin/documentos/novo?processId=${proc.id}&movementId=${m.id}&clientId=${proc.clientId}`}
                          title="Gerar petição a partir desta movimentação"
                          size="sm"
                        />
                        <MovementDeadline
                          movementId={m.id}
                          processId={proc.id}
                          movementTitle={m.title}
                          status={m.deadline ? "set" : m.noDeadline ? "none" : "pending"}
                          dueLabel={m.deadline ? formatDate(m.deadline.dueDate) : null}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
