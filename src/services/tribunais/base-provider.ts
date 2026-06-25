import type {
  TribunalProvider,
  TribunalCode,
  ProcessoConsulta,
  ProcessoExterno,
  IntimacaoExterna,
  IntegrationResult,
} from "./types";

/**
 * Provedor base. Cada tribunal estende esta classe e sobrescreve os métodos
 * conforme a API real for disponibilizada. Por padrão, retorna
 * `notImplemented` — permitindo que o restante do sistema funcione e que a
 * integração seja ligada gradualmente.
 */
export abstract class BaseTribunalProvider implements TribunalProvider {
  abstract readonly code: TribunalCode;
  abstract readonly name: string;
  protected readonly baseUrl?: string;
  protected readonly token?: string;

  constructor(opts?: { baseUrl?: string; token?: string }) {
    this.baseUrl = opts?.baseUrl;
    this.token = opts?.token;
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  protected notImplemented<T>(): IntegrationResult<T> {
    return {
      ok: false,
      error: `Integração ${this.code} ainda não implementada.`,
      source: this.code,
      notImplemented: true,
    };
  }

  async consultarProcesso(
    _consulta: ProcessoConsulta
  ): Promise<IntegrationResult<ProcessoExterno>> {
    return this.notImplemented<ProcessoExterno>();
  }

  async listarIntimacoes(): Promise<IntegrationResult<IntimacaoExterna[]>> {
    return this.notImplemented<IntimacaoExterna[]>();
  }
}
