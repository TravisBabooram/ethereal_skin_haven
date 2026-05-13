import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getServiceById, updateService, deleteService } from "@/lib/services/services";
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
    return success(await updateService(id, data));
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
    await deleteService(id);
    return success({ message: "Service deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
