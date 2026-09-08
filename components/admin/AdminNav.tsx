"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Главная",
    items: [{ href: "/admin", label: "Главная страница" }],
  },
  {
    title: "Страницы сайта",
    items: [
      { href: "/admin/about", label: "О компании" },
      { href: "/admin/why-us", label: "Почему выбирают нас" },
      { href: "/admin/guarantees", label: "Гарантии" },
      { href: "/admin/contacts", label: "Контакты" },
      { href: "/admin/legal", label: "Юр. документы" },
    ],
  },
  {
    title: "Услуги",
    items: [
      { href: "/admin/service-pages", label: "Страницы услуг" },
      { href: "/admin/service-categories", label: "Категории услуг" },
      { href: "/admin/service-shared", label: "Общий текст услуг" },
      { href: "/admin/services", label: "Услуги на главной" },
      { href: "/admin/prices", label: "Цены" },
      { href: "/admin/calculator", label: "Калькулятор" },
    ],
  },
  {
    title: "Контент",
    items: [
      { href: "/admin/team", label: "Команда" },
      { href: "/admin/gallery", label: "Примеры работ" },
      { href: "/admin/promos", label: "Акции" },
      { href: "/admin/reviews", label: "Отзывы" },
    ],
  },
  {
    title: "Заказы",
    items: [
      { href: "/admin/orders", label: "Заказы" },
      { href: "/admin/callbacks", label: "Заявки на звонок" },
    ],
  },
  {
    title: "Прочее",
    items: [{ href: "/admin/settings", label: "Настройки" }],
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="mb-1.5 px-2 text-[10px] font-extrabold tracking-[1px] text-muted uppercase">
            {group.title}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-ink hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
