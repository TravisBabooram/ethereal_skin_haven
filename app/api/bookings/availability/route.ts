import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { getAvailableTimeSlots } from "@/lib/services/bookings";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const durationParam = searchParams.get("duration");

    if (!dateParam || !durationParam) {
      throw new APIError(400, "date and duration query params are required");
    }

    const duration = parseInt(durationParam, 10);
    if (isNaN(duration) || duration <= 0) {
      throw new APIError(400, "duration must be a positive integer (minutes)");
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      throw new APIError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      throw new APIError(400, "Cannot book appointments in the past");
    }

    const slots = await getAvailableTimeSlots(date, duration);
    return success({ date: dateParam, duration, slots });
  } catch (error) {
    return handleError(error);
  }
}
