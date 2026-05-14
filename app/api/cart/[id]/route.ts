import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { updateCartItem, removeCartItem } from "@/lib/services/cart";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function getOwnedItem(id: string, userId: string) {
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item) throw new APIError(404, "Cart item not found");
  if (item.userId !== userId) throw new APIError(403, "Forbidden");
  return item;
}

async function putHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    await getOwnedItem(id, user.userId);
    const { quantity } = await req.json();
    if (typeof quantity !== "number" || quantity < 0 || !Number.isInteger(quantity)) {
      throw new APIError(400, "Quantity must be a non-negative integer");
    }
    const item = await updateCartItem(id, quantity);
    return success(item);
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    await getOwnedItem(id, user.userId);
    await removeCartItem(id);
    return success({ message: "Item removed from cart" });
  } catch (error) {
    return handleError(error);
  }
}

export const putRoute = withAuth(putHandler);
export const deleteRoute = withAuth(deleteHandler);

export { putRoute as PUT, deleteRoute as DELETE };
