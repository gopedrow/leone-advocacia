import { requireUser } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { label: "Visão geral", href: "/area-cliente" },
  { label: "Meus processos", href: "/area-cliente/processos" },
  { label: "Documentos", href: "/area-cliente/documentos" },
  { label: "Assinaturas", href: "/area-cliente/assinaturas" },
  { label: "Financeiro", href: "/area-cliente/financeiro" },
  { label: "Mensagens", href: "/area-cliente/mensagens" },
];

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <DashboardShell nav={nav} user={user} areaLabel="Área do Cliente">
      {children}
    </DashboardShell>
  );
}
