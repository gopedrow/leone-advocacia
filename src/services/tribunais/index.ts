import { buildProviders } from "./providers";
import type { TribunalCode, TribunalProvider } from "./types";

export * from "./types";

const providers = buildProviders();

/** Retorna o provedor de um tribunal específico. */
export function getProvider(code: TribunalCode): TribunalProvider {
  return providers[code];
}

/** Lista os provedores e seu estado de configuração. */
export function listProviders() {
  return Object.values(providers).map((p) => ({
    code: p.code,
    name: p.name,
    configured: p.isConfigured(),
  }));
}

/**
 * Sincroniza um processo a partir do tribunal informado.
 * Ponto único de entrada para a futura rotina de sincronização
 * (cron job / webhook). Hoje retorna "não implementado" de forma segura.
 */
export async function sincronizarProcesso(code: TribunalCode, numero: string) {
  const provider = getProvider(code);
  if (!provider.isConfigured()) {
    return { ok: false as const, error: `Provedor ${code} não configurado.` };
  }
  return provider.consultarProcesso({ numero });
}
