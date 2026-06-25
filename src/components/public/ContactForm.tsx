"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/(public)/contato/actions";
import { Button } from "@/components/ui/Button";

const initial: ContactState = { ok: false };

const field =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-navy-800 placeholder:text-muted/70 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok && state.message) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="font-medium text-emerald-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && !state.ok && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Nome completo *
          </label>
          <input id="name" name="name" required className={field} autoComplete="name" />
          <FieldError errors={state.errors?.name} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Telefone / WhatsApp
          </label>
          <input id="phone" name="phone" className={field} autoComplete="tel" inputMode="tel" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={label}>
          E-mail *
        </label>
        <input id="email" name="email" type="email" required className={field} autoComplete="email" />
        <FieldError errors={state.errors?.email} />
      </div>

      <div>
        <label htmlFor="subject" className={label}>
          Assunto
        </label>
        <select id="subject" name="subject" className={field} defaultValue="">
          <option value="" disabled>
            Selecione um assunto
          </option>
          <option>Negativa de cobertura</option>
          <option>Medicamento de alto custo</option>
          <option>Cirurgia / procedimento</option>
          <option>Home care</option>
          <option>Reembolso</option>
          <option>Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Descreva sua situação *
        </label>
        <textarea id="message" name="message" required rows={5} className={field} />
        <FieldError errors={state.errors?.message} />
      </div>

      {/* honeypot anti-spam (oculto) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <p className="text-xs text-muted">
        Ao enviar, você concorda com o tratamento dos seus dados conforme a LGPD, exclusivamente
        para retorno do atendimento.
      </p>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}
