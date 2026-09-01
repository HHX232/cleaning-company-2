"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function createTeamMember(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name || !role) return;

  await prisma.teamMember.create({ data: { name, role, order } });
  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function updateTeamMember(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name || !role) return;

  await prisma.teamMember.update({ where: { id }, data: { name, role, order } });
  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/");
}
