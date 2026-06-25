import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Descreva brevemente sua situação (mín. 10 caracteres)."),
  // honeypot anti-spam (deve vir vazio)
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

export const recoverSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

// ───────────────────────── Clientes (admin) ─────────────────────────
const opt = z.string().optional();

const baseClient = {
  name: z.string().min(2, "Informe o nome completo."),
  email: z.string().email("E-mail inválido."),
  cpf: opt,
  phone: opt,
};

// Campos do perfil cadastral (todos opcionais)
const profileFields = {
  personType: z.enum(["PF", "PJ"]).optional(),
  rg: opt,
  maritalStatus: opt,
  profession: opt,
  nationality: opt,
  companyName: opt,
  cnpj: opt,
  legalRep: opt,
  cep: opt,
  street: opt,
  number: opt,
  complement: opt,
  district: opt,
  city: opt,
  state: opt,
  demandType: opt,
  feeModality: z
    .enum(["AVISTA", "PARCELADO", "EXITO", "ENTRADA_PARCELAMENTO", "MENSALIDADE", "HIBRIDO"])
    .optional()
    .or(z.literal("")),
  feeValue: opt,
  contractDate: opt, // string ISO (input[type=date]); convertida na action
  paymentMethod: z
    .enum(["PIX", "CARTAO", "BOLETO", "TRANSFERENCIA", "DINHEIRO"])
    .optional()
    .or(z.literal("")),
  contractSigned: z.boolean().optional(),
  observation: opt,
  qualification: opt,
};

export const clientCreateSchema = z.object({
  ...baseClient,
  password: z.string().min(6, "A senha inicial deve ter ao menos 6 caracteres."),
  ...profileFields,
});

export const clientUpdateSchema = z.object({
  ...baseClient,
  active: z.boolean().optional(),
  // senha opcional na edição: vazio = manter a atual
  password: z
    .string()
    .min(6, "A nova senha deve ter ao menos 6 caracteres.")
    .optional()
    .or(z.literal("")),
  ...profileFields,
});

// ───────────────────────── Processos ─────────────────────────
const processStatus = z
  .enum(["ANALISE", "DISTRIBUIDO", "EM_ANDAMENTO", "RECURSO", "SUSPENSO", "ENCERRADO"])
  .optional()
  .or(z.literal(""));

export const processSchema = z.object({
  number: z.string().min(3, "Informe o número do processo."),
  title: z.string().min(3, "Informe um título para o processo."),
  clientId: z.string().min(1, "Selecione o cliente."),
  court: opt,
  jurisdiction: opt,
  className: opt,
  subject: opt,
  status: processStatus,
  distributedAt: opt, // ISO date
});

export const movementSchema = z.object({
  processId: z.string().min(1),
  date: z.string().min(1, "Informe a data."),
  title: z.string().min(2, "Descreva a movimentação."),
  description: opt,
});

// ───────────────────────── Prazos ─────────────────────────
export const deadlineSchema = z.object({
  title: z.string().min(2, "Informe o título do prazo."),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  description: opt,
  processNumber: opt,
});
