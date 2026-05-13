import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { updatePolicy, deletePolicy } from "@/lib/services/policies";

async function putHandler(
  req: NextRequest,
  _user: any,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const data = await req.json();
    const policy = await updatePolicy(id, data);
    return success(policy);
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
    await deletePolicy(id);
    return success({ message: "Policy deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
