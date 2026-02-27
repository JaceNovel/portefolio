import { execSync } from "node:child_process";

function run(cmd, options = {}) {
  const { allowFailure = false } = options;
  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch (error) {
    if (!allowFailure) throw error;
    console.warn(`Command failed but was allowed to continue: ${cmd}`);
    return false;
  }
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
    process.env.PRISMA_DATABASE_URL,
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
const strictMigrate = normalizeEnvValue(process.env.PRISMA_MIGRATE_STRICT).toLowerCase() === "true";

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

run("npx prisma generate");

if (isProduction) {
  if (!databaseUrl) {
    const message =
      "Skipping prisma migrate deploy: missing valid DATABASE_URL (or PRISMA_DATABASE_URL/POSTGRES_PRISMA_URL/POSTGRES_URL_NON_POOLING/POSTGRES_URL).";
    if (strictMigrate) {
      throw new Error(message);
    }
    console.warn(message);
  } else {
    run("npx prisma migrate deploy", { allowFailure: !strictMigrate });
  }
} else {
  console.log(
    `Skipping prisma migrate deploy (VERCEL_ENV=${vercelEnv ?? "undefined"}).`
  );
}

run("next build");
