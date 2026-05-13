import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { updateReview, deleteReview } from "@/lib/services/reviews";
import { JWTPayload } from "@/lib/utils/jwt";

async function putHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const data = await req.json();
    const review = await updateReview(id, data);
    return success(review);
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
    await deleteReview(id);
    return success({ message: "Review deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const putRoute = withAuth(putHandler);
export const deleteRoute = withAuth(deleteHandler);

export { putRoute as PUT, deleteRoute as DELETE };
