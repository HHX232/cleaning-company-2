"use client";

import { useEffect, useRef, useState } from "react";

type DropdownItem = { label: string; href: string };
type NavItem = { label: string; href?: string; dropdown?: DropdownItem[] };
type ServiceBlockLite = { slotId: string; items: string[] };

const toDropdown = (items: string[], href = "/#catalog"): DropdownItem[] =>
  items.map((label) => ({ label, href }));

// "Мойка витрин" has its own dedicated page now; the rest of the window
// services still land on the catalog section until they get one too.
const windowServiceHref = (label: string) => (label === "Мойка витрин" ? "/moyka-vitrin" : "/#catalog");

// Same idea for the apartment-cleaning subcategories that now have real
// pages. These are DB-backed service pages served by the dynamic
// app/[slug] route. The rest of this dropdown's items still land on the
// catalog section until they get dedicated pages too.
const flatServiceHref = (label: string) => {
  if (label === "Генеральная") return "/generalnaya-uborka";
  if (label === "Поддерживающая") return "/podderzhivayuschaya-uborka";
  if (label === "Срочная уборка") return "/srochnaya-uborka";
  if (label === "Ежедневная") return "/ezhednevnaya-uborka";
  if (label === "Разовая") return "/razovaya-uborka";
  if (label === "Однокомнатной") return "/odnokomnatnaya-kvartira";
  if (label === "Уборка кухни") return "/uborka-kuhni";
  if (label === "Антисанитарных квартир") return "/uborka-antisanitarnoy-kvartiry";
  return "/#catalog";
};

// Same idea for the room-cleaning subcategories.
const roomServiceHref = (label: string) => (label === "Офисов" ? "/uborka-ofisov" : "/#catalog");

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
    { label: "Уборка домов", dropdown: toDropdown(itemsFor(serviceBlocks, "svc-houses")) },
    {
      label: "Уборка помещений",
      dropdown: itemsFor(serviceBlocks, "svc-rooms").map((label) => ({ label, href: roomServiceHref(label) })),
    },
    { label: "Спецуборка", dropdown: toDropdown(itemsFor(serviceBlocks, "svc-incidents")) },
    {
      label: "Окна",
      dropdown: itemsFor(serviceBlocks, "svc-windows").map((label) => ({ label, href: windowServiceHref(label) })),
    },
    { label: "Новости" },
    {
      label: "О компании",
      dropdown: [
        { label: "Почему выбирают нас", href: "/#services" },
        { label: "Наши специалисты", href: "/#specialists" },
        { label: "Отзывы клиентов", href: "/#reviews" },
      ],
    },
    { label: "Контакты", href: "/#order" },
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
      <div className="flex items-center border-b border-border px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <BurgerIcon />
          Меню
        </button>
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
