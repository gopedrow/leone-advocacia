import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card, Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";

export const metadata: Metadata = {
  title: "Conteúdo Jurídico",
  description:
    "Artigos, notícias e análises sobre Direito da Saúde, planos de saúde, medicamentos e direitos do paciente.",
};

export const dynamic = "force-dynamic";

export default async function ConteudoPage() {
  const articles = await safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true, author: { select: { name: true } } },
        take: 30,
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Conteúdo Jurídico"
        description="Centro de conhecimento sobre Direito da Saúde — explicações claras sobre seus direitos."
        breadcrumb={[{ label: "Conteúdo Jurídico" }]}
      />

      <Section>
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Card key={a.id} className="flex flex-col">
                {a.category && <Badge>{a.category.name}</Badge>}
                <h2 className="mt-3 font-serif text-xl font-semibold text-navy-800">
                  <Link href={`/conteudo/${a.slug}`} className="hover:text-petrol-600">
                    {a.title}
                  </Link>
                </h2>
                {a.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.excerpt}</p>
                )}
                <div className="mt-5 flex items-center justify-between text-xs text-muted">
                  <span>{a.author?.name}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="refresh" className="h-3.5 w-3.5" />
                    {a.readMinutes} min de leitura
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-line bg-surface p-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
        <Icon name="document" />
      </span>
      <h2 className="mt-4 font-semibold text-navy-800">Conteúdo em breve</h2>
      <p className="mt-2 text-sm text-muted">
        Os artigos serão publicados pelo painel administrativo. Execute o seed do banco para ver
        exemplos.
      </p>
    </div>
  );
}
