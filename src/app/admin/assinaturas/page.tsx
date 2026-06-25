import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { createSignatureRequest, deleteSignatureRequest } from "../clientes/finance-actions";
import {
  signatureStatusLabel,
  signatureStatusClass,
  signatureTypeLabel,
  formatDate,
} from "@/lib/labels";

export const dynamic = "force-dynamic";

const fld =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy-800 focus-visible:border-petrol-400";

export default async function AdminAssinaturas() {
  await requireAdmin();

  const [clients, requests] = await Promise.all([
    safeQuery(
      () =>
        prisma.user.findMany({
          where: { role: "CLIENT", active: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.signatureRequest.findMany({
          orderBy: [{ status: "asc" }, { createdAt: "desc" }],
          include: { client: { select: { id: true, name: true } } },
        }),
      []
    ),
  ]);

  return (
    <>
      <PageTitle
        title="Assinaturas"
        subtitle="Envie documentos para o cliente assinar e acompanhe o status."
      />

      {clients.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-sm text-muted">
          Cadastre um cliente primeiro em <strong>Clientes → Novo cliente</strong>.
        </p>
      ) : (
        <form
          action={createSignatureRequest}
          className="mb-8 grid items-end gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Cliente</label>
            <select name="clientId" required className={fld} defaultValue="">
              <option value="" disabled>Selecione…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Título</label>
            <input name="title" required className={fld} placeholder="Ex.: Contrato de honorários" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Tipo</label>
            <select name="type" className={fld} defaultValue="CONTRATO_HONORARIOS">
              <option value="CONTRATO_HONORARIOS">Contrato de honorários</option>
              <option value="PROCURACAO">Procuração</option>
              <option value="DECLARACAO">Declaração</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Arquivo</label>
            <input type="file" name="file" accept=".pdf,.doc,.docx,image/*" className="text-sm" />
          </div>
          <button
            type="submit"
            className="h-10 rounded-lg bg-navy-700 px-4 text-sm font-medium text-white hover:bg-navy-800 sm:col-span-2 lg:col-span-1"
          >
            Enviar para assinatura
          </button>
        </form>
      )}

      <h2 className="mb-4 font-semibold text-navy-800">Documentos enviados</h2>
      {requests.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nenhum documento enviado ainda.
        </p>
      ) : (
        <ul className="space-y-2">
          {requests.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
              <div>
                <p className="font-medium text-navy-800">{s.title}</p>
                <p className="text-xs text-muted">
                  <Link href={`/admin/clientes/${s.client.id}`} className="hover:text-petrol-600">
                    {s.client.name}
                  </Link>
                  {" · "}
                  {signatureTypeLabel[s.type]}
                  {s.signerName ? ` · assinado por ${s.signerName} em ${formatDate(s.signedAt)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${signatureStatusClass[s.status]}`}>
                  {signatureStatusLabel[s.status]}
                </span>
                {s.fileKey && (
                  <a href={`/api/arquivo/${s.id}?tipo=doc`} className="font-medium text-petrol-600 hover:text-petrol-700">
                    Original
                  </a>
                )}
                {s.signedFileKey && (
                  <a href={`/api/arquivo/${s.id}?tipo=assinado`} className="font-medium text-petrol-600 hover:text-petrol-700">
                    Assinado
                  </a>
                )}
                <form action={deleteSignatureRequest}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="clientId" value={s.client.id} />
                  <button type="submit" className="text-muted hover:text-red-600">Excluir</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
