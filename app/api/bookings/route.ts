import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getBookingsByUser, createBooking, getBookingById } from "@/lib/services/bookings";
import { sendBookingReceivedEmail, sendAdminNewBookingNotification } from "@/lib/email";
import { verifyCaptcha } from "@/lib/utils/captcha";
import { JWTPayload } from "@/lib/utils/jwt";

async function handleGet(req: NextRequest, user: JWTPayload) {
  try {
    return success(await getBookingsByUser(user.userId));
  } catch (error) {
    return handleError(error);
  }
}

async function handlePost(req: NextRequest, user: JWTPayload) {
  try {
    const body = await req.json();
    const { appointmentDate, appointmentTime, notes, paymentMethod, services, captchaToken } = body;

    if (!appointmentDate || !appointmentTime || !paymentMethod || !services?.length) {
      throw new APIError(400, "Missing required booking fields");
    }
    if (!Array.isArray(services) || services.length > 10) {
      throw new APIError(400, "Invalid services selection");
    }
    for (const s of services) {
      if (!s.serviceId || typeof s.quantity !== "number" || s.quantity < 1 || s.quantity > 10 || !Number.isInteger(s.quantity)) {
        throw new APIError(400, "Invalid service quantity");
      }
    }

    if (!captchaToken) throw new APIError(400, "Please complete the CAPTCHA");
    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) throw new APIError(400, "CAPTCHA verification failed. Please try again.");

    const booking = await createBooking({
      userId: user.userId,
      appointmentDate,
      appointmentTime,
      notes,
      paymentMethod,
      services,
    });

    // Fetch full booking with relations for emails
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

export const GET = withAuth(handleGet);
export const POST = withAuth(handlePost);
