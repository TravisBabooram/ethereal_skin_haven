import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllGalleryImages, getGalleryByCategory, createGalleryImage } from "@/lib/services/gallery";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    if (category) {
      const images = await getGalleryByCategory(category);
      return success(images);
    }
    const images = await getAllGalleryImages();
    return success(images);
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest) {
  try {
    const data = await req.json();
    const image = await createGalleryImage(data);
    return success(image, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
