import { prisma } from "@/lib/prisma";

export async function getAllServices() {
  return prisma.service.findMany();
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: any) {
  return prisma.service.create({ data });
}

export async function updateService(id: string, data: any) {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string) {
  return prisma.service.delete({ where: { id } });
}

export async function getFeaturedServices(limit = 6) {
  return prisma.service.findMany({
    where: { featured: true },
    take: limit,
  });
}
