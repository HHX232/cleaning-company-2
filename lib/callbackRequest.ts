"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/telegramNotify";

export async function submitCallbackRequest(phone: string): Promise<{ ok: boolean; message: string }> {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { ok: false, message: "Укажите номер телефона." };
  }

  await prisma.callbackRequest.create({ data: { phone: trimmed, source: "site" } });
  revalidatePath("/admin/callbacks");

  notifyAdmins(`📞 <b>Заявка на звонок</b>\n${trimmed}`);

  return { ok: true, message: "Заявка отправлена!" };
}
