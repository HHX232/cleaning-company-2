import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/lib/s3";

// Chat attachments live in S3 under chat/<chatId>/<attachmentKey>. Unlike
// site images they're served only through an auth-gated route, never a
// public URL, so a chat's files stay visible only to its participants.

function objectKey(chatId: string, attachmentKey: string): string {
  return `chat/${chatId}/${attachmentKey}`;
}

export async function putChatAttachment(
  chatId: string,
  attachmentKey: string,
  data: Buffer,
  mimeType: string,
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey(chatId, attachmentKey),
      Body: data,
      ContentType: mimeType,
    }),
  );
}

export async function getChatAttachment(
  chatId: string,
  attachmentKey: string,
): Promise<{ data: Buffer; mimeType: string } | null> {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: objectKey(chatId, attachmentKey) }));
    if (!res.Body) return null;
    const data = Buffer.from(await res.Body.transformToByteArray());
    return { data, mimeType: res.ContentType ?? "application/octet-stream" };
  } catch (err) {
    if ((err as { name?: string }).name === "NoSuchKey") return null;
    throw err;
  }
}
