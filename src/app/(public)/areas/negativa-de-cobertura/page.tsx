import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Negativa de cobertura: o que fazer quando o plano de saúde diz não",
  description:
    "Negativas abusivas de planos de saúde podem ser revertidas, muitas vezes por liminar em poucos dias. Entenda seus direitos diante de uma recusa de exame, cirurgia ou internação.",
};

/* Conteúdo de caráter informativo (ver disclaimer ao final). */

const criterios = [
  {
    title: "Prescrição do médico assistente",
    desc: "O tratamento deve ser indicado pelo seu próprio médico ou dentista, com justificativa clínica.",
  },
  {
    title: "Não ter sido negado pela ANS",
    desc: "A agência não pode ter recusado expressamente esse tratamento, nem estar com a análise pendente.",
  },
  {
    title: "Ausência de alternativa no rol",
    desc: "Não pode existir outro tratamento já listado que resolva o seu caso de forma adequada — ou é preciso comprovar por que ele não serve para você.",
  },
  {
    title: "Comprovação científica de eficácia",
    desc: "Deve haver evidência científica robusta de que o tratamento funciona e é seguro (medicina baseada em evidências).",
  },
  {
    title: "Registro na Anvisa",
    desc: "O medicamento ou produto precisa ter registro válido na agência sanitária brasileira.",
  },
];

const passos = [
  {
    title: "Exija a negativa por escrito",
    desc: "A operadora é obrigada a informar o motivo da recusa por escrito. Esse documento é a sua principal prova.",
  },
  {
    title: "Guarde toda a documentação médica",
    desc: "Pedido do médico, relatório clínico detalhado explicando por que aquele tratamento é necessário, exames e, se possível, estudos científicos que respaldem a indicação.",
  },
  {
    title: "Registre reclamação na ANS",
    desc: "O canal da ANS pode resolver administrativamente e gera um registro formal da recusa, útil caso o caso vá à Justiça.",
  },
  {
    title: "Procure orientação jurídica",
    desc: "Um advogado avalia se a negativa é abusiva e se o seu caso comporta pedido de liminar. Em situações urgentes, cada dia conta.",
  },
  {
    title: 'Não se conforme com o primeiro "não"',
    desc: "Muitas negativas são revertidas. O fato de a operadora ter recusado não significa que ela esteja certa.",
  },
];

const faq = [
  {
    id: "tratamento-medico",
    question: "O plano pode negar um tratamento indicado pelo meu médico?",
    answer:
      "Em regra, não. O plano pode definir quais doenças cobre, mas a escolha do tratamento adequado é do médico. Negar tratamento prescrito, dentro dos critérios legais, costuma ser considerado abusivo pelos tribunais.",
  },
  {
    id: "fora-do-rol",
    question: '"Não está no rol da ANS" é motivo válido para a recusa?',
    answer:
      'Não é mais um motivo absoluto. Desde a Lei 14.454/2022 e a decisão do STF de 2025, o plano pode ser obrigado a cobrir tratamentos fora do rol, desde que cumpridos os cinco critérios cumulativos. A recusa precisa de fundamentação técnica, não apenas da frase "fora do rol".',
  },
  {
    id: "tempo-liminar",
    question: "Quanto tempo demora uma liminar?",
    answer:
      "Depende do caso e do tribunal, mas em situações de urgência decisões liminares podem sair em poucos dias, e às vezes em horas. Por isso documentar bem a urgência é decisivo.",
  },
  {
    id: "reembolso",
    question: "Posso pedir o dinheiro de volta se paguei o tratamento por conta própria?",
    answer:
      "Sim. Se a negativa foi ilícita e você arcou com o custo, é possível pleitear o reembolso — e, quando a recusa era indevida, esse reembolso tende a ser integral, e não limitado às tabelas do plano. Guarde todos os comprovantes de pagamento.",
  },
  {
    id: "dano-moral",
    question: "Vou conseguir indenização por dano moral?",
    answer:
      "Não é automático. Pela tese do STJ de 2026, é preciso demonstrar um impacto que vá além do aborrecimento — risco à vida, sofrimento relevante, conduta abusiva reiterada, entre outros. Cada caso é avaliado individualmente.",
  },
];

const fontes: { label: string; href?: string }[] = [
  {
    label: "Lei 14.454/2022 — cobertura fora do rol da ANS (altera a Lei 9.656/1998)",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14454.htm",
  },
  {
    label: "Lei 9.656/1998 — Lei dos Planos de Saúde",
    href: "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm",
  },
  {
    label: "STF — ADI 7.265 (julgada em 18/09/2025): constitucionalidade da Lei 14.454/2022 e os cinco critérios cumulativos",
    href: "https://portal.stf.jus.br",
  },
  {
    label: "STJ — jurisprudência sobre planos de saúde, urgência/emergência, carência e temas repetitivos",
    href: "https://www.stj.jus.br",
  },
  {
    label: "STJ — Súmulas 469 e 608 (aplicação do Código de Defesa do Consumidor aos planos de saúde)",
    href: "https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/Sumulas.aspx",
  },
  {
    label: "Código de Processo Civil (Lei 13.105/2015), art. 300 — tutela de urgência (liminar)",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm",
  },
  {
    label: "ANS — Agência Nacional de Saúde Suplementar (canais e rol de procedimentos)",
    href: "https://www.gov.br/ans/pt-br",
  },
];

const waMessage =
  "Olá! Tive uma negativa de cobertura do meu plano de saúde e gostaria de avaliar meu caso.";

/* Pequenos blocos reutilizáveis */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 leading-relaxed text-navy-700">
      <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </li>
  );
}

export default function NegativaDeCoberturaPage() {
  return (
    <>
      <PageHero
        title="O plano negou seu exame, cirurgia ou internação?"
        description="Negativas abusivas podem ser revertidas — muitas vezes em poucos dias, por decisão liminar. Entenda o que a lei e os tribunais garantem a você neste momento."
        breadcrumb={[{ label: "Áreas de atuação" }, { label: "Negativa de cobertura" }]}
      />

      {/* Introdução */}
      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-navy-700">
          <p>
            Receber um &ldquo;não&rdquo; do plano de saúde no meio de um tratamento é mais do que um problema
            burocrático. Costuma chegar justamente quando você está fragilizado, com pressa, e dependendo de
            uma autorização para seguir adiante. A boa notícia é que <strong>nem toda negativa é válida</strong> —
            e a lei brasileira oferece caminhos concretos para reverter recusas indevidas, inclusive de forma
            rápida quando há urgência.
          </p>
          <p>
            Este conteúdo reúne o que mudou recentemente nas leis e nas decisões dos tribunais superiores para
            explicar, em linguagem simples, quais são os seus direitos e o que fazer diante de uma negativa.
          </p>
        </div>
      </Section>

      {/* Você é consumidor */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="O ponto de partida"
            title="Você é um consumidor — e isso muda tudo"
          />
          <p className="mt-6 leading-relaxed text-navy-700">
            A relação entre você e a operadora do plano é protegida pelo{" "}
            <strong>Código de Defesa do Consumidor</strong>. Isso já está pacificado pelo Superior Tribunal de
            Justiça (Súmulas 469 e 608). Na prática, significa que:
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>
              O contrato deve ser interpretado <strong>sempre da forma mais favorável a você</strong>, e não da
              operadora.
            </Bullet>
            <Bullet>
              Cláusulas que colocam o consumidor em desvantagem exagerada são <strong>nulas</strong> — não valem,
              mesmo que estejam escritas no contrato que você assinou.
            </Bullet>
            <Bullet>
              A operadora presta um serviço essencial e tem o dever de agir com transparência e boa-fé.
            </Bullet>
          </ul>
          <p className="mt-6 leading-relaxed text-navy-700">
            Outro ponto importante consolidado pelo STJ: o plano{" "}
            <strong>
              pode definir quais doenças cobre, mas não pode escolher qual tratamento você vai receber para
              aquela doença
            </strong>
            . Essa decisão é do seu médico.
          </p>
        </div>
      </Section>

      {/* Fora do rol */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="A grande mudança"
            title="O &ldquo;fora do rol da ANS&rdquo; deixou de ser uma muralha"
          />
          <p className="mt-6 leading-relaxed text-navy-700">
            Por muitos anos, a recusa mais comum vinha embalada na mesma frase:{" "}
            <em>&ldquo;esse procedimento não está no rol da ANS&rdquo;</em>. O rol é a lista de coberturas mínimas
            obrigatórias organizada pela Agência Nacional de Saúde Suplementar.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Esse argumento perdeu força. A <strong>Lei 14.454/2022</strong> estabeleceu que o rol é uma{" "}
            <strong>referência mínima</strong>, e não um limite fechado. E, em setembro de 2025, o{" "}
            <strong>Supremo Tribunal Federal</strong>, no julgamento da ADI 7.265, confirmou que essa lei é
            constitucional. Ou seja:{" "}
            <strong>o plano pode, sim, ser obrigado a cobrir tratamentos que não estão na lista oficial</strong>.
          </p>

          <div className="my-8 rounded-r-xl border-l-4 border-gold-500 bg-gold-500/10 p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-600">
              Atenção — não é automático
            </p>
            <p className="leading-relaxed text-navy-700">
              O STF não abriu uma porta livre. Para que o plano seja obrigado a custear um tratamento{" "}
              <strong>fora do rol</strong>, é preciso preencher <strong>cinco critérios ao mesmo tempo</strong>{" "}
              (cumulativos). Apresentar só a receita do médico, hoje, normalmente não basta.
            </p>
          </div>

          <h3 className="mt-8 font-serif text-xl font-semibold text-navy-800">
            Os 5 critérios fixados pelo STF
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {criterios.map((c, i) => (
              <div
                key={c.title}
                className="relative rounded-xl border border-line bg-surface p-5 pl-14 shadow-soft"
              >
                <span className="absolute left-5 top-5 font-serif text-lg font-semibold text-gold-600">
                  {i + 1}
                </span>
                <b className="block font-semibold text-navy-800">{c.title}</b>
                <small className="mt-1 block text-sm leading-relaxed text-muted">{c.desc}</small>
              </div>
            ))}
          </div>

          <p className="mt-8 leading-relaxed text-navy-700">
            Por isso, reunir <strong>laudos, relatórios médicos detalhados e estudos científicos</strong> faz
            enorme diferença. A falta dessa documentação é, segundo o próprio STF, o erro que mais derruba
            pedidos.
          </p>
        </div>
      </Section>

      {/* Negativas abusivas */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="Quando o &ldquo;não&rdquo; não vale"
            title="Negativas que os tribunais consideram abusivas"
          />
          <p className="mt-6 leading-relaxed text-navy-700">
            A jurisprudência atual do STJ e dos tribunais estaduais já considera <strong>abusivas</strong>, entre
            outras, as seguintes recusas:
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>
              <strong>Negar atendimento de urgência ou emergência</strong> alegando carência. O STJ entende que,
              diante de risco à vida ou à saúde, a carência não pode ser usada como barreira.
            </Bullet>
            <Bullet>
              <strong>Excluir próteses, órteses, exames, medicamentos ou fisioterapia</strong> que estejam
              diretamente ligados a um tratamento coberto pelo plano.
            </Bullet>
            <Bullet>
              <strong>Limitar o número de sessões de terapia</strong> (psicologia, fonoaudiologia, fisioterapia,
              terapia ocupacional) para pacientes com Transtorno do Espectro Autista (TEA) ou outros transtornos
              do desenvolvimento.
            </Bullet>
            <Bullet>
              <strong>Recusar medicamentos prescritos</strong>, inclusive de uso off-label, quando há respaldo
              científico e indicação médica fundamentada.
            </Bullet>
            <Bullet>
              <strong>Negar tratamento apenas por não estar no rol</strong>, quando os critérios da Lei
              14.454/2022 e do STF estão atendidos.
            </Bullet>
          </ul>

          <div className="mt-8 rounded-r-xl border-l-4 border-emerald-500 bg-emerald-50 p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              O que isso garante a você
            </p>
            <p className="leading-relaxed text-navy-700">
              Se a sua negativa se encaixa em uma dessas situações, há forte base legal para exigir a cobertura —
              e, quando necessário, levar o caso à Justiça com boas chances de êxito.
            </p>
          </div>
        </div>
      </Section>

      {/* Liminar (destaque escuro) */}
      <Section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-gold-400">
            A ferramenta da urgência
          </p>
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            A liminar: uma resposta em poucos dias
          </h2>
          <p className="mt-5 leading-relaxed text-navy-100">
            Quando a saúde não pode esperar, o caminho judicial mais importante é a{" "}
            <strong className="text-white">tutela de urgência</strong> (o pedido de liminar), prevista no artigo
            300 do Código de Processo Civil. Ela permite que um juiz{" "}
            <strong className="text-white">determine ao plano que autorize o tratamento imediatamente</strong>,
            antes mesmo do fim do processo.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-400">
                O que o juiz avalia
              </h4>
              <p className="mt-2 leading-relaxed text-navy-100">
                Que o seu direito é provável (a recusa parece indevida) e que há perigo na demora — risco à sua
                saúde se o tratamento atrasar.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-400">
                O resultado prático
              </h4>
              <p className="mt-2 leading-relaxed text-navy-100">
                Decisões liminares costumam sair em <strong className="text-white">poucos dias</strong>, às vezes
                em horas, obrigando a operadora a liberar a internação, o exame ou a cirurgia.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Dano moral */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="E a indenização?"
            title="Negativa indevida nem sempre gera dano moral"
          />
          <p className="mt-6 leading-relaxed text-navy-700">
            Aqui houve uma novidade importante. Em 2026, o STJ fixou tese definindo que{" "}
            <strong>
              a simples recusa indevida, por si só, não gera automaticamente direito a indenização por dano
              moral
            </strong>
            .
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Para receber indenização, é preciso demonstrar algo a mais do que o aborrecimento — por exemplo:
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>
              Houve <strong>risco real à vida</strong> ou agravamento do quadro de saúde.
            </Bullet>
            <Bullet>
              A negativa contrariou <strong>cláusula claramente prevista</strong> no contrato.
            </Bullet>
            <Bullet>
              Houve <strong>sofrimento relevante e comprovado</strong>, especialmente em situações de urgência ou
              emergência.
            </Bullet>
            <Bullet>
              A operadora tem <strong>conduta abusiva e reiterada</strong>.
            </Bullet>
          </ul>
          <p className="mt-6 leading-relaxed text-navy-700">
            Em casos de paciente especialmente vulnerável — como uma criança com TEA que tem o tratamento
            interrompido abruptamente —, o dano moral pode ser presumido a partir das circunstâncias. O ponto
            central é:{" "}
            <strong>
              o direito ao tratamento é uma coisa; a indenização é outra, e depende de prova.
            </strong>
          </p>
        </div>
      </Section>

      {/* Passos */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="Mãos à obra"
            title="O que fazer ao receber uma negativa"
          />
          <ol className="mt-10">
            {passos.map((s, i) => (
              <li
                key={s.title}
                className="relative border-t border-line py-6 pl-16 first:border-t-0"
              >
                <span className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full bg-gold-500 font-serif font-semibold text-navy-900">
                  {i + 1}
                </span>
                <b className="block text-lg font-semibold text-navy-800">{s.title}</b>
                <span className="mt-1 block leading-relaxed text-muted">{s.desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow="Perguntas frequentes" title="Dúvidas comuns" />
        <div className="mt-10">
          <FaqAccordion items={faq} />
        </div>
      </Section>

      {/* Fontes + disclaimer */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="left" title="Em que este conteúdo se baseia" />
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
            {fontes.map((f) => (
              <li key={f.label} className="flex gap-3">
                <Icon name="document" className="mt-0.5 h-4 w-4 shrink-0 text-petrol-500" />
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-petrol-600 underline decoration-line underline-offset-2 hover:text-petrol-700"
                  >
                    {f.label}
                  </a>
                ) : (
                  <span>{f.label}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-xl border border-line bg-white p-6 text-sm leading-relaxed text-muted">
            Este material tem finalidade exclusivamente informativa e não substitui a orientação de um advogado.
            Cada negativa tem particularidades próprias — documentos, prazos e contexto clínico — que precisam
            ser analisadas individualmente. Se você está diante de uma recusa, especialmente com urgência de
            saúde, busque orientação jurídica o quanto antes.
          </p>
        </div>
      </Section>

      {/* CTA final — WhatsApp */}
      <Section className="bg-gradient-to-br from-petrol-600 to-navy-800 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Teve um procedimento negado pelo plano?
          </h2>
          <p className="mt-4 text-lg text-navy-100">
            Analisamos sua negativa com sigilo e indicamos o melhor caminho — inclusive a possibilidade de
            liminar quando há urgência.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={whatsappLink(waMessage)} external variant="gold" size="lg">
              <Icon name="whatsapp" className="h-5 w-5" />
              Falar pelo WhatsApp
            </ButtonLink>
            <ButtonLink
              href="/contato"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Enviar mensagem
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
