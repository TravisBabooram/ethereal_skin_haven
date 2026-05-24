import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getServiceById, updateService, deleteService } from "@/lib/services/services";
import { deleteCloudinaryImage } from "@/lib/utils/cloudinary";
import { JWTPayload } from "@/lib/utils/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);
    if (!service) throw new APIError(404, "Service not found");
    return success(service);
  } catch (error) {
    return handleError(error);
  }
}

async function putHandler(
  req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const data = await req.json();
    const existing = await getServiceById(id);
    const updated = await updateService(id, data);
    if (existing?.image && data.image !== undefined && existing.image !== data.image && !data._noDelete) {
      deleteCloudinaryImage(existing.image).catch(() => null);
    }
    return success(updated);
  } catch (error) {
    return handleError(error);
  }
}

async function deleteHandler(
  req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context!.params;
    const existing = await getServiceById(id);
    await deleteService(id);
    if (existing?.image) deleteCloudinaryImage(existing.image).catch(() => null);
    return success({ message: "Service deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
