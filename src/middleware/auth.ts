import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Interface untuk decoded token
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Paths yang tidak perlu autentikasi
const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh-token",
  "/api/auth/oauth/callback",
];

export async function authMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for public paths
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next();
  }

  // Get token from header
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing authentication token" }, { status: 401 });
  }

  // Verify token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token) as DecodedToken | null;

  if (!decoded) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Add user info to request
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", decoded.userId);

  // Continue with modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Konfigurasi middleware untuk path yang akan diproteksi
export const config = {
  matcher: [
    "/api/posts/:path*",
    "/api/teams/:path*",
    "/api/users/:path*",
    // Tambahkan path lain yang perlu autentikasi
  ],
};
