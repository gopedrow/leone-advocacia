import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FaqAccordion, type Faq } from "@/components/public/FaqAccordion";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Dúvidas comuns sobre Direito da Saúde, planos de saúde, medicamentos e prazos.",
};

export const dynamic = "force-dynamic";

// Fallback usado quando o banco ainda não foi semeado.
const fallback: Faq[] = [
  {
    id: "1",
    question: "O plano de saúde pode negar um tratamento prescrito pelo médico?",
    answer:
      "Em regra, não. A jurisprudência entende que cabe ao médico assistente definir o tratamento adequado. Negativas abusivas podem ser revertidas judicialmente, inclusive por liminar.",
  },
  {
    id: "2",
    question: "Quanto tempo demora para conseguir um medicamento por liminar?",
    answer:
      "Decisões de urgência podem ser proferidas em poucos dias, a depender do caso, dos documentos e da comarca.",
  },
  {
    id: "3",
    question: "Preciso pagar adiantado para entrar com a ação?",
    answer:
      "As condições são definidas de forma transparente na consulta inicial. Em muitos casos há possibilidade de gratuidade de justiça.",
  },
  {
    id: "4",
    question: "Tenho direito a reembolso de despesas médicas?",
    answer:
      "Frequentemente sim, sobretudo em urgências ou diante de negativa indevida. Cada situação é analisada individualmente.",
  },
];

export default async function FaqPage() {
  const dbItems = await safeQuery(
    () =>
      prisma.faqItem.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    []
  );

  const items: Faq[] =
    dbItems.length > 0
      ? dbItems.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
      : fallback;

  return (
    <>
      <FaqJsonLd items={items} />
      <PageHero
        title="Perguntas Frequentes"
        description="Reunimos as dúvidas mais comuns. Não encontrou a sua? Fale com a advogada."
        breadcrumb={[{ label: "Perguntas Frequentes" }]}
      />

      <Section>
        <FaqAccordion items={items} />

        <div className="mx-auto mt-12 max-w-3xl rounded-xl bg-surface p-8 text-center">
          <h2 className="font-serif text-2xl font-semibold text-navy-800">
            Ainda com dúvidas?
          </h2>
          <p className="mt-2 text-muted">Tire suas dúvidas diretamente com a Dra. Letícia Leone.</p>
          <ButtonLink href={whatsappLink()} external variant="primary" size="lg" className="mt-6">
            <Icon name="whatsapp" className="h-5 w-5" />
            Falar pelo WhatsApp
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
