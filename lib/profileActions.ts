"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const editableFields = ["name", "phone", "address"] as const;
type EditableField = (typeof editableFields)[number];

function isEditableField(value: string): value is EditableField {
  return (editableFields as readonly string[]).includes(value);
}

export async function updateProfileField(field: string, value: string) {
  const session = await auth();
  if (!session?.user.id) {
    return { ok: false, message: "Требуется вход в аккаунт." };
  }
  if (!isEditableField(field)) {
    return { ok: false, message: "Неизвестное поле." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { [field]: value.trim() || null },
  });

  return { ok: true, message: "Сохранено." };
}
