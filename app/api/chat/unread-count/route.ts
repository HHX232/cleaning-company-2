import { auth } from "@/lib/auth";
import { getUnreadCountForAdmin, getUnreadCountForUser } from "@/lib/chat";

export async function GET() {
  const session = await auth();
  if (!session?.user.id) return new Response(null, { status: 401 });

  const count =
    session.user.role === "ADMIN" ? await getUnreadCountForAdmin() : await getUnreadCountForUser(session.user.id);

  return Response.json({ count });
}
