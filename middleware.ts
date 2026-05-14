import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { authLimiter, bookingLimiter, apiLimiter } from "@/lib/ratelimit";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

async function getMaintenanceMode(): Promise<boolean> {
  // Use the configured app URL — never the request's Host header (SSRF prevention)
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://etherealskinhaven.com";
  try {
    const res = await fetch(`${base}/api/public/maintenance`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.maintenance === true;
  } catch {
    return false;
  }
}

function getIP(req: NextRequest): string {
  // Netlify injects the real client IP into x-nf-client-connection-ip
  // which cannot be spoofed by the client unlike x-forwarded-for
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "anonymous"
  );
}

async function applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;
  const ip = getIP(req);

  // Auth routes — only rate limit POST (actual login/register attempts, not session checks)
  if (
    req.method === "POST" &&
    (pathname === "/api/auth/login" || pathname === "/api/auth/register")
  ) {
    if (!authLimiter) return null;
    const { success } = await authLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }
    return null;
  }

  // Booking creation — moderate limit
  if (pathname === "/api/bookings" && req.method === "POST") {
    if (!bookingLimiter) return null;
    const { success } = await bookingLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }
    return null;
  }

  // All other public API routes — general limit
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/")) {
    if (!apiLimiter) return null;
    const { success } = await apiLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
    return null;
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api/");
  const isMaintenancePage = pathname === "/maintenance";

  // Apply rate limiting to API routes
  if (isApiRoute) {
    const limited = await applyRateLimit(req);
    if (limited) return limited;
  }

  // Decode JWT (best-effort)
  type Payload = { role?: string; userId?: string };
  let payload: Payload | null = null;
  let tokenInvalid = false;
  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload as Payload;
    } catch {
      tokenInvalid = true;
    }
  }

  const isAdmin = payload?.role === "admin";

  // Maintenance mode — admins, admin routes, auth pages, and API routes always bypass
  if (!isAdminRoute && !isAdmin && !isAuthRoute && !isApiRoute) {
    const maintenance = await getMaintenanceMode();

    if (maintenance && !isMaintenancePage) {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    if (!maintenance && isMaintenancePage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Clear invalid / expired token
  if (tokenInvalid) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }

  // Authenticated routing
  if (payload) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", req.url));
    }
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Unauthenticated — protect private routes
  if (isDashboardRoute || isAdminRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|logo\\.png|api/public/maintenance).*)",
  ],
};
