"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { petitionCreateSchema } from "@/lib/validation";
import { getTemplate, renderTemplateContent } from "@/config/peticoes";

export type PetitionFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const orNull = (v?: string | null) => (v && v.trim() ? v.trim() : null);

async function meta() {
  const h = await headers();
  return { ip: h.get("x-forwarded-for"), userAgent: h.get("user-agent") };
}

/** Cria uma nova peça a partir de um modelo (ou em branco) e abre o editor. */
export async function createPetitionFromTemplate(
  _prev: PetitionFormState,
  formData: FormData
): Promise<PetitionFormState> {
  const admin = await requireAdmin();

  const parsed = petitionCreateSchema.safeParse({
    templateSlug: formData.get("templateSlug"),
    title: formData.get("title"),
    clientId: formData.get("clientId"),
    opposingParty: formData.get("opposingParty") || undefined,
    processId: formData.get("processId") || undefined,
    movementId: formData.get("movementId") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Verifique os campos.", errors: parsed.error.flatten().fieldErrors };
  }
  const { templateSlug, title, clientId, opposingParty, processId, movementId } = parsed.data;

  const client = await prisma.user.findUnique({ where: { id: clientId }, select: { id: true, name: true } });
  if (!client) return { ok: false, message: "Cliente inválido." };

  let processNumber: string | null = null;
  if (processId) {
    const proc = await prisma.process.findUnique({ where: { id: processId }, select: { number: true } });
    processNumber = proc?.number ?? null;
  }

  const template = getTemplate(templateSlug);
  const content = renderTemplateContent(template.content, {
    titulo: title,
    cliente: client.name,
    parteContraria: opposingParty,
    processo: processNumber ?? undefined,
  });

  const petition = await prisma.petition.create({
    data: {
      title: title.trim(),
      category: template.category,
      status: "RASCUNHO",
      content,
      opposingParty: orNull(opposingParty),
      templateSlug: template.slug,
      clientId,
      processId: orNull(processId),
      movementId: orNull(movementId),
      createdById: admin.sub,
    },
  });

  await audit({ action: "PETITION_CREATED", userId: admin.sub, entity: "Petition", entityId: petition.id, ...(await meta()) });
  revalidatePath("/admin/documentos");
  redirect(`/admin/documentos/${petition.id}`);
}

/** Salva o conteúdo e os metadados de uma peça (chamado direto do editor). */
export async function savePetition(
  id: string,
  data: {
    title: string;
    category: string;
    status: string;
    clientId: string;
    opposingParty: string | null;
    processId: string | null;
    content: string;
  }
): Promise<{ ok: boolean; message?: string }> {
  const admin = await requireAdmin();
  if (!id) return { ok: false, message: "Documento inválido." };
  if (!data.title?.trim()) return { ok: false, message: "Informe o título da peça." };
  if (!data.clientId) return { ok: false, message: "Selecione o cliente." };

  try {
    await prisma.petition.update({
      where: { id },
      data: {
        title: data.title.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: data.category as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: data.status as any,
        clientId: data.clientId,
        opposingParty: orNull(data.opposingParty),
        processId: orNull(data.processId),
        content: data.content ?? "",
      },
    });
  } catch {
    return { ok: false, message: "Não foi possível salvar o documento." };
  }

  await audit({ action: "PETITION_UPDATED", userId: admin.sub, entity: "Petition", entityId: id, ...(await meta()) });
  revalidatePath(`/admin/documentos/${id}`);
  revalidatePath("/admin/documentos");
  return { ok: true };
}

export async function deletePetition(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.petition.delete({ where: { id } });
  await audit({ action: "PETITION_DELETED", userId: admin.sub, entity: "Petition", entityId: id, ...(await meta()) });
  revalidatePath("/admin/documentos");
  redirect("/admin/documentos");
}
