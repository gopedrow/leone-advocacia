"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { saveUpload } from "@/lib/storage";
import { audit } from "@/lib/audit";

/** Assinatura eletrônica por aceite (registra nome, IP e data). */
export async function signDigital(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const sig = await prisma.signatureRequest.findFirst({
    where: { id, clientId: user.sub },
  });
  if (!sig) return;

  const h = await headers();
  await prisma.signatureRequest.update({
    where: { id },
    data: {
      status: "ASSINADO_DIGITAL",
      signerName: user.name,
      signerIp: h.get("x-forwarded-for"),
      signedAt: new Date(),
    },
  });
  await audit({
    action: "SIGNATURE_ACCEPTED",
    userId: user.sub,
    entity: "SignatureRequest",
    entityId: id,
    ip: h.get("x-forwarded-for"),
    userAgent: h.get("user-agent"),
  });
  revalidatePath("/area-cliente/assinaturas");
}

/** Upload do documento assinado fisicamente pelo cliente. */
export async function uploadSignedDoc(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const sig = await prisma.signatureRequest.findFirst({
    where: { id, clientId: user.sub },
  });
  if (!sig) return;

  const saved = await saveUpload(formData.get("file"), "signatures", `assinado-${user.sub}`);
  if (!saved) return;

  await prisma.signatureRequest.update({
    where: { id },
    data: {
      status: "ASSINADO_FISICO",
      signedFileKey: saved.key,
      signedFileName: saved.name,
      signedAt: new Date(),
    },
  });
  const h = await headers();
  await audit({
    action: "SIGNATURE_UPLOADED",
    userId: user.sub,
    entity: "SignatureRequest",
    entityId: id,
    ip: h.get("x-forwarded-for"),
    userAgent: h.get("user-agent"),
  });
  revalidatePath("/area-cliente/assinaturas");
}

/** Cliente envia mensagem à advogada (notifica os admins). */
export async function sendMessage(formData: FormData) {
  const user = await requireUser();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) return;

  await prisma.message.create({
    data: { senderId: user.sub, recipientId: admin.id, body },
  });
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: "MESSAGE",
      title: `Nova mensagem de ${user.name}`,
      body: body.slice(0, 120),
    },
  });
  revalidatePath("/area-cliente/mensagens");
}
