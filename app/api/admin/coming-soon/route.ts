import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getSettings, setSetting } from "@/lib/services/settings";
import { JWTPayload } from "@/lib/utils/jwt";

async function GET(_req: NextRequest, _user: JWTPayload) {
  try {
    const s = await getSettings(["products_coming_soon", "gallery_coming_soon"]);
    return success({
      products: s["products_coming_soon"] === "true",
      gallery:  s["gallery_coming_soon"]  === "true",
    });
  } catch (error) {
    return handleError(error);
  }
}

async function PUT(req: NextRequest, _user: JWTPayload) {
  try {
    const body = await req.json();
    if (body.products !== undefined) await setSetting("products_coming_soon", body.products ? "true" : "false");
    if (body.gallery  !== undefined) await setSetting("gallery_coming_soon",  body.gallery  ? "true" : "false");
    const s = await getSettings(["products_coming_soon", "gallery_coming_soon"]);
    return success({
      products: s["products_coming_soon"] === "true",
      gallery:  s["gallery_coming_soon"]  === "true",
    });
  } catch (error) {
    return handleError(error);
  }
}

const getRoute = withAdmin(GET);
const putRoute = withAdmin(PUT);
export { getRoute as GET, putRoute as PUT };
