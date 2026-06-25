/**
 * Contratos da camada de integração com tribunais e sistemas judiciais.
 *
 * Esta camada é uma ABSTRAÇÃO preparada para integrações futuras (PJe, e-SAJ,
 * Projudi, EPROC, Diário Oficial, intimações eletrônicas). Cada provedor
 * implementa a interface `TribunalProvider`. A aplicação consome sempre a
 * interface — nunca um provedor concreto — de modo que novas integrações
 * possam ser adicionadas sem alterar o restante do sistema.
 */

export type TribunalCode = "PJE" | "ESAJ" | "PROJUDI" | "EPROC";

export interface ProcessoConsulta {
  numero: string; // nº CNJ
}

export interface MovimentacaoExterna {
  externalId?: string;
  data: string; // ISO 8601
  titulo: string;
  descricao?: string;
}

export interface ProcessoExterno {
  numero: string;
  tribunal?: string;
  classe?: string;
  assunto?: string;
  orgaoJulgador?: string; // vara/comarca
  movimentacoes: MovimentacaoExterna[];
}

export interface IntimacaoExterna {
  externalId: string;
  numeroProcesso: string;
  prazoFinal?: string; // ISO 8601
  conteudo: string;
  recebidaEm: string; // ISO 8601
}

/** Resultado padronizado de qualquer operação de integração. */
export type IntegrationResult<T> =
  | { ok: true; data: T; source: TribunalCode }
  | { ok: false; error: string; source: TribunalCode; notImplemented?: boolean };

/** Contrato implementado por cada provedor de tribunal. */
export interface TribunalProvider {
  readonly code: TribunalCode;
  readonly name: string;
  /** Indica se o provedor está configurado (credenciais/URL presentes). */
  isConfigured(): boolean;
  /** Consulta dados e movimentações de um processo. */
  consultarProcesso(
    consulta: ProcessoConsulta
  ): Promise<IntegrationResult<ProcessoExterno>>;
  /** Lista intimações pendentes (push/pull conforme o tribunal). */
  listarIntimacoes(): Promise<IntegrationResult<IntimacaoExterna[]>>;
}
