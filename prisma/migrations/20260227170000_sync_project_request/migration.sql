-- Sync ProjectRequest table with current Prisma schema
-- Fixes production drift where columns like `phone` don't exist yet.

ALTER TABLE "ProjectRequest" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "ProjectRequest" ADD COLUMN IF NOT EXISTS "requestType" TEXT;
ALTER TABLE "ProjectRequest" ADD COLUMN IF NOT EXISTS "budget" TEXT;
ALTER TABLE "ProjectRequest" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- `source` exists in the Prisma schema with a default.
ALTER TABLE "ProjectRequest" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "ProjectRequest" ALTER COLUMN "source" SET DEFAULT 'contact';
UPDATE "ProjectRequest" SET "source" = 'contact' WHERE "source" IS NULL;
ALTER TABLE "ProjectRequest" ALTER COLUMN "source" SET NOT NULL;

-- The schema makes these fields optional; the initial migration created them as NOT NULL.
ALTER TABLE "ProjectRequest" ALTER COLUMN "siteType" DROP NOT NULL;
ALTER TABLE "ProjectRequest" ALTER COLUMN "pageCount" DROP NOT NULL;
ALTER TABLE "ProjectRequest" ALTER COLUMN "options" DROP NOT NULL;
ALTER TABLE "ProjectRequest" ALTER COLUMN "estimateCents" DROP NOT NULL;
