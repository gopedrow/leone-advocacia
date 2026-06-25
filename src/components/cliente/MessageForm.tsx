"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { sendMessage } from "@/app/area-cliente/actions";

export function MessageForm() {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await sendMessage(fd);
        ref.current?.reset();
      }}
      className="rounded-xl border border-line bg-white p-4"
    >
      <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-navy-700">
        Enviar mensagem ao escritório
      </label>
      <textarea
        id="body"
        name="body"
        required
        rows={3}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400"
        placeholder="Escreva sua mensagem..."
      />
      <div className="mt-3">
        <Button type="submit" size="sm">Enviar</Button>
      </div>
    </form>
  );
}
