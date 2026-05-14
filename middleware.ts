import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

async function getMaintenanceMode(origin: string): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/api/public/maintenance`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.maintenance === true;
  } catch {
    return false; // fail open — never block the site if the check errors
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isMaintenancePage = pathname === "/maintenance";

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

  // Maintenance mode — admins, admin routes, and login page always bypass
  if (!isAdminRoute && !isAdmin && !isAuthRoute) {
    const maintenance = await getMaintenanceMode(req.nextUrl.origin);

    if (maintenance && !isMaintenancePage) {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    // If maintenance is OFF but someone navigates to /maintenance directly → send home
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
  // Run on all routes except Next.js internals, static files, and the public maintenance API
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|logo\\.png|api/public/maintenance).*)",
  ],
};
