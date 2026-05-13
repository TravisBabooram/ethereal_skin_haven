import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { updateFAQ, deleteFAQ } from "@/lib/services/faq";

async function putHandler(
  req: NextRequest,
  _user: any,
  context?: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context?.params!;
    const data = await req.json();
    const faq = await updateFAQ(id, data);
    return success(faq);
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
    await deleteFAQ(id);
    return success({ message: "FAQ deleted" });
  } catch (error) {
    return handleError(error);
  }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
