import { prisma } from "@/lib/prisma";

export async function getAllPolicies() {
  return prisma.policy.findMany();
}

export async function getPolicyByType(type: string) {
  return prisma.policy.findFirst({ where: { type } });
}

export async function createPolicy(data: any) {
  return prisma.policy.create({ data });
}

export async function updatePolicy(id: string, data: any) {
  return prisma.policy.update({ where: { id }, data });
}

export async function deletePolicy(id: string) {
  return prisma.policy.delete({ where: { id } });
}
