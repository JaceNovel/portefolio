import fs from "fs";
import path from "path";

function ensurePrismaClientLink() {
  const root = process.cwd();
  const generatedDir = path.join(root, "node_modules", ".prisma", "client");
  const prismaPkgDir = path.join(root, "node_modules", "@prisma", "client");
  const linkDir = path.join(prismaPkgDir, ".prisma");
  const linkPath = path.join(linkDir, "client");

  if (!fs.existsSync(generatedDir)) {
    // Nothing we can do.
    return;
  }

  if (fs.existsSync(linkPath)) {
    return;
  }

  fs.mkdirSync(linkDir, { recursive: true });

  // Create a symlink if possible (fast). If it fails (e.g. filesystem constraints), copy instead.
  const relativeTarget = path.relative(linkDir, generatedDir);
  try {
    fs.symlinkSync(relativeTarget, linkPath, "dir");
  } catch {
    fs.cpSync(generatedDir, linkPath, { recursive: true });
  }
}

ensurePrismaClientLink();
