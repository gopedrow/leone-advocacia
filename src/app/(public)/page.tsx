import Link from "next/link";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LegalServiceJsonLd } from "@/components/seo/JsonLd";
import { site, whatsappLink } from "@/config/site";
import { demands, patientRights, steps, differentials, stats, about } from "@/config/content";

export default function HomePage() {
  return (
    <>
      <LegalServiceJsonLd />
      <Hero />
      <Demands />
      <PatientRights />
      <About />
      <HowItWorks />
      <Differentials />
      <Testimonials />
      <FinalCta />
    </>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-800 text-white">
      {/* Elementos gráficos discretos: saúde + proteção + justiça */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-petrol-400 blur-3xl" />
      </div>

      {/* Foto integrada ao fundo — ancorada à direita, esfumada nas bordas
          para se fundir ao azul-marinho do hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[80%] lg:w-[62%]"
      >
        <Image
          src="/images/advogada-hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-top"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 28%, #000 62%), linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%), linear-gradient(to left, transparent 0%, #000 12%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 28%, #000 62%), linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%), linear-gradient(to left, transparent 0%, #000 12%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      </div>

      {/* Véu navy (esquerda → direita) garante leitura do texto sobre a foto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-800 via-navy-800/80 to-transparent lg:via-navy-800/35"
      />

      <Container className="relative py-20 lg:py-28">
        <div className="max-w-xl">
          <Badge className="bg-white/10 text-emerald-100">
            {site.tagline} • {site.oab}
          </Badge>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Defendendo o seu direito à saúde com segurança jurídica e atendimento humanizado.
          </h1>
          <p className="mt-6 max-w-lg font-serif text-lg font-normal leading-relaxed text-navy-100">
            {site.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contato" variant="gold" size="lg">
              Agendar Atendimento
            </ButtonLink>
            <ButtonLink
              href="/#pacientes"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Conhecer Meus Direitos
            </ButtonLink>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-navy-200">
            <Icon name="shield" className="h-5 w-5 text-emerald-300" />
            Atendimento sigiloso • Análise individualizada do seu caso
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────── Demandas ─────────────────────── */
function Demands() {
  return (
    <Section className="bg-surface">
      <SectionHeading
        eyebrow="Como podemos ajudar"
        title="Principais demandas que resolvemos"
        description="Atuação especializada nas situações mais frequentes enfrentadas por pacientes e consumidores de planos de saúde."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {demands.map((d) => (
          <Card key={d.slug} className="flex flex-col">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
              <Icon name={d.icon} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-navy-800">{d.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{d.description}</p>
            <Link
              href="/contato"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-petrol-600 hover:text-petrol-700"
            >
              Avaliar meu caso
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── Direitos do Paciente ─────────────────── */
function PatientRights() {
  return (
    <Section id="pacientes" className="scroll-mt-24">
      <SectionHeading
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
      <div className="mt-10 text-center">
        <ButtonLink href="/faq" variant="outline" size="lg">
          Ver perguntas frequentes
        </ButtonLink>
      </div>
    </Section>
  );
}

/* ───────────────────────── Sobre ──────────────────────── */
function About() {
  return (
    <Section id="sobre" className="scroll-mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy-50 ring-1 ring-line">
            <Image
              src="/images/advogada-sobre.jpg"
              alt={`${site.lawyerName} no escritório`}
              fill
              sizes="(max-width: 1024px) 90vw, 28rem"
              className="object-cover"
            />
            <div className="absolute inset-0 -z-10 grid place-items-center bg-navy-100 text-center text-navy-500">
              <span className="px-6 text-sm">/public/images/advogada-sobre.jpg</span>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Sobre a advogada"
            title={site.lawyerName}
          />
          <p className="mt-4 text-lg leading-relaxed text-muted">{about.intro}</p>
          {about.bio.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <p className="mt-6 text-sm font-medium text-petrol-600">{site.oab}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl font-semibold text-petrol-600">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────── Como funciona ───────────────────── */
function HowItWorks() {
  return (
    <Section className="bg-navy-800 text-white">
      <SectionHeading
        eyebrow="Atendimento"
        title="Como funciona o atendimento"
        description="Um processo claro e acompanhado de perto, do primeiro contato ao resultado."
        className="[&_h2]:text-white [&_p]:text-navy-100"
      />
      <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 font-serif text-lg font-semibold text-navy-900">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-200">{s.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ────────────────────── Diferenciais ──────────────────── */
function Differentials() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Por que a Leone Advocacia"
        title="Nossos diferenciais"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {differentials.map((d) => (
          <div key={d.title} className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon name={d.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-navy-800">{d.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────── Depoimentos ───────────────────── */
function Testimonials() {
  // Área preparada para avaliações e casos de sucesso (alimentável depois).
  const placeholders = [
    "Atendimento atencioso e ágil. Conseguimos a liberação do tratamento por liminar.",
    "Profissionalismo e transparência do início ao fim do processo.",
    "Explicação clara de cada etapa. Recomendo a todos que precisam.",
  ];
  return (
    <Section className="bg-surface">
      <SectionHeading
        eyebrow="Depoimentos"
        title="O que dizem nossos clientes"
        description="Espaço reservado para avaliações e casos de sucesso (substitua pelos depoimentos reais)."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {placeholders.map((t, i) => (
          <Card key={i}>
            <div className="flex gap-1 text-gold-500" aria-label="5 de 5 estrelas">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-navy-700">&ldquo;{t}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-muted">Cliente — [PREENCHER]</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── CTA ────────────────────────── */
function FinalCta() {
  return (
    <Section className="bg-gradient-to-br from-petrol-600 to-navy-800 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          Precisa garantir seu tratamento ou medicamento?
        </h2>
        <p className="mt-4 text-lg text-navy-100">
          Entre em contato agora. Analisamos seu caso com sigilo e indicamos o melhor caminho.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={whatsappLink()} external variant="gold" size="lg">
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
  );
}
