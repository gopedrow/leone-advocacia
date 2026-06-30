"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { savePetition } from "@/app/admin/documentos/actions";
import { petitionCategoryLabel, petitionStatusLabel } from "@/lib/labels";

type PetitionData = {
  id: string;
  title: string;
  category: string;
  status: string;
  content: string;
  clientId: string | null;
  opposingParty: string | null;
  processId: string | null;
  process: { id: string; number: string; title: string } | null;
  movement: { id: string; title: string } | null;
};

const field =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1 block text-xs font-medium text-navy-700";

export function DocumentEditor({
  petition,
  clients,
}: {
  petition: PetitionData;
  clients: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState(petition.title);
  const [category, setCategory] = useState(petition.category);
  const [status, setStatus] = useState(petition.status);
  const [clientId, setClientId] = useState(petition.clientId ?? "");
  const [opposingParty, setOpposingParty] = useState(petition.opposingParty ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingContent = useRef<((html: string) => void) | null>(null);
  // Mantém os valores mais recentes acessíveis dentro do listener de mensagens
  const latest = useRef({ title, category, status, clientId, opposingParty });
  latest.current = { title, category, status, clientId, opposingParty };

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "wysiwyg:ready") {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "wysiwyg:init", html: petition.content },
          "*"
        );
      } else if (msg.type === "wysiwyg:content") {
        pendingContent.current?.(msg.html ?? "");
        pendingContent.current = null;
      } else if (msg.type === "wysiwyg:save") {
        void persist(msg.html ?? "");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petition.content]);

  function requestContent(): Promise<string> {
    return new Promise((resolve) => {
      pendingContent.current = resolve;
      iframeRef.current?.contentWindow?.postMessage({ type: "wysiwyg:requestContent" }, "*");
      setTimeout(() => {
        if (pendingContent.current) {
          pendingContent.current("");
          pendingContent.current = null;
        }
      }, 4000);
    });
  }

  async function persist(html: string) {
    const v = latest.current;
    if (!v.title.trim() || !v.clientId) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    const res = await savePetition(petition.id, {
      title: v.title,
      category: v.category,
      status: v.status,
      clientId: v.clientId,
      opposingParty: v.opposingParty || null,
      processId: petition.processId,
      content: html,
    });
    setSaveState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setSaveState("idle"), 1800);
  }

  async function handleSave() {
    const html = await requestContent();
    await persist(html);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-1 flex-wrap items-end gap-3">
          <div>
            <Link href="/admin/documentos" className="mb-1.5 block text-xs text-petrol-600 hover:text-petrol-700">
              ← Documentos
            </Link>
            <label htmlFor="doc-title" className={label}>Peça</label>
            <input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${field} w-64`}
            />
          </div>
          <div>
            <label htmlFor="doc-category" className={label}>Tipo</label>
            <select
              id="doc-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${field} w-48`}
            >
              {Object.entries(petitionCategoryLabel).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="doc-client" className={label}>Cliente</label>
            <select
              id="doc-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={`${field} w-48`}
            >
              <option value="" disabled>Selecione…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="doc-opposing" className={label}>Parte contrária</label>
            <input
              id="doc-opposing"
              value={opposingParty}
              onChange={(e) => setOpposingParty(e.target.value)}
              className={`${field} w-48`}
              placeholder="Ex.: Unimed Goiânia"
            />
          </div>
          <div>
            <label htmlFor="doc-status" className={label}>Status</label>
            <select
              id="doc-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${field} w-40`}
            >
              {Object.entries(petitionStatusLabel).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          {petition.process && (
            <Link
              href={`/admin/processos/${petition.process.id}`}
              className="mb-0.5 self-end whitespace-nowrap rounded-full bg-navy-50 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-100"
            >
              Processo {petition.process.number}
              {petition.movement ? ` · ${petition.movement.title}` : ""}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 self-end">
          {saveState === "saving" && <span className="text-xs text-muted">Salvando…</span>}
          {saveState === "saved" && <span className="text-xs text-emerald-600">Salvo</span>}
          {saveState === "error" && <span className="text-xs text-red-600">Erro ao salvar</span>}
          <Button onClick={handleSave} disabled={saveState === "saving"}>
            {saveState === "saving" ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-line">
        <iframe
          ref={iframeRef}
          src="/editor/index.html?embedded=1"
          title="Editor de documento"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
