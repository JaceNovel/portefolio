-- Create the WebProject table (present in Prisma schema but missing from initial migration)

CREATE TABLE IF NOT EXISTS "WebProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebProject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WebProject_slug_key" ON "WebProject"("slug");
CREATE INDEX IF NOT EXISTS "WebProject_createdAt_idx" ON "WebProject"("createdAt");
