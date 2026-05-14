import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getSetting, setSetting } from "@/lib/services/settings";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(_req: NextRequest, _user: JWTPayload) {
  try {
    const value = await getSetting("maintenance_mode");
    return success({ maintenance: value === "true" });
  } catch (error) {
    return handleError(error);
  }
}

async function PUT(req: NextRequest, _user: JWTPayload) {
  try {
    const { maintenance } = await req.json();
    await setSetting("maintenance_mode", maintenance ? "true" : "false");
    return success({ maintenance: !!maintenance });
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAdmin(GET);
export const putRoute = withAdmin(PUT);
export { getRoute as GET, putRoute as PUT };
