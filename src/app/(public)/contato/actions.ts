"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validation";
import { audit } from "@/lib/audit";
import { sendMetaEvent } from "@/lib/meta/capi";

export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifique os campos destacados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot preenchido → trata como spam (silenciosamente "ok").
  if (parsed.data.website) return { ok: true };

  try {
    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    const h = await headers();
    await audit({
      action: "LEAD_CREATED",
      entity: "Lead",
      entityId: lead.id,
      ip: h.get("x-forwarded-for"),
      userAgent: h.get("user-agent"),
    });

    // Envia a conversão "Lead" ao Meta (Conversions API).
    // Não bloqueia a resposta nem quebra o envio caso o Meta falhe.
    await sendMetaEvent({
      eventName: "Lead",
      email: parsed.data.email,
      phone: parsed.data.phone,
      sourceUrl: h.get("referer") ?? undefined,
      clientIp: h.get("x-forwarded-for"),
      userAgent: h.get("user-agent"),
      eventId: lead.id,
    }).catch(() => {});
    return {
      ok: true,
      message: "Mensagem enviada com sucesso! Retornaremos em breve.",
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível enviar agora. Tente pelo WhatsApp.",
    };
  }
}
