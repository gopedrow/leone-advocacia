"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import {
  setMovementDeadline,
  clearMovementDeadline,
  setMovementNoDeadline,
} from "@/app/admin/processos/actions";

type Status = "pending" | "set" | "none";

const today = () => new Date().toISOString().slice(0, 10);

const clockColor: Record<Status, string> = {
  pending: "text-gold-500 hover:bg-gold-500/10", // amarelo: prazo pendente
  set: "text-emerald-600 hover:bg-emerald-50", // verde: prazo cadastrado
  none: "text-navy-300 hover:bg-navy-50", // cinza: marcado sem prazo
};

const titleByStatus: Record<Status, string> = {
  pending: "Prazo pendente — clique para cadastrar",
  set: "Prazo cadastrado",
  none: "Sem prazo para esta movimentação",
};

export function MovementDeadline({
  movementId,
  processId,
  movementTitle,
  status,
  dueLabel,
}: {
  movementId: string;
  processId: string;
  movementTitle: string;
  status: Status;
  dueLabel?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={titleByStatus[status]}
        aria-label={titleByStatus[status]}
        className={cn("grid h-8 w-8 place-items-center rounded-md transition-colors", clockColor[status])}
      >
        <Icon name="clock" className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-line bg-white p-4 shadow-card">
          {status === "set" ? (
            <div>
              <p className="text-sm font-medium text-navy-800">Prazo cadastrado</p>
              <p className="mt-1 text-sm text-emerald-700">Vence em {dueLabel}</p>
              <form action={clearMovementDeadline} className="mt-3">
                <input type="hidden" name="movementId" value={movementId} />
                <input type="hidden" name="processId" value={processId} />
                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Remover prazo
                </button>
              </form>
            </div>
          ) : status === "none" ? (
            <div>
              <p className="text-sm font-medium text-navy-800">Marcada como “sem prazo”.</p>
              <form action={setMovementNoDeadline} className="mt-3">
                <input type="hidden" name="movementId" value={movementId} />
                <input type="hidden" name="processId" value={processId} />
                <input type="hidden" name="value" value="false" />
                <button type="submit" className="text-sm font-medium text-petrol-600 hover:text-petrol-700">
                  Reabrir (definir prazo)
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-navy-800">Cadastrar prazo</p>
              <form action={setMovementDeadline} className="space-y-2">
                <input type="hidden" name="movementId" value={movementId} />
                <input type="hidden" name="processId" value={processId} />
                <input
                  type="text"
                  name="title"
                  defaultValue={movementTitle}
                  placeholder="Título do prazo"
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={today()}
                  required
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-petrol-600 px-3 py-2 text-sm font-semibold text-white hover:bg-petrol-700"
                >
                  Salvar prazo
                </button>
              </form>
              <form action={setMovementNoDeadline}>
                <input type="hidden" name="movementId" value={movementId} />
                <input type="hidden" name="processId" value={processId} />
                <input type="hidden" name="value" value="true" />
                <button type="submit" className="text-sm font-medium text-muted hover:text-navy-800">
                  Não há prazo para esta movimentação
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
