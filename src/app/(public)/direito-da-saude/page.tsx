import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { whatsappLink } from "@/config/site";
import { demands, patientRights } from "@/config/content";

export const metadata: Metadata = {
  title: "Direito da Saúde",
  description:
    "Tudo sobre Direito da Saúde em um só lugar: áreas de atuação, direitos do paciente e conteúdo jurídico — negativas de cobertura, medicamentos, cirurgias, SUS e mais.",
};

export const dynamic = "force-dynamic";

const sections = [
  { href: "#areas", label: "Áreas de atuação" },
  { href: "#pacientes", label: "Direitos do Paciente" },
  { href: "#conteudo", label: "Conteúdo Jurídico" },
];

export default async function DireitoDaSaudePage() {
  const articles = await safeQuery(
    () =>
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true, author: { select: { name: true } } },
        take: 6,
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Direito da Saúde"
        description="Tudo o que você precisa saber, reunido em um só lugar: áreas de atuação, seus direitos como paciente e conteúdo jurídico especializado."
        breadcrumb={[{ label: "Direito da Saúde" }]}
      />

      {/* Navegação interna entre as seções */}
      <nav
        aria-label="Seções desta página"
        className="sticky top-18 z-30 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
      >
        <Container className="flex gap-2 overflow-x-auto py-3">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:border-petrol-300 hover:text-petrol-600"
            >
              {s.label}
            </a>
          ))}
        </Container>
      </nav>

      {/* 1) Áreas de atuação */}
      <Section id="areas" className="scroll-mt-32">
        <SectionHeading
          align="left"
          eyebrow="Áreas de atuação"
          title="Como podemos ajudar você"
          description="Atuação especializada nas situações mais frequentes enfrentadas por pacientes e consumidores de planos de saúde."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {demands.map((d) => (
            <article
              key={d.slug}
              id={d.slug}
              className="scroll-mt-32 rounded-xl border border-line bg-white p-7 shadow-soft"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
                  <Icon name={d.icon} />
                </span>
                <h3 className="font-serif text-xl font-semibold text-navy-800">{d.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-muted">{d.description}</p>
              <ButtonLink href="/contato" variant="ghost" size="sm" className="mt-4 px-0 text-petrol-600">
                Avaliar meu caso
                <Icon name="arrowRight" className="h-4 w-4" />
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>

      {/* 2) Direitos do Paciente */}
      <Section id="pacientes" className="scroll-mt-32 bg-surface">
        <SectionHeading
          align="left"
          eyebrow="Direitos do Paciente"
          title="Seus direitos, de forma simples"
          description="Informação de caráter educativo. Cada caso deve ser analisado individualmente."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {patientRights.map((t) => (
            <Card key={t.title}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-xl font-semibold text-navy-800">{t.title}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-navy-700">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/faq" variant="outline" size="lg">
            Ver perguntas frequentes
          </ButtonLink>
        </div>
      </Section>

      {/* 3) Conteúdo Jurídico */}
      <Section id="conteudo" className="scroll-mt-32">
        <SectionHeading
          align="left"
          eyebrow="Conteúdo Jurídico"
          title="Artigos e orientações"
          description="Explicações claras sobre Direito da Saúde, planos de saúde, medicamentos e direitos do paciente."
        />

        {articles.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
              <Icon name="document" />
            </span>
            <h3 className="mt-4 font-semibold text-navy-800">Conteúdo em breve</h3>
            <p className="mt-2 text-sm text-muted">
              Os artigos são publicados pelo painel administrativo.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Card key={a.id} className="flex flex-col">
                  {a.category && <Badge>{a.category.name}</Badge>}
                  <h3 className="mt-3 font-serif text-xl font-semibold text-navy-800">
                    <Link href={`/conteudo/${a.slug}`} className="hover:text-petrol-600">
                      {a.title}
                    </Link>
                  </h3>
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
            <div className="mt-10">
              <ButtonLink href="/conteudo" variant="outline" size="lg">
                Ver todo o conteúdo
              </ButtonLink>
            </div>
          </>
        )}
      </Section>

      {/* CTA final */}
      <Section className="bg-gradient-to-br from-petrol-600 to-navy-800 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold">Sua situação não está na lista?</h2>
          <p className="mt-3 text-navy-100">
            Além das demandas mais comuns, o Direito da Saúde contempla diversas outras questões. Apresente seu caso para uma análise das medidas jurídicas cabíveis.
          </p>
          <ButtonLink href={whatsappLink()} external variant="gold" size="lg" className="mt-7">
            <Icon name="whatsapp" className="h-5 w-5" />
            Vamos resolver isso juntos. Fale com nossa equipe!
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
