import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllPolicies, getPolicyByType, createPolicy } from "@/lib/services/policies";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (type) {
      const policy = await getPolicyByType(type);
      return success(policy);
    }
    const policies = await getAllPolicies();
    return success(policies);
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest) {
  try {
    const data = await req.json();
    const policy = await createPolicy(data);
    return success(policy, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
