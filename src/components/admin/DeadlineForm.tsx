"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { createDeadline, type DeadlineFormState } from "@/app/admin/prazos/actions";

const initialState: DeadlineFormState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

export function DeadlineForm() {
  const [state, formAction, pending] = useActionState(createDeadline, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-xl border border-line bg-white p-5" noValidate>
      <h2 className="font-semibold text-navy-800">Novo prazo</h2>

      {state.message && (
        <p
          role="alert"
          className={`rounded-lg px-4 py-2.5 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={label}>Título *</label>
          <input id="title" name="title" required className={field} placeholder="Ex.: Contestação — Proc. 0001234-..." />
        </div>
        <div>
          <label htmlFor="dueDate" className={label}>Vencimento *</label>
          <input id="dueDate" name="dueDate" type="date" required className={field} />
        </div>
        <div>
          <label htmlFor="processNumber" className={label}>Nº do processo (opcional)</label>
          <input id="processNumber" name="processNumber" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className={label}>Descrição (opcional)</label>
          <textarea id="description" name="description" rows={2} className={field} />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Cadastrar prazo"}
      </Button>
    </form>
  );
}
