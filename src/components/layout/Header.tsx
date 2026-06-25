"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { navMain, clientAreaHref, whatsappLink } from "@/config/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao trocar de rota.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled
          ? "border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
          : "border-transparent bg-white"
      )}
    >
      <nav className="container-page flex h-18 items-center justify-between gap-4" aria-label="Principal">
        <Logo showTagline={false} />

        {/* Menu desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navMain.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-petrol-600"
                      : "text-navy-700 hover:text-petrol-600"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={clientAreaHref}
            className="rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:text-petrol-600"
          >
            Cliente
          </Link>
          <ButtonLink href={whatsappLink()} external variant="primary" size="sm">
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </ButtonLink>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md text-navy-800 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {navMain.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-base font-medium text-navy-800 hover:bg-navy-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={clientAreaHref}
                className="block rounded-md px-3 py-3 text-base font-medium text-navy-800 hover:bg-navy-50"
              >
                Área do Cliente
              </Link>
            </li>
            <li className="px-3 pt-2">
              <ButtonLink href={whatsappLink()} external variant="primary" size="md" className="w-full">
                <Icon name="whatsapp" className="h-4 w-4" />
                Falar com a Advogada
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
