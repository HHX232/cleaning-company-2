import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveStatus, formatRuDate } from "@/lib/orderStatus";
import { getOrCreateChat, getUnreadCountForUser, getUnreadCountForAdmin } from "@/lib/chat";
import { disconnectTelegram } from "@/lib/telegramLink";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import AdminForm from "@/components/admin/AdminForm";
import ProfileEditor from "@/components/profile/ProfileEditor";
import OrdersList from "@/components/profile/OrdersList";
import ChatButton from "@/components/profile/ChatButton";
import TelegramLinkButton from "@/components/profile/TelegramLinkButton";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { orders: { orderBy: { date: "desc" } } },
  });
  if (!user) redirect("/login");

  // Only completed (paid) orders count as actually spent — a scheduled or
  // in-progress order hasn't been paid for yet.
  const spent = user.orders.filter((o) => deriveStatus(o) === "done").reduce((sum, o) => sum + o.price, 0);
  const upcoming = user.orders
    .filter((o) => o.date >= new Date() && ["scheduled", "progress"].includes(deriveStatus(o)))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  const lastCleaning = user.orders
    .filter((o) => deriveStatus(o) === "done")
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  const total = user.orders.length;
  const tierLabel = total === 0 ? "Новый клиент" : total <= 3 ? "Постоянный клиент" : "VIP клиент";

  const isAdmin = user.role === "ADMIN";

  const [realChat, unreadCount, pendingOrdersCount, adminUnreadMessages] = await Promise.all([
    getOrCreateChat(user.id, false),
    getUnreadCountForUser(user.id),
    isAdmin
      ? prisma.order.count({ where: { assignedAt: null, completedAt: null, canceledAt: null } })
      : Promise.resolve(0),
    isAdmin ? getUnreadCountForAdmin() : Promise.resolve(0),
  ]);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />
      <Nav />
      <div className="mx-auto max-w-275 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-ink sm:text-[26px]">Личный кабинет</h1>
          <div className="flex flex-wrap items-center gap-3">
            <ChatButton chatId={realChat.id} unreadCount={unreadCount} />
            {isAdmin && (
              <>
                <Link
                  href="/admin/orders"
                  className="relative flex items-center gap-2 rounded-full bg-dark px-4 py-2 text-[13px] font-bold text-white"
                >
                  Перейти к заказам
                  {pendingOrdersCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d94b4b] px-1.5 text-[11px] font-bold text-white">
                      {pendingOrdersCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin/chats"
                  className="relative flex items-center gap-2 rounded-full bg-dark px-4 py-2 text-[13px] font-bold text-white"
                >
                  Перейти к сообщениям
                  {adminUnreadMessages > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d94b4b] px-1.5 text-[11px] font-bold text-white">
                      {adminUnreadMessages}
                    </span>
                  )}
                </Link>
              </>
            )}
            <Link href="/" className="text-[13px] font-bold text-primary">
              ← На главную
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3">
            <span className="text-[13px] font-bold text-ink">Уведомления в Telegram:</span>
            {user.telegramChatId ? (
              <>
                <span className="text-[13px] font-bold text-primary">✅ Подключено</span>
                <AdminForm action={disconnectTelegram} loadingText="Отключаем…" successText="Telegram отключён">
                  <button type="submit" className="text-[13px] font-bold text-muted hover:text-ink">
                    Отключить
                  </button>
                </AdminForm>
              </>
            ) : (
              <TelegramLinkButton />
            )}
          </div>
        )}

        <ProfileEditor
          email={user.email}
          initialName={user.name}
          initialPhone={user.phone}
          initialAddress={user.address}
          stats={{
            total,
            spent,
            tierLabel,
            nextDateLabel: upcoming ? formatRuDate(upcoming.date, false) : "—",
            lastCleaningLabel: lastCleaning ? formatRuDate(lastCleaning.date) : null,
          }}
        />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink sm:text-[19px]">Мои заказы</h2>
          <span className="text-xs text-muted">{user.orders.length} заказов</span>
        </div>

        <OrdersList orders={user.orders} />
      </div>
      <Footer id="order" />
    </div>
  );
}
