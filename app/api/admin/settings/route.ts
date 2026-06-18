import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getSettings, setSettings } from "@/lib/services/settings";
import { JWTPayload } from "@/lib/utils/jwt";

const ALL_KEYS = [
  "hero_title", "hero_subtitle", "hero_tagline",
  "hide_images",
  "business_hours",
  "seo_home_title", "seo_home_desc",
  "seo_services_title", "seo_services_desc",
  "seo_products_title", "seo_products_desc",
  "seo_about_title", "seo_about_desc",
  "seo_contact_title", "seo_contact_desc",
  "seo_booking_title", "seo_booking_desc",
  "seo_gallery_title", "seo_gallery_desc",
  "seo_faq_title", "seo_faq_desc",
  "seo_policies_title", "seo_policies_desc",
];

async function GET(_req: NextRequest, _user: JWTPayload) {
  try {
    return success(await getSettings(ALL_KEYS));
  } catch (error) {
    return handleError(error);
  }
}

async function PUT(req: NextRequest, _user: JWTPayload) {
  try {
    const data = await req.json();
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => ALL_KEYS.includes(k))
    ) as Record<string, string>;
    await setSettings(filtered);
    return success(await getSettings(ALL_KEYS));
  } catch (error) {
    return handleError(error);
  }
}

export const getRoute = withAdmin(GET);
export const putRoute = withAdmin(PUT);
export { getRoute as GET, putRoute as PUT };
