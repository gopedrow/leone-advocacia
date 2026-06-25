import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { site, whatsappLink } from "@/config/site";

/**
 * Links rastreados de campanha.
 *   /ir/whatsapp?utm_source=instagram&utm_campaign=medicamentos&msg=Ol%C3%A1
 *   /ir/instagram?utm_source=meta&utm_campaign=institucional
 * Registra o clique (com UTMs) e redireciona ao destino.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const { target } = await params;
  const key = target.toLowerCase();
  const sp = req.nextUrl.searchParams;

  let dest: string;
  let targetEnum: "WHATSAPP" | "INSTAGRAM" | "OUTRO";

  if (key === "whatsapp") {
    dest = whatsappLink(sp.get("msg") || undefined);
    targetEnum = "WHATSAPP";
  } else if (key === "instagram") {
    dest = site.social.instagram;
    targetEnum = "INSTAGRAM";
  } else {
    dest = new URL("/", req.url).toString();
    targetEnum = "OUTRO";
  }

  try {
    await prisma.campaignClick.create({
      data: {
        target: targetEnum,
        source: sp.get("utm_source") || undefined,
        campaign: sp.get("utm_campaign") || undefined,
        medium: sp.get("utm_medium") || undefined,
        content: sp.get("utm_content") || undefined,
        referrer: req.headers.get("referer") || undefined,
        ip: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });
  } catch {
    // Nunca bloquear o redirecionamento por causa do log.
  }

  return NextResponse.redirect(dest, 302);
}
