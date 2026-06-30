import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Botão circular com ícone de documento — atalho para abrir a galeria de
 * modelos do editor de peças (petições, recursos, contratos…). Usado ao
 * lado de "Novo processo" e em cada movimentação da linha do tempo.
 */
export function DocIconButton({
  href,
  title = "Gerar petição / documento",
  size = "md",
  className,
}: {
  href: string;
  title?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const iconDim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700 ring-1 ring-inset ring-petrol-100 transition-colors hover:bg-petrol-100 hover:text-petrol-800",
        dim,
        className
      )}
    >
      <Icon name="document" className={iconDim} />
    </Link>
  );
}
