"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { saveUpload } from "@/lib/storage";
import { audit } from "@/lib/audit";

/** Converte "R$ 5.000,00" / "5000" / "5.000,00" em número. */
function parseBRL(v: string): number {
  const cleaned = v
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // remove separador de milhar
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

const revalClient = (id: string) => {
  revalidatePath(`/admin/clientes/${id}`);
  revalidatePath("/admin/assinaturas");
  revalidatePath("/area-cliente/financeiro");
  revalidatePath("/area-cliente/assinaturas");
};

/** Disponibiliza um documento para o cliente assinar. */
export async function createSignatureRequest(formData: FormData) {
  const admin = await requireAdmin();
  const clientId = String(formData.get("clientId") || "");
  const title = String(formData.get("title") || "").trim();
  const type = String(formData.get("type") || "OUTRO");
  if (!clientId || !title) return;

  const saved = await saveUpload(formData.get("file"), "signatures", `doc-${clientId}`);

  const sig = await prisma.signatureRequest.create({
    data: {
      clientId,
      title,
      type: type as "CONTRATO_HONORARIOS" | "PROCURACAO" | "DECLARACAO" | "OUTRO",
      fileKey: saved?.key,
      fileName: saved?.name,
    },
  });
  await prisma.notification.create({
    data: {
      userId: clientId,
      type: "DOCUMENT",
      title: "Novo documento para assinatura",
      body: title,
      link: "/area-cliente/assinaturas",
    },
  });
  await audit({ action: "SIGNATURE_REQUESTED", userId: admin.sub, entity: "SignatureRequest", entityId: sig.id });
  revalClient(clientId);
}

export async function deleteSignatureRequest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const clientId = String(formData.get("clientId") || "");
  if (!id) return;
  await prisma.signatureRequest.delete({ where: { id } });
  revalClient(clientId);
}

/** Cria um lançamento financeiro (honorário/parcela) para o cliente. */
export async function createPayment(formData: FormData) {
  const admin = await requireAdmin();
  const clientId = String(formData.get("clientId") || "");
  const description = String(formData.get("description") || "").trim();
  const amount = parseBRL(String(formData.get("amount") || ""));
  const dueDate = String(formData.get("dueDate") || "");
  const status = String(formData.get("status") || "PENDENTE");
  const method = String(formData.get("method") || "");
  if (!clientId || !description) return;

  await prisma.payment.create({
    data: {
      clientId,
      description,
      amount,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status as "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO",
      paidDate: status === "PAGO" ? new Date() : null,
      method: method ? (method as "PIX" | "CARTAO" | "BOLETO" | "TRANSFERENCIA" | "DINHEIRO") : null,
    },
  });
  await audit({ action: "PAYMENT_CREATED", userId: admin.sub, entity: "Payment", entityId: clientId });
  revalClient(clientId);
}

/** Marca um pagamento como pago/pendente. */
export async function setPaymentStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const clientId = String(formData.get("clientId") || "");
  const status = String(formData.get("status") || "PENDENTE") as
    | "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";
  if (!id) return;
  await prisma.payment.update({
    where: { id },
    data: { status, paidDate: status === "PAGO" ? new Date() : null },
  });
  revalClient(clientId);
}

export async function deletePayment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const clientId = String(formData.get("clientId") || "");
  if (!id) return;
  await prisma.payment.delete({ where: { id } });
  revalClient(clientId);
}
