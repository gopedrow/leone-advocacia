import { BaseTribunalProvider } from "./base-provider";
import type { TribunalCode } from "./types";

/**
 * Provedores concretos. Hoje herdam o comportamento "não implementado" do
 * provedor base; basta sobrescrever os métodos quando a API real estiver
 * disponível, mantendo a mesma interface para o resto do sistema.
 */

export class PjeProvider extends BaseTribunalProvider {
  readonly code = "PJE" as const;
  readonly name = "PJe — Processo Judicial Eletrônico";
  // Ex.: ao implementar, usar this.baseUrl + endpoints da API do CNJ/PJe.
}

export class EsajProvider extends BaseTribunalProvider {
  readonly code = "ESAJ" as const;
  readonly name = "e-SAJ";
}

export class ProjudiProvider extends BaseTribunalProvider {
  readonly code = "PROJUDI" as const;
  readonly name = "Projudi";
}

export class EprocProvider extends BaseTribunalProvider {
  readonly code = "EPROC" as const;
  readonly name = "EPROC";
}

/** Cria os provedores a partir das variáveis de ambiente. */
export function buildProviders() {
  return {
    PJE: new PjeProvider({
      baseUrl: process.env.PJE_API_BASE_URL,
      token: process.env.PJE_API_TOKEN,
    }),
    ESAJ: new EsajProvider({ baseUrl: process.env.ESAJ_API_BASE_URL }),
    PROJUDI: new ProjudiProvider({ baseUrl: process.env.PROJUDI_API_BASE_URL }),
    EPROC: new EprocProvider({ baseUrl: process.env.EPROC_API_BASE_URL }),
  } satisfies Record<TribunalCode, BaseTribunalProvider>;
}
