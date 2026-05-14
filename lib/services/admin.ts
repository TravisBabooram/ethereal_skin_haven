import { prisma } from "@/lib/prisma";
import { getLowStockProducts } from "@/lib/services/products";

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [totalUsers, totalBookings, todayBookings, upcomingBookings, recentUsers, popularRaw, lowStockProducts] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({
        where: { appointmentDate: { gte: todayStart, lt: todayEnd } },
      }),
      prisma.booking.findMany({
        where: { appointmentDate: { gte: now }, status: { not: "Cancelled" } },
        include: {
          user: { select: { id: true, name: true, email: true } },
          bookingItems: { include: { service: true } },
        },
        orderBy: { appointmentDate: "asc" },
        take: 10,
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.bookingItem.groupBy({
        by: ["serviceId"],
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: "desc" } },
        take: 5,
      }),
      getLowStockProducts(5),
    ]);

  const serviceDetails = await prisma.service.findMany({
    where: { id: { in: popularRaw.map((r) => r.serviceId) } },
    select: { id: true, name: true, price: true },
  });

  const popularServices = popularRaw.map((r) => ({
    ...serviceDetails.find((s) => s.id === r.serviceId),
    bookingCount: r._count.serviceId,
  }));

  const totalRevenue = await prisma.booking.aggregate({
    where: { status: { not: "Cancelled" } },
    _sum: { totalPrice: true },
  });

  return {
    totalUsers,
    totalBookings,
    todayBookings,
    totalRevenue: totalRevenue._sum.totalPrice ?? 0,
    upcomingBookings,
    recentUsers,
    popularServices,
    lowStockProducts,
  };
}

export async function getAllBookingsAdmin(opts: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
} = {}) {
  const { status, dateFrom, dateTo, page = 1, limit = 20 } = opts;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);
    where.appointmentDate = dateFilter;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        bookingItems: { include: { service: true } },
      },
      orderBy: { appointmentDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getAllUsersAdmin(page = 1, limit = 20) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count(),
  ]);
  return { users, total, page, limit, pages: Math.ceil(total / limit) };
}
