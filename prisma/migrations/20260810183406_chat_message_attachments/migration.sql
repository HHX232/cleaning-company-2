-- Chat message attachments (kind FILE): bytes in S3, these columns hold the
-- S3 key, original filename and mime type.
ALTER TABLE "ChatMessage" ADD COLUMN "attachmentKey" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "attachmentType" TEXT;
