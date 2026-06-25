import { cn } from "@/lib/cn";

/**
 * Logomarca do escritório (monograma "A" dentro de um quadro), recriada em SVG.
 * Usa `currentColor`, então herda a cor do texto — fica escura na navbar clara
 * e branca no rodapé escuro. Ajuste o tamanho via className (ex.: "h-10 w-10").
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-10 w-10", className)}
      role="img"
      aria-label="Leone Advocacia"
      fill="none"
      stroke="currentColor"
    >
      {/* Quadro externo */}
      <rect x="9" y="9" width="82" height="82" strokeWidth="3" />
      {/* "A" estilizado com recorte na perna esquerda */}
      <g strokeWidth="6.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* perna direita (diagonal contínua) */}
        <path d="M50 25 L72 79" />
        {/* perna esquerda — parte superior */}
        <path d="M50 25 L41 47" />
        {/* perna esquerda — parte inferior (após o recorte) */}
        <path d="M36 59 L28 79" />
        {/* travessão */}
        <path d="M37 63 L63 63" />
      </g>
    </svg>
  );
}
