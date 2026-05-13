import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyToken, extractToken } from "@/lib/utils/jwt";
import { handleError, APIError } from "@/lib/utils/error";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

export async function POST(req: NextRequest) {
  try {
    // Accept token from cookie or Authorization header
    const cookieToken = req.cookies.get("token")?.value;
    const headerToken = extractToken(req.headers.get("authorization") || "");
    const token = cookieToken || headerToken;

    if (!token) throw new APIError(401, "Refresh token required");

    const payload = verifyToken(token);
    if (!payload) throw new APIError(401, "Invalid refresh token");

    const newToken = generateToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const res = NextResponse.json({ token: newToken }, { status: 200 });
    res.cookies.set("token", newToken, COOKIE_OPTS);
    return res;
  } catch (error) {
    return handleError(error);
  }
}
