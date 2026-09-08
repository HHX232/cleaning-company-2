// Shared parsing for admin forms built with components/admin/Repeater.tsx.
// The repeater names its inputs "<prefix>.<index>.<field>" — this scans a
// FormData for that pattern and rebuilds the list, skipping rows left
// entirely blank (e.g. an "Add" click the admin didn't fill in).

export function parseRepeater(formData: FormData, prefix: string, fieldNames: string[]): Record<string, string>[] {
  const indices = new Set<number>();
  const re = new RegExp(`^${prefix}\\.(\\d+)\\.`);
  for (const key of formData.keys()) {
    const m = key.match(re);
    if (m) indices.add(Number(m[1]));
  }
  const sorted = [...indices].sort((a, b) => a - b);
  const items = sorted.map((i) => {
    const obj: Record<string, string> = {};
    for (const f of fieldNames) obj[f] = String(formData.get(`${prefix}.${i}.${f}`) ?? "").trim();
    return obj;
  });
  return items.filter((it) => Object.values(it).some((v) => v !== ""));
}

// For single-field repeaters (plain string lists — perks, paragraphs, badges).
export function parseRepeaterStrings(formData: FormData, prefix: string): string[] {
  return parseRepeater(formData, prefix, ["value"]).map((it) => it.value);
}
