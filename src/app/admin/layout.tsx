import { requireAdmin } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Processos", href: "/admin/processos" },
  { label: "Assinaturas", href: "/admin/assinaturas" },
  { label: "Prazos", href: "/admin/prazos" },
  { label: "Conteúdo", href: "/admin/conteudo" },
  { label: "Leads", href: "/admin/leads" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <DashboardShell nav={nav} user={user} areaLabel="Painel Administrativo">
      {children}
    </DashboardShell>
  );
}
