import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";

type Params = { params: Promise<{ slug: string }> };

async function getArticle(slug: string) {
  return safeQuery(
    () =>
      prisma.article.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { category: true, author: { select: { name: true } } },
      }),
    null
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Artigo não encontrado" };
  return {
    title: a.title,
    description: a.excerpt ?? undefined,
    openGraph: { title: a.title, description: a.excerpt ?? undefined, type: "article" },
  };
}

export default async function ArtigoPage({ params }: Params) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  return (
    <>
      <PageHero
        title={a.title}
        breadcrumb={[
          { label: "Conteúdo Jurídico", href: "/conteudo" },
          { label: a.category?.name ?? "Artigo" },
        ]}
      />
      <Section>
        <article className="mx-auto max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {a.category && <Badge>{a.category.name}</Badge>}
            <span>{a.author?.name}</span>
            {a.publishedAt && (
              <time dateTime={a.publishedAt.toISOString()}>
                {a.publishedAt.toLocaleDateString("pt-BR")}
              </time>
            )}
            <span>· {a.readMinutes} min de leitura</span>
          </div>

          <div className="prose-leone mt-8 space-y-4 leading-relaxed text-navy-700">
            {a.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <hr className="my-10 border-line" />
          <ShareLinks title={a.title} />
        </article>
      </Section>
    </>
  );
}

function ShareLinks({ title }: { title: string }) {
  const text = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-4 text-sm text-muted">
      <span className="font-medium">Compartilhar:</span>
      <a
        className="hover:text-petrol-600"
        href={`https://wa.me/?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
      <a
        className="hover:text-petrol-600"
        href={`https://www.linkedin.com/sharing/share-offsite/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </div>
  );
}
