import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { getAllFAQs, getFAQByCategory, createFAQ } from "@/lib/services/faq";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    if (category) {
      const faqs = await getFAQByCategory(category);
      return success(faqs);
    }
    const faqs = await getAllFAQs();
    return success(faqs);
  } catch (error) {
    return handleError(error);
  }
}

async function postHandler(req: NextRequest) {
  try {
    const data = await req.json();
    const faq = await createFAQ(data);
    return success(faq, 201);
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdmin(postHandler);
