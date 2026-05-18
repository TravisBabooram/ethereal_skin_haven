import { prisma } from "@/lib/prisma";

const DEFAULT_START = 9 * 60;   // 9:00 AM in minutes (fallback)
const DEFAULT_END = 18 * 60;    // 6:00 PM in minutes (fallback)
const SLOT_INTERVAL = 30;       // minutes between slot options
const BUFFER_MINUTES = 15;      // buffer between appointments

export async function getBookingsByUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { bookingItems: { include: { service: true } } },
    orderBy: { appointmentDate: "desc" },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { bookingItems: { include: { service: true } }, user: true },
  });
}

export async function getUpcomingBookings() {
  return prisma.booking.findMany({
    where: { appointmentDate: { gte: new Date() } },
    include: { user: true, bookingItems: { include: { service: true } } },
    orderBy: { appointmentDate: "asc" },
  });
}

export async function updateBooking(id: string, data: any) {
  return prisma.booking.update({
    where: { id },
    data,
    include: { bookingItems: true },
  });
}

// Returns active bookings for a given calendar date (ignores cancelled)
async function getActiveBookingsForDate(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.booking.findMany({
    where: {
      appointmentDate: { gte: start, lte: end },
      status: { not: "Cancelled" },
    },
    include: { bookingItems: { include: { service: true } } },
  });
}

// Converts appointmentTime string ("HH:MM") to minutes from midnight
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Converts minutes from midnight to "HH:MM" string
function minutesToTime(minutes: number): string {
  return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
}

// Calculates total service duration from booking items
function calcBookingDuration(booking: Awaited<ReturnType<typeof getActiveBookingsForDate>>[number]): number {
  return booking.bookingItems.reduce(
    (sum, item) => sum + (item.service?.duration ?? 0) * item.quantity,
    0
  );
}

export async function getAvailableTimeSlots(
  date: Date,
  durationMinutes: number,
  businessStart = DEFAULT_START,
  businessEnd = DEFAULT_END
): Promise<string[]> {
  const booked = await getActiveBookingsForDate(date);

  const occupied = booked.map((b) => {
    const start = timeToMinutes(b.appointmentTime);
    const duration = calcBookingDuration(b);
    return { start, end: start + duration + BUFFER_MINUTES };
  });

  const slots: string[] = [];
  for (let slot = businessStart; slot + durationMinutes <= businessEnd; slot += SLOT_INTERVAL) {
    const slotEnd = slot + durationMinutes + BUFFER_MINUTES;
    const free = !occupied.some((o) => slot < o.end && slotEnd > o.start);
    if (free) slots.push(minutesToTime(slot));
  }

  return slots;
}

export async function isSlotAvailable(
  date: Date,
  time: string,
  durationMinutes: number
): Promise<boolean> {
  const slotStart = timeToMinutes(time);
  const slotEnd = slotStart + durationMinutes + BUFFER_MINUTES;

  const booked = await getActiveBookingsForDate(date);

  return !booked.some((b) => {
    const bStart = timeToMinutes(b.appointmentTime);
    const bEnd = bStart + calcBookingDuration(b) + BUFFER_MINUTES;
    return slotStart < bEnd && slotEnd > bStart;
  });
}

export interface CreateBookingInput {
  userId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  paymentMethod: string;
  services: { serviceId: string; quantity: number }[];
}

export async function createBooking(input: CreateBookingInput) {
  const { userId, appointmentDate, appointmentTime, notes, paymentMethod, services } = input;

  // Fetch all services to get price + duration
  const serviceRecords = await prisma.service.findMany({
    where: { id: { in: services.map((s) => s.serviceId) } },
  });

  if (serviceRecords.length !== services.length) {
    throw new Error("One or more services not found");
  }

  const totalPrice = services.reduce((sum, s) => {
    const svc = serviceRecords.find((r) => r.id === s.serviceId)!;
    return sum + svc.price * s.quantity;
  }, 0);

  const totalDuration = services.reduce((sum, s) => {
    const svc = serviceRecords.find((r) => r.id === s.serviceId)!;
    return sum + svc.duration * s.quantity;
  }, 0);

  const date = new Date(appointmentDate);

  const available = await isSlotAvailable(date, appointmentTime, totalDuration);
  if (!available) {
    throw new Error("This time slot is no longer available. Please choose another.");
  }

  return prisma.booking.create({
    data: {
      userId,
      appointmentDate: date,
      appointmentTime,
      notes,
      paymentMethod,
      totalPrice,
      status: "Pending",
      bookingItems: {
        create: services.map((s) => {
          const svc = serviceRecords.find((r) => r.id === s.serviceId)!;
          return {
            serviceId: s.serviceId,
            userId,
            quantity: s.quantity,
            price: svc.price * s.quantity,
          };
        }),
      },
    },
    include: { bookingItems: { include: { service: true } } },
  });
}
