import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-navy-200">
        <li>
          <Link href="/" className="hover:text-white">
            Início
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden className="text-navy-400">
              /
            </span>
            {c.href ? (
              <Link href={c.href} className="hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span className="text-white" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: Crumb[];
}) {
  return (
    <section className="bg-navy-800 text-white">
      <Container className="py-14 sm:py-16">
        {breadcrumb && (
          <div className="mb-5">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl font-serif text-lg font-normal leading-relaxed text-navy-100">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
