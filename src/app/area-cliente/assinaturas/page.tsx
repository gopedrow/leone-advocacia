import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { SignatureActions } from "@/components/cliente/SignatureActions";
import {
  signatureStatusLabel,
  signatureStatusClass,
  signatureTypeLabel,
  formatDate,
} from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AssinaturasCliente() {
  const user = await requireUser();
  const docs = await safeQuery(
    () =>
      prisma.signatureRequest.findMany({
        where: { clientId: user.sub },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      }),
    []
  );

  return (
    <>
      <PageTitle
        title="Assinaturas"
        subtitle="Documentos disponíveis para assinatura. Assine digitalmente ou envie a versão assinada no papel."
      />

      {docs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nenhum documento para assinar no momento. Quando a advogada disponibilizar um contrato ou
          procuração, ele aparecerá aqui.
        </p>
      ) : (
        <ul className="space-y-5">
          {docs.map((d) => {
            const pending = d.status === "PENDENTE";
            return (
              <li key={d.id} className="rounded-xl border border-line bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      {signatureTypeLabel[d.type]}
                    </p>
                    <h2 className="mt-1 font-serif text-lg font-semibold text-navy-800">{d.title}</h2>
                    <p className="mt-1 text-xs text-muted">Disponibilizado em {formatDate(d.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${signatureStatusClass[d.status]}`}>
                    {signatureStatusLabel[d.status]}
                  </span>
                </div>

                {pending ? (
                  <SignatureActions id={d.id} hasFile={Boolean(d.fileKey)} />
                ) : (
                  <div className="mt-4 border-t border-line pt-4 text-sm text-muted">
                    {d.status === "ASSINADO_DIGITAL" && (
                      <p>
                        Assinado eletronicamente por <strong>{d.signerName}</strong> em{" "}
                        {formatDate(d.signedAt)}.
                      </p>
                    )}
                    {d.status === "ASSINADO_FISICO" && (
                      <p className="flex flex-wrap items-center gap-3">
                        Documento assinado enviado em {formatDate(d.signedAt)}.
                        <a
                          href={`/api/arquivo/${d.id}?tipo=assinado`}
                          className="font-medium text-petrol-600 hover:text-petrol-700"
                        >
                          Baixar enviado
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
