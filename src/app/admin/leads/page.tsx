import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle, StatCard } from "@/components/dashboard/StatCard";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

const leadStatusLabel: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contatado",
  QUALIFIED: "Qualificado",
  CLOSED: "Encerrado",
};

const targetLabel: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  OUTRO: "Outro",
};

export default async function AdminLeads() {
  await requireAdmin();

  const [leads, clicks] = await Promise.all([
    safeQuery(() => prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }), []),
    safeQuery(
      () => prisma.campaignClick.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
      []
    ),
  ]);

  // Agrega cliques por campanha e por destino.
  const byCampaign = new Map<string, number>();
  let wpp = 0;
  let insta = 0;
  for (const c of clicks) {
    const key = c.campaign || "(sem campanha)";
    byCampaign.set(key, (byCampaign.get(key) ?? 0) + 1);
    if (c.target === "WHATSAPP") wpp++;
    if (c.target === "INSTAGRAM") insta++;
  }
  const topCampaigns = [...byCampaign.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <>
      <PageTitle
        title="Leads e Campanhas"
        subtitle="Mensagens do formulário e cliques vindos dos seus anúncios."
      />

      {/* ───── Cliques de campanha ───── */}
      <section className="mb-10">
        <h2 className="mb-4 font-semibold text-navy-800">Cliques de campanha</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Cliques (total)" value={clicks.length} />
          <StatCard label="→ WhatsApp" value={wpp} />
          <StatCard label="→ Instagram" value={insta} />
        </div>

        {topCampaigns.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Campanha</th>
                  <th className="px-5 py-3 text-right font-semibold">Cliques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topCampaigns.map(([name, count]) => (
                  <tr key={name} className="hover:bg-surface">
                    <td className="px-5 py-3 text-navy-800">{name}</td>
                    <td className="px-5 py-3 text-right font-medium text-navy-800">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {clicks.length === 0 && (
          <p className="mt-4 rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
            Nenhum clique registrado ainda. Use os links rastreados nos seus anúncios (veja abaixo)
            para que os cliques apareçam aqui.
          </p>
        )}

        <details className="mt-4 rounded-xl border border-line bg-surface p-4 text-sm text-navy-700">
          <summary className="cursor-pointer font-medium">Como usar os links rastreados</summary>
          <div className="mt-3 space-y-2 text-muted">
            <p>Aponte o anúncio para um destes endereços (troque pelo seu domínio quando publicar):</p>
            <p className="font-mono text-xs text-navy-800">
              /ir/whatsapp?utm_source=instagram&amp;utm_campaign=medicamentos
            </p>
            <p className="font-mono text-xs text-navy-800">
              /ir/instagram?utm_source=meta&amp;utm_campaign=institucional
            </p>
            <p>
              O <strong>utm_campaign</strong> é o nome que aparece na tabela acima. Você pode adicionar
              <span className="font-mono"> &amp;msg=</span> no link do WhatsApp para já abrir uma mensagem pronta.
            </p>
          </div>
        </details>
      </section>

      {/* ───── Leads do formulário ───── */}
      <section>
        <h2 className="mb-4 font-semibold text-navy-800">Mensagens do formulário</h2>
        {leads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
            Nenhum lead recebido ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {leads.map((l) => (
              <li key={l.id} className="rounded-xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-navy-800">{l.name}</p>
                    <p className="text-sm text-muted">
                      {l.email}
                      {l.phone ? ` · ${l.phone}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-petrol-50 px-2.5 py-1 text-xs font-semibold text-petrol-700">
                      {leadStatusLabel[l.status]}
                    </span>
                    <p className="mt-1 text-xs text-muted">{formatDate(l.createdAt)}</p>
                  </div>
                </div>
                {l.subject && <p className="mt-3 text-sm font-medium text-navy-700">{l.subject}</p>}
                <p className="mt-1 text-sm text-muted">{l.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
