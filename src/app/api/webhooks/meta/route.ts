import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Webhook do Meta (Facebook/Instagram) para Lead Ads.
 *
 * GET  → verificação do webhook (Meta envia hub.challenge na configuração).
 * POST → notificação de novo lead (campo "leadgen"). Validamos a assinatura,
 *        buscamos os dados completos na Graph API e salvamos como Lead.
 *
 * Variáveis de ambiente necessárias (configurar no Vercel):
 *   META_VERIFY_TOKEN        - texto que você define e repete no painel do Meta
 *   META_APP_SECRET          - "App Secret" do app do Meta (valida a assinatura)
 *   META_PAGE_ACCESS_TOKEN   - token da Página com permissão leads_retrieval
 *   META_GRAPH_VERSION       - opcional (padrão: v21.0)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

/* ───────────────── Verificação (GET) ───────────────── */
export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

/* ───────────────── Recebimento (POST) ───────────────── */
export async function POST(req: NextRequest) {
  const raw = await req.text();

  // Valida a assinatura (X-Hub-Signature-256) usando o App Secret.
  const appSecret = process.env.META_APP_SECRET;
  const signature = req.headers.get("x-hub-signature-256");
  if (appSecret) {
    if (!signature || !verifySignature(raw, signature, appSecret)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
  }

  let body: MetaWebhookBody;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  // Responde rápido ao Meta; processa os leads em seguida.
  try {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== "leadgen" || !change.value) continue;
        await processLead(change.value);
      }
    }
  } catch (err) {
    // Não devolve erro 500 para o Meta não reenviar em loop; apenas registra.
    console.error("[meta-webhook] erro ao processar lead:", err);
  }

  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}

/* ───────────────── Auxiliares ───────────────── */
function verifySignature(payload: string, header: string, secret: string) {
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function processLead(value: LeadgenValue) {
  const leadgenId = value.leadgen_id;
  if (!leadgenId) return;

  // Evita reprocessar um lead já salvo.
  const existing = await prisma.lead.findUnique({ where: { externalId: leadgenId } });
  if (existing) return;

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) {
    console.warn("[meta-webhook] META_PAGE_ACCESS_TOKEN ausente; lead não buscado.");
    return;
  }

  // Busca os dados completos do lead na Graph API.
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}` +
    `?access_token=${encodeURIComponent(token)}` +
    `&fields=field_data,ad_id,ad_name,form_id,campaign_name,created_time`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("[meta-webhook] Graph API falhou:", res.status, await res.text());
    return;
  }
  const data = (await res.json()) as LeadDetail;

  const fields = mapFieldData(data.field_data ?? []);

  await prisma.lead.create({
    data: {
      name: fields.name || "(sem nome)",
      email: fields.email || null,
      phone: fields.phone || null,
      subject: "Lead de anúncio (Meta)",
      message: fields.message || null,
      source: "META_LEAD_ADS",
      externalId: leadgenId,
      formId: data.form_id ?? value.form_id ?? null,
      adId: data.ad_id ?? value.ad_id ?? null,
      adName: data.ad_name ?? null,
      campaignName: data.campaign_name ?? null,
      raw: data as unknown as Prisma.InputJsonValue,
    },
  });
}

/** Converte o field_data do Meta em campos conhecidos (nome/email/telefone). */
function mapFieldData(fieldData: { name: string; values: string[] }[]) {
  const get = (...keys: string[]) => {
    for (const f of fieldData) {
      const n = f.name?.toLowerCase();
      if (keys.some((k) => n === k || n?.includes(k))) return f.values?.[0];
    }
    return undefined;
  };
  const name = get("full_name", "name", "nome") || [get("first_name"), get("last_name")].filter(Boolean).join(" ");
  return {
    name: (name || "").trim(),
    email: get("email", "e-mail"),
    phone: get("phone_number", "phone", "telefone", "celular"),
    message: get("message", "mensagem", "descreva", "observ"),
  };
}

/* ───────────────── Tipos ───────────────── */
type MetaWebhookBody = {
  object?: string;
  entry?: { id?: string; time?: number; changes?: { field?: string; value?: LeadgenValue }[] }[];
};
type LeadgenValue = {
  leadgen_id?: string;
  form_id?: string;
  ad_id?: string;
  page_id?: string;
  created_time?: number;
};
type LeadDetail = {
  field_data?: { name: string; values: string[] }[];
  ad_id?: string;
  ad_name?: string;
  form_id?: string;
  campaign_name?: string;
  created_time?: string;
};
