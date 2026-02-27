import { execSync } from "node:child_process";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

const vercelEnv = process.env.VERCEL_ENV;
const isProduction = vercelEnv === "production";

run("npx prisma generate");

if (isProduction) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required on Vercel production to run prisma migrate deploy."
    );
  }
  run("npx prisma migrate deploy");
} else {
  console.log(
    `Skipping prisma migrate deploy (VERCEL_ENV=${vercelEnv ?? "undefined"}).`
  );
}

run("next build");
