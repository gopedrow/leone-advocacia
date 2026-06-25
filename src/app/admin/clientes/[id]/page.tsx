import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ClientForm } from "@/components/admin/ClientForm";
import { updateClient } from "../actions";
import {
  createSignatureRequest,
  deleteSignatureRequest,
  createPayment,
  setPaymentStatus,
  deletePayment,
} from "../finance-actions";
import {
  signatureStatusLabel,
  signatureStatusClass,
  signatureTypeLabel,
  paymentStatusLabel,
  paymentStatusClass,
  formatDate,
  formatBRL,
} from "@/lib/labels";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };
const isoDate = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
const fld = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy-800 focus-visible:border-petrol-400";

export default async function EditarClientePage({ params }: Params) {
  await requireAdmin();
  const { id } = await params;

  const client = await safeQuery(
    () =>
      prisma.user.findFirst({
        where: { id, role: "CLIENT" },
        include: {
          clientProfile: true,
          signatureRequests: { orderBy: { createdAt: "desc" } },
          payments: { orderBy: { dueDate: "asc" } },
        },
      }),
    null
  );
  if (!client) notFound();

  const p = client.clientProfile;

  return (
    <>
      <PageTitle title="Editar cliente" subtitle={client.email} />

      <ClientForm
        action={updateClient}
        mode="edit"
        initial={{
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          active: client.active,
          personType: p?.personType ?? "PF",
          rg: p?.rg,
          maritalStatus: p?.maritalStatus,
          profession: p?.profession,
          nationality: p?.nationality,
          companyName: p?.companyName,
          cnpj: p?.cnpj,
          legalRep: p?.legalRep,
          cep: p?.cep,
          street: p?.street,
          number: p?.number,
          complement: p?.complement,
          district: p?.district,
          city: p?.city,
          state: p?.state,
          demandType: p?.demandType,
          feeModality: p?.feeModality,
          feeValue: p?.feeValue,
          contractDate: isoDate(p?.contractDate),
          paymentMethod: p?.paymentMethod,
          contractSigned: p?.contractSigned ?? false,
          contractFileName: p?.contractFileName,
          observation: p?.observation,
          qualification: p?.qualification,
        }}
      />

      {/* ───── Documentos para assinatura ───── */}
      <section className="mt-12">
        <h2 className="mb-4 font-serif text-xl font-semibold text-navy-800">
          Documentos para assinatura
        </h2>

        <form action={createSignatureRequest} className="mb-5 grid items-end gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-[1fr_12rem_auto]">
          <input type="hidden" name="clientId" value={client.id} />
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
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Arquivo (PDF)</label>
            <input type="file" name="file" accept=".pdf,.doc,.docx,image/*" className="text-sm" />
          </div>
          <button type="submit" className="h-10 rounded-lg bg-navy-700 px-4 text-sm font-medium text-white hover:bg-navy-800">
            Disponibilizar
          </button>
        </form>

        {client.signatureRequests.length === 0 ? (
          <p className="text-sm text-muted">Nenhum documento disponibilizado.</p>
        ) : (
          <ul className="space-y-2">
            {client.signatureRequests.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
                <div>
                  <p className="font-medium text-navy-800">{s.title}</p>
                  <p className="text-xs text-muted">
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
                    <input type="hidden" name="clientId" value={client.id} />
                    <button type="submit" className="text-muted hover:text-red-600">Excluir</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ───── Financeiro ───── */}
      <section className="mt-12">
        <h2 className="mb-4 font-serif text-xl font-semibold text-navy-800">Financeiro</h2>

        <form action={createPayment} className="mb-5 grid items-end gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
          <input type="hidden" name="clientId" value={client.id} />
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Descrição</label>
            <input name="description" required className={fld} placeholder="Ex.: Entrada / Parcela 1" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Valor</label>
            <input name="amount" required className={fld} placeholder="R$ 0,00" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Vencimento</label>
            <input type="date" name="dueDate" className={fld} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Status</label>
            <select name="status" className={fld} defaultValue="PENDENTE">
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Forma</label>
            <select name="method" className={fld} defaultValue="">
              <option value="">—</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="BOLETO">Boleto</option>
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
          <button type="submit" className="h-10 rounded-lg bg-navy-700 px-4 text-sm font-medium text-white hover:bg-navy-800">
            Lançar
          </button>
        </form>

        {client.payments.length === 0 ? (
          <p className="text-sm text-muted">Nenhum lançamento financeiro.</p>
        ) : (
          <ul className="space-y-2">
            {client.payments.map((pay) => (
              <li key={pay.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
                <div>
                  <p className="font-medium text-navy-800">{pay.description} — {formatBRL(pay.amount)}</p>
                  <p className="text-xs text-muted">
                    Venc. {formatDate(pay.dueDate)}
                    {pay.paidDate ? ` · pago em ${formatDate(pay.paidDate)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass[pay.status]}`}>
                    {paymentStatusLabel[pay.status]}
                  </span>
                  <form action={setPaymentStatus}>
                    <input type="hidden" name="id" value={pay.id} />
                    <input type="hidden" name="clientId" value={client.id} />
                    <input type="hidden" name="status" value={pay.status === "PAGO" ? "PENDENTE" : "PAGO"} />
                    <button type="submit" className="font-medium text-petrol-600 hover:text-petrol-700">
                      {pay.status === "PAGO" ? "Marcar pendente" : "Marcar pago"}
                    </button>
                  </form>
                  <form action={deletePayment}>
                    <input type="hidden" name="id" value={pay.id} />
                    <input type="hidden" name="clientId" value={client.id} />
                    <button type="submit" className="text-muted hover:text-red-600">Excluir</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
