import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getBookingById, updateBooking } from "@/lib/services/bookings";
import { createAuditLog } from "@/lib/services/audit";
import { sendCancellationEmail, sendRescheduleEmail } from "@/lib/email";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const booking = await getBookingById(id);
    if (!booking) throw new APIError(404, "Booking not found");
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

    const data = await req.json();
    const previousStatus = booking.status;
    const updated = await updateBooking(id, data);

    await createAuditLog(user.userId, "UPDATE", "booking", id, {
      before: { status: previousStatus },
      after: { status: data.status },
    });

    // Trigger email notifications on status changes
    if (data.status && data.status !== previousStatus) {
      if (data.status === "Cancelled") {
        await sendCancellationEmail(booking).catch(() => null);
      } else if (
        (data.appointmentDate || data.appointmentTime) &&
        previousStatus !== "Pending"
      ) {
        await sendRescheduleEmail(updated).catch(() => null);
      }
    }

    return success(updated);
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  _req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    await updateBooking(id, { status: "Cancelled" });
    await createAuditLog(user.userId, "DELETE", "booking", id, {});
    return success({ message: "Booking cancelled" });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
