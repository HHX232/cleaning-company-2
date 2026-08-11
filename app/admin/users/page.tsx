import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveStatus, formatRuDate, kindPresentationFor, statusPresentation } from "@/lib/orderStatus";
import { createUser, deleteUser, updateUser } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

function RoleSelect({ defaultValue, disabled }: { defaultValue: string; disabled?: boolean }) {
  return (
    <select name="role" defaultValue={defaultValue} disabled={disabled} className={inputClass}>
      <option value="USER">Пользователь</option>
      <option value="ADMIN">Админ</option>
      <option value="BANNED">Забанен</option>
    </select>
  );
}

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: { orders: { orderBy: { date: "desc" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-250">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Пользователи</h1>
      <p className="mb-6 text-sm text-muted">
        Можно редактировать данные, менять роль и пароль, создавать и удалять аккаунты. Новый аккаунт активен сразу,
        без подтверждения почты. Свою роль и свой аккаунт изменить/удалить нельзя.
      </p>

      <div className="mb-8 flex flex-col gap-4">
        {users.map((user) => {
          const isSelf = user.id === session?.user.id;

          return (
            <div key={user.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-bold text-ink">
                  {user.email}
                  {isSelf && <span className="ml-2 text-xs font-normal text-muted">(это вы)</span>}
                </div>
                <div className="text-xs text-muted">Зарегистрирован {formatRuDate(user.createdAt)}</div>
              </div>

              <form action={updateUser.bind(null, user.id)} className="mb-3 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className={labelClass}>
                    Email
                    <input type="email" name="email" defaultValue={user.email} required className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Имя
                    <input type="text" name="name" defaultValue={user.name ?? ""} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Телефон
                    <input type="text" name="phone" defaultValue={user.phone ?? ""} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Адрес
                    <input type="text" name="address" defaultValue={user.address ?? ""} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Роль {isSelf && "(нельзя менять свою)"}
                    <RoleSelect defaultValue={user.role} disabled={isSelf} />
                  </label>
                  <label className={labelClass}>
                    Новый пароль (необязательно, от 6 символов)
                    <input type="text" name="password" placeholder="оставьте пустым" className={inputClass} />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                    Сохранить
                  </button>
                  {!isSelf && (
                    <button
                      type="submit"
                      formAction={deleteUser.bind(null, user.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-[#b23434] hover:bg-bg"
                    >
                      Удалить аккаунт
                    </button>
                  )}
                </div>
              </form>

              {user.orders.length === 0 ? (
                <p className="border-t border-border pt-2 text-xs text-muted">Заказов нет.</p>
              ) : (
                <div className="flex flex-col gap-2 border-t border-border pt-2">
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
                        <span className={`rounded-full px-2.5 py-1 font-bold ${presentation.bgClass} ${presentation.textClass}`}>
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

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый пользователь</summary>
        <form action={createUser} className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className={labelClass}>
              Email
              <input type="email" name="email" placeholder="user@example.com" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Пароль (от 6 символов)
              <input type="text" name="password" placeholder="пароль" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Роль
              <RoleSelect defaultValue="USER" />
            </label>
            <label className={labelClass}>
              Имя
              <input type="text" name="name" className={inputClass} />
            </label>
            <label className={labelClass}>
              Телефон
              <input type="text" name="phone" className={inputClass} />
            </label>
            <label className={labelClass}>
              Адрес
              <input type="text" name="address" className={inputClass} />
            </label>
          </div>
          <div>
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
              Создать пользователя
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}
