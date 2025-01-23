// src/routes.ts
import { UserRole } from "@/types/schemas/auth";

/**
 * Öffentliche Routen die keine Auth benötigen
 */
export const publicRoutes = [
    "/",
    "/studio",
    "/auth/new-verification",
    "/logo-c-list-green.svg",
    "/logo_course_list.svg",
    "/gcl-hero.jpg",
    "/hero-golf.webp",
    "/globe.svg",
    "/file.svg",
    "/window.svg",
    "/public/(.*)",
    "/clubs",
    "/kooperationen",
    "/stadt",
    "/pricing",
    "/clubs/[^/]+",
    "/kooperationen/[^/]+",
    "/stadt/[^/]+"
];

/**
 * Auth Routen - Redirect für eingeloggte User
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/register-club",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];

/**
 * User spezifische Routen
 */
export const USER_ROUTES = [
    "/wunschliste",
    "/meine-clubs"
];

/**
 * Club Admin spezifische Routen
 */
export const CLUB_ADMIN_ROUTES = [
    "/club-verwaltung",
    "/club-verwaltung/profil",
    "/club-verwaltung/mitglieder",
    "/club-verwaltung/statistiken"
];

/**
 * Developer spezifische Routen
 */
export const DEVELOPER_ROUTES = [
    "/studio",
    "/system-verwaltung",
    "/benutzer-verwaltung",
    "/vertrags-verwaltung"
];

export const apiAuthPrefix = "/api/auth";
export const CLUB_BACKEND = "/club-verwaltung";
export const USER_DASHBOARD = "/dashboard";
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * Bestimmt die Redirect-URL basierend auf der Benutzerrolle
 */
export const getRedirectPath = (role?: UserRole) => {
    switch(role) {
        case "developer":
            return "/studio";
        case "club_admin":
            return B_BACKEND;
        case "user":
            return "/";
        default:
            return DEFAULT_LOGIN_REDIRECT;
    }
};