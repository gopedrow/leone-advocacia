"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { loginSchema } from "@/lib/validation";

export type AuthState = { ok: boolean; message?: string };

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: "E-mail ou senha inválidos." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const h = await headers();

  if (!user || !user.active || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    await audit({
      action: "LOGIN_FAILED",
      ip: h.get("x-forwarded-for"),
      userAgent: h.get("user-agent"),
    });
    return { ok: false, message: "Credenciais incorretas." };
  }

  await createSession({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  await audit({
    action: "LOGIN_SUCCESS",
    userId: user.id,
    ip: h.get("x-forwarded-for"),
    userAgent: h.get("user-agent"),
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/area-cliente");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
