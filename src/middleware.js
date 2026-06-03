import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_ROUTES = ["/","/forgot-password", "/login", "/register"];

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("inquiry_bazaar_token")?.value;

  // LOGIN / REGISTER PAGES
  if (AUTH_ROUTES.includes(pathname)) {
    if (token) {
      const user = await verifyToken(token);

      if (user) {
        return NextResponse.redirect(
          new URL("/profile", req.url)
        );
      }
    }

    return NextResponse.next();
  }

  // PROTECTED ROUTES
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};