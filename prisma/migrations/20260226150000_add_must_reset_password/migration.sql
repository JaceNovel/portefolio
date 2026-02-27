-- Add mustResetPassword flag for first-login reset
ALTER TABLE "Client" ADD COLUMN "mustResetPassword" BOOLEAN NOT NULL DEFAULT false;
