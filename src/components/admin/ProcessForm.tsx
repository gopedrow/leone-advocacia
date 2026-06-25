"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { ProcessFormState } from "@/app/admin/processos/actions";

type Action = (prev: ProcessFormState, formData: FormData) => Promise<ProcessFormState>;

export type ProcessInitial = {
  id?: string;
  number?: string;
  title?: string;
  clientId?: string;
  court?: string | null;
  jurisdiction?: string | null;
  className?: string | null;
  subject?: string | null;
  status?: string;
  distributedAt?: string;
};

const statusOptions = [
  ["ANALISE", "Análise do caso"],
  ["DISTRIBUIDO", "Distribuído"],
  ["EM_ANDAMENTO", "Em andamento"],
  ["RECURSO", "Fase recursal"],
  ["SUSPENSO", "Suspenso"],
  ["ENCERRADO", "Encerrado"],
] as const;

const initialState: ProcessFormState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

export function ProcessForm({
  action,
  mode,
  clients,
  initial,
}: {
  action: Action;
  mode: "create" | "edit";
  clients: { id: string; name: string }[];
  initial?: ProcessInitial;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      {mode === "edit" && <input type="hidden" name="id" defaultValue={initial?.id} />}

      {state.message && !state.ok && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={label}>Título do processo *</label>
          <input id="title" name="title" required defaultValue={initial?.title} className={field}
            placeholder="Ex.: Fornecimento de medicamento de alto custo" />
          <FieldError errors={state.errors?.title} />
        </div>

        <div>
          <label htmlFor="number" className={label}>Número (CNJ) *</label>
          <input id="number" name="number" required defaultValue={initial?.number} className={field}
            placeholder="0000000-00.0000.0.00.0000" />
          <FieldError errors={state.errors?.number} />
        </div>
        <div>
          <label htmlFor="clientId" className={label}>Cliente *</label>
          <select id="clientId" name="clientId" required defaultValue={initial?.clientId ?? ""} className={field}>
            <option value="" disabled>Selecione…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <FieldError errors={state.errors?.clientId} />
        </div>

        <div>
          <label htmlFor="court" className={label}>Tribunal</label>
          <input id="court" name="court" defaultValue={initial?.court ?? ""} className={field} placeholder="Ex.: TJGO" />
        </div>
        <div>
          <label htmlFor="jurisdiction" className={label}>Vara / Comarca</label>
          <input id="jurisdiction" name="jurisdiction" defaultValue={initial?.jurisdiction ?? ""} className={field} />
        </div>
        <div>
          <label htmlFor="className" className={label}>Classe processual</label>
          <input id="className" name="className" defaultValue={initial?.className ?? ""} className={field} />
        </div>
        <div>
          <label htmlFor="subject" className={label}>Assunto</label>
          <input id="subject" name="subject" defaultValue={initial?.subject ?? ""} className={field} />
        </div>
        <div>
          <label htmlFor="status" className={label}>Status</label>
          <select id="status" name="status" defaultValue={initial?.status ?? "ANALISE"} className={field}>
            {statusOptions.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="distributedAt" className={label}>Data de distribuição</label>
          <input id="distributedAt" name="distributedAt" type="date" defaultValue={initial?.distributedAt ?? ""} className={field} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Salvando..." : mode === "create" ? "Cadastrar processo" : "Salvar alterações"}
        </Button>
        <a href="/admin/processos" className="text-sm font-medium text-muted hover:text-navy-700">
          Cancelar
        </a>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}
