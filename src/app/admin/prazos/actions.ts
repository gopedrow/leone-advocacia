"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { deadlineSchema } from "@/lib/validation";

export type DeadlineFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const orNull = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export async function createDeadline(
  _prev: DeadlineFormState,
  formData: FormData
): Promise<DeadlineFormState> {
  await requireAdmin();
  const parsed = deadlineSchema.safeParse({
    title: formData.get("title"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description") || undefined,
    processNumber: formData.get("processNumber") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Verifique os campos.", errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.deadline.create({
    data: {
      title: parsed.data.title.trim(),
      dueDate: new Date(parsed.data.dueDate),
      description: orNull(parsed.data.description),
      processNumber: orNull(parsed.data.processNumber),
    },
  });

  revalidatePath("/admin/prazos");
  revalidatePath("/admin");
  return { ok: true, message: "Prazo cadastrado." };
}

export async function toggleDeadlineDone(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const done = formData.get("done") === "true";
  if (!id) return;
  await prisma.deadline.update({ where: { id }, data: { done } });
  revalidatePath("/admin/prazos");
  revalidatePath("/admin");
}

export async function deleteDeadline(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.deadline.delete({ where: { id } });
  revalidatePath("/admin/prazos");
  revalidatePath("/admin");
}
