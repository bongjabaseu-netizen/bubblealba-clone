/** 인증 가드 — JWT 토큰 기반 (Edge Runtime 호환) */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/mypage", "/community/write", "/notification"];
const adminPaths = ["/admin"];
const advertiserPaths = ["/advertiser"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Vercel Production에서는 Secure prefix 쿠키 사용
  const isProduction = process.env.NODE_ENV === "production";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: isProduction,
    salt: isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
    cookieName: isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
  });

  // 관리자 페이지 — ADMIN만
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 광고주 페이지 — ADVERTISER 또는 ADMIN
  if (advertiserPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "ADVERTISER" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 보호된 페이지 — 로그인 필수
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/community/write", "/notification", "/admin", "/admin/:path*", "/advertiser", "/advertiser/:path*"],
};
