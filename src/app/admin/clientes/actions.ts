"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { clientCreateSchema, clientUpdateSchema } from "@/lib/validation";

export type ClientFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const orNull = (v?: string | null) => (v && v.trim() ? v.trim() : null);

async function meta() {
  const h = await headers();
  return { ip: h.get("x-forwarded-for"), userAgent: h.get("user-agent") };
}

/** Monta o objeto de perfil para o Prisma a partir dos dados validados. */
function profileData(p: Record<string, unknown>) {
  const s = (k: string) => orNull(p[k] as string | undefined);
  return {
    personType: ((p.personType as string) || "PF") as "PF" | "PJ",
    rg: s("rg"),
    maritalStatus: s("maritalStatus"),
    profession: s("profession"),
    nationality: s("nationality"),
    companyName: s("companyName"),
    cnpj: s("cnpj"),
    legalRep: s("legalRep"),
    cep: s("cep"),
    street: s("street"),
    number: s("number"),
    complement: s("complement"),
    district: s("district"),
    city: s("city"),
    state: s("state"),
    demandType: s("demandType"),
    feeModality: (p.feeModality ? p.feeModality : null) as
      | "AVISTA" | "PARCELADO" | "EXITO" | "ENTRADA_PARCELAMENTO" | "MENSALIDADE" | "HIBRIDO" | null,
    feeValue: s("feeValue"),
    contractDate: p.contractDate ? new Date(p.contractDate as string) : null,
    paymentMethod: (p.paymentMethod ? p.paymentMethod : null) as
      | "PIX" | "CARTAO" | "BOLETO" | "TRANSFERENCIA" | "DINHEIRO" | null,
    contractSigned: Boolean(p.contractSigned),
    observation: s("observation"),
    qualification: s("qualification"),
  };
}

/** Salva o arquivo de contrato em /storage (best-effort, dev local). */
async function saveContract(file: FormDataEntryValue | null, userId: string) {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size) return null;
  try {
    const dir = path.join(process.cwd(), "storage", "contracts");
    await mkdir(dir, { recursive: true });
    const safe = f.name.replace(/[^\w.\-]/g, "_");
    const key = `${userId}-${Date.now()}-${safe}`;
    await writeFile(path.join(dir, key), Buffer.from(await f.arrayBuffer()));
    return { key: `storage/contracts/${key}`, name: f.name };
  } catch {
    return null;
  }
}

function parseInput(formData: FormData) {
  const g = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v : undefined;
  };
  return {
    name: g("name"),
    email: String(formData.get("email") || "").toLowerCase().trim(),
    cpf: g("cpf"),
    phone: g("phone"),
    password: g("password"),
    personType: g("personType") || "PF",
    rg: g("rg"),
    maritalStatus: g("maritalStatus"),
    profession: g("profession"),
    nationality: g("nationality"),
    companyName: g("companyName"),
    cnpj: g("cnpj"),
    legalRep: g("legalRep"),
    cep: g("cep"),
    street: g("street"),
    number: g("number"),
    complement: g("complement"),
    district: g("district"),
    city: g("city"),
    state: g("state"),
    demandType: g("demandType"),
    feeModality: g("feeModality") || "",
    feeValue: g("feeValue"),
    contractDate: g("contractDate"),
    paymentMethod: g("paymentMethod") || "",
    contractSigned: formData.get("contractSigned") === "true",
    observation: g("observation"),
    qualification: g("qualification"),
    active: formData.get("active") === "on",
  };
}

export async function createClient(
  _prev: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const admin = await requireAdmin();
  const parsed = clientCreateSchema.safeParse(parseInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifique os campos destacados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { ok: false, message: "Já existe um usuário com este e-mail." };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      cpf: orNull(parsed.data.cpf),
      phone: orNull(parsed.data.phone),
      role: "CLIENT",
      passwordHash: await hashPassword(parsed.data.password),
      clientProfile: { create: profileData(parsed.data) },
    },
  });

  const saved = await saveContract(formData.get("contractFile"), user.id);
  if (saved) {
    await prisma.clientProfile.update({
      where: { userId: user.id },
      data: { contractFileKey: saved.key, contractFileName: saved.name },
    });
  }

  await audit({ action: "CLIENT_CREATED", userId: admin.sub, entity: "User", entityId: user.id, ...(await meta()) });
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function updateClient(
  _prev: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Cliente inválido." };

  const parsed = clientUpdateSchema.safeParse(parseInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifique os campos destacados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const other = await prisma.user.findFirst({ where: { email: parsed.data.email, NOT: { id } } });
  if (other) return { ok: false, message: "Este e-mail já está em uso por outro usuário." };

  const profile = profileData(parsed.data);
  await prisma.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      cpf: orNull(parsed.data.cpf),
      phone: orNull(parsed.data.phone),
      active: parsed.data.active ?? true,
      ...(parsed.data.password ? { passwordHash: await hashPassword(parsed.data.password) } : {}),
      clientProfile: { upsert: { create: profile, update: profile } },
    },
  });

  const saved = await saveContract(formData.get("contractFile"), id);
  if (saved) {
    await prisma.clientProfile.update({
      where: { userId: id },
      data: { contractFileKey: saved.key, contractFileName: saved.name },
    });
  }

  await audit({ action: "CLIENT_UPDATED", userId: admin.sub, entity: "User", entityId: id, ...(await meta()) });
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function toggleClientActive(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const active = formData.get("active") === "true";
  if (!id) return;
  await prisma.user.update({ where: { id }, data: { active } });
  await audit({
    action: active ? "CLIENT_ACTIVATED" : "CLIENT_DEACTIVATED",
    userId: admin.sub,
    entity: "User",
    entityId: id,
    ...(await meta()),
  });
  revalidatePath("/admin/clientes");
}
