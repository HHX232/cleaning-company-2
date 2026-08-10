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

export async function markCallbackHandled(id: string) {
  await requireAdmin();
  await prisma.callbackRequest.update({ where: { id }, data: { handledAt: new Date() } });
  revalidatePath("/admin/callbacks");
}
