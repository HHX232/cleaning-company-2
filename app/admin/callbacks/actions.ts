"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function markCallbackHandled(id: string) {
  await requireAdmin();
  await prisma.callbackRequest.update({ where: { id }, data: { handledAt: new Date() } });
  revalidatePath("/admin/callbacks");
}
