// src/middleware.ts
import { auth } from "@/auth";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  CLUB_ADMIN_ROUTES,
  USER_ROUTES,
  getRedirectPath
} from "@/routes";
import { UserRole } from "@/types/schemas/auth";
import { type NextRequest } from "next/server";
import type { Session } from "next-auth";

interface AuthenticatedRequest extends NextRequest {
  auth: Session | null;
}

// Hilfsfunktion für öffentliche Routen
const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path) ||
      publicRoutes.some(route => {
        const dynamicRoute = route.replace(/[.*?]/g, '[^/]+');
        const regex = new RegExp(`^${dynamicRoute}$`);
        return regex.test(path);
      });
};

// Hilfsfunktion für Rollenzugriffsprüfung
const hasRouteAccess = (path: string, role?: UserRole) => {
  if (role === "developer") return true;
  if (role === "club_admin") {
    return CLUB_ADMIN_ROUTES.some(route => path.startsWith(route));
  }
  if (role === "user") {
    return USER_ROUTES.some(route => path.startsWith(route));
  }
  return false;
};

// @ts-expect-error - Known issue with NextAuth middleware types
export default auth(function middleware(request: AuthenticatedRequest) {
  const { nextUrl } = request;
  const session = request.auth;
  const isLoggedIn = !!session;
  const role = session?.user?.role as UserRole | undefined;

  // API Routes ignorieren
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return Promise.resolve();
  }

  // Öffentliche Routen - Zugriff erlauben
  if (isPublicRoute(nextUrl.pathname)) {
    return Promise.resolve();
  }

  // Auth Routes - Weiterleitung wenn eingeloggt
  if (authRoutes.includes(nextUrl.pathname)) {
    if (isLoggedIn) {
      return Promise.resolve(
          Response.redirect(new URL(getRedirectPath(role), nextUrl))
      );
    }
    return Promise.resolve();
  }

  // Protected Routes - Auth prüfen
  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Promise.resolve(
        Response.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ))
    );
  }

  // Rollenbasierte Zugriffskontrolle
  if (!hasRouteAccess(nextUrl.pathname, role)) {
    return Promise.resolve(
        Response.redirect(new URL(getRedirectPath(role), nextUrl))
    );
  }

  return Promise.resolve();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};