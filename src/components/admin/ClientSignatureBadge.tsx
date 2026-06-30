"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { createSignatureRequest, deleteSignatureRequest } from "@/app/admin/clientes/finance-actions";
import { signatureStatusLabel, signatureStatusClass } from "@/lib/labels";

type Signature = {
  id: string;
  title: string;
  type: string;
  status: string;
  fileKey: string | null;
  signedFileKey: string | null;
};

const fld =
  "w-full rounded-md border border-line px-3 py-2 text-sm text-navy-800 focus-visible:border-petrol-400";

/**
 * Ícone de documento por cliente, na lista de Clientes — substitui a
 * necessidade de abrir a ficha completa só para mandar algo pra assinar.
 * Vermelho: nenhum documento enviado. Amarelo: aguardando assinatura.
 * Verde: tudo assinado.
 */
export function ClientSignatureBadge({
  clientId,
  signatures,
}: {
  clientId: string;
  signatures: Signature[];
}) {
  const [open, setOpen] = useState(false);

  const total = signatures.length;
  const pending = signatures.filter((s) => s.status === "PENDENTE" || s.status === "RECUSADO").length;
  const signedAll = total > 0 && pending === 0;

  const color =
    total === 0
      ? "text-red-500 hover:bg-red-50"
      : signedAll
        ? "text-emerald-600 hover:bg-emerald-50"
        : "text-gold-500 hover:bg-gold-500/10";

  const title =
    total === 0
      ? "Nenhum documento enviado — clique para enviar"
      : signedAll
        ? "Todos os documentos assinados"
        : `${pending} documento(s) aguardando assinatura`;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={title}
        aria-label={title}
        className={cn("grid h-8 w-8 place-items-center rounded-md transition-colors", color)}
      >
        <Icon name="document" className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-line bg-white p-4 text-left shadow-card">
          {total > 0 && (
            <ul className="mb-3 max-h-44 space-y-2 overflow-y-auto">
              {signatures.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-navy-800">{s.title}</span>
                  <span className="flex flex-shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${signatureStatusClass[s.status]}`}>
                      {signatureStatusLabel[s.status]}
                    </span>
                    <form action={deleteSignatureRequest}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="clientId" value={clientId} />
                      <button type="submit" className="text-muted hover:text-red-600" title="Excluir">
                        ✕
                      </button>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="mb-2 text-sm font-medium text-navy-800">Enviar novo documento</p>
          <form action={createSignatureRequest} className="space-y-2">
            <input type="hidden" name="clientId" value={clientId} />
            <input name="title" required placeholder="Ex.: Contrato de honorários" className={fld} />
            <select name="type" defaultValue="CONTRATO_HONORARIOS" className={fld}>
              <option value="CONTRATO_HONORARIOS">Contrato de honorários</option>
              <option value="PROCURACAO">Procuração</option>
              <option value="DECLARACAO">Declaração</option>
              <option value="OUTRO">Outro</option>
            </select>
            <input type="file" name="file" accept=".pdf,.doc,.docx,image/*" className="w-full text-xs" />
            <button
              type="submit"
              className="w-full rounded-md bg-petrol-600 px-3 py-2 text-sm font-semibold text-white hover:bg-petrol-700"
            >
              Enviar para assinatura
            </button>
          </form>

          {total > 0 && (
            <a
              href={`/admin/clientes/${clientId}`}
              className="mt-3 block text-center text-xs font-medium text-petrol-600 hover:text-petrol-700"
            >
              Ver downloads e ficha completa →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
