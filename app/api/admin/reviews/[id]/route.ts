import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function deleteHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw new APIError(404, "Review not found");
    await prisma.review.delete({ where: { id } });
    return success({ message: "Review deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const DELETE = withAdmin(deleteHandler);
