import { prisma } from "@/lib/prisma";

export async function getAllFAQs() {
  return prisma.fAQ.findMany({ orderBy: { order: "asc" } });
}

export async function getFAQByCategory(category: string) {
  return prisma.fAQ.findMany({ where: { category }, orderBy: { order: "asc" } });
}

export async function createFAQ(data: any) {
  return prisma.fAQ.create({ data });
}

export async function updateFAQ(id: string, data: any) {
  return prisma.fAQ.update({ where: { id }, data });
}

export async function deleteFAQ(id: string) {
  return prisma.fAQ.delete({ where: { id } });
}
