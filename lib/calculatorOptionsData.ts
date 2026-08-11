import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { CalculatorOptionsByField } from "@/lib/calculator";
import { CALCULATOR_FIELDS, type CalculatorField } from "@/lib/dbEnums";

export const getCalculatorOptions = unstable_cache(
  async (): Promise<CalculatorOptionsByField> => {
    const rows = await prisma.calculatorOption.findMany({ orderBy: { order: "asc" } });
    const grouped: CalculatorOptionsByField = {
      OBJECT_TYPE: [],
      DIRT: [],
      BUILDING_TYPE: [],
      REGION: [],
      URGENCY: [],
      STAFF: [],
      EXTRA: [],
    };
    for (const row of rows) {
      // field is a plain string column now (SQLite) — skip any value that
      // isn't one of the known groups rather than crashing.
      if ((CALCULATOR_FIELDS as readonly string[]).includes(row.field)) {
        grouped[row.field as CalculatorField].push({
          key: row.key,
          label: row.label,
          value: row.value,
          isFixed: row.isFixed,
        });
      }
    }
    return grouped;
  },
  ["calculator-options"],
  { revalidate: 600 },
);
