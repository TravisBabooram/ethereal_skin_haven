import { prisma } from "@/lib/prisma";

export async function getReviews(serviceId?: string, productId?: string) {
  return prisma.review.findMany({
    where: { serviceId, productId },
    include: { user: { select: { name: true } } },
  });
}

export async function createReview(userId: string, data: any) {
  return prisma.review.create({
    data: { userId, ...data },
  });
}

export async function updateReview(id: string, data: any) {
  return prisma.review.update({ where: { id }, data });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}
