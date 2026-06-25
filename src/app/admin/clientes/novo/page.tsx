import { requireAdmin } from "@/lib/auth/session";
import { PageTitle } from "@/components/dashboard/StatCard";
import { ClientForm } from "@/components/admin/ClientForm";
import { createClient } from "../actions";

export default async function NovoClientePage() {
  await requireAdmin();
  return (
    <>
      <PageTitle
        title="Novo cliente"
        subtitle="Cadastre o cliente e defina o login (e-mail) e a senha inicial de acesso."
      />
      <ClientForm action={createClient} mode="create" />
    </>
  );
}
