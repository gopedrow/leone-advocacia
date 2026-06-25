import { prisma } from "@/lib/db";

/** Registra um evento de auditoria (LGPD / rastreabilidade). */
export async function audit(params: {
  action: string;
  userId?: string | null;
  entity?: string;
  entityId?: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId ?? undefined,
        entity: params.entity,
        entityId: params.entityId,
        ip: params.ip ?? undefined,
        userAgent: params.userAgent ?? undefined,
      },
    });
  } catch {
    // Auditoria não deve quebrar o fluxo principal.
  }
}
