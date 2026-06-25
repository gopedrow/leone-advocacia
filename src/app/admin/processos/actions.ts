"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { processSchema, movementSchema } from "@/lib/validation";

export type ProcessFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const orNull = (v?: string | null) => (v && v.trim() ? v.trim() : null);

async function meta() {
  const h = await headers();
  return { ip: h.get("x-forwarded-for"), userAgent: h.get("user-agent") };
}

function parseProcess(formData: FormData) {
  const g = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v : undefined;
  };
  return {
    number: g("number"),
    title: g("title"),
    clientId: g("clientId"),
    court: g("court"),
    jurisdiction: g("jurisdiction"),
    className: g("className"),
    subject: g("subject"),
    status: g("status") || "",
    distributedAt: g("distributedAt"),
  };
}

function processData(d: Record<string, unknown>) {
  return {
    title: (d.title as string).trim(),
    clientId: d.clientId as string,
    court: orNull(d.court as string),
    jurisdiction: orNull(d.jurisdiction as string),
    className: orNull(d.className as string),
    subject: orNull(d.subject as string),
    status: (d.status ? d.status : "ANALISE") as
      | "ANALISE" | "DISTRIBUIDO" | "EM_ANDAMENTO" | "RECURSO" | "SUSPENSO" | "ENCERRADO",
    distributedAt: d.distributedAt ? new Date(d.distributedAt as string) : null,
  };
}

export async function createProcess(
  _prev: ProcessFormState,
  formData: FormData
): Promise<ProcessFormState> {
  const admin = await requireAdmin();
  const parsed = processSchema.safeParse(parseProcess(formData));
  if (!parsed.success) {
    return { ok: false, message: "Verifique os campos.", errors: parsed.error.flatten().fieldErrors };
  }

  const exists = await prisma.process.findUnique({ where: { number: parsed.data.number.trim() } });
  if (exists) return { ok: false, message: "Já existe um processo com este número." };

  const proc = await prisma.process.create({
    data: { number: parsed.data.number.trim(), ...processData(parsed.data) },
  });
  await audit({ action: "PROCESS_CREATED", userId: admin.sub, entity: "Process", entityId: proc.id, ...(await meta()) });

  revalidatePath("/admin/processos");
  redirect(`/admin/processos/${proc.id}`);
}

export async function updateProcess(
  _prev: ProcessFormState,
  formData: FormData
): Promise<ProcessFormState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Processo inválido." };

  const parsed = processSchema.safeParse(parseProcess(formData));
  if (!parsed.success) {
    return { ok: false, message: "Verifique os campos.", errors: parsed.error.flatten().fieldErrors };
  }

  const other = await prisma.process.findFirst({
    where: { number: parsed.data.number.trim(), NOT: { id } },
  });
  if (other) return { ok: false, message: "Outro processo já usa este número." };

  await prisma.process.update({
    where: { id },
    data: { number: parsed.data.number.trim(), ...processData(parsed.data) },
  });
  await audit({ action: "PROCESS_UPDATED", userId: admin.sub, entity: "Process", entityId: id, ...(await meta()) });

  revalidatePath("/admin/processos");
  revalidatePath(`/admin/processos/${id}`);
  redirect("/admin/processos");
}

/** Adiciona uma movimentação e notifica o cliente. */
export async function addMovement(
  _prev: ProcessFormState,
  formData: FormData
): Promise<ProcessFormState> {
  const admin = await requireAdmin();
  const parsed = movementSchema.safeParse({
    processId: formData.get("processId"),
    date: formData.get("date"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Verifique os campos.", errors: parsed.error.flatten().fieldErrors };
  }

  const proc = await prisma.process.findUnique({ where: { id: parsed.data.processId } });
  if (!proc) return { ok: false, message: "Processo não encontrado." };

  await prisma.movement.create({
    data: {
      processId: parsed.data.processId,
      date: new Date(parsed.data.date),
      title: parsed.data.title.trim(),
      description: orNull(parsed.data.description),
    },
  });

  // Notifica o cliente sobre a nova movimentação.
  await prisma.notification.create({
    data: {
      userId: proc.clientId,
      type: "MOVEMENT",
      title: "Nova movimentação no seu processo",
      body: parsed.data.title.trim(),
      link: `/area-cliente/processos/${proc.id}`,
    },
  });

  await audit({ action: "MOVEMENT_ADDED", userId: admin.sub, entity: "Process", entityId: proc.id, ...(await meta()) });
  revalidatePath(`/admin/processos/${proc.id}`);
  return { ok: true, message: "Movimentação adicionada e cliente notificado." };
}

export async function deleteProcess(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.process.delete({ where: { id } });
  await audit({ action: "PROCESS_DELETED", userId: admin.sub, entity: "Process", entityId: id, ...(await meta()) });
  revalidatePath("/admin/processos");
  redirect("/admin/processos");
}
