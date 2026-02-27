import { execSync } from "node:child_process";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function normalizeEnvValue(value) {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function resolveDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeEnvValue(candidate);
    if (!normalized) continue;
    if (/^postgres(ql)?:\/\//i.test(normalized)) return normalized;
  }

  return "";
}

const vercelEnv = process.env.VERCEL_ENV;
const isProduction = vercelEnv === "production";
const databaseUrl = resolveDatabaseUrl();

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

run("npx prisma generate");

if (isProduction) {
  if (!databaseUrl) {
    throw new Error(
      "A valid PostgreSQL DATABASE_URL is required on Vercel production (or POSTGRES_PRISMA_URL/POSTGRES_URL_NON_POOLING/POSTGRES_URL)."
    );
  }
  run("npx prisma migrate deploy");
} else {
  console.log(
    `Skipping prisma migrate deploy (VERCEL_ENV=${vercelEnv ?? "undefined"}).`
  );
}

run("next build");
