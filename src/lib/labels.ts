/** Rótulos e estilos para enums do domínio (exibição na UI). */

export const processStatusLabel: Record<string, string> = {
  ANALISE: "Análise do caso",
  DISTRIBUIDO: "Distribuído",
  EM_ANDAMENTO: "Em andamento",
  RECURSO: "Fase recursal",
  SUSPENSO: "Suspenso",
  ENCERRADO: "Encerrado",
};

export const processStatusClass: Record<string, string> = {
  ANALISE: "bg-amber-50 text-amber-700",
  DISTRIBUIDO: "bg-petrol-50 text-petrol-700",
  EM_ANDAMENTO: "bg-emerald-50 text-emerald-700",
  RECURSO: "bg-navy-50 text-navy-700",
  SUSPENSO: "bg-orange-50 text-orange-700",
  ENCERRADO: "bg-gray-100 text-gray-600",
};

export const documentCategoryLabel: Record<string, string> = {
  PETICAO: "Petição",
  DECISAO: "Decisão",
  CONTRATO: "Contrato",
  PROCURACAO: "Procuração",
  LAUDO_MEDICO: "Laudo médico",
  COMPROVANTE: "Comprovante",
  OUTRO: "Outro",
};

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatBRL(v: number | null | undefined): string {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const signatureStatusLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  ASSINADO_DIGITAL: "Assinado (digital)",
  ASSINADO_FISICO: "Assinado (físico)",
  RECUSADO: "Recusado",
};

export const signatureStatusClass: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700",
  ASSINADO_DIGITAL: "bg-emerald-50 text-emerald-700",
  ASSINADO_FISICO: "bg-emerald-50 text-emerald-700",
  RECUSADO: "bg-red-50 text-red-700",
};

export const signatureTypeLabel: Record<string, string> = {
  CONTRATO_HONORARIOS: "Contrato de honorários",
  PROCURACAO: "Procuração",
  DECLARACAO: "Declaração",
  OUTRO: "Documento",
};

export const paymentStatusLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ATRASADO: "Atrasado",
  CANCELADO: "Cancelado",
};

export const paymentStatusClass: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700",
  PAGO: "bg-emerald-50 text-emerald-700",
  ATRASADO: "bg-red-50 text-red-700",
  CANCELADO: "bg-gray-100 text-gray-500",
};

export const petitionCategoryLabel: Record<string, string> = {
  PETICAO_INICIAL: "Petição inicial",
  CONTESTACAO: "Contestação",
  RECURSO_APELACAO: "Recurso de apelação",
  AGRAVO_INSTRUMENTO: "Agravo de instrumento",
  EMBARGOS_DECLARACAO: "Embargos de declaração",
  CONTRARRAZOES: "Contrarrazões",
  RECURSO_ESPECIAL: "Recurso especial",
  RECURSO_EXTRAORDINARIO: "Recurso extraordinário",
  MANDADO_SEGURANCA: "Mandado de segurança",
  TUTELA_URGENCIA: "Tutela de urgência",
  CONTRATO_HONORARIOS: "Contrato de honorários",
  PROCURACAO: "Procuração",
  NOTIFICACAO_EXTRAJUDICIAL: "Notificação extrajudicial",
  PARECER: "Parecer jurídico",
  EM_BRANCO: "Documento em branco",
  OUTRO: "Outro",
};

export const petitionStatusLabel: Record<string, string> = {
  RASCUNHO: "Rascunho",
  EM_REVISAO: "Em revisão",
  FINALIZADA: "Finalizada",
  PROTOCOLADA: "Protocolada",
};

export const petitionStatusClass: Record<string, string> = {
  RASCUNHO: "bg-gray-100 text-gray-600",
  EM_REVISAO: "bg-amber-50 text-amber-700",
  FINALIZADA: "bg-petrol-50 text-petrol-700",
  PROTOCOLADA: "bg-emerald-50 text-emerald-700",
};
