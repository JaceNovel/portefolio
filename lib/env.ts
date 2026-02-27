import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM: z.string().min(1).optional(),

  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  ADMIN_JWT_SECRET: z.string().min(16).optional(),

  CLIENT_JWT_SECRET: z.string().min(16).optional(),

  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
