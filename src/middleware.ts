// src/middleware.ts
import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  CLUB_BACKEND,
  USER_CLUBS
} from "@/routes";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return null;
  }

  const isLoggedIn = !!req.auth;

  // Public routes - allow access
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return null;
  }

  // Auth routes - redirect if logged in
  if (authRoutes.includes(req.nextUrl.pathname)) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      const redirectUrl = role === 'admin' ? CLUB_BACKEND : USER_CLUBS;
      return Response.redirect(new URL(redirectUrl, req.nextUrl));
    }
    return null;
  }

  // Protected routes - handle auth
  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.nextUrl));
  }

  // Handle club backend access
  if (req.nextUrl.pathname.startsWith(CLUB_BACKEND)) {
    if (req.auth?.user?.role !== 'admin') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
}