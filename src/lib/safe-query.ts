/**
 * Executa uma consulta ao banco com fallback.
 * Útil para páginas públicas funcionarem mesmo antes de o banco estar
 * migrado/semeado (retorna o fallback em caso de erro).
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[safeQuery] consulta falhou, usando fallback:", err);
    }
    return fallback;
  }
}
