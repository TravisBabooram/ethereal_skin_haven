import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  BookingEmailData,
  ProductReceiptData,
  bookingReceivedTemplate,
  bookingConfirmedTemplate,
  cancellationTemplate,
  rescheduleTemplate,
  reminderTemplate,
  adminNewBookingTemplate,
  productReceiptTemplate,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Ethereal Skin Haven <bookings@etherealskinhaven.com>";
const REPLY_TO = "etherealskinhaven@gmail.com";
const ADMIN_EMAIL = "etherealskinhaven@gmail.com";

async function send(to: string, subject: string, html: string) {
  return resend.emails.send({ from: FROM, reply_to: REPLY_TO, to, subject, html });
}

function toEmailData(booking: any): BookingEmailData {
  const services = (booking.bookingItems ?? []).map((item: any) => ({
    name: item.service?.name ?? "Treatment",
    price: item.service?.price ?? item.price ?? 0,
    duration: item.service?.duration ?? 0,
    quantity: item.quantity ?? 1,
  }));

  return {
    userName: booking.user?.name ?? "Valued Client",
    userEmail: booking.user?.email ?? "",
    bookingId: booking.id ?? "",
    services,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    paymentMethod: booking.paymentMethod,
    totalPrice: booking.totalPrice ?? 0,
    notes: booking.notes ?? undefined,
  };
}

async function logEmail(userId: string, bookingId: string, type: string) {
  await prisma.emailNotification.create({ data: { userId, bookingId, type } });
}

// ── Client emails ─────────────────────────────────────────────────────────────

export async function sendBookingReceivedEmail(booking: any) {
  const data = toEmailData(booking);
  if (!data.userEmail) return;
  const { subject, html } = bookingReceivedTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "booking_received");
}

export async function sendBookingConfirmedEmail(booking: any) {
  const data = toEmailData(booking);
  if (!data.userEmail) return;
  const { subject, html } = bookingConfirmedTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "booking_confirmed");
}

export async function sendCancellationEmail(booking: any) {
  const data = toEmailData(booking);
  if (!data.userEmail) return;
  const { subject, html } = cancellationTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "cancellation");
}

export async function sendRescheduleEmail(booking: any) {
  const data = toEmailData(booking);
  if (!data.userEmail) return;
  const { subject, html } = rescheduleTemplate(data);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, "reschedule");
}

export async function sendReminderEmail(booking: any, type: "24hr" | "sameday") {
  const data = toEmailData(booking);
  if (!data.userEmail) return;
  const { subject, html } = reminderTemplate(data, type);
  await send(data.userEmail, subject, html);
  await logEmail(booking.userId, booking.id, `reminder_${type}`);
}

// ── Admin notification ────────────────────────────────────────────────────────

export async function sendAdminNewBookingNotification(booking: any) {
  const data = toEmailData(booking);
  const { subject, html } = adminNewBookingTemplate(data);
  await send(ADMIN_EMAIL, subject, html);
}

// ── Product receipt ───────────────────────────────────────────────────────────

export async function sendProductReceiptEmail(data: ProductReceiptData) {
  if (!data.userEmail) return;
  const { subject, html } = productReceiptTemplate(data);
  await send(data.userEmail, subject, html);
}

// Legacy alias so any existing import of sendConfirmationEmail still works
export const sendConfirmationEmail = sendBookingReceivedEmail;
