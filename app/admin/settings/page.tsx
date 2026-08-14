import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import TelegramLinkButton from "@/components/admin/TelegramLinkButton";
import { disconnectTelegram } from "@/lib/telegramLink";

export default async function AdminSettingsPage() {
  const settings = await prisma.adminSettings.findUnique({ where: { id: "admin" } });
  const linked = !!settings?.telegramChatId;

  return (
    <div className="mx-auto max-w-150">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Настройки</h1>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 text-sm font-bold text-ink">Telegram-уведомления</h2>
        <p className="mb-4 text-sm text-muted">
          {linked
            ? "Telegram подключён — сюда приходят новые заказы и заявки на звонок."
            : "Подключите Telegram, чтобы получать уведомления о новых заказах и заявках на звонок."}
        </p>
        {linked ? (
          <AdminForm action={disconnectTelegram}>
            <button type="submit" className="rounded-full border border-border px-4 py-2 text-[13px] font-bold text-ink">
              Отключить Telegram
            </button>
          </AdminForm>
        ) : (
          <TelegramLinkButton />
        )}
      </div>
    </div>
  );
}
