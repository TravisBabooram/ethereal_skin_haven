import { prisma } from "@/lib/prisma";

export async function createAuditLog(
  adminId: string,
  action: string,
  resource: string,
  resourceId: string,
  changes?: Record<string, unknown>
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      action,
      resource,
      resourceId,
      changes: changes ? JSON.stringify(changes) : undefined,
    },
  });
}

export async function getAuditLogs(page = 1, limit = 50) {
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: { admin: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);
  return { logs, total, page, limit, pages: Math.ceil(total / limit) };
}
