import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { site, navMain, whatsappLink } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-navy-800 text-navy-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
            {site.description}
          </p>
          <p className="mt-4 text-sm text-navy-300">
            {site.lawyerName} — {site.oab}
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navMain.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-navy-200 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Atendimento
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-200">
            <li>{site.contact.phone}</li>
            <li>{site.contact.email}</li>
            <li>
              {site.contact.address.street}
              <br />
              {site.contact.address.city}/{site.contact.address.state} — {site.contact.address.zip}
            </li>
            <li className="pt-1 text-navy-300">{site.contact.hours}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Fale agora
          </h3>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm text-navy-200 hover:text-white"
          >
            @leoneadvocaciago
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Todos os direitos reservados.</p>
          <p className="max-w-xl">
            Conteúdo de caráter informativo, sem constituir aconselhamento jurídico.
            Cada caso deve ser analisado individualmente. Respeitamos a LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}
