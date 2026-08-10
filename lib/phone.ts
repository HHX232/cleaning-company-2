// Normalizes to exactly one leading "+", regardless of how many the input
// already has — a plain `startsWith("+") ? value : "+" + value` check lets
// a "+" sneak in twice (e.g. deleting back to "+" and retyping, or mobile
// autofill inserting its own "+") since it only ever adds, never corrects.
export function withPlusPrefix(value: string): string {
  if (!value) return value;
  const digitsOnly = value.replace(/\+/g, "");
  return digitsOnly ? "+" + digitsOnly : "+";
}
