"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signDigital, uploadSignedDoc } from "@/app/area-cliente/actions";

export function SignatureActions({ id, hasFile }: { id: string; hasFile: boolean }) {
  const [agree, setAgree] = useState(false);

  return (
    <div className="mt-4 space-y-4 border-t border-line pt-4">
      {hasFile && (
        <a
          href={`/api/arquivo/${id}?tipo=doc`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-petrol-600 hover:text-petrol-700"
        >
          Baixar documento
        </a>
      )}

      {/* Assinatura eletrônica por aceite */}
      <form action={signDigital} className="rounded-lg bg-surface p-4">
        <input type="hidden" name="id" value={id} />
        <label className="flex items-start gap-2.5 text-sm text-navy-700">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line"
          />
          Declaro que li o documento e concordo em assiná-lo eletronicamente. Meu nome, data e IP
          serão registrados como aceite.
        </label>
        <Button type="submit" size="sm" disabled={!agree} className="mt-3">
          Assinar digitalmente
        </Button>
      </form>

      {/* Assinatura física: upload do assinado */}
      <form action={uploadSignedDoc} className="rounded-lg border border-line p-4">
        <p className="text-sm font-medium text-navy-700">Preferiu assinar no papel?</p>
        <p className="mt-1 text-xs text-muted">
          Baixe acima, assine fisicamente, digitalize e envie o arquivo assinado.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            required
            accept=".pdf,image/*,.doc,.docx"
            className="text-sm"
          />
          <Button type="submit" size="sm" variant="outline">
            Enviar assinado
          </Button>
        </div>
      </form>
    </div>
  );
}
