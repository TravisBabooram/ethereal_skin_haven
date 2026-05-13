import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getUserProfile } from "@/lib/services/users";
import { getBookingsByUser } from "@/lib/services/bookings";
import { JWTPayload } from "@/lib/utils/jwt";

async function handleGet(req: NextRequest, user: JWTPayload) {
  try {
    const [profile, allBookings] = await Promise.all([
      getUserProfile(user.userId),
      getBookingsByUser(user.userId),
    ]);
    const bookings = allBookings.slice(0, 5).map(b => ({
      id: b.id,
      appointmentDate: b.appointmentDate,
      appointmentTime: b.appointmentTime,
      status: b.status,
      totalPrice: b.totalPrice,
    }));
    return success({ ...profile, bookings });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAuth(handleGet);
