import { prisma } from "@/lib/prisma";

export async function getUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string, name: string, passwordHash: string, phone?: string) {
  return prisma.user.create({
    data: { email, name, passwordHash, ...(phone ? { phone } : {}) },
  });
}

export async function updateUser(userId: string, data: any) {
  return prisma.user.update({ where: { id: userId }, data });
}

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, phone: true, createdAt: true },
  });
}
