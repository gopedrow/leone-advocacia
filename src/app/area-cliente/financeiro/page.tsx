import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { StatCard, PageTitle } from "@/components/dashboard/StatCard";
import { paymentStatusLabel, paymentStatusClass, formatDate, formatBRL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function FinanceiroCliente() {
  const user = await requireUser();
  const payments = await safeQuery(
    () => prisma.payment.findMany({ where: { clientId: user.sub }, orderBy: { dueDate: "asc" } }),
    []
  );

  let pago = 0;
  let aPagar = 0;
  for (const p of payments) {
    if (p.status === "PAGO") pago += p.amount;
    else if (p.status === "PENDENTE" || p.status === "ATRASADO") aPagar += p.amount;
  }
  const total = pago + aPagar;

  return (
    <>
      <PageTitle
        title="Financeiro"
        subtitle="Acompanhe seus honorários: o que já foi pago e o que ainda está em aberto."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Total contratado" value={formatBRL(total)} />
        <StatCard label="Pago" value={formatBRL(pago)} />
        <StatCard label="Em aberto" value={formatBRL(aPagar)} />
      </div>

      <h2 className="mt-8 mb-4 font-semibold text-navy-800">Histórico</h2>
      {payments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nenhum lançamento financeiro registrado ainda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Descrição</th>
                <th className="px-5 py-3 font-semibold">Valor</th>
                <th className="px-5 py-3 font-semibold">Vencimento</th>
                <th className="px-5 py-3 font-semibold">Pagamento</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-5 py-4 font-medium text-navy-800">{p.description}</td>
                  <td className="px-5 py-4 text-navy-800">{formatBRL(p.amount)}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(p.dueDate)}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(p.paidDate)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass[p.status]}`}>
                      {paymentStatusLabel[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Dúvidas sobre valores ou formas de pagamento? Fale com o escritório pela aba Mensagens.
      </p>
    </>
  );
}
