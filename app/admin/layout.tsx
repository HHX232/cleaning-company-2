import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { adminEmail, destroyAdminSession, isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  // /admin/login has no session (middleware guarantees this is the only
  // reachable page in that state) — it renders its own centered form, no
  // nav chrome needed.
  if (!authenticated) {
    return <>{children}</>;
  }

  async function logout() {
    "use server";
    await destroyAdminSession();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink [&>a]:whitespace-nowrap [&>a:hover]:text-primary">
          <Link href="/admin">Главная страница</Link>
          <Link href="/admin/team">Команда</Link>
          <Link href="/admin/service-pages">Страницы услуг</Link>
          <Link href="/admin/about">О компании</Link>
          <Link href="/admin/orders">Заказы</Link>
          <Link href="/admin/promos">Акции</Link>
          <Link href="/admin/services">Услуги</Link>
          <Link href="/admin/gallery">Примеры работ</Link>
          <Link href="/admin/calculator">Калькулятор</Link>
          <Link href="/admin/prices">Цены</Link>
          <Link href="/admin/reviews">Отзывы</Link>
          <Link href="/admin/callbacks">Заявки на звонок</Link>
          <Link href="/admin/settings">Настройки</Link>
        </nav>
        <form action={logout} className="shrink-0">
          <button type="submit" className="text-sm whitespace-nowrap text-muted hover:text-ink">
            Выйти ({adminEmail()})
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
