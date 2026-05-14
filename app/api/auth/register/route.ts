import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/utils/jwt";
import { hashPassword } from "@/lib/utils/password";
import { validateEmail, validatePassword, sanitizeEmail } from "@/lib/utils/validation";
import { handleError, APIError } from "@/lib/utils/error";
import { getUserByEmail, createUser } from "@/lib/services/users";
import { verifyCaptcha } from "@/lib/utils/captcha";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, password, captchaToken } = await req.json();

    if (!email || !name || !phone || !password) {
      throw new APIError(400, "Missing required fields");
    }

    if (!captchaToken) throw new APIError(400, "Please complete the CAPTCHA");
    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) throw new APIError(400, "CAPTCHA verification failed. Please try again.");
    if (!validateEmail(email)) throw new APIError(400, "Invalid email");
    if (!validatePassword(password)) throw new APIError(400, "Password must be at least 8 characters");

    const clean = sanitizeEmail(email);
    const existing = await getUserByEmail(clean);
    if (existing) throw new APIError(409, "Email already registered");

    const passwordHash = await hashPassword(password);
    const user = await createUser(clean, name.trim(), passwordHash, phone.trim());
    const token = generateToken({ userId: user.id, email: user.email });

    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name }, token },
      { status: 201 }
    );
    res.cookies.set("token", token, COOKIE_OPTS);
    return res;
  } catch (error) {
    return handleError(error);
  }
}
