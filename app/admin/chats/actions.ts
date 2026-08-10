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

export async function deleteChat(chatId: string) {
  await requireAdmin();
  // ChatMessage.chat is onDelete: Cascade, so messages go with it.
  await prisma.chat.delete({ where: { id: chatId } });
  revalidatePath("/admin/chats");
}
