"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Calc2State,
  CalculatorOptionsByField,
  coefficientsFrom,
  computeCalc2,
  effectiveUrgencyKey,
  labelFor,
  toDateInputString,
} from "@/lib/calculator";
import { createOrderFromCalculatorInChat, submitPhoneAndCreateOrderInChat } from "@/lib/orderCreation";
import { Pill, EmptyGroupNotice } from "@/components/landing/CalculatorPill";
import PhoneConsentModal from "@/components/landing/PhoneConsentModal";
import DateTimePicker from "@/components/landing/DateTimePicker";

export default function ChatOrderCalculator({
  chatId,
  options,
  onCreated,
  onCancel,
}: {
  chatId: string;
  options: CalculatorOptionsByField;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [calc, setCalc] = useState<Calc2State>({
    severity: 5,
    objectType: options.OBJECT_TYPE[0]?.key ?? "",
    dirt: options.DIRT[0]?.key ?? "",
    buildingType: options.BUILDING_TYPE[0]?.key ?? "",
    region: options.REGION[0]?.key ?? "",
    urgency: options.URGENCY[0]?.key ?? "",
    staff: options.STAFF[0]?.key ?? "",
    extras: {},
    desiredDate: null,
    desiredTime: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState({ phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleDateTimeSelect(date: Date, time: string) {
    const urgencyKey = effectiveUrgencyKey(date, options.URGENCY);
    setCalc((s) => ({ ...s, urgency: urgencyKey, desiredDate: toDateInputString(date), desiredTime: time }));
  }

  function pickUrgencyTier(key: string) {
    setShowDatePicker(false);
    setCalc((s) => ({ ...s, urgency: key, desiredDate: null, desiredTime: null }));
  }

  const coefficients = coefficientsFrom(options);
  const result = computeCalc2(calc, coefficients);

  const toggleExtra = (key: string) => setCalc((s) => ({ ...s, extras: { ...s.extras, [key]: !s.extras[key] } }));

  async function handleSubmitOrder() {
    setSubmitting(true);
    const id = toast.loading("Отправляем заявку…");
    const outcome = await createOrderFromCalculatorInChat(chatId, calc);
    setSubmitting(false);

    if (outcome.status === "created") {
      toast.success("Заявка отправлена! Менеджер свяжется с вами.", { id });
      onCreated();
      return;
    }
    toast.dismiss(id);
    if (outcome.status === "needs_phone") {
      setContactPrefill({ phone: outcome.phone ?? "", address: outcome.address ?? "" });
      setPhoneOpen(true);
      return;
    }
    toast.error("Требуется вход в аккаунт.");
  }

  return (
    <div className="flex w-full max-w-130 min-w-0 flex-col gap-4 rounded-2xl border border-border bg-bg px-4 py-4 text-ink">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-extrabold">Расчёт стоимости уборки</span>
        <button type="button" onClick={onCancel} className="text-xs font-semibold text-muted hover:text-ink">
          Отмена
        </button>
      </div>

      <div>
        <div className="mb-2 text-xs font-bold">Тип объекта</div>
        <div className="flex flex-wrap gap-1.5">
          {options.OBJECT_TYPE.length === 0 && <EmptyGroupNotice />}
          {options.OBJECT_TYPE.map((o) => (
            <Pill
              key={o.key}
              active={o.key === calc.objectType}
              onClick={() => setCalc((s) => ({ ...s, objectType: o.key }))}
              className="px-3 py-2 text-xs"
            >
              {o.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span>Тяжесть загрязнения</span>
          <span>{calc.severity} / 10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={calc.severity}
          onChange={(e) => setCalc((s) => ({ ...s, severity: Number(e.target.value) }))}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <div className="mb-2 text-xs font-bold">Состояние помещения</div>
        <div className="flex flex-wrap gap-1.5">
          {options.DIRT.length === 0 && <EmptyGroupNotice />}
          {options.DIRT.map((d) => (
            <Pill
              key={d.key}
              active={d.key === calc.dirt}
              onClick={() => setCalc((s) => ({ ...s, dirt: d.key }))}
              className="px-3 py-2 text-xs"
            >
              {d.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-bold">Дополнительные услуги</div>
        <div className="grid grid-cols-2 gap-1.5">
          {options.EXTRA.map((ex) => {
            const checked = Boolean(calc.extras[ex.key]);
            return (
              <div
                key={ex.key}
                onClick={() => toggleExtra(ex.key)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-2.5 py-2 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: checked ? "color-mix(in srgb, var(--color-primary) 12%, transparent)" : "var(--color-surface)" }}
              >
                <div
                  className="h-3.5 w-3.5 shrink-0 rounded-sm"
                  style={{ background: checked ? "var(--color-primary)" : "var(--color-border)" }}
                />
                <span className="text-[11px] font-semibold">{ex.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <div className="mb-1.5 text-[11px] font-bold">Тип здания</div>
          {options.BUILDING_TYPE.length === 0 && <EmptyGroupNotice />}
          {options.BUILDING_TYPE.map((b) => (
            <Pill
              key={b.key}
              active={b.key === calc.buildingType}
              onClick={() => setCalc((s) => ({ ...s, buildingType: b.key }))}
              className="mb-1 px-2 py-1.5 text-[11px]"
            >
              {b.label}
            </Pill>
          ))}
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold">Область</div>
          {options.REGION.length === 0 && <EmptyGroupNotice />}
          {options.REGION.map((r) => (
            <Pill
              key={r.key}
              active={r.key === calc.region}
              onClick={() => setCalc((s) => ({ ...s, region: r.key }))}
              className="mb-1 px-2 py-1.5 text-[11px]"
            >
              {r.label}
            </Pill>
          ))}
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold">Срочность</div>
          {options.URGENCY.length === 0 && <EmptyGroupNotice />}
          {options.URGENCY.map((u) => (
            <Pill
              key={u.key}
              active={!calc.desiredDate && u.key === calc.urgency}
              onClick={() => pickUrgencyTier(u.key)}
              className="mb-1 px-2 py-1.5 text-[11px]"
            >
              {u.label}
            </Pill>
          ))}
          <Pill
            active={!!calc.desiredDate || showDatePicker}
            onClick={() => setShowDatePicker(true)}
            className="mb-1 px-2 py-1.5 text-[11px]"
          >
            {calc.desiredDate ? `${calc.desiredDate} ${calc.desiredTime}` : "Выбрать дату"}
          </Pill>
        </div>
      </div>

      {showDatePicker && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span>Желаемые дата и время</span>
            <button
              type="button"
              onClick={() => setShowDatePicker(false)}
              className="text-[11px] font-semibold text-muted hover:text-ink"
            >
              Свернуть
            </button>
          </div>
          <DateTimePicker
            selectedDate={calc.desiredDate ? new Date(`${calc.desiredDate}T00:00:00`) : null}
            selectedTime={calc.desiredTime}
            onSelect={handleDateTimeSelect}
          />
        </div>
      )}

      <div>
        <div className="mb-2 text-xs font-bold">Бригада</div>
        <div className="flex gap-1.5">
          {options.STAFF.length === 0 && <EmptyGroupNotice />}
          {options.STAFF.map((s) => (
            <Pill
              key={s.key}
              active={s.key === calc.staff}
              onClick={() => setCalc((st) => ({ ...st, staff: s.key }))}
              className="px-3 py-2 text-xs"
            >
              {s.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-dark px-4 py-3.5 text-white">
        <span className="text-[11px] text-[#cfcfcf]">Итоговая цена от</span>
        <span className="text-2xl leading-none font-extrabold">{result.price} руб.</span>
        <span className="text-[11px] text-[#cfcfcf]">
          ≈ {result.time} ч · Бригада: {labelFor(options.STAFF, calc.staff)}
        </span>
        <button
          type="button"
          onClick={handleSubmitOrder}
          disabled={submitting}
          className="mt-1.5 rounded-lg bg-primary px-4 py-2.5 text-center text-[13px] font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Отправить заказ
        </button>
      </div>

      <PhoneConsentModal
        key={`${contactPrefill.phone}::${contactPrefill.address}`}
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        initialPhone={contactPrefill.phone}
        initialAddress={contactPrefill.address}
        onSubmit={async (phone, address, consent) => {
          const id = toast.loading("Отправляем заявку…");
          const outcome = await submitPhoneAndCreateOrderInChat(chatId, phone, address, consent, calc);
          if (outcome.ok) {
            toast.success("Заявка отправлена! Менеджер свяжется с вами.", { id });
            onCreated();
          } else {
            toast.dismiss(id);
          }
          return outcome;
        }}
      />
    </div>
  );
}
