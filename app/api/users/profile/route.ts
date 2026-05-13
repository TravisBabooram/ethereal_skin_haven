import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/auth";
import { getUserProfile, updateUser, getUserById } from "@/lib/services/users";
import { hashPassword, verifyPassword } from "@/lib/utils/password";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(_req: NextRequest, user: JWTPayload) {
  try {
    const profile = await getUserProfile(user.userId);
    return success(profile);
  } catch (error) {
    return handleError(error);
  }
}

async function PUT(req: NextRequest, user: JWTPayload) {
  try {
    const { name, email, phone, currentPassword, newPassword } = await req.json();
    const updateData: Record<string, string> = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.trim();

    if (newPassword) {
      if (!currentPassword) throw new APIError(400, "Current password is required to set a new password");
      const existing = await getUserById(user.userId);
      if (!existing) throw new APIError(404, "User not found");
      const valid = await verifyPassword(currentPassword, existing.passwordHash);
      if (!valid) throw new APIError(400, "Current password is incorrect");
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await updateUser(user.userId, updateData);
    return success({ id: updated.id, email: updated.email, name: updated.name, phone: updated.phone });
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAuth(GET);
export const putRoute = withAuth(PUT);

export { getRoute as GET, putRoute as PUT };
