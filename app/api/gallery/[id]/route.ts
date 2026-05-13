import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { updateGalleryImage, deleteGalleryImage } from "@/lib/services/gallery";

async function putHandler(
  req: NextRequest,
  _user: any,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const data = await req.json();
    const image = await updateGalleryImage(id, data);
    return success(image);
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
    await deleteGalleryImage(id);
    return success({ message: "Gallery image deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
