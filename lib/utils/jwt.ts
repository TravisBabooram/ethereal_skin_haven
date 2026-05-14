import jwt, { type SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY } as SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
