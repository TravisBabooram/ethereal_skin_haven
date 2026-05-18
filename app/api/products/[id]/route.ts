import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/products";
import { sendAdminLowStockAlert } from "@/lib/email";
import { JWTPayload } from "@/lib/utils/jwt";

const LOW_STOCK_THRESHOLD = 5;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) throw new APIError(404, "Product not found");
    return success(product);
  } catch (error) {
    return handleError(error);
  }
}

async function putHandler(
  req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const data = await req.json();

    const before = await getProductById(id);
    const updated = await updateProduct(id, data);

    // Fire low stock alert only when crossing the threshold for the first time
    if (
      before &&
      typeof data.stockQty === "number" &&
      before.stockQty > LOW_STOCK_THRESHOLD &&
      updated.stockQty <= LOW_STOCK_THRESHOLD
    ) {
      sendAdminLowStockAlert({
        name: updated.name,
        category: updated.category,
        stockQty: updated.stockQty,
      }).catch(() => null);
    }

    return success(updated);
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    await deleteProduct(id);
    return success({ message: "Product deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
