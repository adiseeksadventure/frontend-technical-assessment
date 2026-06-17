import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Route protection.
// In Next.js 16 "Middleware" is called "Proxy" (same functionality, new file
// name). This runs before requests to /dashboard/* and redirects unauthenticated
// users to /login, so protected pages can never be viewed without logging in.
export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only guard the dashboard area.
  matcher: ["/dashboard", "/dashboard/:path*"],
};
