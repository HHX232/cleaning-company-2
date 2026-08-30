import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";

// Single access point for reading/writing site images. The bytes live in
// S3-compatible object storage (srvstorage.kz); the DB keeps only a tiny
// SiteImage metadata row (key, mimeType, updatedAt) so URL cache-busting
// (imageUrl below) and the homepage's cheap key→updatedAt lookup keep
// working without ever loading image bytes through the database.

function objectKey(key: string): string {
  return `images/${key}`;
}

// Returns the bytes + content type for the public serve route. Reads only
// from S3 — the DB isn't touched on image serves.
export async function getImage(key: string): Promise<{ data: Buffer; mimeType: string } | null> {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: objectKey(key) }));
    if (!res.Body) return null;
    const data = Buffer.from(await res.Body.transformToByteArray());
    return { data, mimeType: res.ContentType ?? "application/octet-stream" };
  } catch (err) {
    // NoSuchKey (or any miss) → 404 at the route level.
    if ((err as { name?: string }).name === "NoSuchKey") return null;
    throw err;
  }
}

// srvstorage.kz throws OperationAborted ("a conflicting conditional operation
// is currently in progress") when a PUT races another op on the same key.
// It's transient and the AWS SDK doesn't retry it on its own ($retryable is
// undefined for this error), so retry it here with a short backoff.
async function putObjectWithRetry(command: PutObjectCommand, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await s3.send(command);
    } catch (err) {
      const isConflict = (err as { Code?: string }).Code === "OperationAborted";
      if (!isConflict || attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
}

export async function putImage(key: string, data: Buffer, mimeType: string) {
  await putObjectWithRetry(
    new PutObjectCommand({ Bucket: S3_BUCKET, Key: objectKey(key), Body: data, ContentType: mimeType }),
  );
  // Metadata row drives the ?v= cache-buster and the homepage lookup.
  return prisma.siteImage.upsert({
    where: { key },
    update: { mimeType },
    create: { key, mimeType },
  });
}

// updatedAt may arrive as a string when the caller read it through
// unstable_cache (which serializes Prisma results through JSON, turning
// Date into a string) instead of a direct Prisma call.
export function imageUrl(key: string, updatedAt: Date | string) {
  return `/api/images/${key}?v=${new Date(updatedAt).getTime()}`;
}
