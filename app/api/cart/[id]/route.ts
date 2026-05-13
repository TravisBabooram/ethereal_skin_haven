import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { updateCartItem, removeCartItem } from "@/lib/services/cart";
import { JWTPayload } from "@/lib/utils/jwt";

async function putHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const { quantity } = await req.json();
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
    const { id } = await context?.params!;
    await removeCartItem(id);
    return success({ message: "Item removed from cart" });
  } catch (error) {
    return handleError(error);
  }
}

export const putRoute = withAuth(putHandler);
export const deleteRoute = withAuth(deleteHandler);

export { putRoute as PUT, deleteRoute as DELETE };
