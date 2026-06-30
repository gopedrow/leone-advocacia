import crypto from "crypto";

/**
 * Conversions API do Meta — envia eventos do servidor (ex.: "Lead") para o
 * Meta, melhorando a mensuração e a otimização dos anúncios.
 *
 * Variáveis de ambiente (configurar no Vercel):
 *   META_PIXEL_ID            - ID do conjunto de dados / pixel
 *   META_CAPI_TOKEN          - token de acesso da Conversions API
 *   META_GRAPH_VERSION       - opcional (padrão: v21.0)
 *   META_TEST_EVENT_CODE     - opcional, para testar no "Test Events" do Meta
 *
 * Seguro por padrão: se as variáveis não estiverem configuradas, não faz nada.
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

const sha256 = (v: string) =>
  crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export type MetaEventInput = {
  eventName: "Lead" | "Contact" | "SubmitApplication" | "Schedule";
  email?: string | null;
  phone?: string | null;
  /** URL onde o evento ocorreu (ajuda na atribuição). */
  sourceUrl?: string;
  /** IP e user-agent do visitante, quando disponíveis. */
  clientIp?: string | null;
  userAgent?: string | null;
  eventId?: string;
};

export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return; // não configurado → ignora silenciosamente

  const userData: Record<string, string | string[]> = {};
  if (input.email) userData.em = sha256(input.email);
  if (input.phone) userData.ph = sha256(onlyDigits(input.phone));
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: input.eventId,
        event_source_url: input.sourceUrl,
        user_data: userData,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    if (!res.ok) console.error("[meta-capi] envio falhou:", res.status, await res.text());
  } catch (err) {
    console.error("[meta-capi] erro ao enviar evento:", err);
  }
}
