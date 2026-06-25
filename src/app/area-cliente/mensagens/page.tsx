import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safe-query";
import { PageTitle } from "@/components/dashboard/StatCard";
import { MessageForm } from "@/components/cliente/MessageForm";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function MensagensCliente() {
  const user = await requireUser();
  const messages = await safeQuery(
    () =>
      prisma.message.findMany({
        where: { OR: [{ recipientId: user.sub }, { senderId: user.sub }] },
        orderBy: { createdAt: "desc" },
        include: { sender: { select: { name: true } } },
        take: 50,
      }),
    []
  );

  return (
    <>
      <PageTitle title="Mensagens" subtitle="Comunicação direta com o escritório." />
      <div className="mb-6">
        <MessageForm />
      </div>
      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
          Nenhuma mensagem ainda. A advogada poderá enviar atualizações por aqui.
        </p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => {
            const mine = m.senderId === user.sub;
            return (
              <li
                key={m.id}
                className={`max-w-xl rounded-xl border p-4 ${
                  mine ? "ml-auto border-petrol-200 bg-petrol-50" : "border-line bg-white"
                }`}
              >
                <p className="text-sm text-navy-800">{m.body}</p>
                <p className="mt-2 text-xs text-muted">
                  {mine ? "Você" : m.sender.name} · {formatDate(m.createdAt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
