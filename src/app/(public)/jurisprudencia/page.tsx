import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card, Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";

export const metadata: Metadata = {
  title: "Jurisprudência",
  description:
    "Painel de decisões relevantes do STJ, STF, súmulas e temas repetitivos em Direito da Saúde.",
};

export const dynamic = "force-dynamic";

export default async function JurisprudenciaPage() {
  const items = await safeQuery(
    () =>
      prisma.jurisprudence.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { decisionDate: "desc" },
        take: 50,
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Jurisprudência"
        description="Acompanhamento dos entendimentos dos tribunais superiores aplicáveis ao Direito da Saúde."
        breadcrumb={[{ label: "Jurisprudência" }]}
      />

      <Section>
        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
              <Icon name="scale" />
            </span>
            <h2 className="mt-4 font-semibold text-navy-800">Decisões em breve</h2>
            <p className="mt-2 text-sm text-muted">
              As decisões serão publicadas pelo painel administrativo.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((j) => (
              <Card key={j.id}>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-navy-50 text-navy-700">{j.tribunal}</Badge>
                  {j.reference && (
                    <span className="text-sm font-medium text-petrol-600">{j.reference}</span>
                  )}
                  {j.decisionDate && (
                    <time className="text-xs text-muted" dateTime={j.decisionDate.toISOString()}>
                      {j.decisionDate.toLocaleDateString("pt-BR")}
                    </time>
                  )}
                </div>
                <h2 className="mt-3 font-serif text-lg font-semibold text-navy-800">{j.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{j.summary}</p>
                {j.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {j.tags.split(",").map((t) => (
                      <span key={t} className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
