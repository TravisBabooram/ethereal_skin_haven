import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAuditLogs } from "@/lib/services/audit";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { searchParams } = req.nextUrl;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;
    return success(await getAuditLogs(page, limit));
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
