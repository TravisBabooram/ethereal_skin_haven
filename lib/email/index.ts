import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  BookingEmailData,
  confirmationTemplate,
  reminderTemplate,
  cancellationTemplate,
  rescheduleTemplate,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Ethereal Skin Haven <bookings@etherealskinhaven.com>";

async function send(to: string, subject: string, html: string) {
  return resend.emails.send({ from: FROM, to, subject, html });
}

function toEmailData(booking: any): BookingEmailData {
  const services = booking.bookingItems
    ?.map((item: any) => item.service?.name)
    .filter(Boolean)
    .join(", ");

  return {
    userName: booking.user?.name ?? "Valued Client",
    userEmail: booking.user?.email ?? "",
    serviceName: services || "Your service",
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    paymentMethod: booking.paymentMethod,
  };
}

async function logEmail(userId: string, bookingId: string, type: string) {
  await prisma.emailNotification.create({
    data: { userId, bookingId, type },
  });
}

export async function sendConfirmationEmail(booking: any) {
  const data = toEmailData(booking);
  const { subject, html } = confirmationTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "confirmation");
}

export async function sendReminderEmail(booking: any, type: "24hr" | "sameday") {
  const data = toEmailData(booking);
  const { subject, html } = reminderTemplate(data, type);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, `reminder_${type}`);
}

export async function sendCancellationEmail(booking: any) {
  const data = toEmailData(booking);
  const { subject, html } = cancellationTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "cancellation");
}

export async function sendRescheduleEmail(booking: any) {
  const data = toEmailData(booking);
  const { subject, html } = rescheduleTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "reschedule");
}
