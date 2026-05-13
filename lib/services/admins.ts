import { prisma } from "@/lib/prisma";

export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({ where: { email } });
}

export async function getAdminById(id: string) {
  return prisma.admin.findUnique({ where: { id } });
}
