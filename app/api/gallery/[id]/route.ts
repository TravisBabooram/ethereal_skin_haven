import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getGalleryImageById, updateGalleryImage, deleteGalleryImage } from "@/lib/services/gallery";
import { deleteCloudinaryImage } from "@/lib/utils/cloudinary";

async function putHandler(
  req: NextRequest,
  _user: any,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const data = await req.json();
    const existing = await getGalleryImageById(id);
    const updated = await updateGalleryImage(id, data);
    // If the image URL changed, delete the old one from Cloudinary
    if (existing?.image && data.image && existing.image !== data.image && !data._noDelete) {
      deleteCloudinaryImage(existing.image).catch(() => null);
    }
    return success(updated);
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  req: NextRequest,
  _user: any,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const existing = await getGalleryImageById(id);
    await deleteGalleryImage(id);
    if (existing?.image) deleteCloudinaryImage(existing.image).catch(() => null);
    return success({ message: "Gallery image deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
