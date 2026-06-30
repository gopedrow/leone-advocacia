/**
 * Configuração central do site.
 * ➜ Edite este arquivo para atualizar nome, contatos, menu e textos institucionais.
 *   Os valores marcados com [PREENCHER] devem ser substituídos pelos dados reais.
 */

export const site = {
  name: "Leone Advocacia",
  lawyerName: "Dra. Letícia Leone",
  lawyerShortName: "Letícia Leone",
  oab: "OAB/GO 59.154",
  tagline: "Direito da Saúde",
  description:
    "Atuação especializada em ações contra planos de saúde, fornecimento de medicamentos, tratamentos de alto custo e garantia dos direitos dos pacientes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt-BR",

  contact: {
    phone: "(62) 99871-0007",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5562998710007",
    email: "leticialeoneadv@gmail.com",
    address: {
      street: "Av. Edmundo P. de Abreu, 387 — Setor Bela Vista (Cond. Portal da Cidade)",
      city: "Goiânia",
      state: "GO",
      zip: "74823-030",
    },
    hours: "Seg. a Sex., das 9h às 18h",
  },

  social: {
    instagram: "https://www.instagram.com/leoneadvocaciago/",
  },
} as const;

/** Mensagem padrão pré-preenchida ao abrir o WhatsApp. */
export const whatsappLink = (
  message = "Olá! Gostaria de falar com a advogada sobre um caso de Direito da Saúde."
) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;

/** Itens do menu principal (Header). */
export const navMain = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Jurisprudência", href: "/jurisprudencia" },
  { label: "Dúvidas", href: "/faq" },
  { label: "Contato", href: "/contato" },
] as const;

/** Link da Área do Cliente (destacado à parte no Header). */
export const clientAreaHref = "/login";
