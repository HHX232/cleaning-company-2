import type { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // /admin/login has no session (middleware guarantees this is the only
  // reachable page in that state) — it renders its own centered form, no
  // nav chrome needed.
  if (!session) {
    return <>{children}</>;
  }

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <nav className="flex gap-6 text-sm font-semibold text-ink">
          <Link href="/admin">Главная страница</Link>
          <Link href="/admin/team">Команда</Link>
          <Link href="/admin/service-pages">Страницы услуг</Link>
          <Link href="/admin/about">О компании</Link>
          <Link href="/admin/orders">Заказы</Link>
          <Link href="/admin/users">Пользователи</Link>
          <Link href="/admin/promos">Акции</Link>
          <Link href="/admin/services">Услуги</Link>
          <Link href="/admin/gallery">Примеры работ</Link>
          <Link href="/admin/calculator">Калькулятор</Link>
          <Link href="/admin/prices">Цены</Link>
          <Link href="/admin/reviews">Отзывы</Link>
          <Link href="/admin/chats">Чаты</Link>
          <Link href="/admin/callbacks">Заявки на звонок</Link>
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted">
            Выйти ({session.user.email})
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
