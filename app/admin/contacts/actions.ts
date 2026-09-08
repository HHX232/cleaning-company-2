"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateContacts(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    eyebrow: s("eyebrow"),
    heading: s("heading"),
    lead: s("lead"),
    hoursValue: s("hoursValue"),
    hoursText: s("hoursText"),
    areaText: s("areaText"),
    phoneNote: s("phoneNote"),
    emailNote: s("emailNote"),
    messengersHeading: s("messengersHeading"),
    ctaTitle: s("ctaTitle"),
    ctaText: s("ctaText"),
  };

  await prisma.contactsPage.upsert({
    where: { id: "contacts" },
    update: data,
    create: { id: "contacts", ...data },
  });

  revalidatePath("/admin/contacts");
  revalidatePath("/contacts");
}
