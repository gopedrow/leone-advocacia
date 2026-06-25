import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { processStatusLabel, processStatusClass, formatDate, documentCategoryLabel } from "@/lib/labels";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function ProcessoDetalhe({ params }: Params) {
  const { id } = await params;
  const user = await requireUser();

  const proc = await safeQuery(
    () =>
      prisma.process.findFirst({
        where: { id, clientId: user.sub },
        include: {
          movements: { orderBy: { date: "desc" } },
          documents: { orderBy: { createdAt: "desc" } },
        },
      }),
    null
  );

  if (!proc) notFound();

  return (
    <>
      <Link href="/area-cliente/processos" className="text-sm text-petrol-600 hover:text-petrol-700">
        ← Voltar aos processos
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy-800">{proc.title}</h1>
          <p className="mt-1 font-mono text-sm text-muted">{proc.number}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${processStatusClass[proc.status]}`}>
          {processStatusLabel[proc.status]}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Tribunal" value={proc.court} />
        <Info label="Vara / Comarca" value={proc.jurisdiction} />
        <Info label="Classe" value={proc.className} />
        <Info label="Assunto" value={proc.subject} />
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Linha do tempo */}
        <section>
          <h2 className="mb-4 font-semibold text-navy-800">Linha do tempo</h2>
          {proc.movements.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
              Nenhuma movimentação registrada.
            </p>
          ) : (
            <ol className="relative space-y-6 border-l-2 border-line pl-6">
              {proc.movements.map((m) => (
                <li key={m.id} className="relative">
                  <span className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-petrol-500 ring-4 ring-surface" />
                  <p className="text-xs text-muted">{formatDate(m.date)}</p>
                  <p className="font-medium text-navy-800">{m.title}</p>
                  {m.description && <p className="mt-1 text-sm text-muted">{m.description}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Documentos do processo */}
        <section>
          <h2 className="mb-4 font-semibold text-navy-800">Documentos</h2>
          {proc.documents.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
              Sem documentos anexados.
            </p>
          ) : (
            <ul className="space-y-3">
              {proc.documents.map((d) => (
                <li key={d.id} className="rounded-lg border border-line bg-white p-4">
                  <p className="text-sm font-medium text-navy-800">{d.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {documentCategoryLabel[d.category]} · {formatDate(d.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-navy-800">{value || "—"}</dd>
    </div>
  );
}
