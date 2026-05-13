import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/utils/jwt";
import { verifyPassword } from "@/lib/utils/password";
import { sanitizeEmail } from "@/lib/utils/validation";
import { handleError, APIError } from "@/lib/utils/error";
import { getUserByEmail } from "@/lib/services/users";
import { getAdminByEmail } from "@/lib/services/admins";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throw new APIError(400, "Email and password required");
    }

    const clean = sanitizeEmail(email);

    // Check regular users first
    const user = await getUserByEmail(clean);
    if (user) {
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) throw new APIError(401, "Invalid credentials");

      const token = generateToken({ userId: user.id, email: user.email });
      const res = NextResponse.json(
        { user: { id: user.id, email: user.email, name: user.name }, token },
        { status: 200 }
      );
      res.cookies.set("token", token, COOKIE_OPTS);
      return res;
    }

    // Fall back to admin table
    const admin = await getAdminByEmail(clean);
    if (admin) {
      const valid = await verifyPassword(password, admin.passwordHash);
      if (!valid) throw new APIError(401, "Invalid credentials");

      const token = generateToken({ userId: admin.id, email: admin.email, role: "admin" });
      const res = NextResponse.json(
        { user: { id: admin.id, email: admin.email, name: admin.name, role: "admin" }, token },
        { status: 200 }
      );
      res.cookies.set("token", token, COOKIE_OPTS);
      return res;
    }

    throw new APIError(401, "Invalid credentials");
  } catch (error) {
    return handleError(error);
  }
}
