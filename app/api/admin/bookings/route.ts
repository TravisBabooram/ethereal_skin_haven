import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllBookingsAdmin } from "@/lib/services/admin";
import { createBooking, getBookingById } from "@/lib/services/bookings";
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
    const { userId, services, appointmentDate, appointmentTime, paymentMethod, notes } = body;

    if (!userId || !services?.length || !appointmentDate || !appointmentTime || !paymentMethod) {
      throw new APIError(400, "Missing required booking fields");
    }

    const booking = await createBooking({ userId, appointmentDate, appointmentTime, notes, paymentMethod, services });

    const full = await getBookingById(booking.id);
    if (full) {
      sendBookingReceivedEmail(full).catch(() => null);
      sendAdminNewBookingNotification(full).catch(() => null);
    }

    return success(booking, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
