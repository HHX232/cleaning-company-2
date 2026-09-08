"use client";

import { useRef, useState } from "react";

export type RepeaterField = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  rows?: number;
  placeholder?: string;
};

type Item = { id: string; values: Record<string, string> };

type RepeaterProps = {
  // Base name for this list's inputs — rendered as "<name>.<index>.<field>".
  name: string;
  fields: RepeaterField[];
  initialItems: Record<string, string>[];
  addLabel?: string;
  // A single-field repeater (fields has one entry) renders each row as one
  // wide input instead of a bordered card, for plain string lists (perks,
  // paragraphs, badges).
  emptyText?: string;
  // Fixed-length lists (photos tied to slots, per-position styling) hide the
  // add/remove/reorder controls — only the field values themselves change.
  fixed?: boolean;
};

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

let nextId = 0;
function makeId() {
  nextId += 1;
  return `r${Date.now()}-${nextId}`;
}

export default function Repeater({ name, fields, initialItems, addLabel = "+ Добавить", emptyText, fixed = false }: RepeaterProps) {
  const [items, setItems] = useState<Item[]>(() => initialItems.map((values) => ({ id: makeId(), values })));
  const isSimple = fields.length === 1;

  function add() {
    setItems((prev) => [...prev, { id: makeId(), values: Object.fromEntries(fields.map((f) => [f.name, ""])) }]);
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.id === id);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 && emptyText && <p className="text-xs text-muted">{emptyText}</p>}
      {items.map((item, i) => (
        <div
          key={item.id}
          className={isSimple ? "flex items-center gap-2" : "flex flex-col gap-2 rounded-lg border border-border bg-bg p-3"}
        >
          {!isSimple && !fixed && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted">#{i + 1}</span>
              <RowControls
                canUp={i > 0}
                canDown={i < items.length - 1}
                onUp={() => move(item.id, -1)}
                onDown={() => move(item.id, 1)}
                onRemove={() => remove(item.id)}
              />
            </div>
          )}
          {isSimple ? (
            <>
              <span className="w-5 shrink-0 text-xs font-bold text-muted">{i + 1}.</span>
              <input
                type="text"
                name={`${name}.${i}.${fields[0].name}`}
                defaultValue={item.values[fields[0].name]}
                placeholder={fields[0].placeholder}
                className={`${inputClass} flex-1`}
              />
              {!fixed && (
                <RowControls
                  canUp={i > 0}
                  canDown={i < items.length - 1}
                  onUp={() => move(item.id, -1)}
                  onDown={() => move(item.id, 1)}
                  onRemove={() => remove(item.id)}
                />
              )}
            </>
          ) : (
            fields.map((f) => (
              <label key={f.name} className={labelClass}>
                {f.label}
                {f.type === "textarea" ? (
                  <textarea
                    name={`${name}.${i}.${f.name}`}
                    defaultValue={item.values[f.name]}
                    placeholder={f.placeholder}
                    rows={f.rows ?? 3}
                    className={inputClass}
                  />
                ) : (
                  <input
                    type="text"
                    name={`${name}.${i}.${f.name}`}
                    defaultValue={item.values[f.name]}
                    placeholder={f.placeholder}
                    className={inputClass}
                  />
                )}
              </label>
            ))
          )}
        </div>
      ))}
      {!fixed && (
        <button
          type="button"
          onClick={add}
          className="self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-primary hover:text-primary"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}

function RowControls({
  canUp,
  canDown,
  onUp,
  onDown,
  onRemove,
}: {
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={!canUp}
        aria-label="Переместить выше"
        className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-surface hover:text-ink disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={!canDown}
        aria-label="Переместить ниже"
        className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-surface hover:text-ink disabled:opacity-30"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Удалить"
        className="flex h-6 items-center justify-center rounded px-2 text-[11px] font-bold text-red-600 hover:bg-red-50"
      >
        Удалить
      </button>
    </div>
  );
}
