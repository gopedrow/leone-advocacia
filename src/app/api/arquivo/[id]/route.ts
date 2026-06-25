import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { readStoredFile } from "@/lib/storage";

/**
 * Download autenticado de documentos de assinatura.
 *   /api/arquivo/<sigId>?tipo=doc|assinado
 * Cliente só acessa os próprios; admin acessa todos.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return new NextResponse("Não autorizado", { status: 401 });

  const { id } = await params;
  const tipo = req.nextUrl.searchParams.get("tipo") === "assinado" ? "assinado" : "doc";

  const sig = await prisma.signatureRequest.findUnique({ where: { id } });
  if (!sig) return new NextResponse("Não encontrado", { status: 404 });

  if (session.role !== "ADMIN" && sig.clientId !== session.sub) {
    return new NextResponse("Acesso negado", { status: 403 });
  }

  const key = tipo === "assinado" ? sig.signedFileKey : sig.fileKey;
  const name = tipo === "assinado" ? sig.signedFileName : sig.fileName;
  if (!key) return new NextResponse("Arquivo indisponível", { status: 404 });

  try {
    const buf = await readStoredFile(key);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${name || "documento"}"`,
      },
    });
  } catch {
    return new NextResponse("Falha ao ler o arquivo", { status: 500 });
  }
}
