import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken"); // Replace with your actual auth token logic

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/session", "/profile", "/match"]; // Added "/match"

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // Redirect to the login page if not authenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ["/dashboard/:path*", "/session/:path*", "/profile/:path*", "/match"]
};
