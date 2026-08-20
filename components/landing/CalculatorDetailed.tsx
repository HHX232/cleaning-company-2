"use client";

import { useState } from "react";
import { toast } from "sonner";
import { roomOptions } from "@/lib/content";
import {
  Calc2State,
  CalculatorOptionsByField,
  coefficientsFrom,
  computeCalc2,
  effectiveUrgencyKey,
  labelFor,
  toDateInputString,
} from "@/lib/calculator";
import { createOrderFromCalculator } from "@/lib/orderCreation";
import PhoneConsentModal from "./PhoneConsentModal";
import TelegramOptInModal from "./TelegramOptInModal";
import DateTimePicker from "./DateTimePicker";
import { Pill, EmptyGroupNotice } from "./CalculatorPill";

export default function CalculatorDetailed({ options }: { options: CalculatorOptionsByField }) {
  const [rooms, setRooms] = useState("2");
  const [calc, setCalc] = useState<Calc2State>({
    area: 25,
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
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [lastPhone, setLastPhone] = useState("");

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

  function handleSubmitOrder() {
    setPhoneOpen(true);
  }

  return (
    <section id="calculator" className="bg-surface px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-2 text-center text-2xl font-extrabold text-ink sm:text-[30px]">Подробный расчёт стоимости</h2>
      <p className="mb-6 text-center text-sm text-muted sm:mb-8">
        Учитывает тип объекта, состояние, доп. услуги, область и срочность
      </p>

      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-[1fr_340px] lg:gap-6">
        <div className="flex flex-col gap-6 rounded-[18px] border border-border bg-bg p-5 sm:p-7">
          <div>
            <div className="mb-2.5 text-sm font-bold text-ink">Тип объекта</div>
            <div className="flex flex-wrap gap-2">
              {options.OBJECT_TYPE.length === 0 && <EmptyGroupNotice />}
              {options.OBJECT_TYPE.map((o) => (
                <Pill
                  key={o.key}
                  active={o.key === calc.objectType}
                  onClick={() => setCalc((s) => ({ ...s, objectType: o.key }))}
                  className="px-4 py-2.5 text-[13px]"
                >
                  {o.label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2.5 flex justify-between text-sm font-bold text-ink">
              <span>Площадь, м²</span>
              <span>{calc.area >= 150 ? "150+" : calc.area} м²</span>
            </div>
            <input
              type="range"
              min={1}
              max={150}
              step={1}
              value={calc.area}
              onChange={(e) => setCalc((s) => ({ ...s, area: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <div className="mb-2.5 text-sm font-bold text-ink">Количество комнат</div>
            <div className="flex gap-2">
              {roomOptions.map((r) => (
                <Pill
                  key={r}
                  active={r === rooms}
                  onClick={() => setRooms(r)}
                  className="flex h-10 w-10 items-center justify-center text-[13px]"
                >
                  {r}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2.5 text-sm font-bold text-ink">Состояние помещения</div>
            <div className="flex flex-wrap gap-2">
              {options.DIRT.length === 0 && <EmptyGroupNotice />}
              {options.DIRT.map((d) => (
                <Pill
                  key={d.key}
                  active={d.key === calc.dirt}
                  onClick={() => setCalc((s) => ({ ...s, dirt: d.key }))}
                  className="px-4 py-2.5 text-[13px]"
                >
                  {d.label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2.5 text-sm font-bold text-ink">Дополнительные услуги</div>
            <div className="grid grid-cols-2 gap-2">
              {options.EXTRA.map((ex) => {
                const checked = Boolean(calc.extras[ex.key]);
                return (
                  <div
                    key={ex.key}
                    onClick={() => toggleExtra(ex.key)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: checked ? "color-mix(in srgb, var(--color-primary) 12%, transparent)" : "var(--color-surface)" }}
                  >
                    <div
                      className="h-4 w-4 shrink-0 rounded-[4px]"
                      style={{ background: checked ? "var(--color-primary)" : "var(--color-border)" }}
                    />
                    <span className="text-[13px] font-semibold text-ink">{ex.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="mb-2 text-[13px] font-bold text-ink">Тип здания</div>
              {options.BUILDING_TYPE.length === 0 && <EmptyGroupNotice />}
              {options.BUILDING_TYPE.map((b) => (
                <Pill
                  key={b.key}
                  active={b.key === calc.buildingType}
                  onClick={() => setCalc((s) => ({ ...s, buildingType: b.key }))}
                  className="mb-1.5 px-2.5 py-2 text-xs"
                >
                  {b.label}
                </Pill>
              ))}
            </div>
            <div>
              <div className="mb-2 text-[13px] font-bold text-ink">Область</div>
              {options.REGION.length === 0 && <EmptyGroupNotice />}
              {options.REGION.map((r) => (
                <Pill
                  key={r.key}
                  active={r.key === calc.region}
                  onClick={() => setCalc((s) => ({ ...s, region: r.key }))}
                  className="mb-1.5 px-2.5 py-2 text-xs"
                >
                  {r.label}
                </Pill>
              ))}
            </div>
            <div>
              <div className="mb-2 text-[13px] font-bold text-ink">Срочность</div>
              {options.URGENCY.length === 0 && <EmptyGroupNotice />}
              {options.URGENCY.map((u) => (
                <Pill
                  key={u.key}
                  active={!calc.desiredDate && u.key === calc.urgency}
                  onClick={() => pickUrgencyTier(u.key)}
                  className="mb-1.5 px-2.5 py-2 text-xs"
                >
                  {u.label}
                </Pill>
              ))}
              <Pill
                active={!!calc.desiredDate || showDatePicker}
                onClick={() => setShowDatePicker(true)}
                className="mb-1.5 px-2.5 py-2 text-xs"
              >
                {calc.desiredDate ? `${calc.desiredDate} ${calc.desiredTime}` : "Выбрать дату"}
              </Pill>
            </div>
          </div>

          {showDatePicker && (
            <div>
              <div className="mb-2.5 flex items-center justify-between text-sm font-bold text-ink">
                <span>Желаемые дата и время</span>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="text-xs font-semibold text-muted hover:text-ink"
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
            <div className="mb-2.5 text-sm font-bold text-ink">Бригада</div>
            <div className="flex gap-2">
              {options.STAFF.length === 0 && <EmptyGroupNotice />}
              {options.STAFF.map((s) => (
                <Pill
                  key={s.key}
                  active={s.key === calc.staff}
                  onClick={() => setCalc((st) => ({ ...st, staff: s.key }))}
                  className="px-4 py-2.5 text-[13px]"
                >
                  {s.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="flex h-fit flex-col gap-3.5 rounded-[18px] bg-dark p-6 sm:p-7 lg:sticky lg:top-5">
          <span className="text-[13px] text-[#cfcfcf]">Итоговая цена от</span>
          <span className="text-[40px] leading-none font-extrabold text-white">{result.price} руб.</span>
          <div className="my-1.5 h-px bg-white/15" />
          <div className="text-[13px] leading-relaxed text-[#cfcfcf]">
            Время работ: ≈ {result.time} ч
            <br />
            Бригада: {labelFor(options.STAFF, calc.staff)}
          </div>
          <button
            type="button"
            onClick={handleSubmitOrder}
            className="mt-2.5 cursor-pointer rounded-[9px] bg-primary px-5.5 py-3.5 text-center text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Рассчитать точную стоимость
          </button>
          <span className="text-[11px] leading-snug text-[#8a8a8a]">
            Ориентировочная цена — менеджер подтвердит итоговую сумму после уточнения деталей
          </span>
        </div>
      </div>

      <PhoneConsentModal
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        onSubmit={async (phone, address, consent) => {
          const id = toast.loading("Отправляем заявку…");
          const outcome = await createOrderFromCalculator(phone, address, consent, calc);
          if (outcome.ok) {
            toast.success("Заявка отправлена! Менеджер свяжется с вами.", { id });
            setPhoneOpen(false);
            setLastPhone(phone);
            setTelegramOpen(true);
          } else {
            toast.dismiss(id);
          }
          return outcome;
        }}
      />
      <TelegramOptInModal open={telegramOpen} phone={lastPhone} onClose={() => setTelegramOpen(false)} />
    </section>
  );
}
