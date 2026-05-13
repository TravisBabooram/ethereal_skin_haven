import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getDashboardStats } from "@/lib/services/admin";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(_req: NextRequest, _user: JWTPayload) {
  try {
    return success(await getDashboardStats());
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
