"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USER_ROLES, type UserRole } from "@/lib/dbEnums";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function normalizeRole(raw: FormDataEntryValue | null): UserRole {
  const role = String(raw ?? "USER");
  return (USER_ROLES as readonly string[]).includes(role) ? (role as UserRole) : "USER";
}

export async function updateUserRole(userId: string, formData: FormData) {
  const session = await requireAdmin();
  // Never let an admin lock themselves out by demoting/banning their own account.
  if (userId === session.user.id) return;

  const role = normalizeRole(formData.get("role"));
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  revalidatePath("/admin/orders");
}

// Create a user straight away — no email verification (admin-created account).
export async function createUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const role = normalizeRole(formData.get("role"));

  if (!email || password.length < 6) return;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      name: name || null,
      phone: phone || null,
      address: address || null,
    },
  });
  revalidatePath("/admin/users");
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const isSelf = userId === session.user.id;

  if (!email) return;
  // Guard email uniqueness against other accounts.
  const clash = await prisma.user.findUnique({ where: { email } });
  if (clash && clash.id !== userId) return;

  const data: {
    email: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    role?: UserRole;
    passwordHash?: string;
  } = {
    email,
    name: name || null,
    phone: phone || null,
    address: address || null,
  };
  // Role editable here too, except an admin can't change their own role.
  if (!isSelf) data.role = normalizeRole(formData.get("role"));
  if (password.length >= 6) data.passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id: userId }, data });
  revalidatePath("/admin/users");
  revalidatePath("/admin/orders");
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();
  // Can't delete your own admin account.
  if (userId === session.user.id) return;
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/admin/orders");
}
