"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/dbEnums";

const validRoles: UserRole[] = ["USER", "ADMIN", "BANNED"];

export async function updateUserRole(userId: string, formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Never let an admin lock themselves out by demoting/banning their own
  // account — they'd have no way back in without direct DB access.
  if (userId === session.user.id) return;

  const role = String(formData.get("role") ?? "") as UserRole;
  if (!validRoles.includes(role)) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  revalidatePath("/admin/orders");
}
