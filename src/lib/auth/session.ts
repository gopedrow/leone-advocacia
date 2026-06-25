import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionClaims,
} from "./jwt";

/** Cria o cookie de sessão (httpOnly, secure em produção). */
export async function createSession(claims: SessionClaims) {
  const token = await signSession(claims);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Lê a sessão atual (ou null). Use em Server Components / Route Handlers. */
export async function getSession(): Promise<SessionClaims | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifySession(token);
  return claims
    ? { sub: claims.sub, role: claims.role, name: claims.name, email: claims.email }
    : null;
}

/** Exige autenticação; redireciona para /login caso contrário. */
export async function requireUser(): Promise<SessionClaims> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Exige perfil ADMIN; redireciona caso contrário. */
export async function requireAdmin(): Promise<SessionClaims> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/area-cliente");
  return session;
}
