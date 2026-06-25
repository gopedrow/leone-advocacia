import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/public/ContactForm";
import { site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Dra. Letícia Leone. Atendimento por WhatsApp, formulário e e-mail para casos de Direito da Saúde.",
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        title="Fale com a Advogada"
        description="Conte sua situação. A análise é sigilosa e individualizada."
        breadcrumb={[{ label: "Contato" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-navy-800">
              Envie sua mensagem
            </h2>
            <p className="mt-2 text-muted">Retornaremos o mais breve possível.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-emerald-600 p-6 text-white transition-colors hover:bg-emerald-700"
            >
              <Icon name="whatsapp" className="h-8 w-8" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-emerald-50">Atendimento rápido e direto</p>
              </div>
            </a>

            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="font-semibold text-navy-800">Canais</h3>
              <ul className="mt-4 space-y-3 text-sm text-navy-700">
                <li className="flex items-center gap-3">
                  <Icon name="chat" className="h-5 w-5 text-petrol-500" />
                  {site.contact.phone}
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="document" className="h-5 w-5 text-petrol-500" />
                  {site.contact.email}
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="hospital" className="mt-0.5 h-5 w-5 shrink-0 text-petrol-500" />
                  <span>
                    {site.contact.address.street}
                    <br />
                    {site.contact.address.city}/{site.contact.address.state} — {site.contact.address.zip}
                  </span>
                </li>
                <li className="pt-1 text-muted">{site.contact.hours}</li>
              </ul>
            </div>

            <div className="rounded-xl bg-navy-50 p-6 text-sm text-navy-700">
              <p className="font-medium">Envio preliminar de documentos</p>
              <p className="mt-1 text-muted">
                Tenha em mãos prescrição médica, negativa do plano e documentos pessoais — isso
                agiliza a análise do seu caso.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
