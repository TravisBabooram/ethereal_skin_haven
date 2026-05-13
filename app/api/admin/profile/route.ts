import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAdminById } from "@/lib/services/admins";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/utils/password";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(req: NextRequest, user: JWTPayload) {
  try {
    const admin = await getAdminById(user.userId);
    if (!admin) throw new APIError(404, "Admin not found");
    return success({ id: admin.id, email: admin.email, name: admin.name, role: admin.role, createdAt: admin.createdAt });
  } catch (error) {
    return handleError(error);
  }
}

async function PUT(req: NextRequest, user: JWTPayload) {
  try {
    const { name, email, currentPassword, newPassword } = await req.json();
    const admin = await getAdminById(user.userId);
    if (!admin) throw new APIError(404, "Admin not found");

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();

    if (newPassword) {
      if (!currentPassword) throw new APIError(400, "Current password is required to set a new password");
      const valid = await verifyPassword(currentPassword, admin.passwordHash);
      if (!valid) throw new APIError(400, "Current password is incorrect");
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.admin.update({ where: { id: user.userId }, data: updateData });
    return success({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAdmin(GET);
export const putRoute = withAdmin(PUT);

export { getRoute as GET, putRoute as PUT };
