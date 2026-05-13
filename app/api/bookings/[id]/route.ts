import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getBookingById, updateBooking } from "@/lib/services/bookings";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const booking = await getBookingById(id);
    if (!booking) throw new APIError(404, "Booking not found");

    // Users can only view their own bookings; admins can view all
    if (user.role !== "admin" && booking.userId !== user.userId) {
      throw new APIError(403, "Access denied");
    }

    return success(booking);
  } catch (error) {
    return handleError(error);
  }
}

async function putHandler(
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const booking = await getBookingById(id);
    if (!booking) throw new APIError(404, "Booking not found");

    if (user.role !== "admin" && booking.userId !== user.userId) {
      throw new APIError(403, "Access denied");
    }

    const data = await req.json();

    // Non-admins can only cancel their own bookings
    if (user.role !== "admin") {
      if (data.status && data.status !== "Cancelled") {
        throw new APIError(403, "You can only cancel your own bookings");
      }
      const allowedFields = { status: data.status, notes: data.notes };
      return success(await updateBooking(id, allowedFields));
    }

    return success(await updateBooking(id, data));
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
