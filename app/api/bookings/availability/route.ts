import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { getAvailableTimeSlots } from "@/lib/services/bookings";
import { getSetting } from "@/lib/services/settings";

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

    // Check blocked dates
    const blockedRaw = await getSetting("blocked_dates").catch(() => "[]");
    const blockedDates: string[] = JSON.parse(blockedRaw ?? "[]");
    if (blockedDates.includes(dateParam)) {
      return success({ date: dateParam, duration, slots: [] });
    }

    // Check business hours config
    const hoursRaw = await getSetting("business_hours").catch(() => null);
    const dayOfWeek = String(date.getDay()); // "0" = Sun, "6" = Sat

    let businessStart = 9 * 60;  // 9:00 AM default
    let businessEnd = 18 * 60;   // 6:00 PM default

    if (hoursRaw) {
      try {
        const hoursConfig = JSON.parse(hoursRaw);
        const dayConfig = hoursConfig[dayOfWeek];
        if (dayConfig) {
          if (!dayConfig.open) {
            return success({ date: dateParam, duration, slots: [] });
          }
          const [sh, sm] = dayConfig.start.split(":").map(Number);
          const [eh, em] = dayConfig.end.split(":").map(Number);
          businessStart = sh * 60 + sm;
          businessEnd = eh * 60 + em;
        }
      } catch { /* use defaults */ }
    }

    const slots = await getAvailableTimeSlots(date, duration, businessStart, businessEnd);
    return success({ date: dateParam, duration, slots });
  } catch (error) {
    return handleError(error);
  }
}
