import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { imageUrl, putImage } from "@/lib/imageStorage";

const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const targetFields = ["photoUrl", "heroImageUrl", "consultationImageUrl", "beforeUrl", "afterUrl"] as const;
type TargetField = (typeof targetFields)[number];

function isTargetField(value: FormDataEntryValue | null): value is TargetField {
  return typeof value === "string" && (targetFields as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const form = await request.formData();
  const key = form.get("key");
  const file = form.get("file");
  const redirectTo = form.get("redirectTo");
  const targetTable = form.get("targetTable");
  const targetId = form.get("targetId");
  const targetField = form.get("targetField");

  if (typeof key !== "string" || !(file instanceof File) || typeof redirectTo !== "string") {
    return new Response("Invalid form data", { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return new Response("File must be an image", { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return new Response("Image too large (max 4MB)", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await putImage(key, buffer, file.type);

  if (typeof targetTable === "string" && typeof targetId === "string" && isTargetField(targetField)) {
    const url = imageUrl(key, image.updatedAt);
    if (targetTable === "teamMember") {
      await prisma.teamMember.update({ where: { id: targetId }, data: { photoUrl: url } });
    } else if (targetTable === "servicePage") {
      await prisma.servicePage.update({ where: { id: targetId }, data: { [targetField]: url } });
      const page = await prisma.servicePage.findUnique({ where: { id: targetId }, select: { slug: true } });
      if (page) revalidatePath(`/${page.slug}`);
    } else if (targetTable === "galleryItem" && (targetField === "beforeUrl" || targetField === "afterUrl")) {
      await prisma.galleryItem.update({ where: { id: targetId }, data: { [targetField]: url } });
    }
  }

  revalidatePath("/");
  revalidatePath(redirectTo);

  return Response.redirect(new URL(redirectTo, request.url), 303);
}
