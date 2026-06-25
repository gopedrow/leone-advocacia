import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-troque-em-producao"
);
const issuer = process.env.JWT_ISSUER ?? "leone-advocacia";
const maxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS ?? 7);

export type SessionClaims = {
  sub: string; // userId
  role: "CLIENT" | "ADMIN";
  name: string;
  email: string;
};

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(`${maxAgeDays}d`)
    .sign(secret);
}

export async function verifySession(
  token: string
): Promise<(SessionClaims & JWTPayload) | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { issuer });
    return payload as SessionClaims & JWTPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "leone_session";
export const SESSION_MAX_AGE = maxAgeDays * 24 * 60 * 60; // segundos
