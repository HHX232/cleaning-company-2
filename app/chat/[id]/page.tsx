import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCalculatorOptions } from "@/lib/calculatorOptionsData";
import ChatRoom from "@/components/chat/ChatRoom";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user.id) redirect("/login");

  const chat = await prisma.chat.findUnique({ where: { id }, include: { user: true } });
  if (!chat) notFound();

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = chat.userId === session.user.id;
  if (!isOwner && !isAdmin) redirect("/profile");

  // An admin viewing their OWN chat (e.g. their own /profile demo chat) is
  // acting as the customer, not as support.
  const actingAsAdmin = isAdmin && !isOwner;

  const viewerRole = actingAsAdmin ? "ADMIN" : "USER";
  const title = chat.isDemo
    ? "Демо-чат (проверка задержки)"
    : actingAsAdmin
      ? `Чат с ${chat.user.email}`
      : "Чат с менеджером";

  // Placing an order only makes sense in the real support chat — the demo
  // chat is a private bot-latency sandbox admin's inbox never lists, so an
  // order made there would have no one to see the resulting preview card.
  const calculatorOptions = chat.isDemo ? undefined : await getCalculatorOptions();

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Header />
      <Nav />
      <div className="flex flex-1 flex-col">
        <ChatRoom chatId={chat.id} viewerRole={viewerRole} title={title} calculatorOptions={calculatorOptions} />
      </div>
    </div>
  );
}
