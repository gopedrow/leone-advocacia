import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { Icon } from "@/components/ui/Icon";
import { documentCategoryLabel, formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function DocumentosCliente() {
  const user = await requireUser();
  const docs = await safeQuery(
    () =>
      prisma.document.findMany({
        where: { ownerId: user.sub },
        orderBy: { createdAt: "desc" },
        include: { process: { select: { number: true } } },
      }),
    []
  );

  // Agrupa por categoria
  const grouped = docs.reduce<Record<string, typeof docs>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});

  return (
    <>
      <PageTitle title="Documentos" subtitle="Seus documentos organizados por categoria." />
      {docs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nenhum documento disponível ainda.
        </p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                {documentCategoryLabel[cat] ?? cat}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 rounded-lg border border-line bg-white p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
                      <Icon name="document" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy-800">{d.name}</p>
                      <p className="text-xs text-muted">
                        {d.process?.number ? `Proc. ${d.process.number} · ` : ""}
                        {formatDate(d.createdAt)}
                      </p>
                    </div>
                    {/* Download conectado ao storage na fase de backend de arquivos */}
                    <span className="text-xs font-medium text-petrol-600">Baixar</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
