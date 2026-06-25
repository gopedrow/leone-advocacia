import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Cinzel auto-hospedada (arquivo variável local, pesos 400–900).
const cinzel = localFont({
  src: "../fonts/Cinzel-VariableFont_wght.ttf",
  variable: "--font-cinzel",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Direito da Saúde",
    "advogada plano de saúde",
    "negativa de cobertura",
    "medicamento de alto custo",
    "direitos do paciente",
    "Goiânia",
  ],
  authors: [{ name: site.lawyerName }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
