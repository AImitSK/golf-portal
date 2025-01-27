// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  console.log("Middleware - Anfrage:", request.nextUrl.pathname);

  const session = await auth();
  console.log("Middleware - Session:", session);

  // Beispielhafte Blockierung bestimmter Pfade
  if (request.nextUrl.pathname.startsWith("/private")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};

// routes.ts
type Route = {
  path: string;
  component: string;
};

export const routes: Route[] = [
  { path: "/", component: "home" },
  { path: "/about", component: "about" },
  { path: "/contact", component: "contact" },
];

// auth.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    return res.status(200).json({ token: "fake-jwt-token" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
