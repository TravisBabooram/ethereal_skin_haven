import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllUsersAdmin } from "@/lib/services/admin";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils/password";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { searchParams } = req.nextUrl;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
    return success(await getAllUsersAdmin(page, limit));
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { name, phone } = await req.json();
    if (!name?.trim()) throw new APIError(400, "Name is required");

    const uid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const placeholderEmail = `manual_${uid}@noemail.local`;
    const lockedHash = await hashPassword(Math.random().toString(36) + uid);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: placeholderEmail,
        passwordHash: lockedHash,
        isManualEntry: true,
      },
      select: { id: true, name: true, phone: true, isManualEntry: true, createdAt: true },
    });

    return success(user, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
