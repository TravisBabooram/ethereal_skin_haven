import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { prisma } from "@/lib/prisma";
import { JWTPayload } from "@/lib/utils/jwt";

async function calendarHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { searchParams } = req.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (!from || !to) throw new APIError(400, "from and to date params required");

    const bookings = await prisma.booking.findMany({
      where: {
        appointmentDate: {
          gte: new Date(from),
          lte: new Date(to + "T23:59:59"),
        },
        status: { not: "Cancelled" },
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        bookingItems: { include: { service: { select: { name: true, duration: true } } } },
      },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
    });

    return success(bookings);
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(calendarHandler);
