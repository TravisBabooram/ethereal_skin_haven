import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllBookingsAdmin } from "@/lib/services/admin";
import { JWTPayload } from "@/lib/utils/jwt";

async function getHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const { searchParams } = req.nextUrl;
    return success(
      await getAllBookingsAdmin({
        status: searchParams.get("status") ?? undefined,
        dateFrom: searchParams.get("dateFrom") ?? undefined,
        dateTo: searchParams.get("dateTo") ?? undefined,
        page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
        limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
      })
    );
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withAdmin(getHandler);
