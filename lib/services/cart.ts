import { prisma } from "@/lib/prisma";

export async function getCartByUser(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { service: true, product: true },
  });
}

export async function addToCart(userId: string, serviceId?: string, productId?: string, quantity = 1) {
  return prisma.cartItem.create({
    data: { userId, serviceId, productId, quantity },
  });
}

export async function updateCartItem(id: string, quantity: number) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id } });
  }
  return prisma.cartItem.update({ where: { id }, data: { quantity } });
}

export async function removeCartItem(id: string) {
  return prisma.cartItem.delete({ where: { id } });
}

export async function clearCart(userId: string) {
  return prisma.cartItem.deleteMany({ where: { userId } });
}
