import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllProducts, getFeaturedProducts, getProductsByCategory, createProduct } from "@/lib/services/products";
import { JWTPayload } from "@/lib/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const featured = req.nextUrl.searchParams.get("featured");
    const category = req.nextUrl.searchParams.get("category");
    const limit = req.nextUrl.searchParams.get("limit");

    if (featured === "true") return success(await getFeaturedProducts(limit ? parseInt(limit) : 6));
    if (category) return success(await getProductsByCategory(category));
    return success(await getAllProducts());
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const data = await req.json();
    return success(await createProduct(data), 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
