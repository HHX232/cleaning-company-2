import { prisma } from "@/lib/prisma";
import { formatRuDateTime } from "@/lib/orderStatus";
import { markCallbackHandled } from "./actions";

export default async function AdminCallbacksPage() {
  const requests = await prisma.callbackRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-160">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Заявки на звонок</h1>

      {requests.length === 0 && <p className="text-sm text-muted">Пока нет заявок.</p>}

      {requests.length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
          {requests.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 px-4 py-3 ${i !== 0 ? "border-t border-border" : ""} ${
                r.handledAt ? "opacity-50" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-ink">{r.phone}</div>
                <div className="text-xs text-muted">
                  {r.source === "telegram" ? "Из Telegram-бота" : "С сайта"} · {formatRuDateTime(r.createdAt)}
                </div>
              </div>
              {r.handledAt ? (
                <span className="shrink-0 text-xs font-bold text-muted">Обработана</span>
              ) : (
                <form action={markCallbackHandled.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary"
                  >
                    Отметить обработанной
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
