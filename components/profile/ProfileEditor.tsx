"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfileField } from "@/lib/profileActions";
import { withPlusPrefix } from "@/lib/phone";

type ProfileEditorProps = {
  email: string;
  initialName: string | null;
  initialPhone: string | null;
  initialAddress: string | null;
  stats: { total: number; spent: number; tierLabel: string; nextDateLabel: string; lastCleaningLabel: string | null };
};

function initialsFor(name: string, email: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length > 0) {
    return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  }
  return email.charAt(0).toUpperCase();
}

export default function ProfileEditor({
  email,
  initialName,
  initialPhone,
  initialAddress,
  stats,
}: ProfileEditorProps) {
  const [name, setName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [address, setAddress] = useState(initialAddress ?? "");
  const [savingData, setSavingData] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  async function saveData() {
    setSavingData(true);
    const id = toast.loading("Сохраняем данные…");
    const [nameResult, phoneResult] = await Promise.all([
      updateProfileField("name", name),
      updateProfileField("phone", phone),
    ]);
    setSavingData(false);

    if (!nameResult.ok) {
      toast.error(nameResult.message, { id });
      return;
    }
    if (!phoneResult.ok) {
      toast.error(phoneResult.message, { id });
      return;
    }
    toast.success("Данные сохранены.", { id });
  }

  async function saveAddress() {
    setSavingAddress(true);
    const id = toast.loading("Сохраняем адрес…");
    const result = await updateProfileField("address", address);
    setSavingAddress(false);

    if (!result.ok) {
      toast.error(result.message, { id });
      return;
    }
    toast.success("Адрес сохранён.", { id });
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-[22px] bg-dark p-6 sm:col-span-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-on-primary">
            {initialsFor(name, email)}
          </div>
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={name}
              placeholder="Ваше имя"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/25 bg-white/8 px-2.5 py-1.5 text-[17px] font-extrabold text-white outline-none placeholder:text-white/40"
            />
            <input
              type="tel"
              value={phone}
              placeholder="Телефон"
              onChange={(e) => setPhone(withPlusPrefix(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-white/25 bg-white/8 px-2.5 py-1.5 text-[13px] text-white outline-none placeholder:text-white/40"
            />
            <div className="mt-1.5 truncate rounded-lg border border-transparent px-2.5 py-1.5 text-[13px] text-white/70">
              {email}
            </div>
            <button
              type="button"
              onClick={saveData}
              disabled={savingData}
              className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
            >
              Сохранить
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-[22px] bg-primary p-6">
          <div className="text-[32px] font-extrabold text-on-primary">{stats.total}</div>
          <div className="mt-1.5 text-xs text-on-primary/85">заказов всего</div>
          {stats.lastCleaningLabel && (
            <div className="mt-2 text-[11px] text-on-primary/70">
              Последняя уборка была {stats.lastCleaningLabel}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-[22px] border border-border bg-bg p-6">
          <div className="text-[32px] font-extrabold text-ink">{stats.spent} руб.</div>
          <div className="mt-1.5 text-xs text-muted">потрачено на уборку</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-border bg-bg p-5.5">
          <div className="mb-1.5 text-xs text-muted">Основной адрес</div>
          <input
            type="text"
            value={address}
            placeholder="Укажите адрес"
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-sm leading-relaxed font-bold text-ink outline-none"
          />
          <button
            type="button"
            onClick={saveAddress}
            disabled={savingAddress}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
          >
            Сохранить
          </button>
        </div>
        <div className="rounded-[22px] border border-border bg-bg p-5.5">
          <div className="mb-1.5 text-xs text-muted">Статус клиента</div>
          <div className="text-sm font-bold text-ink">{stats.tierLabel}</div>
        </div>
        <div className="rounded-[22px] border border-border bg-bg p-5.5">
          <div className="mb-1.5 text-xs text-muted">Следующая уборка</div>
          <div className="text-sm font-bold text-ink">{stats.nextDateLabel}</div>
        </div>
      </div>
    </>
  );
}
