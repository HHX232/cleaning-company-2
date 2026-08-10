"use client";

import { useState } from "react";

type DateTimePickerProps = {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelect: (date: Date, time: string) => void;
};

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`);

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function DateTimePicker({ selectedDate, selectedTime, onSelect }: DateTimePickerProps) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selectedDate ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const isCurrentMonth = viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() === today.getMonth();

  const firstWeekday = (viewMonth.getDay() + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  function pickDay(day: Date) {
    onSelect(day, selectedTime ?? TIME_SLOTS[0]);
  }

  function pickTime(time: string) {
    onSelect(selectedDate ?? today, time);
  }

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-border bg-surface p-4 sm:flex-row sm:gap-6">
      <div className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            disabled={isCurrentMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-bg disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Предыдущий месяц"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-ink">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-bg"
            aria-label="Следующий месяц"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <span key={i} />;
            const past = day < today;
            const active = selectedDate && isSameDay(day, selectedDate);
            return (
              <button
                key={i}
                type="button"
                disabled={past}
                onClick={() => pickDay(day)}
                className={`h-8 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : past
                      ? "cursor-not-allowed text-muted/40"
                      : "text-ink hover:bg-bg"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex max-h-60 w-full flex-col gap-1.5 overflow-y-auto sm:w-28">
        {TIME_SLOTS.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => pickTime(time)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              time === selectedTime ? "bg-primary text-on-primary" : "bg-bg text-ink hover:bg-border/40"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
