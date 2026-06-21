import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllBookingsAdmin } from "@/lib/services/admin";
import { createAdminBooking, getBookingById } from "@/lib/services/bookings";
import { sendBookingReceivedEmail, sendAdminNewBookingNotification } from "@/lib/email";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { searchParams } = req.nextUrl;
    return success(
      await getAllBookingsAdmin({
        status: searchParams.get("status") ?? undefined,
        dateFrom: searchParams.get("dateFrom") ?? undefined,
        dateTo: searchParams.get("dateTo") ?? undefined,
        page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
        limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
      })
    );
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const body = await req.json();
    const { userId, guestName, guestPhone, services, appointmentDate, appointmentTime, paymentMethod, notes } = body;

    if (!userId && !guestName) throw new APIError(400, "A client or guest name is required");
    if (!services?.length || !appointmentDate || !appointmentTime || !paymentMethod) {
      throw new APIError(400, "Missing required booking fields");
    }

    const booking = await createAdminBooking({
      userId,
      guestName,
      guestPhone,
      appointmentDate,
      appointmentTime,
      notes,
      paymentMethod,
      services,
    });

    const full = await getBookingById(booking.id);
    if (full) {
      if (full.user) sendBookingReceivedEmail(full as any).catch(() => null);
      sendAdminNewBookingNotification(full as any).catch(() => null);
    }

    return success(booking, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
