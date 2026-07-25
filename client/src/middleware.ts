import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes ที่ไม่ต้อง login
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // ถ้ายังไม่ login และพยายามเข้า protected route → redirect ไป /login
  if (!token && !PUBLIC_ROUTES.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ถ้า login แล้ว แต่พยายามเข้า auth pages → redirect ไป /dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// กำหนดว่า middleware จะทำงานกับ route ไหนบ้าง
// ยกเว้น static files, API routes, images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
