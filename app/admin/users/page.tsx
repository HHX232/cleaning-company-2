import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveStatus, formatRuDate, kindPresentationFor, statusPresentation } from "@/lib/orderStatus";
import { updateUserRole } from "./actions";

const roleLabels: Record<string, string> = {
  USER: "Пользователь",
  ADMIN: "Админ",
  BANNED: "Забанен",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: { orders: { orderBy: { date: "desc" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-250">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Пользователи</h1>

      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const isSelf = user.id === session?.user.id;

          return (
            <div key={user.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-ink">{user.email}</div>
                  <div className="text-xs text-muted">
                    Зарегистрирован {formatRuDate(user.createdAt)}
                    {user.name && ` · ${user.name}`}
                    {user.phone && ` · ${user.phone}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-bold text-ink">
                    {roleLabels[user.role] ?? user.role}
                  </span>
                  {isSelf ? (
                    <span className="text-xs text-muted">(это вы)</span>
                  ) : (
                    <form action={updateUserRole.bind(null, user.id)} className="flex items-center gap-2">
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                      >
                        <option value="USER">Пользователь</option>
                        <option value="ADMIN">Админ</option>
                        <option value="BANNED">Забанен</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                      >
                        Сохранить
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {user.orders.length === 0 ? (
                <p className="text-xs text-muted">Заказов нет.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {user.orders.map((order) => {
                    const status = deriveStatus(order);
                    const presentation = statusPresentation[status];
                    const kind = kindPresentationFor(order.kind);

                    return (
                      <div
                        key={order.id}
                        className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5 text-xs"
                      >
                        <span className="font-bold text-ink">{order.title}</span>
                        <span className="text-muted">{kind.label}</span>
                        <span className="text-muted">{formatRuDate(order.date)}</span>
                        <span
                          className={`rounded-full px-2.5 py-1 font-bold ${presentation.bgClass} ${presentation.textClass}`}
                        >
                          {presentation.label}
                        </span>
                        <span className="ml-auto font-bold text-ink">{order.price} руб.</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
