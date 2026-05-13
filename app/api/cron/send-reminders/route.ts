import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email";

// Protected by a shared secret — set CRON_SECRET in .env.local
// Call this endpoint from Vercel Cron or any external scheduler daily at 8 AM
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const in24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const in24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Bookings in ~24 hours that haven't received a 24hr reminder
    const upcoming24h = await prisma.booking.findMany({
      where: {
        appointmentDate: { gte: in24hStart, lte: in24hEnd },
        status: { not: "Cancelled" },
        emailNotifications: { none: { type: "reminder_24hr" } },
      },
      include: {
        user: { select: { name: true, email: true } },
        bookingItems: { include: { service: true } },
      },
    });

    // Bookings today that haven't received a same-day reminder
    const today = await prisma.booking.findMany({
      where: {
        appointmentDate: { gte: todayStart, lt: todayEnd },
        status: { not: "Cancelled" },
        emailNotifications: { none: { type: "reminder_sameday" } },
      },
      include: {
        user: { select: { name: true, email: true } },
        bookingItems: { include: { service: true } },
      },
    });

    const results = await Promise.allSettled([
      ...upcoming24h.map((b) => sendReminderEmail(b, "24hr")),
      ...today.map((b) => sendReminderEmail(b, "sameday")),
    ]);

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ sent, failed });
  } catch (err) {
    console.error("[Cron] send-reminders error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
