-- The previous migration (20260814182355_remove_accounts_phone_orders)
-- dropped User/Chat/ChatMessage/EmailVerification but never recreated
-- Order with "phone" instead of "userId" — this finishes that job.
-- Confirmed OK to lose any existing Order rows on this deploy.
DROP TABLE IF EXISTS "Order";

CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "address" TEXT,
    "price" INTEGER NOT NULL,
    "serviceDetail" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" DATETIME,
    "completedAt" DATETIME,
    "paidAt" DATETIME,
    "canceledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
