"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type Faq = { id: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line bg-white">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-navy-800">{it.question}</span>
                <Icon
                  name="arrowRight"
                  className={cn(
                    "h-5 w-5 shrink-0 text-petrol-500 transition-transform",
                    isOpen ? "rotate-90" : "rotate-0"
                  )}
                />
              </button>
            </h3>
            {isOpen && (
              <div className="px-6 pb-5 -mt-1 leading-relaxed text-muted">{it.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
