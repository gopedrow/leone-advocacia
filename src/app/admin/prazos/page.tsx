import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { DeadlineForm } from "@/components/admin/DeadlineForm";
import { formatDate } from "@/lib/labels";
import { toggleDeadlineDone, deleteDeadline } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPrazos() {
  await requireAdmin();
  const deadlines = await safeQuery(
    () => prisma.deadline.findMany({ orderBy: [{ done: "asc" }, { dueDate: "asc" }] }),
    []
  );

  const today = new Date();

  return (
    <>
      <PageTitle title="Controle de Prazos" subtitle="Agenda de prazos do escritório." />

      <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <DeadlineForm />

        <div>
          <h2 className="mb-4 font-semibold text-navy-800">Prazos cadastrados</h2>
          {deadlines.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
              Nenhum prazo cadastrado.
            </p>
          ) : (
            <ul className="space-y-3">
              {deadlines.map((d) => {
                const overdue = !d.done && new Date(d.dueDate) < today;
                return (
                  <li
                    key={d.id}
                    className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-5 ${
                      overdue ? "border-red-200" : "border-line"
                    } ${d.done ? "opacity-60" : ""}`}
                  >
                    <div>
                      <p className={`font-medium text-navy-800 ${d.done ? "line-through" : ""}`}>
                        {d.title}
                      </p>
                      {d.processNumber && (
                        <p className="font-mono text-xs text-muted">{d.processNumber}</p>
                      )}
                      {d.description && <p className="mt-1 text-sm text-muted">{d.description}</p>}
                      <p className={`mt-1 text-sm font-semibold ${overdue ? "text-red-600" : "text-petrol-600"}`}>
                        {d.done ? "Concluído" : `Vence ${formatDate(d.dueDate)}`}
                        {overdue ? " · atrasado" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                      <form action={toggleDeadlineDone}>
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="done" value={(!d.done).toString()} />
                        <button type="submit" className="font-medium text-petrol-600 hover:text-petrol-700">
                          {d.done ? "Reabrir" : "Concluir"}
                        </button>
                      </form>
                      <form action={deleteDeadline}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" className="font-medium text-muted hover:text-red-600">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
