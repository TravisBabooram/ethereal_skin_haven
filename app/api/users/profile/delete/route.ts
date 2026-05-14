import { NextRequest, NextResponse } from "next/server";
import { handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function deleteHandler(_req: NextRequest, user: JWTPayload) {
  try {
    const existing = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!existing) throw new APIError(404, "Account not found");

    await prisma.user.delete({ where: { id: user.userId } });

    const res = NextResponse.json({ message: "Account deleted" });
    res.cookies.delete("token");
    return res;
  } catch (error) {
    return handleError(error);
  }
}

export const DELETE = withAuth(deleteHandler);
