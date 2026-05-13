import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getReviews, createReview } from "@/lib/services/reviews";
import { JWTPayload } from "@/lib/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const serviceId = req.nextUrl.searchParams.get("serviceId") || undefined;
    const productId = req.nextUrl.searchParams.get("productId") || undefined;
    const reviews = await getReviews(serviceId, productId);
    return success(reviews);
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest, user: JWTPayload) {
  try {
    const data = await req.json();
    const review = await createReview(user.userId, data);
    return success(review, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAuth(postHandler);
