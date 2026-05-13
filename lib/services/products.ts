import { prisma } from "@/lib/prisma";

export async function getAllProducts() {
  return prisma.product.findMany();
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({ where: { category } });
}

export async function createProduct(data: any) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: any) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { featured: true },
    take: limit,
  });
}
