"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import {
  PETITION_TEMPLATES,
  PETITION_TEMPLATE_GROUPS,
  type PetitionTemplate,
} from "@/config/peticoes";
import { createPetitionFromTemplate, type PetitionFormState } from "@/app/admin/documentos/actions";

const initialState: PetitionFormState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

export type GalleryContext = {
  processId?: string | null;
  processNumber?: string | null;
  processTitle?: string | null;
  movementId?: string | null;
  movementTitle?: string | null;
  clientId?: string | null;
};

export function TemplateGallery({
  clients,
  context,
}: {
  clients: { id: string; name: string }[];
  context: GalleryContext;
}) {
  const [selected, setSelected] = useState<PetitionTemplate | null>(null);
  const [state, formAction, pending] = useActionState(createPetitionFromTemplate, initialState);

  const grouped = PETITION_TEMPLATE_GROUPS.map((group) => ({
    group,
    items: PETITION_TEMPLATES.filter((t) => t.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {(context.processId || context.movementId) && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-petrol-100 bg-petrol-50 p-4 text-sm text-petrol-800">
          <Icon name="document" className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            Este documento será vinculado ao processo{" "}
            <strong>{context.processNumber ?? context.processId}</strong>
            {context.processTitle ? ` — ${context.processTitle}` : ""}
            {context.movementTitle ? (
              <>
                {" "}
                e à movimentação <strong>“{context.movementTitle}”</strong>
              </>
            ) : null}
            .
          </p>
        </div>
      )}

      <div className="space-y-9">
        {grouped.map(({ group, items }) => (
          <section key={group}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((tpl) => (
                <button
                  key={tpl.slug}
                  type="button"
                  onClick={() => setSelected(tpl)}
                  className="group flex flex-col items-start gap-3 rounded-xl border border-line bg-white p-5 text-left shadow-soft transition-shadow hover:shadow-card hover:border-petrol-200"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol-50 text-petrol-700 transition-colors group-hover:bg-petrol-100">
                    <Icon name="document" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy-800">{tpl.title}</span>
                    <span className="mt-1 block text-sm text-muted">{tpl.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-line bg-white p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl font-semibold text-navy-800">{selected.title}</h3>
            <p className="mt-1 text-sm text-muted">{selected.description}</p>

            <form action={formAction} className="mt-5 space-y-4">
              <input type="hidden" name="templateSlug" value={selected.slug} />
              {context.processId && <input type="hidden" name="processId" value={context.processId} />}
              {context.movementId && <input type="hidden" name="movementId" value={context.movementId} />}

              {state.message && !state.ok && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {state.message}
                </p>
              )}

              <div>
                <label htmlFor="title" className={label}>Nome da peça *</label>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={selected.title}
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="clientId" className={label}>Cliente *</label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  defaultValue={context.clientId ?? ""}
                  className={field}
                >
                  <option value="" disabled>Selecione…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="opposingParty" className={label}>Parte contrária</label>
                <input
                  id="opposingParty"
                  name="opposingParty"
                  className={field}
                  placeholder="Ex.: Unimed Goiânia / Estado de Goiás"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button type="submit" disabled={pending}>
                  {pending ? "Criando..." : "Criar e abrir editor"}
                </Button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-sm font-medium text-muted hover:text-navy-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
