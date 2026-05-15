import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { getSettings } from "@/lib/services/settings";

export async function GET(_req: NextRequest) {
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
