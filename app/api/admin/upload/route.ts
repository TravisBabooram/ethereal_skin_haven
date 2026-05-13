import { NextRequest } from "next/server";
import { success, handleError, APIError } from "@/lib/utils/error";
import { withAdmin } from "@/lib/utils/auth";
import { JWTPayload } from "@/lib/utils/jwt";
import crypto from "crypto";

async function POST(req: NextRequest, _user: JWTPayload) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new APIError(503, "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.");
    }

    const { folder = "ethereal-skin-haven" } = await req.json().catch(() => ({}));
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    return success({ cloudName, apiKey, timestamp, signature, folder });
  } catch (error) {
    return handleError(error);
  }
}

export const postRoute = withAdmin(POST);
export { postRoute as POST };
