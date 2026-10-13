import { NextRequest, NextResponse } from "next/server";

// Routes that require the user to be logged in
const protectedRoutes = ["/account", "/orders", "/checkout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the better-auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = Boolean(sessionToken);

  // Redirect unauthenticated users away from protected pages
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)",
  ],
};
