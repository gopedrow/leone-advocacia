import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ProcessForm } from "@/components/admin/ProcessForm";
import { createProcess } from "../actions";

export const dynamic = "force-dynamic";

export default async function NovoProcessoPage() {
  await requireAdmin();
  const clients = await safeQuery(
    () =>
      prisma.user.findMany({
        where: { role: "CLIENT", active: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    []
  );

  return (
    <>
      <PageTitle title="Novo processo" subtitle="Cadastre o processo e vincule a um cliente." />
      {clients.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-sm text-muted">
          Cadastre um cliente primeiro em <strong>Clientes → Novo cliente</strong> para poder vincular o processo.
        </p>
      ) : (
        <ProcessForm action={createProcess} mode="create" clients={clients} />
      )}
    </>
  );
}
