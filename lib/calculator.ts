// Calc2State's fields are plain strings (not literal unions) because the
// option sets they reference are admin-editable at runtime via the
// CalculatorOption table (see lib/calculatorOptionsData.ts) — the set of
// valid keys isn't knowable at compile time anymore.
export type Calc2State = {
  severity: number;
  objectType: string;
  dirt: string;
  buildingType: string;
  region: string;
  urgency: string;
  staff: string;
  extras: Record<string, boolean>;
  // Set when the customer picks an exact date/time via "Выбрать дату"
  // instead of a Срочность tier — used only for the final Order.date, not
  // pricing (urgency is still derived from the picked date and stored
  // normally above).
  desiredDate: string | null;
  desiredTime: string | null;
};

export type CalculatorOptionRow = { key: string; label: string; value: number };

export type CalculatorOptionsByField = {
  OBJECT_TYPE: CalculatorOptionRow[];
  DIRT: CalculatorOptionRow[];
  BUILDING_TYPE: CalculatorOptionRow[];
  REGION: CalculatorOptionRow[];
  URGENCY: CalculatorOptionRow[];
  STAFF: CalculatorOptionRow[];
  EXTRA: CalculatorOptionRow[];
};

export type CalculatorCoefficients = {
  objectType: Record<string, number>;
  dirt: Record<string, number>;
  buildingType: Record<string, number>;
  region: Record<string, number>;
  urgency: Record<string, number>;
  staff: Record<string, number>;
  extra: Record<string, number>;
};

export function coefficientsFrom(options: CalculatorOptionsByField): CalculatorCoefficients {
  const toRecord = (rows: CalculatorOptionRow[]) => Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    objectType: toRecord(options.OBJECT_TYPE),
    dirt: toRecord(options.DIRT),
    buildingType: toRecord(options.BUILDING_TYPE),
    region: toRecord(options.REGION),
    urgency: toRecord(options.URGENCY),
    staff: toRecord(options.STAFF),
    extra: toRecord(options.EXTRA),
  };
}

export function labelFor(rows: CalculatorOptionRow[], key: string): string {
  return rows.find((r) => r.key === key)?.label ?? key;
}

// Derives which Срочность tier a picked calendar date corresponds to for
// pricing purposes (today/tomorrow/planned), falling back to the first
// available urgency option if none of those keys exist.
export function effectiveUrgencyKey(date: Date, urgencyOptions: CalculatorOptionRow[]): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  const preferredKey = diffDays <= 0 ? "today" : diffDays === 1 ? "tomorrow" : "planned";
  const match = urgencyOptions.find((u) => u.key === preferredKey);
  return match ? match.key : (urgencyOptions[0]?.key ?? "");
}

export function toDateInputString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const BASE_PER_SEVERITY_POINT = 40;

export function computeCalc2(state: Calc2State, coef: CalculatorCoefficients) {
  const extrasSum = Object.keys(state.extras).reduce(
    (sum, key) => sum + (state.extras[key] ? (coef.extra[key] ?? 0) : 0),
    0,
  );
  const severityFactor = (coef.dirt[state.dirt] ?? 1) * (coef.objectType[state.objectType] ?? 1);
  const raw =
    (BASE_PER_SEVERITY_POINT * state.severity * severityFactor * (coef.region[state.region] ?? 1) + extrasSum) *
    (coef.buildingType[state.buildingType] ?? 1) *
    (coef.urgency[state.urgency] ?? 1);
  const price = Math.max(150, Math.round(raw));
  const time = Math.max(1, Math.round(((state.severity / 2) * severityFactor) / (coef.staff[state.staff] ?? 1)));
  return { price, time };
}
