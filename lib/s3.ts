import { S3Client } from "@aws-sdk/client-s3";

export const S3_BUCKET = process.env.S3_BUCKET ?? "";

export function isS3Configured(): boolean {
  return Boolean(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && S3_BUCKET);
}

// forcePathStyle: srvstorage.kz (and most non-AWS S3-compatible providers)
// serve buckets as endpoint/bucket/key rather than bucket.endpoint, which
// would need wildcard DNS they don't provide.
export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
});
