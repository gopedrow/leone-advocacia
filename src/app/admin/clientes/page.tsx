import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/labels";
import { toggleClientActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminClientes() {
  await requireAdmin();
  const clients = await safeQuery(
    () =>
      prisma.user.findMany({
        where: { role: "CLIENT" },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { processes: true } },
          signatureRequests: { select: { status: true } },
        },
      }),
    []
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Clientes" />
        <ButtonLink href="/admin/clientes/novo" size="sm">
          Novo cliente
        </ButtonLink>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Nome</th>
              <th className="px-5 py-3 font-semibold">E-mail</th>
              <th className="px-5 py-3 font-semibold">Processos</th>
              <th className="px-5 py-3 font-semibold">Documentos</th>
              <th className="px-5 py-3 font-semibold">Desde</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  Nenhum cliente cadastrado. Clique em “Novo cliente” para começar.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="hover:bg-surface">
                  <td className="px-5 py-4 font-medium text-navy-800">
                    <Link href={`/admin/clientes/${c.id}`} className="hover:text-petrol-600">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">{c.email}</td>
                  <td className="px-5 py-4 text-muted">{c._count.processes}</td>
                  <td className="px-5 py-4">
                    {(() => {
                      const sigs = c.signatureRequests;
                      const total = sigs.length;
                      const signedAll =
                        total > 0 &&
                        sigs.every(
                          (s) => s.status === "ASSINADO_DIGITAL" || s.status === "ASSINADO_FISICO"
                        );
                      const color =
                        total === 0 ? "text-red-500" : signedAll ? "text-emerald-600" : "text-gold-500";
                      const title =
                        total === 0
                          ? "Nenhum documento enviado para assinatura"
                          : signedAll
                            ? "Todos os documentos assinados"
                            : "Documento(s) aguardando assinatura";
                      return (
                        <Link href={`/admin/clientes/${c.id}`} title={title} className={`inline-flex ${color}`}>
                          <Icon name="document" className="h-5 w-5" />
                        </Link>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-4 text-muted">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/clientes/${c.id}`} className="font-medium text-petrol-600 hover:text-petrol-700">
                        Editar
                      </Link>
                      <form action={toggleClientActive}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="active" value={(!c.active).toString()} />
                        <button type="submit" className="font-medium text-muted hover:text-navy-800">
                          {c.active ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
