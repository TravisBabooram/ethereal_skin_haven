import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@etherealskinhaven.com";
  const password = "Admin@2025!";
  const name = "Ethereal Skin Haven";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin account already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: { email, name, passwordHash, role: "admin" },
  });

  console.log("✅ Admin account created successfully.");
  console.log("   Email:", email);
}

main()
  .catch((e) => { console.error("Failed:", e); process.exit(1); })
  .finally(async () => { await pool.end(); });
