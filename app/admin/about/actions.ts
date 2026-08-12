"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

// Each non-empty line "left | right" becomes an object {a: left, b: right}.
function parsePairs(raw: string, a: string, b: string): Record<string, string>[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split("|");
      return { [a]: left.trim(), [b]: rest.join("|").trim() };
    });
}

export async function updateAbout(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    eyebrow: s("eyebrow"),
    heading: s("heading"),
    lead: s("lead"),
    stats: parsePairs(s("stats"), "value", "label"),
    missionTitle: s("missionTitle"),
    missionText1: s("missionText1"),
    missionText2: s("missionText2"),
    values: parsePairs(s("values"), "title", "text"),
    ctaTitle: s("ctaTitle"),
    ctaText: s("ctaText"),
  };

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: data,
    create: { id: "about", ...data },
  });

  revalidatePath("/admin/about");
  revalidatePath("/o-kompanii");
}
