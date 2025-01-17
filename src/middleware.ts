import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  CLUB_BACKEND  
} from "@/routes";

type AuthRequest = {
  auth: any;
  nextUrl: URL;
}

export default auth((req: AuthRequest) => {
  console.log("Middleware executing");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Auth:", !!req.auth);
  console.log("Role:", req.auth?.user?.role);
  
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  console.log({
    path: nextUrl.pathname,
    isLoggedIn,
    role,
    auth: req.auth
  })

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isClubBackendRoute = nextUrl.pathname.startsWith(CLUB_BACKEND);  
  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if(isLoggedIn) {
      if (role === 'admin') {
        return Response.redirect(new URL(CLUB_BACKEND, nextUrl));  
      }
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Schützt Club-Backend Routes
  if (isClubBackendRoute) {  
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    
    if (role !== 'admin') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  if(!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|public|favicon.ico|logo-c-list-green.svg|logo_course_list.svg|gcl-hero.jpg|hero-golf.webp|globe.svg|file.svg|window.svg).*)',
  ],
}
