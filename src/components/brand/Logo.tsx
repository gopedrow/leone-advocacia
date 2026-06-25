import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";
import { BrandMark } from "./BrandMark";

/** Logotipo tipográfico (sem dependência de imagem). */
export function Logo({
  className,
  tone = "dark",
  showTagline = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  showTagline?: boolean;
}) {
  const main = tone === "light" ? "text-white" : "text-navy-800";
  const sub = tone === "light" ? "text-petrol-100" : "text-petrol-500";
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label={`${site.name} — Início`}>
      <BrandMark className={cn("h-10 w-10 shrink-0", main)} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-lg font-semibold tracking-tight", main)}>
          Leone <span className="font-normal">Advocacia</span>
        </span>
        {showTagline && (
          <span className={cn("mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em]", sub)}>
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
