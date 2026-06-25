/**
 * Ícones SVG inline (stroke), leves e sem dependências externas.
 * Estilo "linha" alinhado ao conceito Direito + Saúde + Tecnologia.
 */
import { cn } from "@/lib/cn";

type IconProps = { className?: string };

const base = "h-6 w-6";
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const icons = {
  shield: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  heart: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.6 12 20 12 20z" />
    </svg>
  ),
  pill: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M12 8v8" />
    </svg>
  ),
  scale: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M12 3v18M5 21h14M6 7h12" />
      <path d="M6 7l-3 6a3 3 0 0 0 6 0L6 7zM18 7l-3 6a3 3 0 0 0 6 0l-3-6z" />
    </svg>
  ),
  stethoscope: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M10 16v1a4 4 0 0 0 8 0v-2" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  ),
  document: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  ),
  hospital: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M4 21V8l8-4 8 4v13" />
      <path d="M10 21v-4h4v4M12 8v3M10.5 9.5h3" />
    </svg>
  ),
  ambulance: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
      <path d="M7 9v3M5.5 10.5h3" />
    </svg>
  ),
  refresh: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" />
    </svg>
  ),
  chat: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M4 12l5 5 11-11" />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  ),
  arrowRight: (p: IconProps) => (
    <svg className={cn(base, p.className)} {...common}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg className={cn(base, p.className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c1.7.6 1.7.4 2 .4a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = icons[name];
  return <C className={className} />;
}
