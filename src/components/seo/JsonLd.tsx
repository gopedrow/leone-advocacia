import { site } from "@/config/site";

/** Schema.org — LegalService, para rich results de serviços jurídicos. */
export function LegalServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    description: site.description,
    url: site.url,
    areaServed: "BR",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.state,
      addressCountry: "BR",
    },
    founder: {
      "@type": "Person",
      name: site.lawyerName,
      jobTitle: "Advogada — Direito da Saúde",
    },
    knowsAbout: [
      "Direito da Saúde",
      "Planos de saúde",
      "Fornecimento de medicamentos",
      "Direitos do paciente",
    ],
    sameAs: [site.social.instagram],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
