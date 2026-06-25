import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-petrol-500">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl font-semibold text-navy-800 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 font-serif text-lg font-normal leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
