// src/middleware.ts
import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  CLUB_BACKEND,
  USER_CLUBS
} from "@/routes";

// Hilfsfunktion für öffentliche Routen
const isPublicRoute = (path: string) => {
  // Statische öffentliche Routen
  const basePublicRoutes = [
    "/",
    "/studio",
    "/auth/new-verification",
    "/pricing",
    "/logo-c-list-green.svg",
    "/logo_course_list.svg",
    "/gcl-hero.jpg",
    "/hero-golf.webp",
    "/globe.svg",
    "/file.svg",
    "/window.svg"
  ];

  if (basePublicRoutes.includes(path)) return true;

  // Öffentliche Bereiche und deren Unterseiten
  const publicSections = ['/clubs', '/kooperationen', '/stadt'];
  return publicSections.some(section =>
      path === section || // Hauptseite
      path.startsWith(`${section}/`) // Unterseiten
  );
};

export default auth((req) => {
  const { nextUrl } = req;

  // API Routes ignorieren
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return; // Rückgabe von `undefined`, was mit `void` kompatibel ist
  }

  const isLoggedIn = !!req.auth;

  // Öffentliche Routen - Zugriff erlauben
  if (isPublicRoute(nextUrl.pathname)) {
    return;
  }

  // Auth Routes - Weiterleitung wenn eingeloggt
  if (authRoutes.includes(nextUrl.pathname)) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      const redirectUrl = role === 'admin' ? CLUB_BACKEND : USER_CLUBS;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return;
  }

  // Protected Routes - Auth prüfen
  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // Club Backend Zugriff prüfen
  if (nextUrl.pathname.startsWith(CLUB_BACKEND)) {
    if (req.auth?.user?.role !== 'admin') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  // Rückgabe `void` oder `Response`
  return;
});