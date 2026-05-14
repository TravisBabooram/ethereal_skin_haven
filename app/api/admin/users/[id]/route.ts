import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        bookings: {
          include: {
            bookingItems: { include: { service: true } },
          },
          orderBy: { appointmentDate: "desc" },
        },
        cartItems: {
          include: { service: true, product: true },
        },
        _count: { select: { bookings: true } },
      },
    });

    if (!user) throw new APIError(404, "Client not found");

    const totalSpent = user.bookings
      .filter(b => b.status !== "Cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return success({ ...user, totalSpent });
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new APIError(404, "Client not found");
    await prisma.user.delete({ where: { id } });
    return success({ message: "Client deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
export const DELETE = withAdmin(deleteHandler);
