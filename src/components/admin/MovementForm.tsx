"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { addMovement, type ProcessFormState } from "@/app/admin/processos/actions";

const initialState: ProcessFormState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

export function MovementForm({ processId }: { processId: string }) {
  const [state, formAction, pending] = useActionState(addMovement, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Limpa o formulário após sucesso.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-xl border border-line bg-white p-5" noValidate>
      <input type="hidden" name="processId" value={processId} />
      <h3 className="font-semibold text-navy-800">Adicionar movimentação</h3>

      {state.message && (
        <p
          role="alert"
          className={`rounded-lg px-4 py-2.5 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <div>
          <label htmlFor="date" className={label}>Data *</label>
          <input id="date" name="date" type="date" required className={field} />
        </div>
        <div>
          <label htmlFor="title" className={label}>Movimentação *</label>
          <input id="title" name="title" required className={field} placeholder="Ex.: Decisão — tutela de urgência deferida" />
        </div>
      </div>
      <div>
        <label htmlFor="description" className={label}>Detalhes (opcional)</label>
        <textarea id="description" name="description" rows={2} className={field} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Adicionando..." : "Adicionar e notificar cliente"}
      </Button>
    </form>
  );
}
