"use client";

import { useEffect, useRef, useState } from "react";
import { company } from "@/lib/content";

type DropdownItem = { label: string; href: string };
type NavItem = { label: string; href?: string; dropdown?: DropdownItem[] };
type ServiceBlockLite = { slotId: string; items: string[] };

// Every dropdown label below now has a real DB-backed page served by the
// dynamic app/[slug] route. Each map turns a menu label into its slug;
// hrefFrom() falls back to the catalog section for any unmatched label.
const hrefFrom = (map: Record<string, string>) => (label: string) => map[label] ?? "/#catalog";

const windowServiceSlugs: Record<string, string> = {
  "Мойка витрин": "/moyka-vitrin",
  "Сезонная": "/sezonnaya-mojka-okon",
  "После ремонта": "/mojka-okon-posle-remonta",
  "В квартире": "/mojka-okon-v-kvartire",
  "В доме": "/mojka-okon-v-dome",
  "В офисе": "/mojka-okon-v-ofise",
};
const windowServiceHref = hrefFrom(windowServiceSlugs);

const houseServiceSlugs: Record<string, string> = {
  "Генеральная": "/generalnaya-uborka-doma",
  "Точечная": "/tochechnaya-uborka-doma",
  "Срочная": "/srochnaya-uborka-doma",
  "Коттедж": "/uborka-kottedzha",
  "Дача": "/uborka-dachi",
  "После ремонта": "/uborka-doma-posle-remonta",
};
const houseServiceHref = hrefFrom(houseServiceSlugs);

const incidentServiceSlugs: Record<string, string> = {
  "После пожара": "/uborka-posle-pozhara",
  "После потопа": "/uborka-posle-potopa",
  "После прорыва канализации": "/uborka-posle-proryva-kanalizacii",
  "Слив воды с натяжного потолка": "/sliv-vody-s-natyazhnogo-potolka",
  "Удаление плесени": "/udalenie-pleseni",
  "После гибели домашнего питомца": "/uborka-posle-gibeli-pitomca",
  "Тротуарная плитка": "/ochistka-trotuarnoy-plitki",
  "Запущенные помещения": "/uborka-zapushchennyh-pomeshcheniy",
  "Дезинфекция": "/dezinfekciya",
  "Расчистка участка": "/raschistka-uchastka",
  "После смерти человека": "/uborka-posle-smerti",
  "Удаление запахов": "/udalenie-zapahov",
  "Уборка очень грязных квартир": "/uborka-ochen-gryaznyh-kvartir",
  "Уборка после Плюшкина": "/uborka-posle-plyushkina",
  "Антисанитарные помещения": "/uborka-antisanitarnyh-pomeshcheniy",
  "После алкоголиков": "/uborka-posle-alkogolikov",
  "После больных людей": "/uborka-posle-bolnyh-lyudey",
  "Вывоз мусора": "/vyvoz-musora",
  "Демонтаж": "/demontazh",
  "Травля насекомых": "/travlya-nasekomyh",
  "Голубиный помет": "/uborka-golubinogo-pometa",
  "Холодный туман": "/obrabotka-holodnym-tumanom",
};
const incidentServiceHref = hrefFrom(incidentServiceSlugs);

const flatServiceSlugs: Record<string, string> = {
  "Генеральная": "/generalnaya-uborka",
  "Ежедневная": "/ezhednevnaya-uborka",
  "Точечная": "/tochechnaya-uborka",
  "Разовая": "/razovaya-uborka",
  "Поддерживающая": "/podderzhivayuschaya-uborka",
  "После ремонта": "/uborka-kvartiry-posle-remonta",
  "Комплексная": "/kompleksnaya-uborka-kvartiry",
  "Срочная уборка": "/srochnaya-uborka",
  "После аренды": "/uborka-posle-arendy",
  "Однокомнатной": "/odnokomnatnaya-kvartira",
  "Двухкомнатной": "/dvuhkomnatnaya-kvartira",
  "Трехкомнатной": "/trehkomnatnaya-kvartira",
  "Четырехкомнатной": "/chetyrehkomnatnaya-kvartira",
  "Уборка кухни": "/uborka-kuhni",
  "Уборка ванной": "/uborka-vannoy-komnaty",
  "Антисанитарных квартир": "/uborka-antisanitarnoy-kvartiry",
  "Запущенных квартир": "/uborka-zapushchennoy-kvartiry",
  "Уборка балкона": "/uborka-balkona",
};
const flatServiceHref = hrefFrom(flatServiceSlugs);

const roomServiceSlugs: Record<string, string> = {
  "Офисов": "/uborka-ofisov",
  "Бизнес-центров": "/uborka-biznes-centrov",
  "Торговых центров": "/uborka-torgovyh-centrov",
  "Салонов красоты": "/uborka-salonov-krasoty",
  "Медицинских центров": "/uborka-medicinskih-centrov",
  "Ресторанов и кафе": "/uborka-restoranov-i-kafe",
  "Служебных помещений": "/uborka-sluzhebnyh-pomeshcheniy",
  "Производственных помещений": "/uborka-proizvodstvennyh-pomeshcheniy",
  "Учебных заведений": "/uborka-uchebnyh-zavedeniy",
  "Нежилых": "/uborka-nezhilyh-pomeshcheniy",
  "Складских помещений": "/uborka-skladskih-pomeshcheniy",
  "Паркинга": "/uborka-parkinga",
  "Автосалонов": "/uborka-avtosalonov",
  "Фитнес клубов": "/uborka-fitnes-klubov",
  "Магазинов": "/uborka-magazinov",
  "Бассейнов, бани и сауны": "/uborka-basseynov-bani-i-sauny",
};
const roomServiceHref = hrefFrom(roomServiceSlugs);

function itemsFor(blocks: ServiceBlockLite[], slotId: string): string[] {
  return blocks.find((b) => b.slotId === slotId)?.items ?? [];
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5.5C3 4.67 3.67 4 4.5 4H7l2 4.5-2 1.5c.9 2.2 2.8 4.1 5 5l1.5-2L18 15v2.5c0 .83-.67 1.5-1.5 1.5C9.6 19 3 12.4 3 5.5Z" />
    </svg>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  if (item.dropdown) {
    return (
      <div className="border-b border-border">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-ink"
        >
          {item.label}
          <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
        {open && (
          <div className="flex flex-col gap-0.5 pb-3 pl-3">
            {item.dropdown.map((d) => (
              <a
                key={d.label}
                href={d.href}
                onClick={onNavigate}
                className="rounded-lg px-2 py-2 text-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-primary"
              >
                {d.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.href) {
    return (
      <a href={item.href} onClick={onNavigate} className="block border-b border-border py-3.5 text-sm font-semibold text-ink">
        {item.label}
      </a>
    );
  }

  return <span className="block border-b border-border py-3.5 text-sm font-semibold text-muted">{item.label}</span>;
}

export default function NavClient({ serviceBlocks }: { serviceBlocks: ServiceBlockLite[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems: NavItem[] = [
    {
      label: "Уборка квартир",
      dropdown: itemsFor(serviceBlocks, "svc-flats").map((label) => ({ label, href: flatServiceHref(label) })),
    },
    {
      label: "Уборка домов",
      dropdown: itemsFor(serviceBlocks, "svc-houses").map((label) => ({ label, href: houseServiceHref(label) })),
    },
    {
      label: "Уборка помещений",
      dropdown: itemsFor(serviceBlocks, "svc-rooms").map((label) => ({ label, href: roomServiceHref(label) })),
    },
    {
      label: "Спецуборка",
      dropdown: itemsFor(serviceBlocks, "svc-incidents").map((label) => ({ label, href: incidentServiceHref(label) })),
    },
    {
      label: "Окна",
      dropdown: itemsFor(serviceBlocks, "svc-windows").map((label) => ({ label, href: windowServiceHref(label) })),
    },
    {
      label: "О компании",
      dropdown: [
        { label: "О компании", href: "/o-kompanii" },
        { label: "Почему выбирают нас", href: "/pochemu-vybirayut-nas" },
        { label: "Наши гарантии", href: "/nashi-garantii" },
      ],
    },
    { label: "Цены", href: "/#prices" },
    { label: "Контакты", href: "/contacts" },
  ];

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [openIndex]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop nav */}
      <nav ref={navRef} className="hidden border-b border-border lg:block">
        <div className="mx-auto flex max-w-385 items-center gap-8 px-10 py-3.5 text-[15px] font-semibold text-ink">
        {navItems.map((item, i) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              if (!item.dropdown) return;
              cancelClose();
              setOpenIndex(i);
            }}
            onMouseLeave={() => {
              if (!item.dropdown) return;
              scheduleClose();
            }}
          >
            {item.dropdown ? (
              <button
                type="button"
                onClick={() => {
                  cancelClose();
                  setOpenIndex(i);
                }}
                aria-expanded={openIndex === i}
                className="flex items-center gap-1 transition-colors duration-150 hover:text-primary"
              >
                {item.label}
                <span
                  className={`text-xs transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
            ) : item.href ? (
              <a href={item.href} className="transition-colors duration-150 hover:text-primary">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}

            {item.dropdown && openIndex === i && (
              <div
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                className={`absolute top-full z-30 mt-3 rounded-xl border border-border bg-bg p-2 shadow-[0_16px_36px_rgba(0,0,0,0.14)] ${
                  item.dropdown.length > 9
                    ? "left-0 w-max min-w-110 columns-2 gap-x-1"
                    : "left-1/2 w-max min-w-55 -translate-x-1/2"
                }`}
              >
                {item.dropdown.map((d) => (
                  <a
                    key={d.label}
                    href={d.href}
                    onClick={() => setOpenIndex(null)}
                    className="block rounded-lg px-3.5 py-2.5 text-sm break-inside-avoid text-ink transition-colors duration-150 hover:bg-surface hover:text-primary"
                  >
                    {d.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      </nav>

      {/* Mobile trigger bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <BurgerIcon />
          Меню
        </button>
        <a
          href={`tel:+${company.phone.replace(/\D/g, "")}`}
          className="flex items-center gap-1.5 text-sm font-bold text-primary"
        >
          <PhoneIcon />
          {company.phone}
        </a>
      </div>

      {/* Mobile slide-in panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-65 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col overflow-y-auto bg-bg p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-extrabold text-ink">Меню</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col">
              {navItems.map((item) => (
                <MobileNavItem key={item.label} item={item} onNavigate={() => setMobileOpen(false)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
