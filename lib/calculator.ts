// Calc2State's fields are plain strings (not literal unions) because the
// option sets they reference are admin-editable at runtime via the
// CalculatorOption table (see lib/calculatorOptionsData.ts) — the set of
// valid keys isn't knowable at compile time anymore.
export type Calc2State = {
  area: number;
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

export type CalculatorOptionRow = { key: string; label: string; value: number; isFixed: boolean };

export type CalculatorOptionsByField = {
  OBJECT_TYPE: CalculatorOptionRow[];
  DIRT: CalculatorOptionRow[];
  BUILDING_TYPE: CalculatorOptionRow[];
  REGION: CalculatorOptionRow[];
  URGENCY: CalculatorOptionRow[];
  STAFF: CalculatorOptionRow[];
  EXTRA: CalculatorOptionRow[];
};

// Each option carries its value plus whether that value is a multiplier or a
// flat ruble amount (isFixed), so the price formula can treat them differently.
export type OptionMeta = { value: number; isFixed: boolean };
type MetaRecord = Record<string, OptionMeta>;

export type CalculatorCoefficients = {
  objectType: MetaRecord;
  dirt: MetaRecord;
  buildingType: MetaRecord;
  region: MetaRecord;
  urgency: MetaRecord;
  staff: MetaRecord;
  extra: MetaRecord;
};

export function coefficientsFrom(options: CalculatorOptionsByField): CalculatorCoefficients {
  const toRecord = (rows: CalculatorOptionRow[]): MetaRecord =>
    Object.fromEntries(rows.map((r) => [r.key, { value: r.value, isFixed: r.isFixed }]));
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

// A selected option contributes either a multiplier (neutral 1 when it's a
// fixed-price option or missing) or a flat ruble add (0 unless it's fixed).
function mult(rec: MetaRecord, key: string): number {
  const m = rec[key];
  return m && !m.isFixed ? m.value : 1;
}
function fixed(rec: MetaRecord, key: string): number {
  const m = rec[key];
  return m && m.isFixed ? m.value : 0;
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

// Scaled down from the old 1-10 "severity" scale's 40-per-point (÷5, matching
// the 1-50 "area" scale being 5x wider) so a mid-range input still prices out
// to roughly the same amount as before.
const BASE_PER_SQM = 8;

export function computeCalc2(state: Calc2State, coef: CalculatorCoefficients) {
  // Extras (multi-select): fixed ones add rubles, multiplier ones multiply.
  let extrasFixedSum = 0;
  let extrasMultiplier = 1;
  for (const key of Object.keys(state.extras)) {
    if (!state.extras[key]) continue;
    const m = coef.extra[key];
    if (!m) continue;
    if (m.isFixed) extrasFixedSum += m.value;
    else extrasMultiplier *= m.value;
  }

  const conditionFactor = mult(coef.dirt, state.dirt) * mult(coef.objectType, state.objectType);

  let raw =
    (BASE_PER_SQM * state.area * conditionFactor * mult(coef.region, state.region) + extrasFixedSum) *
    mult(coef.buildingType, state.buildingType) *
    mult(coef.urgency, state.urgency) *
    extrasMultiplier;

  // Fixed-price single-selects add a flat amount on top, outside the multipliers.
  raw +=
    fixed(coef.dirt, state.dirt) +
    fixed(coef.objectType, state.objectType) +
    fixed(coef.region, state.region) +
    fixed(coef.buildingType, state.buildingType) +
    fixed(coef.urgency, state.urgency) +
    fixed(coef.staff, state.staff);

  const price = Math.max(150, Math.round(raw));
  // Staff is a time divider; a fixed-price staff option divides by 1 (mult()).
  const time = Math.max(1, Math.round(((state.area / 10) * conditionFactor) / mult(coef.staff, state.staff)));
  return { price, time };
}
