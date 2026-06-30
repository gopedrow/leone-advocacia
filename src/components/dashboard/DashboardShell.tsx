import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LogoutButton } from "./LogoutButton";

export type NavItem = { label: string; href: string };

export function DashboardShell({
  nav,
  user,
  areaLabel,
  children,
}: {
  nav: NavItem[];
  user: { name: string; role: string };
  areaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-line bg-white lg:flex lg:flex-col">
        <div className="border-b border-line p-5">
          <Logo />
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-petrol-500">
            {areaLabel}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label={areaLabel}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <p className="text-sm font-medium text-navy-800">{user.name}</p>
          <p className="text-xs text-muted">{user.role === "ADMIN" ? "Administrador(a)" : "Cliente"}</p>
          <LogoutButton className="mt-3 text-sm font-medium text-petrol-600 hover:text-petrol-700" />
        </div>
      </aside>

      <div className="flex flex-col">
        {/* Topbar (mobile) */}
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4 lg:hidden">
          <Logo />
          <LogoutButton className="text-sm font-medium text-petrol-600" />
        </header>

        {/* Nav mobile horizontal */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
