import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { site, whatsappLink } from "@/config/site";
import { about, stats } from "@/config/content";

export const metadata: Metadata = {
  title: "Sobre a advogada",
  description: `Conheça a trajetória de ${site.lawyerName}, advogada especializada em Direito da Saúde.`,
};

export default function SobrePage() {
  return (
    <>
      <PageHero
        title={`Sobre ${site.lawyerName}`}
        description="Autoridade técnica e atendimento humanizado na defesa do seu direito à saúde."
        breadcrumb={[{ label: "Sobre" }]}
      />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-navy-50 ring-1 ring-line">
            <Image
              src="/images/advogada-sobre.jpg"
              alt={site.lawyerName}
              fill
              sizes="(max-width: 1024px) 90vw, 32rem"
              className="object-cover"
            />
            <div className="absolute inset-0 -z-10 grid place-items-center bg-navy-100 text-center text-navy-500">
              <span className="px-6 text-sm">/public/images/advogada-sobre.jpg</span>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-muted">{about.intro}</p>
            {about.bio.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-navy-700">
                {p}
              </p>
            ))}
            <p className="mt-6 text-sm font-medium text-petrol-600">{site.oab}</p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
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

      <Section className="bg-surface">
        <div className="space-y-8">
          <Card>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-petrol-50 text-petrol-600">
              <Icon name="spark" />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-navy-800">Missão</h2>
            <p className="mt-3 leading-relaxed text-muted">{about.mission}</p>
          </Card>
          <Card>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon name="shield" />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-navy-800">Valores</h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2">
              {about.values.map((v) => (
                <li key={v.title} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-navy-800">{v.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{v.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <ButtonLink href={whatsappLink()} external variant="primary" size="lg">
            <Icon name="whatsapp" className="h-5 w-5" />
            Falar com a Advogada
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
