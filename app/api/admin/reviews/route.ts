import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(_req: NextRequest, _user: JWTPayload) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(reviews);
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
