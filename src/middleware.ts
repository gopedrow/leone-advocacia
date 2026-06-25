import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt";

/**
 * Proteção de rotas por perfil (RBAC) na borda.
 * - /area-cliente/*  → exige sessão (CLIENT ou ADMIN)
 * - /admin/*         → exige sessão ADMIN
 */
const CLIENT_PREFIX = "/area-cliente";
const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isClientArea = pathname.startsWith(CLIENT_PREFIX);
  const isAdminArea = pathname.startsWith(ADMIN_PREFIX);

  if (!isClientArea && !isAdminArea) return NextResponse.next();

  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminArea && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/area-cliente", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/area-cliente/:path*", "/admin/:path*"],
};
