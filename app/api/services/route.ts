import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllServices, getFeaturedServices, createService } from "@/lib/services/services";
import { JWTPayload } from "@/lib/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const featured = req.nextUrl.searchParams.get("featured");
    const limit = req.nextUrl.searchParams.get("limit");

    if (featured === "true") {
      return success(await getFeaturedServices(limit ? parseInt(limit) : 6));
    }
    return success(await getAllServices());
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest, _user: JWTPayload) {
  try {
    const data = await req.json();
    const service = await createService(data);
    return success(service, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
