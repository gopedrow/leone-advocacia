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

/** Cadastra (ou atualiza) o prazo de uma movimentação. */
export async function setMovementDeadline(formData: FormData) {
  const admin = await requireAdmin();
  const movementId = String(formData.get("movementId") || "");
  const processId = String(formData.get("processId") || "");
  const title = String(formData.get("title") || "").trim();
  const dueDate = String(formData.get("dueDate") || "");
  if (!movementId || !dueDate) return;

  const mov = await prisma.movement.findUnique({ where: { id: movementId }, include: { process: true } });
  if (!mov) return;

  const data = {
    title: title || mov.title,
    dueDate: new Date(dueDate),
    processNumber: mov.process.number,
    movementId,
  };

  // Upsert do prazo vinculado à movimentação + tira a marca "sem prazo".
  await prisma.deadline.upsert({
    where: { movementId },
    create: data,
    update: { title: data.title, dueDate: data.dueDate },
  });
  await prisma.movement.update({ where: { id: movementId }, data: { noDeadline: false } });

  await audit({ action: "DEADLINE_SET", userId: admin.sub, entity: "Movement", entityId: movementId, ...(await meta()) });
  revalidatePath(`/admin/processos/${processId}`);
  revalidatePath("/admin/processos");
  revalidatePath("/admin/prazos");
}

/** Remove o prazo vinculado à movimentação (volta a ficar pendente). */
export async function clearMovementDeadline(formData: FormData) {
  const admin = await requireAdmin();
  const movementId = String(formData.get("movementId") || "");
  const processId = String(formData.get("processId") || "");
  if (!movementId) return;
  await prisma.deadline.deleteMany({ where: { movementId } });
  await prisma.movement.update({ where: { id: movementId }, data: { noDeadline: false } });
  await audit({ action: "DEADLINE_CLEARED", userId: admin.sub, entity: "Movement", entityId: movementId, ...(await meta()) });
  revalidatePath(`/admin/processos/${processId}`);
  revalidatePath("/admin/processos");
  revalidatePath("/admin/prazos");
}

/** Marca a movimentação como "sem prazo" (ou desfaz). */
export async function setMovementNoDeadline(formData: FormData) {
  const admin = await requireAdmin();
  const movementId = String(formData.get("movementId") || "");
  const processId = String(formData.get("processId") || "");
  const value = String(formData.get("value") || "true") === "true";
  if (!movementId) return;
  // Ao marcar "sem prazo", remove qualquer prazo eventualmente cadastrado.
  if (value) await prisma.deadline.deleteMany({ where: { movementId } });
  await prisma.movement.update({ where: { id: movementId }, data: { noDeadline: value } });
  await audit({ action: "MOVEMENT_NO_DEADLINE", userId: admin.sub, entity: "Movement", entityId: movementId, ...(await meta()) });
  revalidatePath(`/admin/processos/${processId}`);
  revalidatePath("/admin/processos");
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
