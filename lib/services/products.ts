import { prisma } from "@/lib/prisma";

function stockStatus(qty: number): string {
  if (qty === 0) return "out_of_stock";
  if (qty <= 5) return "low_stock";
  return "available";
}

export async function getAllProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({ where: { category } });
}

export async function createProduct(data: any) {
  const qty = typeof data.stockQty === "number" ? data.stockQty : 0;
  return prisma.product.create({
    data: {
      ...data,
      stockQty: qty,
      availabilityStatus: data.availabilityStatus ?? stockStatus(qty),
    },
  });
}

export async function updateProduct(id: string, data: any) {
  const update = { ...data };
  // Auto-sync status when stock is explicitly provided but status is not
  if (typeof update.stockQty === "number" && update.availabilityStatus === undefined) {
    update.availabilityStatus = stockStatus(update.stockQty);
  }
  return prisma.product.update({ where: { id }, data: update });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getLowStockProducts(threshold = 5) {
  return prisma.product.findMany({
    where: { stockQty: { lte: threshold } },
    orderBy: { stockQty: "asc" },
    select: { id: true, name: true, stockQty: true, availabilityStatus: true, category: true },
  });
}
