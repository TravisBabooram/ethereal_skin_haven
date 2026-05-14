import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getCartByUser, addToCart } from "@/lib/services/cart";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(req: NextRequest, user: JWTPayload) {
  try {
    const cart = await getCartByUser(user.userId);
    return success(cart);
  } catch (error) {
    return handleError(error);
  }
}

async function POST(req: NextRequest, user: JWTPayload) {
  try {
    const { serviceId, productId, quantity } = await req.json();
    if (!serviceId && !productId) throw new APIError(400, "serviceId or productId is required");
    const qty = typeof quantity === "number" ? quantity : 1;
    if (qty < 1 || qty > 20 || !Number.isInteger(qty)) throw new APIError(400, "Invalid quantity");
    const item = await addToCart(user.userId, serviceId ?? undefined, productId ?? undefined, qty);
    return success(item, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAuth(GET);
export const postRoute = withAuth(POST);

export { getRoute as GET, postRoute as POST };
