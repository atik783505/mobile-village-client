import { NextRequest, NextResponse } from "next/server";

// Login ছাড়া access করা যাবে না
const authRequiredRoutes = [
  "/dashboard",
  "/account",
  "/checkout",
  "/allcart",
];

// Admin role ছাড়া access করা যাবে না
const adminOnlyRoutes = [
  "/dashboard/admin",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = Boolean(sessionToken);

  // Login না থাকলে protected routes block
  if (!isLoggedIn && authRequiredRoutes.some((r) => pathname.startsWith(r))) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes — session cookie তে role নেই, তাই server-side layout এ check হয়
  // এখানে শুধু login check করা হচ্ছে
  // role check dashboard/layout.tsx এবং dashboard/page.tsx এ হচ্ছে
  if (!isLoggedIn && adminOnlyRoutes.some((r) => pathname.startsWith(r))) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)",
  ],
};
