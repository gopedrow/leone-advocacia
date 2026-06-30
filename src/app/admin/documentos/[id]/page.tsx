import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { DocumentEditor } from "@/components/admin/DocumentEditor";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function DocumentoPage({ params }: Params) {
  await requireAdmin();
  const { id } = await params;

  const [petition, clients] = await Promise.all([
    safeQuery(
      () =>
        prisma.petition.findUnique({
          where: { id },
          include: {
            process: { select: { id: true, number: true, title: true } },
            movement: { select: { id: true, title: true } },
          },
        }),
      null
    ),
    safeQuery(
      () => prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
  ]);

  if (!petition) notFound();

  return <DocumentEditor petition={petition} clients={clients} />;
}
