import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken, JWTPayload } from "./jwt";

function getToken(req: NextRequest): string | null {
  return extractToken(req.headers.get("authorization") || "") || req.cookies.get("token")?.value || null;
}

export function withAuth(
  handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = getToken(req);
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const user = verifyToken(token);
      if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

      return handler(req, user, context);
    } catch {
      return NextResponse.json({ error: "Auth error" }, { status: 500 });
    }
  };
}

export function withAdmin(
  handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = getToken(req);
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const user = verifyToken(token);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
      }

      return handler(req, user, context);
    } catch {
      return NextResponse.json({ error: "Auth error" }, { status: 500 });
    }
  };
}
