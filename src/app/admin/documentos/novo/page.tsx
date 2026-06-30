import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { TemplateGallery } from "@/components/admin/TemplateGallery";

export const dynamic = "force-dynamic";

type Search = Promise<{ processId?: string; movementId?: string; clientId?: string }>;

export default async function NovoDocumentoPage({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { processId, movementId, clientId } = await searchParams;

  const [clients, process, movement] = await Promise.all([
    safeQuery(
      () =>
        prisma.user.findMany({
          where: { role: "CLIENT", active: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      []
    ),
    processId
      ? safeQuery(
          () =>
            prisma.process.findUnique({
              where: { id: processId },
              select: { id: true, number: true, title: true, clientId: true },
            }),
          null
        )
      : Promise.resolve(null),
    movementId
      ? safeQuery(() => prisma.movement.findUnique({ where: { id: movementId }, select: { id: true, title: true } }), null)
      : Promise.resolve(null),
  ]);

  return (
    <>
      <PageTitle
        title="Novo documento"
        subtitle="Escolha um modelo de petição, recurso ou contrato — ou comece do zero."
      />
      <TemplateGallery
        clients={clients}
        context={{
          processId: process?.id ?? processId ?? null,
          processNumber: process?.number ?? null,
          processTitle: process?.title ?? null,
          movementId: movement?.id ?? movementId ?? null,
          movementTitle: movement?.title ?? null,
          clientId: clientId ?? process?.clientId ?? null,
        }}
      />
    </>
  );
}
