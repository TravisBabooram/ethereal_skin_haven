import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter } as any);

  const email = "admin@etherealskinhaven.com";
  const password = "Admin@2025!";
  const name = "Admin";

  const existing = await (prisma as any).admin.findUnique({ where: { email } });
  if (existing) {
    console.log("✓ Admin already exists:", email);
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await (prisma as any).admin.create({
    data: { email, name, passwordHash, role: "admin" },
  });

  console.log("✓ Admin created successfully");
  console.log("  Email:   ", email);
  console.log("  Password:", password);
  console.log("  ID:      ", admin.id);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
